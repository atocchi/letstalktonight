import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import db from './services/firebase';
import { Card, Chip } from 'react-native-paper'

export default function App() {

const [chat, setChat] = useState ({
  chats: [{
    content: 'Please Login to See Chat',
    timestamp: '',
    name: 'andrewtocchi@gmail.com'
  }],
  content: '',
  readError: null,
  writeError: null,
});

//Allows setting state for text input 
const [text, setText] = useState({
  content: ''
})

const [name, setName] = useState({
  name: 'mike'
})

//Pulls from Firebase to Create in Process Chats 
useEffect(() =>{
  db.ref('tofu').on("value", snapshot => {
      let chat = [];
      snapshot.forEach((snap) => {
          chat.push(snap.val());
          setChat({chats: chat})
})
  }) 
},[])

  function pressHandler() {
    if(text.content === ''){
      alert('You cannot send an empty mesage!');
    }
    else if(name.name === null){
      let nName = prompt("Please enter a chat name!", `Anon${(Math.random() * 999)}`);
      setName({name: nName});
    }
    else if(name.name !== null){
      setChat({ writeError: null });
      try {
         db.ref('tofu').push({
          name: name.name,
          content: text.content,
          timestamp: Date(Date.now())
        });
        setText({ content: '' });
      } catch (error) {
        setChat({ writeError: error.message });
      }
    }
    }

  return (
    <View style={styles.container}>
    <ScrollView style={styles.textBox}>
      <Text>Active Chat is Below!</Text>
      {chat.chats.map(chat => {
      if(chat.name === 'rick'){
      return <Text style={styles.textMsg}>{chat.name} : {chat.content}</Text>
      }
      else{
      return <Text style={styles.textMsg2}>{chat.name} : {chat.content}</Text>
      }
      }
      )
      }
    </ScrollView>
      <TextInput
      style={{backgroundColor: 'white', width: '75%', marginLeft: '2.5%'}}
      defaultValue={text.content}
      onChangeText={(value) => setText({content: value})}
      />
      <Text onPress={pressHandler}>Submit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textBox : {
    maxHeight: '65%',
    width: '100%',
    backgroundColor: 'grey'
  },
  textMsg: {
    marginBottom: '1.5%',
    marginLeft: '2.5%',
    width: '65%',
    backgroundColor: '#FDFD96',
    padding: '1.5%',
    borderRadius: 10
  },
  textMsg2: {
    marginBottom: '1.5%',
    marginLeft: '30%',
    width: '65%',
    backgroundColor: '#AEC6CF',
    padding: '1.5%',
    borderRadius: 10
  }
});
