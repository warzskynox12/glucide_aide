import React, { useEffect, useState } from 'react';
import Menu from '../menu/menu';
import '../../style/historique/historique.css';
import firebase from '../firebasse/firebasse';

function Historique() {
    const [historique, setHistorique] = useState([]);
    const [editing, setEditing] = useState(null);
    const [posteRepasValue, setPosteRepasValue] = useState('');

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                fetchHistorique(user.uid); 
            } else {
                window.location.href = '/glucide_aide/';
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchHistorique = async (uid) => {
        try {
            const cookiesDoc = await firebase.firestore().collection('cookies').doc(uid).get();
            if (cookiesDoc.exists) {
                const cookiesData = cookiesDoc.data();
                const cookiesList = Object.keys(cookiesData).map(key => {
                    const [quantite, glycemie, moment, resultat, heure, date, posteRepas] = cookiesData[key].split(' ');
                    return {
                        cookieName: key,
                        quantite,
                        glycemie: parseFloat(glycemie),
                        moment,
                        resultat,
                        heure,
                        date,
                        posteRepas: parseFloat(posteRepas) || ''
                    };
                });
                setHistorique(cookiesList);
            }
        } catch (error) {
            console.error("Error fetching historique: ", error);
        }
    };

    const handlePosteRepasChange = (e) => {
        setPosteRepasValue(e.target.value);
    };

    const startEditing = (cookie) => {
        setEditing(cookie.cookieName);
        setPosteRepasValue(cookie.posteRepas);
    };

    const savePosteRepas = async (cookie) => {
        const { cookieName, quantite, glycemie, moment, resultat, heure, date } = cookie;

        try {
            const updatedCookie = `${quantite} ${glycemie} ${moment} ${resultat} ${heure} ${date} ${posteRepasValue}mg/dl`;
            const db = firebase.firestore();
            const user = firebase.auth().currentUser;

            await db.collection('cookies').doc(user.uid).set({
                [cookieName]: updatedCookie
            }, { merge: true });

            setHistorique(historique.map(c => c.cookieName === cookieName ? { ...c, posteRepas: parseFloat(posteRepasValue) } : c));
            setEditing(null);
        } catch (error) {
            console.error("Error updating poste repas: ", error);
        }
    };

    const extractNumericValue = (value) => {
        const match = value.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : NaN;
    };
    
    const getGlycemieClass = (value) => {
        // Assurez-vous que value est une chaîne de caractères
        const strValue = String(value).trim().toLowerCase();
        const numericValue = extractNumericValue(strValue);
    
        if (strValue === '' || strValue === 'rien' || isNaN(numericValue)) return 'glycemie-empty';
    
        if (numericValue <= 70) return 'glycemie-low';
        if (numericValue > 70 && numericValue < 170) return 'glycemie-normal';
        if (numericValue >= 170 && numericValue <= 250) return 'glycemie-high';
        return 'glycemie-very-high';
    };
    
    const getPosteRepasClass = (value) => {
        // Assurez-vous que value est une chaîne de caractères
        const strValue = String(value).trim().toLowerCase();
        const numericValue = extractNumericValue(strValue);
    
        if (strValue === '' || strValue === 'rien' || isNaN(numericValue)) return 'poste-repas-empty';
    
        if (numericValue <= 70) return 'poste-repas-low';
        if (numericValue > 70 && numericValue < 170) return 'poste-repas-normal';
        if (numericValue >= 170 && numericValue <= 250) return 'poste-repas-high';
        return 'poste-repas-very-high';
    };
    
    const renderCookies = () => {
        if (!historique.length) {
            return <div>No historical data found.</div>;
        }
    
        const cookiesParDate = historique.reduce((acc, cookie) => {
            if (!acc[cookie.date]) {
                acc[cookie.date] = [];
            }
            acc[cookie.date].push(cookie);
            return acc;
        }, {});
    
        const datesTriees = Object.keys(cookiesParDate).sort((a, b) => new Date(b.split('-').reverse().join('-')) - new Date(a.split('-').reverse().join('-')));
    
        return datesTriees.map(date => {
            const cookiesGroupe = cookiesParDate[date].sort((a, b) => {
                const [aHeure, aMinute] = a.heure.split(':').map(Number);
                const [bHeure, bMinute] = b.heure.split(':').map(Number);
                return bHeure - aHeure || bMinute - aMinute;
            });
    
            return (
                <div key={date} className="cookie-item">
                    <div className="nom-item" onClick={() => {
                        const detailsTable = document.getElementById(date);
                        detailsTable.style.display = detailsTable.style.display === 'none' ? 'table' : 'none';
                    }}>
                         {date}
                    </div>
                    <table id={date} className="table-cookies" style={{ display: 'none' }}>
                        <thead>
                            <tr>
                                <th>Moment</th>
                                <th>Quantité</th>
                                <th>Glycémie</th>
                                <th>Unité</th>
                                <th>Poste repas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cookiesGroupe.map(cookie => (
                                <tr key={cookie.cookieName}>
                                    <td>{cookie.moment}</td>
                                    <td>{cookie.quantite}</td>
                                    <td className={getGlycemieClass(cookie.glycemie)}>
                                        {cookie.glycemie} mg/dl
                                        
                                    </td>
                                    <td>{cookie.resultat}</td>
                                    <td className={getPosteRepasClass(cookie.posteRepas)}>
                                        {editing === cookie.cookieName ? (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder='Poste repas'
                                                    value={posteRepasValue}
                                                    onChange={handlePosteRepasChange}
                                                />
                                                <button onClick={() => savePosteRepas(cookie)}>Save</button>
                                            </>
                                        ) : (
                                            <>
                                                <span onClick={() => startEditing(cookie)}>
                                                    {cookie.posteRepas || 'Click to edit'}
                                                </span>
                                                {cookie.posteRepas && ' mg/dl'}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        });
    };
    

    return (
        <div className='historique'>
            <Menu />
            <h1 className='titre-historique'>Historique</h1>
            <div id="cookie-list">
                {renderCookies()}
            </div>
        </div>
    );
}

export default Historique;
