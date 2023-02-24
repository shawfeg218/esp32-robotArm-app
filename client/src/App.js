import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import ArmControl from './components/ArmControl';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/quiz" element={<Quiz />} />
				<Route path="/arm-control" element={<ArmControl />} />
			</Routes>
		</Router>
	);
}

export default App;
