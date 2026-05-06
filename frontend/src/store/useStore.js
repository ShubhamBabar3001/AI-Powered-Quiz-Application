// useStore.js — replace the useQuizStore block
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Auth Store (unchanged) ---
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  enrolledContests: [],
  contests: [],

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, enrolledContests: [] }),
  enrollInContest: (contestId) => set((state) => ({
    enrolledContests: [...state.enrolledContests, contestId]
  })),
  updateUserStats: (attempt) => set((state) => {
    if (!state.user) return state;
    return {
      user: {
        ...state.user,
        totalScore: state.user.totalScore + attempt.score,
        quizzesAttempted: state.user.quizzesAttempted + 1,
        streak: state.user.streak + 1,
      }
    };
  }),
}));

export const useTestStore = create(
  persist(
    (set) => ({
      aiTest: false,
      currentQuiz: null,
      currentAttempt: null,
      
      // Persisted quiz session state
      selectedAnswers: {},   // { [questionId]: [option, ...] }
      timeLeft: null,        // seconds remaining (null = not started)

      setCurrentQuiz: (quiz) => set({
        currentQuiz: quiz,
        selectedAnswers: {},
        // Convert minutes → seconds on quiz start
        timeLeft: quiz ? quiz.timeLimit * 60 : null,
      }),

      setAiTest: (test)=>set({aiTest:test}),
      setSelectedAnswers: (answers) => set({ selectedAnswers: answers }),
      setTimeLeft: (time) => set({ timeLeft: time }),

      // Call after submit to wipe session
      clearQuizSession: () => set({
        selectedAnswers: {},
        timeLeft: null,
        currentQuiz: null,
      }),
    }),
    {
      name: 'quiz-session-storage',
      // Only persist these keys (not quiz lists which come from server)
      partialize: (state) => ({
        currentQuiz: state.currentQuiz,
        selectedAnswers: state.selectedAnswers,
        timeLeft: state.timeLeft,
      }),
    }
  )
);
// --- Quiz Store with persistence ---
export const useQuizStore = create((set) => ({
  tech_quizzes: [],
  verbal_quizzes: [],
  history: [],

  setTechQuiz: (quiz) => set({ tech_quizzes: quiz }),
  setVerbalQuiz: (quiz) => set({ verbal_quizzes: quiz }),

  setAllQuizzes: (tech, verbal) =>
    set({
      tech_quizzes: tech,
      verbal_quizzes: verbal,
    }),

  addAttempt: (attempt) =>
    set((state) => ({
      history: [attempt, ...state.history],
    })),
}));