import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/menu/menu.css';


const Menu = () => {
    const [menuOuvert, setMenuOuvert] = useState(false);
    const toggleMenu = () => {
        setMenuOuvert(!menuOuvert);
      };
    return (
        <div>
            <div className='menupage'> 
                <button className='bouton-menu' onClick={toggleMenu}>
                    <div className={menuOuvert ? 'barre1' : 'barre'}></div>
                    <div className={menuOuvert ? 'barre2' : 'barre'}></div>
                    <div className={menuOuvert ? 'barre3' : 'barre'}></div>
                </button>
                <div className={menuOuvert ? "menu menu-ouvert" : "menu"}>
                    <div className='menu-list'>
                        <Link to="/glucide_aide/" className='case1'>Home</Link>
                        <Link to="/glucide_aide/Ratio" className='case2'>Ratio</Link>
                        <Link to="/glucide_aide/Calculette" className='case3'>Calculette</Link>
                        <Link to="/glucide_aide/Historique" className='case4'>Historique</Link>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default Menu;