import { auth } from '../Services/firebase';


function signUp(email, password) {
    return auth().createUserWithEmailAndPassword(email, password);
  }
  
function signIn(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
  }

function signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    console.log(auth().currentUser)
    return auth().signInWithPopup(provider);
  }

  export {signIn, signUp, signInWithGoogle}