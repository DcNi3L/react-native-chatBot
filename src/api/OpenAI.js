/* eslint-disable prettier/prettier */
import axios from 'axios';
import {apiKey} from '../constants/index';

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'content-Type': 'application/json',
  },
});

//urls
const chatGPTUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGPTUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt} . Symply answer with a yes or no.`,
        },
      ],
    });

    console.log('data: ', res.data.choices[0].message);
    let isImage = res.data?.choices[0]?.message?.content;
    if (isImage.toLowerCase().includes('yes')) {
      console.log('DALL-E API call!');
      return dalleApiCall(prompt, messages || []);
    } else {
      console.log('ChatGPT API call!');
      return chatGptApiCall(prompt, messages || []);
    }
  } catch (error) {
    console.log('API error: ', error);
    return Promise.resolve({success: false, message: error.message});
  }
};

const chatGptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGPTUrl, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    return Promise.resolve({success: true, data: messages});
  } catch (error) {
    console.log('API error: ', error);
    return Promise.resolve({success: false, message: error.message});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(dalleUrl, {
      prompt,
      n: 1,
      size: '512x512',
    });

    let url = res?.data?.data[0]?.url;
    console.log('Image url: ', url);
    messages.push({role: 'assistant', content: url});
    return Promise.resolve({success: true, data: messages});
  } catch (error) {
    console.log('API error: ', error);
    return Promise.resolve({success: false, message: error.message});
  }
};
