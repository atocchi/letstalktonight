import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert,SafeAreaView } from 'react-native';
import db from './services/firebase';
import { Card, Chip } from 'react-native-paper';
import { Barometer } from 'expo-sensors';

export default function App() {

//ref for resizing scrollview container
const scrollViewRef = useRef();

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

//Modal Bool
const [modal, setModal] = useState(false)

//Allows setting state for text input 
const [text, setText] = useState({
  content: ''
})

const [pState, setPState] = useState(0)

const [name, setName] = useState({
  name: null
})

// const subscription = Barometer.addListener(({ pressure, relativeAltitude }) => {
//   console.log((pressure - 1012.256)* 100);
//   setPState(pressure )
// });



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

  function nameHandler(){
    if(name.name === null){
      alert("Please Enter Your Name!")
    }
    else{
      console.log(name.name)
      setModal(true)
    }
  }

  function pressHandler() {
    if(text.content === ''){
      alert('You cannot send an empty mesage!');
    }
    else if(name.name === null){
      
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
      <Text style={styles.nameUI}>{name.name}</Text>
      { 
      modal ?
      <Text></Text>
      :
      <View style={styles.modal}>
      <Text style={styles.nameText}>Please enter your chat name:</Text>
      <TextInput style={styles.textPut2}
        defaultValue={name.name}
        onChangeText={(value) => setName({name: value})}
        />
        <Text style={styles.sub2} onPress={nameHandler}>Submit</Text>
      </View>
      }
      <ScrollView style={styles.textBox} ref={scrollViewRef}
      onContentSizeChange={(contentWidth, contentHeight)=> {scrollViewRef.current.scrollToEnd({animated: true})}}>
        {chat.chats.map((chat)  => {
          if(chat.name !== name.name){
            return <Text key={chat.timestamp}  style={styles.textMsg}>{chat.name}:     {chat.content}</Text>
          }
          else{
            return <Text key={chat.timestamp} style={styles.textMsg2}>{chat.name}:     {chat.content}</Text>
          }
         }
        )}
      </ScrollView>
      <View style={styles.inputBox}>
        <TextInput style={styles.textPut}
        defaultValue={text.content}
        onChangeText={(value) => setText({content: value})}
        />
        <Text style={styles.sub} onPress={pressHandler}>Submit</Text>
      </View>
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
    marginBottom: '0.75%',
    marginTop: '0.75%',
    marginLeft: '2.5%',
    width: '65%',
    backgroundColor: '#FDFD96',
    padding: '0.75%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    
  },
  textMsg2: {
    marginBottom: '0.76%',
    marginTop: '0.75%',
    marginLeft: '30%',
    width: '65%',
    backgroundColor: '#AEC6CF',
    padding: '0.75%',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 15,
      height: 35
    },
    shadowRadius: 15,
    shadowOpacity: 1.0
  },
  textPut: {
    backgroundColor: '#d3d3d3', 
    width: '75%', 
    marginLeft: '2.5%',
    marginTop: '1.5%',
    borderColor: 'black',
    borderWidth: 1
  },
  inputBox : {
    width: '100%',
    flexDirection: 'row'
  },
  sub: {
    borderColor: 'black',
    borderWidth: 1,
    textAlign: 'center',
    marginTop: '1.5%',
    width: '20%',
    height: '65%',
    padding: 1
  },
  modal: {
    zIndex: 1,
    textAlign: 'center',
    opacity: 0.7,
    position: 'absolute', 
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  textPut2: {
    backgroundColor: '#d3d3d3', 
    width: '75%', 
    marginLeft: '2.5%',
    marginTop: '1.5%',
    borderColor: 'black',
    borderWidth: 1,
    left: "10%"
  },
  sub2: {
    borderColor: 'black',
    borderWidth: 1,
    textAlign: 'center',
    marginTop: '1.5%',
    width: '20%',
    padding: 1,
    left: "35%"
  },
  nameText :{
    left: "15%",
    fontSize: 25
  },
  nameUI : {
    width: '95%',
    textAlign: 'center'
  }

});
