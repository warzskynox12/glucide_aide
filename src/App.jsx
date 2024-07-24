import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './composant/home/home';
import Ratio from './composant/ratio/ratio';
import Calculette from './composant/calculette/calculette';
import Historique from './composant/historique/historique';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/glucide_aide/" element={<Home />} />
          <Route path="/glucide_aide/Ratio" element={<Ratio />} />
          <Route path="/glucide_aide/Calculette" element={<Calculette />} />
          <Route path="/glucide_aide/Historique" element={<Historique />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;