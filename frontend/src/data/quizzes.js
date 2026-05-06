export const PREDEFINED_QUIZZES = [
  {
    id: 'react-basics',
    title: 'React Fundamentals',
    description: 'Master the basics of React including components, props, and state.',
    category: 'Frontend',
    difficulty: 'easy',
    timeLimit: 300,
    questions: [
      {
        id: 'r1',
        text: 'What is the primary purpose of React?',
        type: 'single',
        options: [
          'To manage databases',
          'To build user interfaces',
          'To handle server-side logic',
          'To style web pages'
        ],
        correctAnswer: 1,
        explanation: 'React is a JavaScript library for building user interfaces.'
      },
      {
        id: 'r2',
        text: 'Which hook is used to manage state in a functional component?',
        type: 'single',
        options: ['useEffect', 'useContext', 'useState', 'useReducer'],
        correctAnswer: 2,
        explanation: 'useState is the primary hook for state management in functional components.'
      }
    ]
  },
  {
    id: 'js-advanced',
    title: 'Advanced JavaScript',
    description: 'Deep dive into closures, prototypes, and async/await.',
    category: 'Programming',
    difficulty: 'hard',
    timeLimit: 600,
    questions: [
      {
        id: 'js1',
        text: 'What is a closure in JavaScript?',
        type: 'single',
        options: [
          'A way to close a browser tab',
          'A function combined with its lexical environment',
          'A method to end a loop',
          'A private variable'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'css-mastery',
    title: 'CSS Mastery',
    description: 'Master Flexbox, Grid, and modern CSS techniques.',
    category: 'Design',
    difficulty: 'medium',
    timeLimit: 450,
    questions: [
      {
        id: 'c1',
        text: 'Which property is used to create a flex container?',
        type: 'single',
        options: ['display: block', 'display: grid', 'display: flex', 'float: left'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'aptitude-math',
    title: 'Quantitative Aptitude',
    description: 'Test your mathematical skills with problems on percentages, ratios, and more.',
    category: 'Arithmetic',
    difficulty: 'medium',
    timeLimit: 600,
    questions: [
      {
        id: 'm1',
        text: 'If a person sells an article for $120 and makes a profit of 20%, what was the cost price?',
        type: 'single',
        options: ['$100', '$96', '$105', '$110'],
        correctAnswer: 0,
        explanation: 'Cost Price = Selling Price / (1 + Profit%) = 120 / 1.2 = 100.'
      }
    ]
  },
  {
    id: 'aptitude-math-2',
    title: 'Ratio and Proportion',
    description: 'Master the concepts of ratios and proportions with these practice problems.',
    category: 'Arithmetic',
    difficulty: 'easy',
    timeLimit: 450,
    questions: [
      {
        id: 'm2',
        text: 'If A:B = 2:3 and B:C = 4:5, then A:B:C is:',
        type: 'single',
        options: ['8:12:15', '2:4:5', '2:3:5', '8:10:15'],
        correctAnswer: 0,
        explanation: 'A:B = 8:12 (multiplying by 4) and B:C = 12:15 (multiplying by 3). So A:B:C = 8:12:15.'
      }
    ]
  },
  {
    id: 'aptitude-reasoning',
    title: 'Logical Reasoning',
    description: 'Challenge your brain with logical puzzles and pattern recognition.',
    category: 'Logical',
    difficulty: 'hard',
    timeLimit: 900,
    questions: [
      {
        id: 'l1',
        text: 'Which number should come next in the series: 2, 4, 8, 16, 32, ...?',
        type: 'single',
        options: ['48', '64', '40', '56'],
        correctAnswer: 1,
        explanation: 'The series follows a pattern of multiplying by 2. 32 * 2 = 64.'
      }
    ]
  },
  {
    id: 'aptitude-verbal',
    title: 'Verbal Ability',
    description: 'Improve your English vocabulary and grammar with these verbal aptitude tests.',
    category: 'Verbal',
    difficulty: 'easy',
    timeLimit: 300,
    questions: [
      {
        id: 'v1',
        text: 'Choose the synonym for "Abundant":',
        type: 'single',
        options: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
        correctAnswer: 1,
        explanation: '"Abundant" means existing or available in large quantities; plentiful.'
      }
    ]
  },
  {
    id: 'aptitude-time-work',
    title: 'Time and Work',
    description: 'Solve complex problems involving work rates and time efficiency.',
    category: 'Arithmetic',
    difficulty: 'medium',
    timeLimit: 600,
    questions: [
      {
        id: 'tw1',
        text: 'A can do a work in 10 days and B in 15 days. If they work together, in how many days will they finish the work?',
        type: 'single',
        options: ['6 days', '8 days', '5 days', '7 days'],
        correctAnswer: 0,
        explanation: '1/10 + 1/15 = 5/30 = 1/6. So, 6 days.'
      }
    ]
  },
  {
    id: 'aptitude-averages',
    title: 'Averages',
    description: 'Practice calculating averages for various data sets and scenarios.',
    category: 'Arithmetic',
    difficulty: 'easy',
    timeLimit: 300,
    questions: [
      {
        id: 'avg1',
        text: 'The average of first five prime numbers is:',
        type: 'single',
        options: ['5.6', '5.4', '5.2', '5.0'],
        correctAnswer: 0,
        explanation: '(2+3+5+7+11)/5 = 28/5 = 5.6.'
      }
    ]
  },
  {
    id: 'aptitude-syllogism',
    title: 'Syllogisms',
    description: 'Test your deductive reasoning with classic syllogism puzzles.',
    category: 'Logical',
    difficulty: 'hard',
    timeLimit: 600,
    questions: [
      {
        id: 'syl1',
        text: 'Statements: All cats are dogs. All dogs are birds. Conclusion: All cats are birds.',
        type: 'single',
        options: ['True', 'False', 'Cannot be determined', 'Partially true'],
        correctAnswer: 0,
        explanation: 'If A is B and B is C, then A is C.'
      }
    ]
  },
  {
    id: 'aptitude-blood-relations',
    title: 'Blood Relations',
    description: 'Untangle complex family trees and relationship puzzles.',
    category: 'Logical',
    difficulty: 'medium',
    timeLimit: 450,
    questions: [
      {
        id: 'br1',
        text: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
        type: 'single',
        options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
        correctAnswer: 1,
        explanation: 'The man\'s father\'s son is the man himself. So, the man in the photo\'s father is the speaker. Thus, it\'s his son.'
      }
    ]
  },
  {
    id: 'aptitude-antonyms',
    title: 'Antonyms',
    description: 'Test your vocabulary by identifying the opposite meanings of words.',
    category: 'Verbal',
    difficulty: 'easy',
    timeLimit: 300,
    questions: [
      {
        id: 'ant1',
        text: 'Choose the antonym for "Fragile":',
        type: 'single',
        options: ['Weak', 'Robust', 'Delicate', 'Brittle'],
        correctAnswer: 1,
        explanation: '"Fragile" means easily broken; "Robust" means strong and healthy.'
      }
    ]
  }
];

export const TECH_QUIZZES = [];
export const VERBAL_QUIZZES = [];