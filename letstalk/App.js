import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import db from './services/firebase'

export default function App() {

const [chat, setChat] = useState ({
  chats: [{
    content: 'Please Login to See Chat',
    timestamp: '',
    email: 'andrewtocchi@gmail.com'
  }],
  content: '',
  readError: null,
  writeError: null,
});

useEffect(() =>{
  console.log('effect used')
  db.ref('tofu').on("value", snapshot => {
      let chat = [];
      console.log(snapshot)
      snapshot.forEach((snap) => {
          chat.push(snap.val());
          setChat({chats: chat.reverse()})
})
  }) 
},[])

  return (
    <View style={styles.container}>
      <Text>Active Chat is Below!</Text>
      {chat.chats.map(chat =>
      <Text>{chat.content}</Text>
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
