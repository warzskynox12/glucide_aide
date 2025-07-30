import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../menu/menu';
import '../../style/ratio/ratio.css';
import firebase from '../firebasse/firebasse';
import { Navigate } from 'react-router-dom';

function Ratio() {
    const navigate = useNavigate();
    const [bolusma, setBolusma] = useState('');
    const [bolusmi, setBolusmi] = useState('');
    const [bolusgo, setBolusgo] = useState('');
    const [bolusso, setBolusso] = useState('');
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                fetchData(user.uid);
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchData = async (uid) => {
        try {
            const doc = await firebase.firestore().collection('ratio').doc(uid).get();
            if (doc.exists) {
                const data = doc.data();
                setInitialData(data);
                // NE PAS vider les inputs ici !
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleSave = async () => {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        const updates = {};
        if (bolusma !== initialData.bolusma) updates.bolusma = bolusma;
        if (bolusmi !== initialData.bolusmi) updates.bolusmi = bolusmi;
        if (bolusgo !== initialData.bolusgo) updates.bolusgo = bolusgo;
        if (bolusso !== initialData.bolusso) updates.bolusso = bolusso;

        if (Object.keys(updates).length > 0) {
            try {
                const docRef = firebase.firestore().collection('ratio').doc(user.uid);
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    await docRef.update(updates);
                } else {
                    await docRef.set(updates);
                }
                await fetchData(user.uid); // Rafraîchir l'affichage
                setBolusma('');
                setBolusmi('');
                setBolusgo('');
                setBolusso('');
            } catch (error) {
                console.error("Error saving document: ", error);
            }
        }
    };
    

    return (
    <div className='ratio-container'>
    <Menu/>
    <h1 className='titre-ratio'>Ratio</h1>
    <div className='ratio'>
    <p className='ratio-group'>
        <label className='ratio-label' htmlFor="bolusma">Ratio Matin :</label>
        <input
            className='ratio-input'
            type="text"
            id="bolusma"
            pattern="[0-9]+(\.[0-9]+)?"
            title="Veuillez entrer un nombre valide (chiffres et point décimal)"
            placeholder="Bolus Matin"
            value={bolusma}
            onChange={(e) => setBolusma(e.target.value)}
        />
        <div className="ratio-value" id="bolusmatin">ratio matin : {initialData.bolusma} ml/dl</div>
    </p>
    
    <p className='ratio-group'>
        <label className='ratio-label' htmlFor="bolusmi">Ratio Midi :</label>
        <input
            className='ratio-input'
            type="text"
            id="bolusmi"
            pattern="[0-9]+(\.[0-9]+)?"
            title="Veuillez entrer un nombre valide (chiffres et point décimal)"
            placeholder="Bolus Midi"
            value={bolusmi}
            onChange={(e) => setBolusmi(e.target.value)}
        />
        <div className="ratio-value" id="bolusmidi">ratio midi : {initialData.bolusmi} ml/dl</div>
    </p>
    
    <p className='ratio-group'>
        <label className='ratio-label' htmlFor="bolusgo">Ratio Goûter :</label>
        <input
            className='ratio-input'
            type="text"
            id="bolusgo"
            pattern="[0-9]+(\.[0-9]+)?"
            title="Veuillez entrer un nombre valide (chiffres et point décimal)"
            placeholder="Bolus Goûter"
            value={bolusgo}
            onChange={(e) => setBolusgo(e.target.value)}
        />
        <div className="ratio-value" id="bolusgouter">ratio goûter : {initialData.bolusgo} ml/dl</div>
    </p>
    
    <p className='ratio-group'>
        <label className='ratio-label' htmlFor="bolusso">Ratio Soir :</label>
        <input
            className='ratio-input'
            type="text"
            id="bolusso"
            pattern="[0-9]+(\.[0-9]+)?"
            title="Veuillez entrer un nombre valide (chiffres et point décimal)"
            placeholder="Bolus Soir"
            value={bolusso}
            onChange={(e) => setBolusso(e.target.value)}
        />
        <div className="ratio-value" id="bolussoir">ratio soir : {initialData.bolusso} ml/dl</div>
    </p>
    </div>
    <center>
        <button
            onClick={handleSave}
            id="submit-btn"
            className="submit-button"
        >
            Enregistrer
        </button>
    </center>
</div>

    );
}

export default Ratio;
