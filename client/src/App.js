import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import './CSS/App.css';
import ArmControlContainer from './components/ArmControlContainer';
import Result from './components/Result';
import { AppContextProvider } from './AppContext';
function App() {
  return (
    <Router>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/arm-control" element={<ArmControlContainer />} />
          <Route path="/quiz/result" element={<Result />} />
        </Routes>
      </AppContextProvider>
    </Router>
  );
}

export default App;
