import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
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
  name: 'rick'
})

//Pulls from Firebase to Create in Process Chats 
useEffect(() =>{
  db.ref('tofu').on("value", snapshot => {
      let chat = [];
      snapshot.forEach((snap) => {
          chat.push(snap.val());
          setChat({chats: chat.reverse()})
})
  }) 
},[])

  function pressHandler() {
    if(text.content === ''){
      // event.preventDefault();
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
        console.log(error)
        setChat({ writeError: error.message });
      }
    }
    }

  return (
    <View style={styles.container}>
      <Text>Active Chat is Below!</Text>
      {chat.chats.map(chat =>
      <Chip style={style.textMsg}>{chat.name} : {chat.content}</Chip>
      )
      }
      <TextInput
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMsg: {
    marginBottom: '5px',
  }
});
