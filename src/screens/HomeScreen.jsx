/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features';
import {dummyMessages} from '../constants';
import Voice from '@react-native-community/voice';

export default function HomeScreen() {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    const initVoice = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Record Audio Permission',
              message: 'App needs access to your microphone to record audio',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Record audio permission denied');
            return;
          }
        }

        await Voice.isAvailable();
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;
      } catch (error) {
        console.log('Voice initialization error:', error);
      }
    };

    initVoice();

    return () => {
      Voice.removeAllListeners();
    };
  }, []);

  //handlers
  const speechStartHandler = e => {
    console.log('speech start handler: ', e);
  };

  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech end handler: ', e);
  };

  const speechResultsHandler = e => {
    console.log('voice event:', e);
    const text = e.value[0];
    setResult(text);
  };
  console.log('result',result);

  const speechErrorHandler = e => {
    console.log('speech error handler: ', e);
  };

  //functions for buttons
  const clear = () => {
    setMessages([]);
  };

  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start('ru-RU', 'en-US');
    } catch (error) {
      console.log('voice recording error: ', error.message);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.log('voice recording error: ', error.message);
    }
  };

  const stopSpeaking = () => {
    setSpeaking(false);
  };


  return (
    <View className="flex-1 bg-white py-2 pb-3">
      <SafeAreaView className="flex-1 flex mx-5">
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
                          <Text className="text-gray-600">{message.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white rounded-xl rounded-tr-none p-2">
                          <Text className="text-gray-600">{message.content}</Text>
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
        <View className="flex justify-center items-center">
          {recording ? (
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
