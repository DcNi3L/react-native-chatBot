import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {auth} from '../config/firebase';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Toast from 'react-native-toast-message';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import RNFetchBlob from 'rn-fetch-blob';

export default function ProfileScreen({route}) {
  const {messages} = route.params;
  const navigation = useNavigation();

  const [localImages, setLocalImages] = useState({});

  useEffect(() => {
    downloadImages();
  }, []);

  const downloadImages = async () => {
    const localImagesTemp = {};

    for (const message of messages) {
      if (message.role === 'assistant' && message.content.includes('https')) {
        try {
          const {dirs} = RNFetchBlob.fs;
          const filePath = `${dirs.DocumentDir}/${message.content.split('/').pop().split('?')[0]}`;
          await RNFetchBlob.config({
            path: filePath,
          }).fetch('GET', message.content);

          localImagesTemp[message.content] = filePath;
        } catch (error) {
          console.error('Image download error:', error);
        }
      }
    }

    setLocalImages(localImagesTemp);
  };

  const generatePDF = async () => {
    let htmlString = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px 30px; }
            strong { display: block; font-weight: bold; text-align: left; text-transform: capitalize; }
            .message-user { display: flex; justify-content: flex-end }
            .message { margin: 20px 0; }
            .user { color: blue; border-radius: 8px; text-align: right; background-color: rgba(0, 0, 0, 0.3); padding: 10px 15px; width: fit-content; }
            .assistant { color: green; border-radius: 8px; background-color: rgba(0, 0, 0, 0.2); padding: 10px 15px; width: fit-content;}
            .image { width: 200px; height: 200px; }
            .img-s { display: block; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Chat Messages</h1>
    `;

    messages.forEach(message => {
      if (message.role === 'assistant' && message.content.includes('https')) {
        htmlString += `
            <div class="message assistant">
              <strong class="img-s">${message.role}:</strong>
              <img src="${message.content}" class="image" />
            </div>
          `;
      } else {
        htmlString += `
            <div class="message message-${message.role}">
                <div class="${message.role}">
                    <strong>${message.role}:</strong> ${message.content}
                </div>
            </div>
          `;
      }
    });

    htmlString += `
        </body>
      </html>
    `;

    const options = {
      html: htmlString,
      fileName: 'chat',
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const destPath = `${RNFetchBlob.fs.dirs.DownloadDir}/chat.pdf`;
      await RNFetchBlob.fs.mv(file.filePath, destPath);
      const shareOptions = {
        title: 'Share PDF',
        url: `file://${destPath}`,
        type: 'application/pdf',
      };
      Toast.show({
        type: 'success',
        text1: 'PDF Download successful!',
        text2: 'Share PDF',
      });

      await Share.open(shareOptions);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error generating PDF',
        text2: error.message,
      });
      console.error('Error generating PDF:', error);
    }
  };

  const deleteUser = () => {
    auth.currentUser
      .delete()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'User deleted successfully!',
        });
        navigation.navigate('Login');
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Deleting failed!',
          text2: error.message,
        });
      });
  };

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => {
        Toast.show({
          type: 'success',
          text1: 'Logout failed!',
          text2: error.message,
        });
      });
  };

  return (
    <View className="bg-[#010919]">
      <SafeAreaView className="flex justify-start mt-5">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-emerald-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View className="flex h-screen justify-center items-center">
        <TouchableOpacity
          onPress={generatePDF}
          className="bg-blue-500 w-4/5 rounded-full p-3 m-2">
          <Text className="text-white text-center font-bold text-2xl">
            Download Chat as PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          className="bg-green-500 w-4/5 rounded-full p-3 m-2">
          <Text className="text-white text-center font-bold text-2xl">
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={deleteUser}
          className="bg-red-500 w-4/5 rounded-full p-3 m-2">
          <Text className="text-white text-center font-bold text-2xl">
            Delete User
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
