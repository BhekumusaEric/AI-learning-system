"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Award, ChevronRight } from 'lucide-react';

const EXAM_QUESTIONS = [
  {
    id: 1,
    question: "What does the print() function do in Python?",
    options: ["Stores a value in memory", "Displays output to the screen", "Creates a new variable", "Imports a library"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which of the following correctly creates a list in Python?",
    options: ["fruits = (\"apple\", \"banana\")", "fruits = {\"apple\", \"banana\"}", "fruits = [\"apple\", \"banana\"]", "fruits = \"apple\", \"banana\""],
    correct: 2,
  },
  {
    id: 3,
    question: "What is the correct syntax for a for loop in Python?",
    options: ["for i in range(5):", "for (i = 0; i < 5; i++)", "foreach i in range(5):", "loop i from 0 to 5:"],
    correct: 0,
  },
  {
    id: 4,
    question: "What does NumPy stand for?",
    options: ["New Python", "Numerical Python", "Number Processing", "Numeric Package"],
    correct: 1,
  },
  {
    id: 5,
    question: "Which NumPy function creates an array of zeros?",
    options: ["np.empty()", "np.zeros()", "np.blank()", "np.null()"],
    correct: 1,
  },
  {
    id: 6,
    question: "What is a Pandas DataFrame?",
    options: ["A type of neural network", "A 2D table-like data structure with rows and columns", "A plotting library", "A type of loop"],
    correct: 1,
  },
  {
    id: 7,
    question: "Which method shows the first 5 rows of a DataFrame?",
    options: ["df.top()", "df.first()", "df.head()", "df.show()"],
    correct: 2,
  },
  {
    id: 8,
    question: "What is supervised learning?",
    options: [
      "Learning without any data",
      "Learning from labeled examples with known correct answers",
      "Finding hidden patterns without labels",
      "A type of neural network",
    ],
    correct: 1,
  },
  {
    id: 9,
    question: "What does MSE stand for in model evaluation?",
    options: ["Maximum Squared Error", "Mean Squared Error", "Minimum Standard Error", "Model Score Evaluation"],
    correct: 1,
  },
  {
    id: 10,
    question: "What is the purpose of splitting data into train and test sets?",
    options: [
      "To make the dataset smaller",
      "To test if the model works on unseen data",
      "To speed up training",
      "To remove duplicate rows",
    ],
    correct: 1,
  },
  {
    id: 11,
    question: "K-Nearest Neighbors classifies a point by:",
    options: [
      "Drawing a decision boundary",
      "Looking at the K most similar training examples",
      "Calculating the mean of all points",
      "Building a tree of questions",
    ],
    correct: 1,
  },
  {
    id: 12,
    question: "What is overfitting?",
    options: [
      "When a model is too simple to learn patterns",
      "When a model memorizes training data but fails on new data",
      "When training takes too long",
      "When the dataset is too large",
    ],
    correct: 1,
  },
  {
    id: 13,
    question: "What does K-Means clustering do?",
    options: [
      "Predicts a numeric value",
      "Groups data into K clusters based on similarity",
      "Classifies data using labels",
      "Reduces the number of features",
    ],
    correct: 1,
  },
  {
    id: 14,
    question: "What is PCA used for?",
    options: [
      "Predicting categories",
      "Reducing the number of features while keeping important patterns",
      "Cleaning missing data",
      "Building decision trees",
    ],
    correct: 1,
  },
  {
    id: 15,
    question: "Which library is commonly used for data visualization in Python?",
    options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
    correct: 2,
  },
];

const PASS_THRESHOLD = 0.7; // 70%

export default function DipExamPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    const correct = EXAM_QUESTIONS.filter(q => answers[q.id] === q.correct).length;
    setScore(correct);
    setSubmitted(true);
  };

  const passed = score / EXAM_QUESTIONS.length >= PASS_THRESHOLD;
  const answeredAll = Object.keys(answers).length === EXAM_QUESTIONS.length;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className={`p-6 rounded-2xl mb-6 ${passed ? 'bg-accent/10 border border-accent/30' : 'bg-error/10 border border-error/30'}`}>
          {passed ? <Award className="w-16 h-16 text-accent mx-auto" /> : <XCircle className="w-16 h-16 text-error mx-auto" />}
        </div>
        <h1 className="text-3xl font-bold mb-2">{passed ? 'Congratulations! 🎉' : 'Not Quite Yet'}</h1>
        <p className="text-secondary-text mb-2">
          You scored <span className={`font-bold text-xl ${passed ? 'text-accent' : 'text-error'}`}>{score}/{EXAM_QUESTIONS.length}</span>
          {' '}({Math.round((score / EXAM_QUESTIONS.length) * 100)}%)
        </p>
        <p className="text-secondary-text mb-8 max-w-md">
          {passed
            ? 'You have successfully completed the Digital Inclusion Program — Foundational AI & ML course!'
            : `You need ${Math.ceil(PASS_THRESHOLD * EXAM_QUESTIONS.length)} correct answers to pass. Review the material and try again.`}
        </p>

        {passed ? (
          <button
            onClick={() => router.push('/dip/certificate')}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all text-lg"
          >
            <Award className="w-5 h-5" />
            Get Your Certificate
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }}
            className="px-8 py-4 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all"
          >
            Try Again
          </button>
        )}

        {/* Answer review */}
        <div className="mt-12 w-full max-w-2xl text-left">
          <h2 className="text-lg font-bold mb-4 text-secondary-text uppercase tracking-wider">Review</h2>
          {EXAM_QUESTIONS.map(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={q.id} className={`mb-4 p-4 rounded-xl border ${isCorrect ? 'border-accent/30 bg-accent/5' : 'border-error/30 bg-error/5'}`}>
                <p className="text-sm font-medium mb-2">{q.id}. {q.question}</p>
                <p className="text-sm">
                  {isCorrect
                    ? <span className="text-accent flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct: {q.options[q.correct]}</span>
                    : <span className="text-error flex items-center gap-1"><XCircle className="w-4 h-4" /> Your answer: {q.options[userAnswer] ?? 'Not answered'} — Correct: {q.options[q.correct]}</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Final Exam</h1>
          <p className="text-secondary-text">Digital Inclusion Program — Foundational AI & ML</p>
          <p className="text-sm text-secondary-text mt-1">{EXAM_QUESTIONS.length} questions · Pass mark: {PASS_THRESHOLD * 100}%</p>
        </div>

        {EXAM_QUESTIONS.map(q => (
          <div key={q.id} className="mb-8 p-6 bg-secondary border border-border-subtle rounded-xl">
            <p className="font-semibold mb-4">{q.id}. {q.question}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    answers[q.id] === idx
                      ? 'border-accent bg-accent/10 text-accent font-medium'
                      : 'border-border-subtle hover:border-accent/50 hover:bg-secondary/80 text-secondary-text'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!answeredAll}
          className="w-full py-4 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg mb-8"
        >
          {answeredAll ? 'Submit Exam' : `Answer all questions (${Object.keys(answers).length}/${EXAM_QUESTIONS.length})`}
        </button>
      </div>
    </div>
  );
}
