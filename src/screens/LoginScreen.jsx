/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {logIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        await logIn(email, password);
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
        });
        navigation.replace('Home');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.message,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please enter both email and password',
      });
    }
  };

  return (
    <View className="flex-1 bg-[#010919] py-4">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-emerald-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/signup.png')}
            style={{width: 200, height: 180}}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 justify-center bg-gray-900 px-8"
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
        <Text
          className="font-bold text-emerald-500 text-center absolute top-10"
          style={{fontSize: wp(10), letterSpacing: 2, left: wp(36)}}>
          Login
        </Text>
        <View className="space-y-2 ">
          <Text className="text-white ml-4">Email Address</Text>
          <TextInput
            keyboardType="email-address"
            className="p-4 bg-gray-100 text-black rounded-2xl mb-3"
            placeholder="Enter Email"
            placeholderTextColor={'black'}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Text className="text-white ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-black rounded-2xl mb-3"
            placeholder="Enter Password"
            placeholderTextColor={'black'}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-emerald-600 w-full px-4 py-3 rounded-2xl">
            <Text
              style={{fontSize: wp(6)}}
              className="font-bold text-center text-white">
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full mt-4">
          <Text className="text-white text-lg text-center">
            Not a member?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              className="text-green-500 font-extrabold">
              Register
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
