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

export default function RegisterScreen() {
  const navigation = useNavigation();
  const {register} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        await register(email, password);
      } catch (error) {
        console.log('auth error: ', error.message);
      }
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
          className="font-bold text-emerald-500 text-center absolute top-8"
          style={{fontSize: wp(10), letterSpacing: 2, left: wp(30)}}>
          Register
        </Text>
        <View className="space-y-2">
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
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full mt-4">
          <Text className="text-white text-lg text-center">
            Already have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              className="text-green-500 font-extrabold">
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
