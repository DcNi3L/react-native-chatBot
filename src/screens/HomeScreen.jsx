/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features';
// import {dummyMessages} from '../constants';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import {apiCall} from '../api/OpenAI';

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const ScrollViewRef = useRef();

  //handlers
  const speechStartHandler = e => {
    console.log('speech start handler: ', e);
  };

  const speechResultsHandler = e => {
    console.log('voice event:', e.value);
    const text = e.value[0];
    setResult(text);
    fetchResponse(text);
  };

  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech end handler: ', e);
    const text = e.value[0];
    setResult(text);
  };

  // console.log('result',result);

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
        // console.log('Data: ', res);
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

  const startTextToSpeech = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      Tts.speak(message.content, {
        androidParams: {
          KEY_PARAM_PAN: 0.5,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_VOICE_CALL',
        },
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
    <View className="flex-1 bg-white py-2 pb-3">
      <SafeAreaView className="flex-1 flex mx-5 relative">
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
              className="text-gray-700 font-semibold ml-1">
              Assistant
            </Text>
            <View
              style={{height: hp(66)}}
              className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                ref={ScrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="flex bg-emerald-100 rounded-2xl rounded-tl-none p-1.5">
                            <Image
                              source={{uri: message.content}}
                              style={{height: wp(60), width: wp(60)}}
                              className="rounded-2xl"
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={index}
                          style={{width: wp(70)}}
                          className="bg-emerald-100 rounded-xl rounded-tl-none p-2">
                          <Text className="text-gray-600">
                            {message.content}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white rounded-xl rounded-tr-none p-2">
                          <Text className="text-gray-600">
                            {message.content}
                          </Text>
                        </View>
                      </View>
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
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              {/* recording stop */}
              <Image
                style={{height: hp(10), width: hp(10)}}
                source={require('../../assets/images/voice.png')}
                className="rounded-full"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* recording start */}
              <Image
                style={{height: hp(10), width: hp(10)}}
                source={require('../../assets/images/record.png')}
                className="rounded-full"
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
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
        </View>
      </SafeAreaView>
    </View>
  );
}
