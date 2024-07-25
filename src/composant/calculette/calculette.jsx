import React, { useEffect, useState } from 'react';
import Menu from '../menu/menu';
import '../../style/calculette/calculette.css';
import firebase from '../firebasse/firebasse';

function Calculette() {
    const [bolusma, setBolusma] = useState('');
    const [bolusmi, setBolusmi] = useState('');
    const [bolusgo, setBolusgo] = useState('');
    const [bolusso, setBolusso] = useState('');
    const [glycemie, setGlycemie] = useState('');
    const [glucide, setGlucide] = useState('');
    const [matin, setMatin] = useState(false);
    const [midi, setMidi] = useState(false);
    const [gouter, setGouter] = useState(false);
    const [soir, setSoir] = useState(false);
    const [resultats, setResultats] = useState('');
    const [resultats2, setResultats2] = useState('');

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                await fetchData(user.uid);
            } else {
                window.location.href = '/glucide_aide/';
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchData = async (uid) => {
        try {
            const doc = await firebase.firestore().collection('ratio').doc(uid).get();
            if (doc.exists) {
                const data = doc.data();
                setBolusma(data.bolusma || '');
                setBolusmi(data.bolusmi || '');
                setBolusgo(data.bolusgo || '');
                setBolusso(data.bolusso || '');
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const calculateBolus = async () => {
        const glycemieValue = parseFloat(glycemie);
        const glucideValue = parseFloat(glucide);

        if (isNaN(glycemieValue) || isNaN(glucideValue)) {
            setResultats('Veuillez entrer des valeurs valides pour glycémie et glucide.');
            return;
        }

        let result = '';

        if (glycemieValue < 170) {
            if (matin) result = (glucideValue / parseFloat(bolusma)).toFixed(2);
            if (midi) result = (glucideValue / parseFloat(bolusmi)).toFixed(2);
            if (gouter) result = (glucideValue / parseFloat(bolusgo)).toFixed(2);
            if (soir) result = (glucideValue / parseFloat(bolusso)).toFixed(2);
        } else if (glycemieValue >= 170 && glycemieValue < 220) {
            if (matin) result = (glucideValue / parseFloat(bolusma) + 1).toFixed(2);
            if (midi) result = (glucideValue / parseFloat(bolusmi) + 1).toFixed(2);
            if (gouter) result = (glucideValue / parseFloat(bolusgo) + 1).toFixed(2);
            if (soir) result = (glucideValue / parseFloat(bolusso) + 1).toFixed(2);
        } else if (glycemieValue >= 220 && glycemieValue < 270) {
            if (matin) result = (glucideValue / parseFloat(bolusma) + 2).toFixed(2);
            if (midi) result = (glucideValue / parseFloat(bolusmi) + 2).toFixed(2);
            if (gouter) result = (glucideValue / parseFloat(bolusgo) + 2).toFixed(2);
            if (soir) result = (glucideValue / parseFloat(bolusso) + 2).toFixed(2);
        } else if (glycemieValue >= 270 && glycemieValue < 320) {
            if (matin) result = (glucideValue / parseFloat(bolusma) + 3).toFixed(2);
            if (midi) result = (glucideValue / parseFloat(bolusmi) + 3).toFixed(2);
            if (gouter) result = (glucideValue / parseFloat(bolusgo) + 3).toFixed(2);
            if (soir) result = (glucideValue / parseFloat(bolusso) + 3).toFixed(2);
        } else if (glycemieValue >= 320) {
            if (matin) result = (glucideValue / parseFloat(bolusma) + 4).toFixed(2);
            if (midi) result = (glucideValue / parseFloat(bolusmi) + 4).toFixed(2);
            if (gouter) result = (glucideValue / parseFloat(bolusgo) + 4).toFixed(2);
            if (soir) result = (glucideValue / parseFloat(bolusso) + 4).toFixed(2);
        }
        setResultats(result);

        const db = firebase.firestore();
        const user = firebase.auth().currentUser;
        const currentTime = new Date();
        const aujd = new Date();
        let day = aujd.getDate();
        const an = aujd.getFullYear();
        let month = aujd.getMonth() + 1;

        let moment = "";
        if (matin) moment = "Matin";
        if (midi) moment = "Midi";
        if (gouter) moment = "Goûter";
        if (soir) moment = "Soir";

        if (!glucide || !glycemie || !moment) {
            setResultats2("Veuillez remplir tous les champs et sélectionner un moment.");
            return;
        }

        if (month === 13) month = 1;
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        const aujdFormatted = `${day}-${month}-${an}`;
        
        try {
            const cookiesDoc = await db.collection("cookies").doc(user.uid).get();
            const cookieCount = cookiesDoc.exists ? Object.keys(cookiesDoc.data()).length : 0;
            const cookieName = "cookie_" + (cookieCount + 1);

            await db.collection("cookies").doc(user.uid).set({
                [cookieName]: `${glucide}g ${glycemie}mg/dl ${moment} ${result}ui ${currentTime.getHours()}:${currentTime.getMinutes()} ${aujdFormatted}`
            }, { merge: true });

            setResultats2("Enregistré !");
        } catch (error) {
            console.error("Error saving data: ", error);
            setResultats2("Erreur lors de l'enregistrement !");
        }
    };

    return (
        <div className='calculette'>
            <Menu />
            <h1 className='titre-calculette'>Calculette</h1>
            <div className='calcul'>
                <input
                    type="text"
                    value={glycemie}
                    onChange={(e) => setGlycemie(e.target.value)}
                    placeholder="Glycémie"
                    className="input-glycemie"
                /><br />
                <input
                    type="text"
                    value={glucide}
                    onChange={(e) => setGlucide(e.target.value)}
                    placeholder="Glucides"
                    className="input-glucide"
                /><br />
                <input
                    type="checkbox"
                    checked={matin}
                    onChange={() => setMatin(!matin)}
                    id="Matin"
                    className="checkbox-matin"
                /><label htmlFor="Matin" className="label-matin">Matin</label><br />
                <input
                    type="checkbox"
                    checked={midi}
                    onChange={() => setMidi(!midi)}
                    id="Midi"
                    className="checkbox-midi"
                /><label htmlFor="Midi" className="label-midi">Midi</label><br />
                <input
                    type="checkbox"
                    checked={gouter}
                    onChange={() => setGouter(!gouter)}
                    id="Goûter"
                    className="checkbox-gouter"
                /><label htmlFor="Goûter" className="label-gouter">Goûter</label><br />
                <input
                    type="checkbox"
                    checked={soir}
                    onChange={() => setSoir(!soir)}
                    id="Soir"
                    className="checkbox-soir"
                /><label htmlFor="Soir" className="label-soir">Soir</label><br />
                <button onClick={calculateBolus} id="submit-btn" className="btn-submit">Calculer</button>
                <div id="resultats" className="result result1">{resultats}</div>
                <div id="resultats2" className="result result2">{resultats2}</div>
            </div>
        </div>
    );
}

export default Calculette;
