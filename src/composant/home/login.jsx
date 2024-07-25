import React, { useState } from 'react';
import '../../style/home/login.css'
import firebase from '../firebasse/firebasse';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('Connexion réussie !');
      window.location.href = '/glucide_aide/';
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log('Connexion réussie avec Google !');
      window.location.href = '/glucide_aide/';
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Adresse email"
        value={email}
        className='mail2'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        className='password2'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='se-connecter1' onClick={handleLogin} disabled={isLoading}>Se connecter</button>
      <button className='sign-google1' onClick={handleGoogleLogin} disabled={isLoading}>Se connecter avec Google</button>
    </div>
  );
};

export default Login;