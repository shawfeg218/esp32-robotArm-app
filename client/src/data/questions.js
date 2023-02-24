const questions = {
	Math: [
		{
			id: 1,
			text: 'What is 2 + 2?',
			options: [
				{ id: 1, text: '1' },
				{ id: 2, text: '2' },
				{ id: 3, text: '3' },
				{ id: 4, text: '4' },
			],
			correctOptionId: 4,
		},
		{
			id: 2,
			text: 'What is 3 x 3?',
			options: [
				{ id: 1, text: '6' },
				{ id: 2, text: '7' },
				{ id: 3, text: '8' },
				{ id: 4, text: '9' },
			],
			correctOptionId: 4,
		},
	],
	English: [
		{
			id: 1,
			text: 'What is the opposite of "hot"?',
			options: [
				{ id: 1, text: 'cold' },
				{ id: 2, text: 'warm' },
				{ id: 3, text: 'cool' },
				{ id: 4, text: 'chilly' },
			],
			correctOptionId: 1,
		},
		{
			id: 2,
			text: 'What is the past tense of "go"?',
			options: [
				{ id: 1, text: 'gone' },
				{ id: 2, text: 'went' },
				{ id: 3, text: 'goed' },
				{ id: 4, text: 'goed' },
			],
			correctOptionId: 2,
		},
	],
};

export default questions;
