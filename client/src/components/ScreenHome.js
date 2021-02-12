import React, {useState, useEffect}  from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {Input, Button, Icon} from 'antd';
import { PropertySafetyFilled } from '@ant-design/icons';
import {connect} from 'react-redux';


function ScreenHome(props) {

  //(2.13) Ces états vont servir à stocker les valeurs des champs de saisie
  const [signInEmail , setSignInEmail ] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
 //(2.5) Ces états vont servir à stocker les valeurs des champs de saisie.
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [userExists, setUserExists] = useState(false);

  const [listErrorsSignin, setListErrorsSignin] = useState([]);
  const [listErrorsSignup, setListErrorsSignup] = useState([]);

  //(2.7) mise en place la mécanique qui permet d’exploiter les valeurs des champs de saisie
  //(2.8) on déclenche la route du Backend permettant d’enregistrer un utilisateur en base de données
  var handleSubmitSignUp = async () => {
    const data = await fetch('/sign-up', { 
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `username=${signUpUsername}&email=${signUpEmail}&password=${signUpPassword}`
    })

    const body = await data.json();
    //console.log(body)
    if(body.result == true){ 
      setUserExists(true); 
      props.addToken(body.token);
    } else {
      setListErrorsSignup(body.error)
    }
   }
 

   //(2.15) déclenchement de la route du Backend permettant de vérifier si l'utilisateur existe en base de données
    var handleSubmitSignIn = async () => {
       const data = await fetch('/sign-in', {
         method: 'POST',
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         body:`email=${signInEmail}&password=${signInPassword}` 
       })
          const body = await data.json();
          
          if(body.result == true){
             setUserExists(true);
             props.addToken(body.token);
        } else {
          setListErrorsSignin(body.error)
        }
      }

   // console.log(userExists)
   
   //(2.9) mise en place une redirection vers la ScreenSource 
      if(userExists){
    return <Redirect to='/screensource' />}


   var tabErrorsSignin = listErrorsSignin.map((error, i) => {
      return(<p>{error}</p>)
    })

   var tabErrorsSignup = listErrorsSignup.map((error, i) => {
      return(<p>{error}</p>)
    })
    
    
  

     //(2.6)  Mise en place la mécanique permettant de capter les changements sur les champs de saisie afin de mettre à jour l’état associé.
     //(2.14) //
  return (
    <div className="Login-page" >

          {/* SIGN-IN */}

          <div className="Sign">
                  
                  <Input onChange={(e) => setSignInEmail(e.target.value)} className="Login-input" placeholder="email" />

                  <Input.Password onChange={(e) => setSignInPassword(e.target.value)} className="Login-input" placeholder="password" />

                 {tabErrorsSignin}

             <Button onClick={() => handleSubmitSignIn()} style={{width:'80px'}} type="primary">Sign-in</Button>

           </div>

          {/* SIGN-UP */}

          <div className="Sign">
                  
                  <Input onChange={(e) => setSignUpUsername(e.target.value)} className="Login-input" placeholder="username" />

                  <Input onChange={(e) => setSignUpEmail(e.target.value)} className="Login-input" placeholder="email" />
                  
                  <Input.Password onChange={(e) => setSignUpPassword(e.target.value)} className="Login-input" placeholder="password" />
            
                  {tabErrorsSignup}

            <Button onClick={() => handleSubmitSignUp()} style={{width:'80px'}} type="primary">Sign-up</Button>

          </div>

      </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
  
    addToken: function(token) {
      dispatch( {
        type: 'addToken',
        token: token
      })
    }
  }
}

export default connect(
mapDispatchToProps,
null
)
(ScreenHome);
