"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, Award, Download, BookOpen, X } from 'lucide-react';

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



const PASS_THRESHOLD = 0.7;

// ── Certificate Modal ────────────────────────────────────────────────────────
function CertificateModal({ score, total, onClose }: { score: number; total: number; onClose: () => void }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [ready, setReady] = useState(false);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const pct = Math.round((score / total) * 100);

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111] border border-border-subtle rounded-2xl shadow-2xl my-auto">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-secondary-text hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {!ready ? (
          // ── Step 1: Enter details ──────────────────────────────────────────
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent/20 p-2 rounded-lg"><Award className="w-6 h-6 text-accent" /></div>
              <div>
                <h2 className="text-xl font-bold">Generate Your Certificate</h2>
                <p className="text-secondary-text text-sm">Enter your details to personalise it</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Institution / Organisation (optional)</label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="e.g. Greenfield High School"
                  className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
              <button
                onClick={() => setReady(true)}
                disabled={!fullName.trim()}
                className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Generate Certificate
              </button>
            </div>
          </div>
        ) : (
          // ── Step 2: Show certificate + download ───────────────────────────
          <div className="p-6">
            <div className="flex gap-3 mb-4 print:hidden">
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all text-sm">
                <Download className="w-4 h-4" /> Download / Print
              </button>
              <button onClick={() => setReady(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all text-sm">
                Edit Details
              </button>
            </div>

            {/* Certificate */}
            <div ref={certRef} className="bg-white text-black rounded-xl overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>
              <div className="h-3 bg-gradient-to-r from-[#00ff9d] to-[#00b0f0]" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-black p-2.5 rounded-xl"><BookOpen className="w-6 h-6 text-[#00ff9d]" /></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Digital Inclusion Program</p>
                    <p className="text-base font-bold text-black leading-tight">SAAIO Training Grounds</p>
                  </div>
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Certificate of Completion</p>
                <div className="w-20 h-px bg-gray-300 mb-5" />
                <p className="text-sm text-gray-600 mb-2">This certifies that</p>
                <h1 className="text-3xl font-bold text-black mb-1">{fullName}</h1>
                {institution && <p className="text-sm text-gray-500 mb-3">{institution}</p>}
                <div className="w-40 h-px bg-gray-300 mb-5" />
                <p className="text-sm text-gray-600 mb-1">has successfully completed</p>
                <h2 className="text-xl font-bold text-black mb-1">Python Programming Fundamentals</h2>
                <p className="text-gray-500 text-xs mb-1">Digital Inclusion Program · SAAIO Training Grounds</p>
                <p className="text-gray-400 text-xs mb-6">Final Exam Score: {score}/{total} ({pct}%)</p>

                <Award className="w-12 h-12 text-[#00ff9d] mb-6" strokeWidth={1.5} />

                <div className="flex items-center justify-between w-full border-t border-gray-200 pt-5 text-xs">
                  <div className="text-left">
                    <p className="text-gray-400 uppercase tracking-wider text-[10px]">Date Issued</p>
                    <p className="font-semibold text-black">{date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 uppercase tracking-wider text-[10px]">Program</p>
                    <p className="font-semibold text-black">Digital Inclusion Program</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 uppercase tracking-wider text-[10px]">Issued by</p>
                    <p className="font-semibold text-black">SAAIO Training Grounds</p>
                  </div>
                </div>
              </div>
              <div className="h-3 bg-gradient-to-r from-[#00b0f0] to-[#00ff9d]" />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body > *:not(.fixed) { display: none !important; }
          .fixed { position: static !important; background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Main Exam Page ───────────────────────────────────────────────────────────
export default function DipExamPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showCert, setShowCert] = useState(false);

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

  return (
    <>
      {showCert && <CertificateModal score={score} total={EXAM_QUESTIONS.length} onClose={() => setShowCert(false)} />}

      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full p-8">

          {/* ── Result banner (shown after submit) ── */}
          {submitted && (
            <div className={`mb-8 p-6 rounded-2xl border text-center ${passed ? 'bg-accent/10 border-accent/30' : 'bg-error/10 border-error/30'}`}>
              {passed ? <Award className="w-12 h-12 text-accent mx-auto mb-3" /> : <XCircle className="w-12 h-12 text-error mx-auto mb-3" />}
              <h1 className="text-2xl font-bold mb-1">{passed ? 'Congratulations! 🎉' : 'Not Quite Yet'}</h1>
              <p className="text-secondary-text mb-1">
                You scored <span className={`font-bold text-lg ${passed ? 'text-accent' : 'text-error'}`}>{score}/{EXAM_QUESTIONS.length}</span>
                {' '}({Math.round((score / EXAM_QUESTIONS.length) * 100)}%)
              </p>
              <p className="text-secondary-text text-sm mb-4">
                {passed
                  ? 'You have successfully completed the Python Programming Fundamentals course!'
                  : `You need ${Math.ceil(PASS_THRESHOLD * EXAM_QUESTIONS.length)} correct answers to pass. Review and try again.`}
              </p>
              {passed ? (
                <button onClick={() => setShowCert(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all mx-auto">
                  <Award className="w-5 h-5" /> Get Your Certificate
                </button>
              ) : (
                <button onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }}
                  className="px-6 py-3 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all">
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* ── Exam header ── */}
          {!submitted && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Final Exam</h1>
              <p className="text-secondary-text">Python Programming Fundamentals</p>
              <p className="text-sm text-secondary-text mt-1">{EXAM_QUESTIONS.length} questions · Pass mark: {PASS_THRESHOLD * 100}%</p>
            </div>
          )}

          {/* ── Questions ── */}
          {EXAM_QUESTIONS.map(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={q.id} className={`mb-6 p-6 bg-secondary border rounded-xl transition-colors ${
                submitted
                  ? isCorrect ? 'border-accent/40' : 'border-error/40'
                  : 'border-border-subtle'
              }`}>
                <p className="font-semibold mb-4 whitespace-pre-line">{q.id}. {q.question}</p>
                <div className="flex flex-col gap-2">
                  {q.options.map((option, idx) => {
                    let style = 'border-border-subtle text-secondary-text hover:border-accent/50 hover:bg-secondary/80';
                    if (submitted) {
                      if (idx === q.correct) style = 'border-accent bg-accent/10 text-accent font-medium';
                      else if (idx === userAnswer) style = 'border-error bg-error/10 text-error';
                      else style = 'border-border-subtle text-secondary-text/40';
                    } else if (userAnswer === idx) {
                      style = 'border-accent bg-accent/10 text-accent font-medium';
                    }
                    return (
                      <button key={idx} onClick={() => handleSelect(q.id, idx)}
                        disabled={submitted}
                        className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}>
                        {String.fromCharCode(65 + idx)}. {option}
                      </button>
                    );
                  })}
                </div>
                {submitted && !isCorrect && userAnswer !== undefined && (
                  <p className="mt-3 text-xs text-error flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 shrink-0" /> Your answer was incorrect — correct answer highlighted in green
                  </p>
                )}
              </div>
            );
          })}

          {/* ── Submit / retry ── */}
          {!submitted ? (
            <button onClick={handleSubmit} disabled={!answeredAll}
              className="w-full py-4 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg mb-8">
              {answeredAll ? 'Submit Exam' : `Answer all questions (${Object.keys(answers).length}/${EXAM_QUESTIONS.length})`}
            </button>
          ) : (
            <div className="flex gap-4 mb-8">
              {passed && (
                <button onClick={() => setShowCert(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all">
                  <Award className="w-5 h-5" /> Get Certificate
                </button>
              )}
              <button onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }}
                className="flex-1 py-4 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all">
                {passed ? 'Retake Exam' : 'Try Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
