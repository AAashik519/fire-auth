import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);
function App() {
  const [user ,setUser]=useState({
    isSignIN :false,
    name :' ',
    email :'',
    photo :'',
    password:''
  

  })
   const provider = new firebase.auth.GoogleAuthProvider();
   const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
     .then((res) =>{
      
       const {displayName ,photoURL ,email} =res.user
         console.log(displayName ,photoURL ,email  );

         const signInUser= {
           isSignIN: true,
           name:displayName,
           email:email,
           photo:photoURL
         }
         setUser(signInUser)

     })
     .catch((err) =>{
       console.log(err.message);
     })
   
     
   }

   const handleSignOut =()=>{
    // const signOutUser ={
    //   isSignIN :false
    // }
    // setUser(signOutUser)
    firebase.auth().signOut()
    .then((res) => {
       const signOutUser={
        isSignIN :false,
        name :' ',
        email :'',
        photo :'',
        password:''
      
       }
       console.log(res);
       setUser(signOutUser)
    }).catch((err) => {
      console.log(err.message);
    });
   }


   const handleSubmit =(e)=>{   
    console.log(user.email ,user.password); 
    if(user.email && user.password){
 console.log('ekfewfujk');
    }
    e.preventDefault();
   }
  
   const handleChange=(e)=>{
      let isFormValid =true ;
      if(e.target.name==='email'){
             isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
      }
      if(e.target.name==='password'){
          const isPasswordValid = e.target.value.length >6
          const passwordHasNumber =/\d{1}/.test(e.target.value)
          isFormValid =isPasswordValid &&  passwordHasNumber;
      }
      if(isFormValid){
          const newUserInfo ={...user}
       
          newUserInfo[e.target.name] = e.target.value ;
          setUser(newUserInfo)
         
      }  

       
   
   }

    

  return (
    <div className="App">
      { user.isSignIN ?
        <button onClick ={handleSignOut}> Sign out</button> : <button onClick ={handleSignIn}> Sign In</button>
      }
       {
         user.isSignIN &&  <div>
           <p> welcome , {user.name} </p>
           <p> Your email Address , {user.email} </p>
           <img src={user.photo} alt="email image" />
            </div>
}

      <form  onSubmit={handleSubmit}>
      
         
      <h1> Our Own Authintication</h1>
      <input type="text" name='name'  onBlur={ handleChange} placeholder='Your name'   />
      <br />
       <input type="email" name="email" onBlur={handleChange} placeholder='your email address' required/> <br />
       <input type="password" name="password" onBlur={handleChange} required placeholder ='your password'/>
       <br />
      <input type="submit" value="Submit" />
      </form>

    </div>
  );
}

export default App;

