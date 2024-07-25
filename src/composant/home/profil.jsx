import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from '../firebasse/firebasse';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import '../../style/home/profil.css';



const profil = () => {
    const [user, setUser] = useState(null);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [error, setError] = useState(null);
    const [isGoogleProvider, setIsGoogleProvider] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setIsGoogleProvider(user.providerData.some(provider => provider.providerId === 'google.com'));
            } else {
                setUser('');
                navigate('/nationglorycomu/Auth');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLinkGoogleAccount = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().currentUser.linkWithPopup(provider);
            console.log('Compte Google lié avec succès !');
            setIsGoogleProvider(true);
            location.reload();
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            await firebase.auth().currentUser.updateEmail(newEmail);
            console.log('Adresse email mise à jour avec succès !');
            location.reload();
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            if (newPassword !== confirmNewPassword) {
                setError('Les mots de passe doivent correspondre.');
                return;
            }
            await firebase.auth().currentUser.updatePassword(newPassword);
            console.log('Mot de passe mis à jour avec succès !');
            location.reload();
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    const handleUpdateName = async () => {
        try {
            await firebase.auth().currentUser.updateProfile({
                displayName: `${newFirstName} ${newLastName}`
            });
            console.log('Nom mis à jour avec succès !');
            location.reload();
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    };

    const handleFileChange = (event) => {
        setNewProfileImage(event.target.files[0]);
    };

    const handleClick = async () => {
        try {
            if (newProfileImage) {
                const imgRef = ref(firebase.storage(), `profiles/${uuidv4()}`);
                const snapshot = await uploadBytes(imgRef, newProfileImage);
                console.log(snapshot);

                const url = await getDownloadURL(snapshot.ref);
                setProfileImageUrl(url);

                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    await updateProfile(user, { photoURL: url });

                    const db = getFirestore();
                    await setDoc(doc(db, "users", user.uid), { photoURL: url }, { merge: true });

                    location.reload();
                } else {
                    console.error('Utilisateur non connecté');
                }
            }
        } catch (error) {
            console.error('Erreur lors du téléchargement de l\'image de profil :', error);
        }
    };

    const photoORI = "https://firebasestorage.googleapis.com/v0/b/nationsglory-62812.appspot.com/o/Prendre%20sa%20sant%C3%A9%20en%20main%20n%E2%80%99a%20jamais%20%C3%A9t%C3%A9%20aussi%20simple.jpg?alt=media&token=dc085ed1-9a30-4dc8-92cc-ad7eaa8a840c";
    const photoURL = user?.photoURL;

    useEffect(() => {
        const titre = document.getElementById('titre-infoutilisateur');
        if (titre) {
            const toggleInfoUtilisateur = () => {
                var x = document.getElementById('infoutilisateur');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleInfoUtilisateur);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleInfoUtilisateur);
            };
        }
    }, []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-assogoogle');
        if (titre) {
            const toggleAssogoogle = () => {
                var x = document.getElementById('assogoogle');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleAssogoogle);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleAssogoogle);
            };
        }
    }, []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-adressemail');
        if (titre) {
            const toggleAdressemail = () => {
                var x = document.getElementById('adressemail');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleAdressemail);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleAdressemail);
            };
        }
    }, []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-mdp');
        if (titre) {
            const toggleMdp = () => {
                var x = document.getElementById('mdp');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleMdp);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleMdp);
            };
        }
    }, []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-mnom');
        if (titre) {
            const toggleMnom = () => {
                var x = document.getElementById('mnom');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleMnom);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleMnom);
            };
        }
    }, []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-mprofil');
        if (titre) {
            const toggleMprofil = () => {
                var x = document.getElementById('mprofil');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleMprofil);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleMprofil);
            };
        }
    }
    , []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-delete');
        if (titre) {
            const toggleDelete = () => {
                var x = document.getElementById('delete');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleDelete);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleDelete);
            };
        }
    }, []);
    //faire apparaitre et disparaitre les informations de l'utilisateur
    useEffect(() => {
        const titre = document.getElementById('titre-deconnexion');
        if (titre) {
            const toggleDeconnexion = () => {
                var x = document.getElementById('deconnexion');
                if (x.style.display === 'flex') {
                    x.style.display = 'none';
                } else {
                    x.style.display = 'flex';
                }
            };
            titre.addEventListener('click', toggleDeconnexion);
            // Nettoyage de l'écouteur d'événements
            return () => {
                titre.removeEventListener('click', toggleDeconnexion);
            };
        }
    }, []);

    return (
        <div className='profil'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2 id='titre-infoutilisateur' className='titre-infoutilisateur'><p>Informations de l'utilisateur</p></h2>               
            <div id='infoutilisateur' className='infoutilisateur'>
                <p className='infoutilisateur1' style={{display: "grid",}}>
                    <div className='infoutilisateurimg'>
                        <img  src={photoURL || photoORI}/>
                    </div>
                    <div className='infoutilisateurautre'>
                        Nom:<br/>{user?.displayName?.split(' ')[0]} {user?.displayName?.split(' ')[1]}<br/><br/>Email:<br/> {user?.email}
                    </div>
                </p>
            </div>
            <h2 id='titre-assogoogle' className='titre-assogoogle'><p>connection a google</p></h2>
            <div id='assogoogle' className='assogoogle'>
                {isGoogleProvider ? (
                    <p>Connecté avec Google</p>
                ) : (
                    <p><button  onClick={handleLinkGoogleAccount}>Lier un compte Google</button></p>
                )}
            </div>
            <h2 id='titre-adressemail' className='titre-adressemail' ><p>Modifier l'adresse email</p></h2>
            <div id='adressemail' className='adressemail'>    
                <p>
                    <input
                        type="email"
                        placeholder="Nouvelle adresse email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button onClick={handleUpdateEmail}>Mettre à jour l'email</button>
                </p>
            </div>
            <h2 id='titre-mdp' className='titre-mdp'><p>Modifier le mot de passe</p></h2>
            <div id='mdp' className='mdp'>
                <p>
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le nouveau mot de passe"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <button onClick={handleUpdatePassword}>Mettre à jour le mot de passe</button>
                </p>
            </div>
            <h2 id='titre-mnom' className='titre-mnom'><p>Modifier le nom</p></h2>
            <div id='mnom' className='mnom'>
                <p>
                    <input
                        type="text"
                        placeholder="Nouveau prénom"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Nouveau nom de famille"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                    />
                    <button onClick={handleUpdateName}>Mettre à jour le nom</button>
                </p>
            </div>
            <h2 id='titre-mprofil' className='titre-mprofil'><p>Modifier l'image de profil</p></h2>
            <div id='mprofil' className='mprofil'>
                <p>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleClick}>Télécharger l'image de profil</button>
                </p>
            </div>
            <h2 id='titre-delete' className='titre-delete'><p>Supprimer le compte</p></h2>
            <div id='delete' className='delete'>
                <p>
                <button onClick={() => {
                    if (window.confirm('Voulez-vous vraiment supprimer votre compte ?')) {
                        
                        firebase.firestore().collection('users').doc(user.uid).delete().then(() => {
                            console.log(user.uid);
                            console.log('Document utilisateur supprimé avec succès !');
                        }).catch((error) => {
                            setError(error.message);
                            console.error(error.message);
                        });
                        firebase.auth().currentUser.delete().then(() => {
                            console.log('Compte supprimé avec succès !');
                            navigate('/glucide_aide/');
                        }).catch((error) => {
                            setError(error.message);
                            console.error(error.message);
                        });
                    }
                }}>Supprimer le compte</button>
                </p>
            </div>
            <h2 id='titre-deconnexion' className='titre-deconnexion'><p>Déconnexion</p></h2>
            <div id='deconnexion' className='deconnexion'>
                <p>
                <button onClick={() => {
                    firebase.auth().signOut().then(() => {
                        console.log('Déconnexion réussie !');
                        navigate('/glucide_aide/');
                    }).catch((error) => {
                        setError(error.message);
                        console.error(error.message);
                    });
                }}>Déconnexion</button>
                </p>
            </div>
        </div>
    );
};

export default profil;