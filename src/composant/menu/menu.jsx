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
                        <Link to="/" className='case1'>Home</Link>
                        <Link to="/Ratio" className='case2'>Ratio</Link>
                        <Link to="/Calculette" className='case3'>Calculette</Link>
                        <Link to="/Historique" className='case4'>Historique</Link>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default Menu;