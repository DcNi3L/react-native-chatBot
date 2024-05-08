/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.log('auth error: ', error.message);
      }
    }
  };

  return (
    <View className="flex-1 bg-[#010919] py-4">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={() => navigation.goBack()} className="bg-emerald-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={require('../../assets/images/signup.png')} style={{width: 200, height: 180}} />
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-gray-900 px-8 pt-8" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} >
        <View className="space-y-2 ">
          <Text className="text-white ml-4">Full Name</Text>
          <TextInput
            className="p-4 bg-gray-100 text-black rounded-2xl mb-3"
            placeholder="Enter Name"
            value="John Doe" />
          <Text className="text-white ml-4">Email Address</Text>
          <TextInput
            keyboardType="email-address"
            className="p-4 bg-gray-100 text-black rounded-2xl mb-3"
            placeholder="Enter Email"
            value={email}
            onChangeText={(text) => setEmail(text)} />
          <Text className="text-white ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-black rounded-2xl mb-3"
            placeholder="Enter Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true} />
            <TouchableOpacity onPress={handleSubmit} className="bg-emerald-600 w-full px-4 py-3 rounded-2xl">
              <Text
                style={{fontSize: wp(6)}}
                className="font-bold text-center text-white">
                Sign Up
              </Text>
            </TouchableOpacity>
        </View>
        <View className="w-full mt-1">
          <Text className="text-white text-lg text-center">Already have an account? <Text onPress={() => navigation.navigate('Login')} className="text-green-500 font-extrabold">Login</Text></Text>
        </View>
      </View>
    </View>
  );
}
