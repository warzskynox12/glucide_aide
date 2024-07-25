import React, { useState } from 'react';
import '../../style/home/sign.css';
import firebase from '../firebasse/firebasse';



const Sign = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSignup = async () => {
      setError('');
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
  
      setIsLoading(true);
      try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
  
          if (profileImage) {
            const storageRef = firebase.storage().ref();
            const profileImageRef = storageRef.child(`profiles/${userCredential.user.uid}`);
            
            await profileImageRef.put(profileImage);
            const profileImageUrl = await profileImageRef.getDownloadURL();
        
            await userCredential.user.updateProfile({
              displayName: `${firstName} ${lastName}`,
              photoURL: profileImageUrl,
            });
        
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
              firstName: firstName,
              lastName: lastName,
              email: email,
              photoURL: profileImageUrl,
            });
        
            console.log('Profil utilisateur mis à jour avec succès.');
          } else {
            await userCredential.user.updateProfile({
              displayName: `${firstName} ${lastName}`,
            });
        
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
              firstName: firstName,
              lastName: lastName,
              email: email,
            });
          }
      console.log('Inscription réussie !');
      window.location.href = '/glucide_aide/';
      } catch (error) {
        setError(error.message);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleGoogleSignup = async () => {
      setIsLoading(true);
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
  
        const email = result.user.email;
        const { given_name, family_name } = result.additionalUserInfo.profile;
  
        const profileImageUrl = result.user.photoURL || 'https://firebasestorage.googleapis.com/v0/b/nationsglory-62812.appspot.com/o/Prendre%20sa%20sant%C3%A9%20en%20main%20n%E2%80%99a%20jamais%20%C3%A9t%C3%A9%20aussi%20simple.jpg?alt=media&token=dc085ed1-9a30-4dc8-92cc-ad7eaa8a840c';
  
        await firebase.firestore().collection('users').doc(result.user.uid).set({
          firstName: given_name,
          lastName: family_name,
          email: email,
          photoURL: profileImageUrl,
        });
  
        console.log('Inscription avec Google réussie !');
        window.location.href = '/glucide_aide/';
      } catch (error) {
        setError(error.message);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className='sign-in'>
            {error && <p className='error' style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                className='prénom'
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nom"
                value={lastName}
                className='nom'
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Adresse email"
                value={email}
                className='mail1'
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                className='password1'
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                className='passwordconfirm'
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                className='file'
                onChange={(e) => setProfileImage(e.target.files[0])}
            />
            <button className='se-connecter' onClick={handleSignup} disabled={isLoading}>S'inscrire</button>
            <button className='sign-google' onClick={handleGoogleSignup} disabled={isLoading}>S'inscrire avec Google</button>
        </div>
    );
};

export default Sign;