import { useState, useRef, useContext } from 'react';

import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';



const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const formHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    setIsLoading(true);
    let url;
    if(isLogin){
       url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCaZ5dpUWi2wLHU10GHp8wyS5zaoLpgR5U';
       

    }else{
       url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCaZ5dpUWi2wLHU10GHp8wyS5zaoLpgR5U';
      
    }
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type' : 'application/json'
        }
      }
    ).then((res) => {
      setIsLoading(false);
      if(res.ok){
        return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = 'Auth failed!';
          // if(data && data.error && data.error.message){
          //   errorMessage = data.error.message;
          // }
          throw new Error(errorMessage);
        })
      }
    }).then((data) => {
      console.log(data);
      authCtx.login(data.idToken);
      history.replace('/');
    })
    .catch((err) => {
      alert(err.message);
    })



  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={formHandler} >
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordRef}
          />
        </div>
        <div className={classes.actions}>
         {!isLoading &&  <button>{isLogin ? 'Login' :'Create Account'}</button>}
         {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};
export default AuthForm;
