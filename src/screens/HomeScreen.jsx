/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useEffect, useRef, useState} from 'react';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features';
// import {dummyMessages} from '../constants';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import {apiCall} from '../api/OpenAI';
import { ArrowRightStartOnRectangleIcon } from 'react-native-heroicons/solid';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [textValue, setTextValue] = useState('');
  const ScrollViewRef = useRef();

  //handlers
  const speechStartHandler = e => {
    console.log('speech start handler: ', e);
  };

  const speechResultsHandler = async e => {
    console.log('voice event:', e.value);
    const text = e.value[0];
    setResult(text);
    fetchResponse(text);
  };

  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech end handler: ', e);
  };

  const speechErrorHandler = e => {
    console.log('speech error handler: ', e);
  };

  //functions for buttons
  const clear = () => {
    setMessages([]);
    Tts.stop();
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('voice recording error: ', error.message);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      //fetching responce from openai
    } catch (error) {
      console.log('voice recording error: ', error.message);
    }
  };

  const fetchResponse = text => {
    console.log('result from api: ', text);
    if (text.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: text.trim()});
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);

      apiCall(text.trim(), newMessages).then(res => {
        console.log('Data: ', res);
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          setResult('');
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error: ', res.msg);
        }
      });
    }
  };

  const startTextToSpeech = async message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      let languageCode = 'en-US';
      if (/[\u0400-\u04FF]/.test(message.content)) {
        languageCode = 'ru-RU';
      }
      console.log('language code: ', languageCode);
      Tts.speak(message.content, {
        androidParams: {
          KEY_PARAM_PAN: 1,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
        language: languageCode,
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      ScrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  console.log('Result: ', result);

  const handleImagePress = imageUrl => {
    Alert.alert(
      'Choose an Option:',
      '',
      [
        {
          text: 'Open in Browser',
          onPress: () => Linking.openURL(imageUrl),
        },
        {
          text: 'Download',
          onPress: async () => {
            const {DownloadDirectoryPath} = RNFS;
            const filename = imageUrl.split('/').pop().split('?')[0];
            const downloadDest = `${DownloadDirectoryPath}/${filename}.png`;

            const downloadFile = RNFS.downloadFile({
              fromUrl: imageUrl,
              toFile: downloadDest,
              progress: res => {
                const progress = (res.bytesWritten / res.contentLength) * 100;
                console.log(`Download Progress: ${progress.toFixed(2)}%`);
              },
            });

            try {
              const response = await downloadFile.promise;

              if (response.statusCode === 200) {
                ToastAndroid.show(
                  'Image downloaded successfully.',
                  ToastAndroid.SHORT,
                );
              } else {
                throw new Error(
                  `Failed to download image. Status code: ${response.statusCode}`,
                );
              }
            } catch (error) {
              ToastAndroid.show(
                'Failed to download image.',
                ToastAndroid.SHORT,
              );
              console.error('Download Error:', error.message);
            }
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const handleTextCopy = text => {
    Clipboard.setString(text);
    ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT);
  };

  const showInputField = () => {
    setShowInput(true);
    setSpeaking(false);
    setRecording(false);
  };

  const sendText = () => {
    if (textValue.trim().length > 0) {
      setResult(textValue);
      fetchResponse(textValue);
      setTextValue('');
      setShowInput(false);
    }
  };

  const changeToVoice = () => {
    setTextValue('');
    setShowInput(false);
  };

  //firebase logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    //voice recording
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    //tts
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-progress', event =>
      console.log('progress', event),
    );
    Tts.addEventListener('tts-finish', event => {
      setSpeaking(false);
      console.log('finish: ', event);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View className="flex-1 bg-[#010919] py-2 pb-3">
      <SafeAreaView className="flex-1 flex mx-5 relative">
        <View className="flex-row justify-end px-1">
          <TouchableOpacity onPress={handleLogout}>
            <ArrowRightStartOnRectangleIcon size="30" color="white" />
          </TouchableOpacity>
        </View>
        {/*Bot icon*/}
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/bot.png')}
            style={{height: hp('15'), width: hp('15')}}
          />
        </View>
        {/* features || messages */}
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text
              style={{fontSize: wp(5)}}
              className="text-white font-semibold ml-1">
              Assistant
            </Text>
            <View
              style={{height: hp(63)}}
              className="bg-gray-800 rounded-3xl p-4">
              <ScrollView
                ref={ScrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleImagePress(message.content)}
                          className="flex-row justify-start">
                          <View className="flex bg-emerald-100 rounded-2xl rounded-tl-none p-1.5">
                            <Image
                              source={{uri: message.content}}
                              style={{height: wp(60), width: wp(60)}}
                              className="rounded-2xl"
                              resizeMode="contain"
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleTextCopy(message.content)}
                          style={{width: wp(70)}}
                          className="bg-[#01A980] rounded-xl rounded-tl-none p-2">
                          <Text className="text-white">{message.content}</Text>
                        </TouchableOpacity>
                      );
                    }
                  } else {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleTextCopy(message.content)}
                        className="flex-row justify-end">
                        <View className="bg-[#394848] rounded-xl rounded-tr-none p-2 w-fit">
                          <Text className="text-white">{message.content}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* buttons */}
        <View className="flex absolute bottom-0 left-0 w-full justify-center items-center">
          {loading ? (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={{height: hp(10), width: hp(10)}}
            />
          ) : (
            !showInput && (
              <TouchableOpacity
                onPress={recording ? stopRecording : startRecording}>
                <Image
                  style={{height: hp(10), width: hp(10)}}
                  source={
                    recording
                      ? require('../../assets/images/voice.png')
                      : require('../../assets/images/record.png')
                  }
                  className="rounded-full"
                />
              </TouchableOpacity>
            )
          )}

          {showInput && (
            <View className="w-full flex flex-row justify-center items-center px-11">
              <TouchableOpacity onPress={() => changeToVoice()} className="bg-neutral-700 rounded-full flex items-center justify-center px-4 mr-2">
                <Text style={{fontSize: wp(8)}} className="text-white text-center font-extrabold mb-1.5">x</Text>
              </TouchableOpacity>
              <TextInput
                value={textValue}
                onChangeText={value => setTextValue(value)}
                placeholder="Type your message..."
                className="text-black pl-3 font-semibold placeholder:text-gray-500 bg-neutral-50 rounded-2xl w-full break-all"
              />
              <TouchableOpacity
                onPress={() => sendText()}
                className="bg-white rounded-full ml-2 p-1.5">
                <Image
                  source={require('../../assets/images/send.png')}
                  style={{height: hp(4.5), width: hp(4.5)}}
                />
              </TouchableOpacity>
            </View>
          )}

          {messages.length > 0 && !showInput && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-300 rounded-3xl py-3 px-4 absolute right-8">
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl py-3 px-4 absolute left-8">
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}

          {!showInput === !speaking && (
            <TouchableOpacity
              onPress={showInputField}
              className="bg-emerald-500 rounded-3xl py-3 px-4 absolute left-8">
              <Text className="text-white font-bold">Text</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
