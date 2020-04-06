import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import wordFilter from './wordFilter'
import { auth } from '../Services/firebase';
import { signInWithGoogle } from '../Services/Signin'

///Messenger takes in room={'foo'} as a prop
//this determines the room that post will be sent too
//Mesenger also takes in isMod{bool} as a prop
//this determines if the post will be conidered a mod post or not
//This MAY be exploitable because currently it is prop, and so can be altered 

function Messenger (props){
const [chat, setChat] = useState ({
    adenvtreon: [{
      content: 'Please Login to See Chat',
      timestamp: '',
      mod: true,
      uid: '',
      email: 'adventreon@gmail.com'
    }],
    content: '',
    readError: null,
    writeError: null,
});

const [user, setUser] = useState ({
  user: auth().currentUser
})

Messenger.defaultProps = {
 isMod: false,
 child: false
}

// const [isMod, setMod] = useState(false)

const [name, setName] = useState({
  name: ''
})

const matches = useMediaQuery('(min-width:600px)');

const [text, setText] = useState({
    content: ''
}
)

async function googleSignIn() {
  try {
    await signInWithGoogle();
    window.location.reload(false);
    console.log('logged in')
  } catch (error) {
    setChat({ error: error.message });
  }
}

function signOut () {
auth().signOut().then(function() {
  console.log('Signed Out');
}, function(error) {
  console.error('Sign Out Error', error);
});
}







function handleChange(event) {
   setText({
      content: event.target.value
    });
}   

   function handleSubmit(event) {
      if(text.content === ''){
        event.preventDefault();
        console.log(auth().currentUser)
        alert('You cannot send an empty mesage!')
      }
      else if(auth().currentUser === null){
        event.preventDefault();
        alert("Please use the button to log into Google below!")
      }
      else if(auth().currentUser !== null){
        event.preventDefault();
        console.log(auth().currentUser)
        setChat({ writeError: null });
        try {
           db.ref(props.room).push({
            content: text.content,
            timestamp: Date(Date.now()),
            mod: props.isMod,
            uid: auth().currentUser.uid,
            email: auth().currentUser.email
          });
          setText({ content: '' });
        } catch (error) {
          console.log(error)
          setChat({ writeError: error.message });
        }
      }
      }



useEffect(() =>{
    setUser({user: auth().currentUser})
    db.ref(props.room).on("value", snapshot => {
        let adenvtreon = [];
        snapshot.forEach((snap) => {
            adenvtreon.push(snap.val());
            setChat({adenvtreon: adenvtreon.reverse()})
})
    }) 
},[])


return (
    <div>
      <Paper style={matches ? {backgroundColor: 'grey', width: '520px', padding: '20px', height: '200px', overflow: 'auto'} :{backgroundColor: 'grey', width: '335px', padding: '20px', height: '300px', overflow: 'auto'} }>
      <div className={props.room}>
        {chat.adenvtreon.map(chat => {
        if(auth().currentUser === null){
          return <Paper elevation={2} style={chat.mod ? {fontFamily: 'Baloo 2, cursive', width:'50%',padding:'5px', paddingBottom: '15px', marginBottom: '15px',backgroundColor: '#FDFD96'} : {fontFamily: 'Baloo 2, cursive', width:'50%',padding:'5px', paddingBottom: '15px', marginBottom: '15px',backgroundColor: '#add8e6'}} key={chat.timestamp}>{props.child ? wordFilter(chat.content) : chat.content} 
          <br/>
          <p style={{fontSize: '5px'}}>{chat.email}~ @{chat.timestamp}</p>
          </Paper>
        }
        else if(chat.email === auth().currentUser.email){
          return <Paper elevation={2} style={chat.mod ? {fontFamily: 'Baloo 2, cursive', width:'50%',padding:'5px', paddingBottom: '15px', marginBottom: '15px',backgroundColor: '#FDFD96'} : {fontFamily: 'Baloo 2, cursive', width:'50%',padding:'5px', paddingBottom: '15px', marginBottom: '15px',backgroundColor: '#add8e6'}} key={chat.timestamp}>{props.child ? wordFilter(chat.content) : chat.content} 
          <br/>
          <p style={{fontSize: '5px'}}>{chat.email}~ @{chat.timestamp}</p>
          </Paper>
        }
        else{
          return <Paper elevation={2} style={chat.mod ?{fontFamily: 'Baloo 2, cursive', width:'50%',padding:'5px', paddingBottom: '15px', marginBottom: '15px', marginLeft: '30px',backgroundColor: '#FDFD96' } : {fontFamily: 'Baloo 2, cursive', width:'50%',padding:'5px', paddingBottom: '15px', marginBottom: '15px', marginLeft: '30px'}} key={chat.timestamp}>{props.child ? wordFilter(chat.content) : chat.content}
          <br/>
          <p style={{fontSize: '5px'}}>{chat.email}~ @{chat.timestamp}</p>
          </Paper>
        }
        })}
      </div>
      </Paper>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} style={matches ? {width: '440px', marginBottom: '20px', padding: '20px'} : {width: '257px', marginBottom: '20px', padding: '20px'}} value={text.content}></input>
        <button style={{padding: '20px'}} type="submit">Send</button>
      </form>
      <button onClick={googleSignIn} type="button">
      Sign up with Google
      </button>
      <button onClick={signOut} type="button">
        Sign out
      </button>
    </div>
  );



}

export default Messenger