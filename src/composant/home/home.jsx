import React, { useState, useEffect } from 'react';
import Menu from '../menu/menu';
import '../../style/home/home.css';
import Sign from './sign';
import Loginnn from './login';
import firebase from '../firebasse/firebasse';
import Profil from './profil';

function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [is, setIs] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIs(!!user);
    });
    return () => unsubscribe(); 
  }, []); 

  
  if (is === null) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='home'>
      <Menu />
      <h1 className='titre-home'>Home</h1>
      <div className='sign'>
      {is ? <Profil /> :
        <>
          {isLogin ? <Login /> : <Sign />}
          <div className='connection'>
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </div>
        </>
      }
      </div>
    </div>
  );
}

export default Home;