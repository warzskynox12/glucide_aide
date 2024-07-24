import React from 'react';
import Menu from '../menu/menu'
import '../../style/calculette/calculette.css';

function Calculette() {
    return (
        <div className='calculette'>
            <Menu />
            <h1 className='titre-calculette'>Calculette</h1>
        </div>
    );
}

export default Calculette;