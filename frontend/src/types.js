/**
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {'single' | 'multiple'} type
 * @property {string[]} options
 * @property {number | number[]} correctAnswer - Index or array of indices
 * @property {string} [explanation]
 */

/**
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {Difficulty} difficulty
 * @property {Question[]} questions
 * @property {number} timeLimit - in seconds
 * @property {string} [thumbnail]
 */

/**
 * @typedef {Object} QuizAttempt
 * @property {string} id
 * @property {string} quizId
 * @property {string} userId
 * @property {number} score
 * @property {number} totalQuestions
 * @property {number} correctAnswers
 * @property {number} timeSpent
 * @property {string} date
 * @property {Object.<string, number>} answers - questionId -> selectedOptionIndex
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {number} totalScore
 * @property {number} quizzesAttempted
 * @property {number} [rank]
 * @property {number} streak
 */

/**
 * @typedef {Object} Contest
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} prizePool
 * @property {string} deadline
 * @property {Difficulty} difficulty
 * @property {number} participants
 * @property {string[]} rules
 * @property {string} quizId
 */