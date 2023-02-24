import React, { useState } from 'react';
import Question from './Question';

function Quiz() {
	const [selectedSubject, setSelectedSubject] = useState('');

	const handleSelectSubject = (subject) => {
		setSelectedSubject(subject);
	};

	return (
		<div>
			<h2>Quiz</h2>
			<div>
				{selectedSubject ? null : (
					<>
						<button onClick={() => handleSelectSubject('Math')}>Math</button>
						<button onClick={() => handleSelectSubject('English')}>
							English
						</button>
					</>
				)}
			</div>
			{selectedSubject ? <Question subject={selectedSubject} /> : null}
		</div>
	);
}

export default Quiz;
