"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correct: number;
}

const EXAM_QUESTIONS: Question[] = [
  // ── Python Basics ──────────────────────────────────────────────────────────
  { id: 1, question: "What does the print() function do in Python?", options: ["Stores a value in memory", "Displays output to the screen", "Creates a new variable", "Imports a library"], correct: 1 },
  { id: 2, question: "Which of the following correctly stores the number 10 in a variable?", options: ["10 = score", "score == 10", "score = 10", "int score = 10"], correct: 2 },
  { id: 3, question: "What data type is the value True in Python?", options: ["String", "Integer", "Float", "Boolean"], correct: 3 },
  { id: 4, question: "Which symbol is used for comments in Python?", options: ["//", "/*", "#", "--"], correct: 2 },
  { id: 5, question: "What is the correct way to create a string in Python?", options: ["name = Alice", "name = (Alice)", "name = 'Alice'", "string name = 'Alice'"], correct: 2 },
  { id: 6, question: "What does len() return when called on a list?", options: ["The largest item", "The number of items", "The first item", "The sum of all items"], correct: 1 },
  { id: 7, question: "Which operator checks if two values are equal?", options: ["=", "=>", "==", "!="], correct: 2 },
  { id: 8, question: "What will int('42') return?", options: ["'42'", "42.0", "42", "Error"], correct: 2 },
  { id: 9, question: "Which of these is a valid Python variable name?", options: ["2score", "my-score", "my_score", "my score"], correct: 2 },
  { id: 10, question: "What does the % operator do in Python?", options: ["Division", "Exponentiation", "Remainder after division", "Floor division"], correct: 2 },

  // ── Lists ──────────────────────────────────────────────────────────────────
  { id: 11, question: "Which of the following correctly creates a list of three fruits?", options: ['fruits = ("apple","banana","cherry")', 'fruits = ["apple","banana","cherry"]', 'fruits = {"apple","banana","cherry"}', 'fruits = "apple","banana","cherry"'], correct: 1 },
  { id: 12, question: "How do you access the first item in a list called 'colors'?", options: ["colors[1]", "colors.first()", "colors[0]", "colors.get(0)"], correct: 2 },
  { id: 13, question: "Which method adds an item to the end of a list?", options: [".add()", ".insert()", ".append()", ".push()"], correct: 2 },
  { id: 14, question: "What does colors[-1] return?", options: ["An error", "The first item", "The last item", "Nothing"], correct: 2 },
  { id: 15, question: "How do you get items from index 1 to 3 (exclusive) from a list called data?", options: ["data[1,3]", "data[1:3]", "data(1:3)", "data.slice(1,3)"], correct: 1 },

  // ── Loops ──────────────────────────────────────────────────────────────────
  { id: 16, question: "What is the correct syntax for a for loop that runs 5 times?", options: ["for i in range(5):", "for (i=0; i<5; i++)", "foreach i in range(5):", "loop 5 times:"], correct: 0 },
  {
    id: 17, question: "What will this code print?",
    code: "for item in [1, 2, 3]:\n    print(item)",
    options: ["1 2 3 on one line", "[1, 2, 3]", "1, 2, and 3 each on a new line", "Nothing"],
    correct: 2,
  },
  {
    id: 18, question: "What is the output of this code?",
    code: "total = 0\nfor i in range(4):\n    total += i\nprint(total)",
    options: ["10", "6", "4", "0"],
    correct: 1,
  },
  { id: 19, question: "What does range(2, 6) produce?", options: ["2, 3, 4, 5, 6", "2, 3, 4, 5", "1, 2, 3, 4, 5, 6", "2, 4, 6"], correct: 1 },
  { id: 20, question: "Which keyword immediately stops a loop?", options: ["stop", "exit", "break", "return"], correct: 2 },

  // ── If / Else ──────────────────────────────────────────────────────────────
  { id: 21, question: "What does an if statement do?", options: ["Repeats code multiple times", "Runs code only when a condition is True", "Defines a reusable block of code", "Stores a value in a variable"], correct: 1 },
  { id: 22, question: "What keyword runs alternative code when the if condition is False?", options: ["elif only", "otherwise", "else", "default"], correct: 2 },
  {
    id: 23, question: "What will this code print?",
    code: "x = 7\nif x > 5:\n    print('big')\nelse:\n    print('small')",
    options: ["small", "big", "7", "Nothing"],
    correct: 1,
  },
  {
    id: 24, question: "What is the output?",
    code: "score = 55\nif score >= 70:\n    print('Pass')\nelif score >= 50:\n    print('Borderline')\nelse:\n    print('Fail')",
    options: ["Pass", "Fail", "Borderline", "Nothing"],
    correct: 2,
  },
  { id: 25, question: "Which keyword checks an additional condition after an if?", options: ["else", "elif", "then", "when"], correct: 1 },

  // ── Functions ──────────────────────────────────────────────────────────────
  { id: 26, question: "What keyword is used to define a function in Python?", options: ["function", "define", "func", "def"], correct: 3 },
  { id: 27, question: "What does the return statement do?", options: ["Prints the result", "Stops the program", "Sends a value back to the caller", "Repeats the function"], correct: 2 },
  {
    id: 28, question: "What will this code output?",
    code: "def greet(name):\n    return 'Hello ' + name\n\nprint(greet('Alex'))",
    options: ["greet('Alex')", "Hello name", "Hello Alex", "Nothing"],
    correct: 2,
  },
  {
    id: 29, question: "What does this function return when called as double(4)?",
    code: "def double(n):\n    return n * 2",
    options: ["4", "2", "8", "Error"],
    correct: 2,
  },
  { id: 30, question: "What are the inputs to a function called?", options: ["Returns", "Variables", "Parameters", "Arguments and parameters"], correct: 3 },

  // ── Indentation & Syntax ───────────────────────────────────────────────────
  { id: 31, question: "In Python, what does indentation define?", options: ["Style only", "The end of a block", "Which block a line belongs to", "Speed of execution"], correct: 2 },
  { id: 32, question: "What character ends a function definition line?", options: [";", "{", ":", "->"], correct: 2 },
  {
    id: 33, question: "What error will this code produce?",
    code: "def add(a, b):\nreturn a + b",
    options: ["NameError", "TypeError", "IndentationError", "SyntaxError"],
    correct: 2,
  },
  { id: 34, question: "Which of these correctly defines a function that adds two numbers?", options: ["function add(a,b): return a+b", "def add(a,b): return a+b", "def add(a,b) => a+b", "define add(a,b): a+b"], correct: 1 },
  { id: 35, question: "What does Python use instead of curly braces {} to define code blocks?", options: ["Parentheses", "Square brackets", "Indentation", "BEGIN/END keywords"], correct: 2 },

  // ── NumPy ──────────────────────────────────────────────────────────────────
  { id: 36, question: "What is the main advantage of NumPy arrays over Python lists?", options: ["They can store strings", "They are optimised for mathematical operations", "They use less syntax", "They are easier to print"], correct: 1 },
  { id: 37, question: "How do you create a NumPy array from a list [1,2,3]?", options: ["numpy.list([1,2,3])", "np.array([1,2,3])", "np.create([1,2,3])", "array([1,2,3])"], correct: 1 },
  {
    id: 38, question: "What does this code produce?",
    code: "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)",
    options: ["[1,2,3,1,2,3]", "[2,4,6]", "Error", "[1,2,3,2]"],
    correct: 1,
  },
  { id: 39, question: "What does .shape return on a 3×4 NumPy array?", options: ["12", "(4,3)", "(3,4)", "[3,4]"], correct: 2 },
  {
    id: 40, question: "What is the output?",
    code: "import numpy as np\na = np.array([10, 20, 30, 40])\nprint(a[1:3])",
    options: ["[10,20]", "[20,30]", "[20,30,40]", "[10,20,30]"],
    correct: 1,
  },

  // ── Pandas ─────────────────────────────────────────────────────────────────
  { id: 41, question: "What is a Pandas DataFrame?", options: ["A list of numbers", "A table-like data structure with rows and columns", "A type of loop", "A NumPy array"], correct: 1 },
  { id: 42, question: "Which method shows the first 5 rows of a DataFrame?", options: [".first()", ".top()", ".head()", ".show()"], correct: 2 },
  { id: 43, question: "How do you select a column named 'age' from a DataFrame df?", options: ["df.age()", "df->age", "df['age']", "df.select('age')"], correct: 2 },
  { id: 44, question: "What does df.info() show?", options: ["The first 5 rows", "Column names, types, and non-null counts", "Summary statistics", "The last 5 rows"], correct: 1 },
  { id: 45, question: "Which method gives count, mean, min, max for numeric columns?", options: [".info()", ".head()", ".describe()", ".summary()"], correct: 2 },

  // ── Matplotlib ─────────────────────────────────────────────────────────────
  { id: 46, question: "What is Matplotlib used for?", options: ["Database queries", "Creating data visualisations", "Training ML models", "Web scraping"], correct: 1 },
  {
    id: 47, question: "What does this code create?",
    code: "import matplotlib.pyplot as plt\nplt.plot([1,2,3],[4,5,6])\nplt.show()",
    options: ["A bar chart", "A scatter plot", "A line plot", "A histogram"],
    correct: 2,
  },
  { id: 48, question: "Which function creates a scatter plot in Matplotlib?", options: ["plt.line()", "plt.scatter()", "plt.bar()", "plt.dots()"], correct: 1 },
  { id: 49, question: "What does plt.xlabel('Time') do?", options: ["Sets the chart title", "Labels the x-axis", "Labels the y-axis", "Saves the chart"], correct: 1 },
  { id: 50, question: "Which chart is best for showing the distribution of a single variable?", options: ["Line plot", "Scatter plot", "Bar chart", "Histogram"], correct: 3 },

  // ── Machine Learning Concepts ──────────────────────────────────────────────
  { id: 51, question: "What is supervised learning?", options: ["Learning without any data", "Learning from labelled examples with correct answers", "Grouping data without labels", "Reducing data dimensions"], correct: 1 },
  { id: 52, question: "What is the purpose of splitting data into train and test sets?", options: ["To make training faster", "To test on unseen data and check real performance", "To reduce the dataset size", "To remove duplicates"], correct: 1 },
  { id: 53, question: "What does a linear regression model predict?", options: ["A category label", "A continuous numeric value", "A cluster assignment", "A probability only"], correct: 1 },
  { id: 54, question: "What does MSE (Mean Squared Error) measure?", options: ["Model accuracy as a percentage", "Average squared difference between predictions and actual values", "Number of correct predictions", "Speed of the model"], correct: 1 },
  { id: 55, question: "What is overfitting?", options: ["Model is too simple to learn patterns", "Model memorises training data but fails on new data", "Model trains too slowly", "Model has too few parameters"], correct: 1 },
  { id: 56, question: "What does K-Nearest Neighbors (KNN) classify a point as?", options: ["The average of all points", "The class of the majority of its K closest neighbours", "A random class", "The class of the furthest point"], correct: 1 },
  { id: 57, question: "What is the purpose of a decision tree?", options: ["To cluster data", "To ask a series of yes/no questions to reach a prediction", "To reduce dimensions", "To generate images"], correct: 1 },
  { id: 58, question: "What does unsupervised learning do?", options: ["Learns from labelled data", "Finds patterns or groups in data without labels", "Always predicts a number", "Requires a test set"], correct: 1 },
  { id: 59, question: "What does K-Means clustering do?", options: ["Predicts a numeric value", "Classifies using labelled data", "Groups data into K clusters based on similarity", "Reduces features to 2D"], correct: 2 },
  {
    id: 60, question: "What will this sklearn code do?",
    code: "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)",
    options: [
      "Train a model on 20% of the data",
      "Split data so 80% is for training and 20% for testing",
      "Remove 20% of the data permanently",
      "Shuffle the data only",
    ],
    correct: 1,
  },
];

