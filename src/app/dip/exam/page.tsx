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
    question: "Which of the following correctly stores the number 10 in a variable?",
    options: ["10 = score", "score == 10", "score = 10", "int score = 10"],
    correct: 2,
  },
  {
    id: 3,
    question: "What data type is the value True in Python?",
    options: ["String", "Integer", "Float", "Boolean"],
    correct: 3,
  },
  {
    id: 4,
    question: "Which of the following correctly creates a list of three fruits?",
    options: [
      'fruits = ("apple", "banana", "cherry")',
      'fruits = ["apple", "banana", "cherry"]',
      'fruits = {"apple", "banana", "cherry"}',
      'fruits = "apple", "banana", "cherry"',
    ],
    correct: 1,
  },
  {
    id: 5,
    question: "How do you access the first item in a list called 'colors'?",
    options: ["colors[1]", "colors.first()", "colors[0]", "colors.get(0)"],
    correct: 2,
  },
  {
    id: 6,
    question: "What is the correct syntax for a for loop that runs 5 times?",
    options: [
      "for i in range(5):",
      "for (i = 0; i < 5; i++)",
      "foreach i in range(5):",
      "loop 5 times:",
    ],
    correct: 0,
  },
  {
    id: 7,
    question: "What will this code print?\n\nfor item in [1, 2, 3]:\n    print(item)",
    options: ["1 2 3 on one line", "[1, 2, 3]", "1, 2, 3 each on a new line", "Nothing"],
    correct: 2,
  },
  {
    id: 8,
    question: "What does an if statement do?",
    options: [
      "Repeats code multiple times",
      "Runs code only when a condition is True",
      "Defines a reusable block of code",
      "Stores a value in a variable",
    ],
    correct: 1,
  },
  {
    id: 9,
    question: "What keyword is used when you want to run different code if the condition is False?",
    options: ["elif only", "otherwise", "else", "default"],
    correct: 2,
  },
  {
    id: 10,
    question: "What will this code print?\n\nx = 7\nif x > 5:\n    print('big')\nelse:\n    print('small')",
    options: ["small", "big", "7", "Nothing"],
    correct: 1,
  },
  {
    id: 11,
    question: "What keyword is used to define a function in Python?",
    options: ["function", "define", "func", "def"],
    correct: 3,
  },
  {
    id: 12,
    question: "What is the purpose of the return statement in a function?",
    options: [
      "To print the result to the screen",
      "To stop the program",
      "To send a value back to whoever called the function",
      "To repeat the function",
    ],
    correct: 2,
  },
  {
    id: 13,
    question: "Which of the following correctly defines a function that adds two numbers?",
    options: [
      "function add(a, b): return a + b",
      "def add(a, b): return a + b",
      "def add(a, b) => a + b",
      "define add(a, b): a + b",
    ],
    correct: 1,
  },
  {
    id: 14,
    question: "What will this code output?\n\ndef greet(name):\n    return 'Hello ' + name\n\nprint(greet('Alex'))",
    options: ["greet('Alex')", "Hello name", "Hello Alex", "Nothing"],
    correct: 2,
  },
  {
    id: 15,
    question: "In Python, what does indentation (spaces at the start of a line) mean?",
    options: [
      "It is just for style and has no effect",
      "It marks the end of a block of code",
      "It defines which block of code a line belongs to",
      "It makes the code run faster",
    ],
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
