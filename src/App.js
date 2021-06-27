import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser,setNewUser] =useState(false)
  const [user, setUser] = useState({
    isSignIN: false,
   
    name: ' ',
    email: '',
    photo: '',
    password: ''


  })
  const provider = new firebase.auth.GoogleAuthProvider();
   const FbProvider =  new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then((res) => {

        const { displayName, photoURL, email } = res.user
        console.log(displayName, photoURL, email);

        const signInUser = {
          isSignIN: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signInUser)

      })
      .catch((err) => {
        console.log(err.message);
      })


  }

  const handleSignOut = () => {
    // const signOutUser ={
    //   isSignIN :false
    // }
    // setUser(signOutUser)
    firebase.auth().signOut()
      .then((res) => {
        const signOutUser = {
          isSignIN: false,
          name: ' ',
          email: '',
          photo: '',
          password: '',
          error: '',
          success: false

        }
        console.log(res);
        setUser(signOutUser)
      }).catch((err) => {
        console.log(err.message);
      });
  }


  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true
          setUser(newUserInfo)
        })
        .catch((error) => {
          
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
          updateUserInfo(user.name)

        });
    }

    if(!newUser && user.email && user.password ){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(( res) => {
        const newUserInfo = { ...user }
        newUserInfo.error = '';
        newUserInfo.success = true
        setUser(newUserInfo)
     console.log('sign in user info' ,res.user);
      })
      .catch((error) => {
        const newUserInfo = { ...user }
        newUserInfo.error = error.message
        newUserInfo.success = false
        setUser(newUserInfo)

      });
    }
    e.preventDefault();
  }

  const handleChange = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user }

      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)

    }

  }

  const updateUserInfo =(name) =>{
      const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
      })
      .then(function () {
        console.log('user name update successFully')
      })
      .catch(function(error){
        console.log('user name update successfully');
      })
  }



  const handleFbSignIN =()=>{
    
    firebase
    .auth()
    .signInWithPopup(FbProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
  
      
      var user = result.user;
  
       
      var accessToken = credential.accessToken;
  
      // ...
      console.log(user)
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
  
      // ...
      console.log(error);
    });
  }

  return (
    <div className="App">
      {user.isSignIN ?
        <button onClick={handleSignOut}> Sign out</button> : <button onClick={handleSignIn}> Sign In</button>
      }
      <br />
      <br />
      { <button onClick={handleFbSignIN}> FaceBook Login</button> }
      {
        user.isSignIN && <div>
          <p> welcome , {user.name} </p>
          <p> Your email Address , {user.email} </p>
          <img src={user.photo} alt="email image" />
        </div>
      }
      <h1> Our Own Authintication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser"> New User Sign Up</label>
      <br />
      <form onSubmit={handleSubmit}>

        {newUser && <input type="text" name='name' onBlur={handleChange} placeholder='Your name' />}
        <br />
        <input type="email" name="email" onBlur={handleChange} placeholder='your email address' required /> <br />
        <input type="password" name="password" onBlur={handleChange} required placeholder='your password' />
        <br />
        <input type="submit" value="Submit" />
      </form>

      <p style={{ color: 'red' }}> {user.error} </p>

      {user.success && <p style={{ color: 'green' }}> User { newUser ? 'created' : 'Log In'} successFully </p>}
    </div>
  );
}

export default App;