const PASS_THRESHOLD = 0.7;
const TOTAL = EXAM_QUESTIONS.length;

export default function DipExamPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    const correct = EXAM_QUESTIONS.filter(q => answers[q.id] === q.correct).length;
    setScore(correct);
    setSubmitted(true);
    if (correct / TOTAL >= PASS_THRESHOLD) {
      localStorage.setItem('dip_exam_passed', 'true');
      localStorage.setItem('dip_exam_score', String(correct));
      localStorage.setItem('dip_exam_total', String(TOTAL));
    } else {
      localStorage.removeItem('dip_exam_passed');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setSubmitted(false);
    setAnswers({});
    setScore(0);
    localStorage.removeItem('dip_exam_passed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const passed = submitted && score / TOTAL >= PASS_THRESHOLD;
  const answeredAll = Object.keys(answers).length === TOTAL;
  const pct = submitted ? Math.round((score / TOTAL) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full p-8">

        {/* ── Result banner ── */}
        {submitted && (
          <div className={`mb-8 p-6 rounded-2xl border text-center ${passed ? 'bg-accent/10 border-accent/30' : 'bg-error/10 border-error/30'}`}>
            {passed
              ? <Award className="w-12 h-12 text-accent mx-auto mb-3" />
              : <XCircle className="w-12 h-12 text-error mx-auto mb-3" />}
            <h1 className="text-2xl font-bold mb-1">{passed ? 'Congratulations! 🎉' : 'Not Quite Yet'}</h1>
            <p className="text-secondary-text mb-1">
              You scored{' '}
              <span className={`font-bold text-lg ${passed ? 'text-accent' : 'text-error'}`}>
                {score}/{TOTAL}
              </span>{' '}
              ({pct}%)
            </p>
            <p className="text-secondary-text text-sm mb-5">
              {passed
                ? 'You have successfully completed the Python Programming Fundamentals course!'
                : `You need at least ${Math.ceil(PASS_THRESHOLD * TOTAL)} correct answers (${PASS_THRESHOLD * 100}%) to pass. Review the questions below and try again.`}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {passed && (
                <button
                  onClick={() => router.push('/dip/certificate')}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all"
                >
                  <Award className="w-5 h-5" /> Get Your Certificate
                </button>
              )}
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all"
              >
                {passed ? 'Retake Exam' : 'Try Again'}
              </button>
            </div>
          </div>
        )}

        {/* ── Exam header ── */}
        {!submitted && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Final Exam</h1>
            <p className="text-secondary-text">Python Programming Fundamentals</p>
            <p className="text-sm text-secondary-text mt-1">{TOTAL} questions · Pass mark: {PASS_THRESHOLD * 100}%</p>
          </div>
        )}

        {/* ── Questions ── */}
        {EXAM_QUESTIONS.map((q) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct;
          return (
            <div
              key={q.id}
              className={`mb-6 p-6 bg-secondary border rounded-xl transition-colors ${
                submitted
                  ? isCorrect ? 'border-accent/40' : 'border-error/40'
                  : 'border-border-subtle'
              }`}
            >
              {/* Question text */}
              <p className="font-semibold mb-3 leading-relaxed">
                <span className="text-accent mr-2">{q.id}.</span>{q.question}
              </p>

              {/* Code snippet */}
              {q.code && (
                <pre className="mb-4 p-4 bg-[#0d0d0d] border border-[#333] rounded-lg text-sm font-mono text-[#e0e0e0] overflow-x-auto leading-relaxed whitespace-pre">
                  <code>{q.code}</code>
                </pre>
              )}

              {/* Options */}
              <div className="flex flex-col gap-2">
                {q.options.map((option, idx) => {
                  let style = 'border-border-subtle text-secondary-text hover:border-accent/50 hover:bg-accent/5';
                  if (submitted) {
                    if (idx === q.correct) style = 'border-accent bg-accent/10 text-accent font-medium';
                    else if (idx === userAnswer) style = 'border-error bg-error/10 text-error';
                    else style = 'border-border-subtle text-secondary-text/40';
                  } else if (userAnswer === idx) {
                    style = 'border-accent bg-accent/10 text-accent font-medium';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(q.id, idx)}
                      disabled={submitted}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Wrong answer indicator */}
              {submitted && !isCorrect && userAnswer !== undefined && (
                <p className="mt-3 text-xs text-error flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  Incorrect — correct answer highlighted in green
                </p>
              )}
              {submitted && userAnswer === undefined && (
                <p className="mt-3 text-xs text-warning flex items-center gap-1">
                  ⚠ Not answered — correct answer highlighted in green
                </p>
              )}
            </div>
          );
        })}

        {/* ── Submit / retry ── */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!answeredAll}
            className="w-full py-4 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg mb-8"
          >
            {answeredAll
              ? 'Submit Exam'
              : `Answer all questions to submit (${Object.keys(answers).length}/${TOTAL} answered)`}
          </button>
        ) : (
          <div className="flex gap-4 mb-8">
            {passed && (
              <button
                onClick={() => router.push('/dip/certificate')}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all"
              >
                <Award className="w-5 h-5" /> Get Certificate
              </button>
            )}
            <button
              onClick={handleRetry}
              className="flex-1 py-4 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all"
            >
              {passed ? 'Retake Exam' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
