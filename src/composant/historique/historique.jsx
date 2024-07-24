import React from 'react';
import Menu from '../menu/menu'
import '../../style/historique/historique.css';

const Historique = () => {
    return (
        <div className='historique'>
            <Menu />
            <h1 className='titre-historique'>Historique</h1>
        </div>
    );
};

export default Historique;