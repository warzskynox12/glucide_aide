import React from 'react';
import Menu from '../menu/menu'
import '../../style/home/home.css';



function Home() {
    return (
        <div className='home'>
            <Menu />
            <h1 className='titre-home'>Home</h1>    
        </div>
    );
}

export default Home;