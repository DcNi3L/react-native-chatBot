/* eslint-disable prettier/prettier */
import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {
  return (
    <View style={{height: hp(60)}} className="space-y-4">
      <Text style={{fontSize: wp(6.5)}} className="font-semibold text-white">
        Features
      </Text>
      <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-1">
          <Image
            source={require('../../assets/images/gptIcon.png')}
            style={{width: hp(4), height: hp(4)}}
          />
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-[#010919]">
            ChatGPT
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="font-medium text-[#010919]">
          A chatbot with generative artificial intelligence, developed by
          Openway and capable of working in an interactive mode, supporting
          queries in natural languages.
        </Text>
      </View>
      <View className="bg-purple-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-1">
          <Image
            source={require('../../assets/images/dalleIcon.png')}
            style={{width: hp(4), height: hp(4)}}
          />
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-[#010919]">
            DALL-E
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-[#010919] font-medium">
          Technology that helps users create new images with their imagination
          only by using graphics prompts. DALL-E can create the impression that
          may look entirely different as mentioned by the user’s prompt.
        </Text>
      </View>
      <View className="bg-cyan-200 p-4 rounded-xl space-y-2" style={{height: hp(18)}}>
        <View className="flex-row items-center space-x-1">
          <Image
            source={require('../../assets/images/smartaiIcon.png')}
            style={{width: hp(4), height: hp(4)}}
          />
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-[#010919]">
            Smart AI
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-[#010919] font-medium">
          A powerful voice assistant with the abilities of ChatGPT and DALL-E,
          providing you the best of both worlds.
        </Text>
      </View>
    </View>
  );
}
