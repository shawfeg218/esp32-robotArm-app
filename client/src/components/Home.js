import { useNavigate } from 'react-router-dom';

function Home() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>Welcome to my web app!</h1>
			<button
				onClick={() => {
					navigate('/quiz');
				}}
			>
				Quiz
			</button>
			<button
				onClick={() => {
					navigate('/arm-control');
				}}
			>
				操作手臂
			</button>
		</div>
	);
}

export default Home;
