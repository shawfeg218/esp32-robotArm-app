import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import './CSS/App.css';
import ArmControlContainer from './components/ArmControlContainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/arm-control" element={<ArmControlContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
