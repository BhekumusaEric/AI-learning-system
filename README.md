# SAAIO Training Grounds

## 🔗 Platform Links

| Platform | URL |
|---|---|
| 🎓 Student Login (IDC SEF / DIP) | https://ai-learning-system-ten.vercel.app/dip/login |
| 🛡️ Admin Dashboard | https://ai-learning-system-ten.vercel.app/admin |

---

## Product Requirement Document (PRD)

### Executive Summary

Product Name: SAAIO Training Grounds
Target Audience: High school students (ages 14-18) preparing for the International Olympiad in Artificial Intelligence
Core Concept: A digital textbook-style platform where each chapter follows a consistent "Read → Practice" pattern. Students learn concepts through simplified explanations, then immediately apply them in an integrated development environment (IDE) with hidden unit tests that provide instant, helpful feedback.
Aesthetic: Dark mode by default (black background, white text) with a clean, monospaced font for that authentic coding feel. The interface should feel like opening a well-organized technical textbook that comes alive with code.
Section 1: Visual Design & User Experience (The "Look and Feel")
1.1 Color Palette (Dark Theme)

    Primary Background: #000000 (Pure black)

    Secondary Background (Cards, Code Blocks): #1a1a1a (Dark gray)

    Primary Text: #ffffff (Pure white)

    Secondary Text: #b0b0b0 (Light gray for less important text)

    Accent Color (Buttons, Links, Highlights): #00ff9d (Neon green - easy on eyes in dark mode)

    Error Color: #ff5f5f (Soft red)

    Success Color: #00ff9d (Same as accent)

    Warning Color: #ffb86b (Warm orange)

    Border Color: #333333 (Subtle dividers)

1.2 Typography

    Primary Font (Body Text): JetBrains Mono or Fira Code - Monospaced fonts that feel like you're reading code, even for explanations. Size: 16px for comfortable reading.

    Headings: Same monospaced family, but bold weights (700) to create hierarchy.

    Code Editor Font: JetBrains Mono with ligatures enabled (size: 14px in the editor)

    Line Height: 1.6 for body text, 1.2 for headings

1.3 Layout Structure (The "Book" Metaphor)

The platform is organized like a textbook:
text

SAAIO TRAINING GROUNDS
├── Part 1: Foundational Skills & Classical ML
│   ├── Chapter 1: Python Programming Fundamentals
│   │   ├── Page 1: Variables and Data Types (Read)
│   │   ├── Page 2: Your First Code Challenge (Practice)
│   │   ├── Page 3: Loops (Read)
│   │   ├── Page 4: Loop Practice (Practice)
│   │   └── ...
│   ├── Chapter 2: NumPy for Data Handling
│   └── ...
├── Part 2: Neural Networks & Deep Learning
├── Part 3: Computer Vision
└── Part 4: Natural Language Processing & Audio

1.4 Page Layout (Two-Panel Design)

Every page in the platform follows this exact structure:
text

┌─────────────────────────────────────────────────────────────┐
│  Part 1 > Chapter 2 > Page 4: Loop Practice               [≡] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │                    │  │                    │            │
│  │   THE THEORY       │  │   THE PRACTICE     │            │
│  │   (Left Panel)     │  │   (Right Panel)    │            │
│  │                    │  │                    │            │
│  │  • Simplified      │  │  ┌─────────────┐   │            │
│  │    explanation     │  │  │ CODE EDITOR │   │            │
│  │                    │  │  │             │   │            │
│  │  • Key concepts     │  │  │ def solve():│   │            │
│  │    in bullet points │  │  │     # Write │   │            │
│  │                    │  │  │     your code│  │            │
│  │  • "Remember" boxes │  │  └─────────────┘   │            │
│  │                    │  │                      │            │
│  │  • Visual diagrams  │  │  ┌─────────────┐   │            │
│  │    when helpful     │  │  │  FEEDBACK   │   │            │
│  │                    │  │  │  PANEL      │   │            │
│  │                    │  │  │ • Hidden    │   │            │
│  │                    │  │  │   tests run │   │            │
│  │                    │  │  │ • Clear     │   │            │
│  │                    │  │  │   pass/fail │   │            │
│  │                    │  │  │ • Helpful   │   │            │
│  │                    │  │  │   hints     │   │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                               │
│  [Previous Page]                                [Next Page]  │
└─────────────────────────────────────────────────────────────┘

Section 2: The Practice Panel - Built-in IDE with Hidden Tests
2.1 Code Editor Component Specifications

The right panel contains a fully functional code editor with these features:

Editor Features:

    Monaco Editor (same engine as VS Code) embedded directly in the browser

    Python syntax highlighting

    Autocomplete for: numpy, pandas, matplotlib, sklearn, torch

    Line numbers

    Bracket matching

    Automatic indentation

    "Run Code" button (green, prominent)

    "Reset Code" button (gray, subtle)

    Keyboard shortcut: Ctrl+Enter to run code

Default State:
Each practice page opens with a code stub pre-written. Example:
python

# Chapter 2: NumPy Arrays
# Task: Create a 3x3 numpy array with values from 1 to 9

import numpy as np

def create_array():
    # YOUR CODE HERE
    # Replace the line below with your solution
    result = None
    
    return result

# The hidden tests will call your function automatically
# Don't modify the code below this line

2.2 Hidden Unit Tests System

This is the core learning mechanism. Every practice problem has hidden tests that run when the user clicks "Run Code."

Test Runner Architecture:
text

┌─────────────────────────────────────────────────────────────┐
│  FEEDBACK PANEL                                              │
├─────────────────────────────────────────────────────────────┤
│  ● Running tests...                                           │
│                                                               │
│  ✓ Test 1: Correct array shape (3, 3)                        │
│  ✓ Test 2: Correct values [1,2,3,4,5,6,7,8,9]                │
│  ✗ Test 3: Array uses int64 dtype (got float64)              │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  HINT: NumPy arrays can specify dtype. Try:         │    │
│  │  np.array(..., dtype=np.int64)                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  [Try Again]                                    [Solution?]  │
└─────────────────────────────────────────────────────────────┘

Test Result Categories & Visual Feedback:

    PASS (✓) - Green checkmark, test passed

    FAIL (✗) - Red X, test failed

    ERROR (⚠️) - Yellow warning, code crashed

Feedback Messages must be:

    Clear: "Test 2 failed: Expected sum of array to be 45, got 30"

    Encouraging: Never say "Wrong." Say "Not quite yet. Let's try again!"

    Actionable: Provide hints that guide without giving away the answer

    Progressive: After 3 failed attempts, show a more specific hint

2.3 Example Practice Problem with Hidden Tests

Left Panel (Theory):
text

# For Loops in Python

A for loop lets you repeat code for each item in a list:

    for item in my_list:
        print(item)

Key points:
• The loop runs once for each item
• 'item' takes the value of each element
• Indentation matters!

Remember: Loops help us avoid writing repetitive code.

Right Panel (Practice):
python

# Task: Write a function that sums all numbers in a list
# Example: [1, 2, 3, 4] → 10

def sum_list(numbers):
    # Initialize a variable to store the total
    total = 0
    
    # Write a for loop here to add each number to total
    
    
    return total

# =================================================
# HIDDEN TESTS (Student doesn't see this)
# =================================================
"""
Test 1: sum_list([1, 2, 3, 4]) == 10
Test 2: sum_list([5]) == 5
Test 3: sum_list([]) == 0
Test 4: sum_list([-1, 0, 1]) == 0
Test 5: sum_list([100, 200, 300]) == 600
"""

Feedback after running:
text

✓ Test 1 passed: [1,2,3,4] → 10
✓ Test 2 passed: [5] → 5
✓ Test 3 passed: [] → 0
✗ Test 4 failed: [-1,0,1] → Expected 0, got 2
✓ Test 5 passed: [100,200,300] → 600

Hint: Check how your loop handles negative numbers.
Make sure you're adding each number, not just counting them.

Section 3: Complete Syllabus Breakdown (Simplified for Teenagers)

Below is the entire SAAIO 2026 syllabus rewritten as simplified "Chapters" and "Pages" with age-appropriate explanations.
PART 1: FOUNDATIONAL SKILLS & CLASSICAL MACHINE LEARNING

Duration: ~40 pages
Chapter 1: Python Programming Fundamentals (Practice Focus)
Page	Title	Type	Concept Simplified
1.1	"Your First Python Program"	Read	Python is a language computers understand. The print() function shows output.
1.2	"Hello, World!" Challenge	Practice	Write code that prints "Hello, SAAIO!"
1.3	"Storing Things: Variables"	Read	Variables are labeled boxes that hold data. name = "Alex" stores text.
1.4	"Variable Practice"	Practice	Create variables of different types (numbers, text, true/false)
1.5	"Lists: Shopping for Data"	Read	Lists store multiple items in order: fruits = ["apple", "banana", "cherry"]
1.6	"List Challenge"	Practice	Create a list, access items by index, modify items
1.7	"For Loops: Doing Things Repeatedly"	Read	Loops let you process each item in a list without writing repetitive code
1.8	"Loop Practice"	Practice	Write a loop that prints each item in a list
1.9	"If Statements: Making Decisions"	Read	if lets code make choices based on conditions
1.10	"If/Else Challenge"	Practice	Write code that classifies numbers as positive, negative, or zero
1.11	"Functions: Reusable Code Blocks"	Read	Functions package code for reuse. def greet(name):
1.12	"Function Writing Practice"	Practice	Write a function that converts temperature from Celsius to Fahrenheit
Chapter 2: NumPy - Math Superpowers (Practice Focus)
Page	Title	Type	Concept Simplified
2.1	"Arrays vs. Lists"	Read	NumPy arrays are like lists but optimized for math. They're faster and have superpowers.
2.2	"Creating Arrays"	Practice	Create arrays from lists using np.array()
2.3	"Array Shapes"	Read	Arrays have shapes. A 3×4 array has 3 rows and 4 columns.
2.4	"Shape Practice"	Practice	Create arrays with different shapes and check their .shape
2.5	"Array Math"	Read	With NumPy, you can add, multiply, and do math on entire arrays at once!
2.6	"Array Operations"	Practice	Multiply two arrays element-wise, calculate sums and means
2.7	"Indexing and Slicing"	Read	Grab specific parts of arrays like slicing a pizza
2.8	"Slicing Challenge"	Practice	Extract specific rows, columns, and subarrays
Chapter 3: Pandas - Data Tables (Practice Focus)
Page	Title	Type	Concept Simplified
3.1	"DataFrames: Spreadsheets in Code"	Read	Pandas DataFrames are like Excel tables in Python
3.2	"Creating DataFrames"	Practice	Create a DataFrame from dictionaries or CSV files
3.3	"Exploring Your Data"	Practice	Use .head(), .info(), .describe() to understand datasets
3.4	"Selecting Columns and Rows"	Practice	Grab specific columns or filter rows based on conditions
Chapter 4: Matplotlib - Drawing with Data (Practice Focus)
Page	Title	Type	Concept Simplified
4.1	"Why Visualize?"	Read	A picture is worth a thousand numbers. Graphs reveal patterns.
4.2	"Your First Plot"	Practice	Create a simple line plot of x vs y
4.3	"Scatter Plots"	Practice	Plot points to see relationships between variables
4.4	"Bar Charts and Histograms"	Practice	Visualize distributions and comparisons
Chapter 5: Supervised Learning - Learning with Answers (Both Theory & Practice)
Page	Title	Type	Concept Simplified
5.1	"What is Supervised Learning?"	Read	Like studying with an answer key. You learn from examples that have correct answers.
5.2	"Features and Labels"	Read	Features are inputs (house size), labels are outputs (house price)
5.3	"Train/Test Split"	Both	Practice on some data, test on new data to ensure you really learned
5.4	"Linear Regression: Drawing Lines"	Read	Find the straight line that best fits your data points
5.5	"Linear Regression Practice"	Practice	Use sklearn to predict house prices from size
5.6	"Evaluating Models: How Wrong Are We?"	Both	Mean Squared Error (MSE) measures average mistake size
5.7	"MSE Practice"	Practice	Calculate MSE for your predictions
5.8	"Logistic Regression: Yes/No Predictions"	Read	Predict categories: Will this email be spam? (Yes/No)
5.9	"Logistic Regression Practice"	Practice	Classify emails as spam or not spam
5.10	"Accuracy, Precision, Recall"	Both	Not all mistakes are equal. Precision: "Were we right when we said spam?"
5.11	"Classification Metrics Practice"	Practice	Calculate accuracy, precision, and recall for a classifier
5.12	"K-Nearest Neighbors: Bird by Bird"	Read	Find the K most similar examples and copy their answer
5.13	"KNN Practice"	Practice	Classify iris flowers using KNN
5.14	"Decision Trees: 20 Questions"	Read	Ask a series of yes/no questions to reach a conclusion
5.15	"Decision Tree Practice"	Practice	Build a tree to classify animals
5.16	"Overfitting: When You Memorize, Not Learn"	Theory	Memorizing the practice test doesn't help on the real exam
5.17	"Underfitting: Too Simple to Capture Patterns"	Theory	A yes/no question can't capture complex situations
5.18	"Finding the Sweet Spot"	Practice	Tune model complexity to avoid over/underfitting
Chapter 6: Unsupervised Learning - Finding Patterns Without Answers (Both Theory & Practice)
Page	Title	Type	Concept Simplified
6.1	"Learning Without an Answer Key"	Read	Sometimes data has no labels. Find natural groups instead.
6.2	"K-Means Clustering: Finding Groups"	Read	K-Means finds K groups in your data based on similarity
6.3	"K-Means Practice"	Practice	Cluster customer data into groups
6.4	"Choosing K: How Many Groups?"	Practice	Try different K values and see what makes sense
6.5	"PCA: Simplifying Complex Data"	Read	Turn 100 features into 2 while keeping the important patterns
6.6	"PCA Visualization Practice"	Practice	Reduce high-dimensional data to 2D for plotting
PART 2: NEURAL NETWORKS & DEEP LEARNING

Duration: ~30 pages
Chapter 7: Neural Networks - Brain-Inspired Computing (Both Theory & Practice)
Page	Title	Type	Concept Simplified
7.1	"What's a Neural Network?"	Read	A network of simple calculators that learn patterns, inspired by brain cells
7.2	"The Perceptron: One Artificial Neuron"	Read	Takes inputs, multiplies by weights, adds bias, decides whether to "fire"
7.3	"Perceptron Practice"	Practice	Build a single neuron that learns AND/OR logic gates
7.4	"Activation Functions: The Decision Maker"	Read	ReLU, Sigmoid, Tanh - different ways to decide "yes" or "no"
7.5	"Activation Function Practice"	Practice	Apply different activations and see how outputs change
7.6	"Loss Functions: Measuring Mistakes"	Read	Loss tells the network how wrong it is. MSE for numbers, Cross-Entropy for categories.
7.7	"Loss Calculation Practice"	Practice	Calculate loss for sample predictions
7.8	"Gradient Descent: Downhill to Success"	Read	Like rolling a ball downhill to find the lowest point (minimum error)
7.9	"Learning Rate: Step Size Matters"	Practice	Try different learning rates - too big overshoots, too small takes forever
7.10	"Backpropagation: Learning from Mistakes"	Read	Error flows backward through the network, telling each neuron how to adjust
7.11	"Building Your First Neural Network"	Practice	Use PyTorch to create a network that classifies handwritten digits
7.12	"Multi-Layer Perceptrons"	Both	Stack layers to learn more complex patterns
7.13	"MLP Practice"	Practice	Add hidden layers to improve your digit classifier
7.14	"Dropout: Randomly Turn Off Neurons"	Practice	Prevents overfitting by making the network robust
7.15	"Adam Optimizer: Smart Gradient Descent"	Practice	Adam adapts learning rates automatically - the smart choice
PART 3: COMPUTER VISION

Duration: ~20 pages
Chapter 8: Teaching Computers to See (Both Theory & Practice)
Page	Title	Type	Concept Simplified
8.1	"Images as Numbers"	Read	Images are just grids of numbers (pixels). Color = number.
8.2	"Image Loading Practice"	Practice	Load and display images using matplotlib
8.3	"Convolutional Layers: Pattern Detectors"	Read	Small filters scan the image looking for edges, corners, textures
8.4	"Convolution Visualization"	Practice	Apply edge detection filters to an image
8.5	"Pooling: Shrinking While Keeping Important Stuff"	Read	Max pooling keeps the strongest signal, reduces image size
8.6	"CNN Building Practice"	Practice	Build a simple CNN for digit classification
8.7	"Pre-trained Models: Standing on Giants' Shoulders"	Read	Use models already trained on millions of images (ResNet, etc.)
8.8	"Transfer Learning Practice"	Practice	Take a pre-trained ResNet and fine-tune it for your specific task
PART 4: NATURAL LANGUAGE PROCESSING

Duration: ~20 pages
Chapter 9: Teaching Computers to Read (Both Theory & Practice)
Page	Title	Type	Concept Simplified
9.1	"Text is Just Data Too"	Read	Computers need numbers. Turn words into numbers.
9.2	"Tokenization: Splitting Text into Pieces"	Practice	Break sentences into words or subwords
9.3	"Word Embeddings: Meaning as Numbers"	Read	Represent words as vectors where similar words are close together
9.4	"Exploring Embeddings"	Practice	Find words similar to "king" and see "queen" nearby
9.5	"BERT: Understanding Context"	Read	BERT reads both left and right to understand word meaning in context
9.6	"BERT for Classification"	Practice	Use a pre-trained BERT to classify movie reviews as positive/negative
9.7	"Language Models: Predicting Next Words"	Both	Models that complete your sentences (like phone keyboard predictions)
9.8	"Prompting Practice"	Practice	Give instructions to a language model and see responses
9.9	"Transformers: The Technology Behind ChatGPT"	Theory	Attention mechanism focuses on important parts of text
9.10	"Fine-tuning LLMs"	Practice	Adapt a pre-trained model for your specific task
Section 4: Technical Implementation Specifications
4.1 Database Schema
sql

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    current_chapter_id INTEGER,
    current_page_id INTEGER,
    total_xp INTEGER DEFAULT 0
);

-- Chapters table (mirrors the book structure)
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY,
    part_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL
);

-- Pages table (each page is either "read" or "practice")
CREATE TABLE pages (
    id INTEGER PRIMARY KEY,
    chapter_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    page_type TEXT CHECK(page_type IN ('read', 'practice')),
    theory_content TEXT,  -- Markdown content for left panel
    initial_code TEXT,    -- Code stub for practice pages
    order_index INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 10
);

-- Hidden tests for practice pages
CREATE TABLE hidden_tests (
    id INTEGER PRIMARY KEY,
    page_id INTEGER NOT NULL,
    test_input TEXT,      -- JSON-serialized input
    expected_output TEXT, -- JSON-serialized expected output
    hint_message TEXT,    -- Hint shown on failure
    order_index INTEGER
);

-- User progress tracking
CREATE TABLE user_progress (
    user_id UUID REFERENCES users(id),
    page_id INTEGER REFERENCES pages(id),
    completed_at TIMESTAMP DEFAULT NOW(),
    attempts INTEGER DEFAULT 0,
    solved BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, page_id)
);

-- User code submissions (for analytics)
CREATE TABLE code_submissions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    page_id INTEGER REFERENCES pages(id),
    code TEXT NOT NULL,
    test_results JSONB,   -- Store which tests passed/failed
    submitted_at TIMESTAMP DEFAULT NOW()
);

4.2 API Endpoints
python

# GET /api/chapters
# Returns the entire book structure with progress for current user
{
  "parts": [
    {
      "id": 1,
      "title": "Foundational Skills & Classical ML",
      "chapters": [
        {
          "id": 1,
          "title": "Python Programming Fundamentals",
          "pages": [
            {
              "id": 1,
              "title": "Your First Python Program",
              "type": "read",
              "completed": true,
              "order": 1
            },
            {
              "id": 2,
              "title": "Hello, World! Challenge",
              "type": "practice",
              "completed": false,
              "order": 2
            }
          ]
        }
      ]
    }
  ]
}

# GET /api/pages/{page_id}
# Returns complete page content
{
  "id": 42,
  "title": "K-Means Clustering Practice",
  "type": "practice",
  "theory_content": "## Finding Groups in Data...",
  "initial_code": "def cluster_data(data):\n    # Your code here\n    pass",
  "chapter_id": 6,
  "order": 3,
  "xp_reward": 25
}

# POST /api/submit/{page_id}
# Submit code for testing
{
  "code": "def cluster_data(data):\n    from sklearn.cluster import KMeans\n    kmeans = KMeans(n_clusters=3)\n    return kmeans.fit_predict(data)"
}

# Response
{
  "success": true,
  "tests_passed": 3,
  "tests_total": 5,
  "results": [
    {
      "test_id": 1,
      "passed": true,
      "expected": null,
      "actual": null
    },
    {
      "test_id": 2,
      "passed": false,
      "expected": "[0 0 1 1 2 2]",
      "actual": "[0 0 1 1 1 1]",
      "hint": "Check cluster assignments for the last two points"
    }
  ],
  "xp_earned": 15,
  "completed": false
}

# POST /api/progress/{page_id}/complete
# Mark a read page as complete
{
  "success": true,
  "xp_earned": 10,
  "next_page_id": 43
}

4.3 Test Runner Implementation (Pseudocode)
python

def run_hidden_tests(user_code, page_id):
    """
    Execute user code against hidden tests
    """
    # Create safe execution environment
    safe_globals = {
        'np': __import__('numpy'),
        'pd': __import__('pandas'),
        'plt': __import__('matplotlib.pyplot'),
        'sklearn': __import__('sklearn'),
        'torch': __import__('torch')
    }
    
    # Prepare results array
    results = []
    
    # Fetch hidden tests from database
    tests = db.query(HiddenTest).filter(page_id=page_id).all()
    
    for test in tests:
        try:
            # Execute user code with test input
            exec_globals = safe_globals.copy()
            exec(user_code, exec_globals)
            
            # Call the student's function (assumes they defined a specific function)
            user_function = exec_globals.get('solve')  # or appropriate function name
            
            if not user_function:
                results.append({
                    'test_id': test.id,
                    'passed': False,
                    'error': 'Function not found',
                    'hint': 'Make sure your function is named correctly'
                })
                continue
            
            # Parse test input (could be JSON)
            input_data = json.loads(test.test_input)
            expected = json.loads(test.expected_output)
            
            # Run their code
            start_time = time.time()
            result = user_function(input_data)
            execution_time = time.time() - start_time
            
            # Compare results (with tolerance for floats)
            if compare_results(result, expected):
                results.append({
                    'test_id': test.id,
                    'passed': True
                })
            else:
                results.append({
                    'test_id': test.id,
                    'passed': False,
                    'expected': expected,
                    'actual': result,
                    'hint': test.hint_message
                })
                
        except Exception as e:
            results.append({
                'test_id': test.id,
                'passed': False,
                'error': str(e),
                'hint': 'Your code crashed! Check for syntax errors.'
            })
    
    # Calculate overall success
    passed = sum(1 for r in results if r['passed'])
    total = len(results)
    
    return {
        'passed': passed,
        'total': total,
        'results': results,
        'all_passed': passed == total
    }

4.4 Frontend Components to Build

    BookNavigator Component

        Renders the table of contents (left sidebar)

        Shows progress per chapter (percentage complete)

        Highlights current page

        Collapsible chapters

    TwoPanelLayout Component

        Manages left/right panel sizing (adjustable divider)

        Handles responsive design (stack on mobile)

        Preserves panel state between pages

    TheoryPanel Component

        Renders markdown with code syntax highlighting

        Supports LaTeX for math formulas ($E = mc^2$)

        Includes interactive diagrams (D3.js visualizations)

    CodeEditor Component

        Monaco editor integration

        Theme matches platform (black background)

        Syntax highlighting for Python

        Autocomplete for ML libraries

    FeedbackPanel Component

        Displays test results with color coding

        Shows hints progressively

        Animation for test completion

        "Next Page" button when all tests pass

    ProgressBar Component

        Shows XP and level

        Daily streak counter

        Next badge preview

Section 5: Development Phases
Phase 1: MVP (Month 1-2)

    User authentication (register/login)

    Database setup with schema

    Chapter 1 (Python Basics) fully implemented

    Basic two-panel layout

    Code editor with run functionality

    Simple test runner (2-3 tests per problem)

    Dark theme implementation

Phase 2: Core Curriculum (Month 3-4)

    Chapters 2-4 (NumPy, Pandas, Matplotlib)

    Chapter 5 (Supervised Learning) partially

    Enhanced test runner with better hints

    Progress tracking system

    XP and basic gamification

Phase 3: Advanced Topics (Month 5-6)

    Complete Chapters 5-9

    Visualization components (The Observatory)

    Pre-trained model integration

    Daily quests system

    Badges and achievements

Phase 4: Polish & Scale (Month 7-8)

    Performance optimization

    Mobile responsive design

    Teacher/admin dashboard

    Analytics tracking

    Community features (optional)

Section 6: Success Criteria

The platform is successful when:

    Students complete chapters - Average completion rate > 70%

    Students enjoy learning - Feedback surveys show > 4/5 satisfaction

    Students learn effectively - Pre/post assessment shows knowledge gain

    Students return regularly - 50% weekly active users

    Students can solve SAAIO problems - Practice problems align with competition difficulty

This document provides everything needed for an AI agent or development team to build the SAAIO Training Grounds platform. The key differentiators are:

    Book-like structure with consistent Read → Practice pattern

    Dark theme with monospaced font for authentic coding feel

    Hidden unit tests that provide progressive, helpful feedback

    Simplified explanations tailored for teenagers

    Complete syllabus coverage of SAAIO 2026

The platform should feel like opening a well-designed textbook that comes alive with interactive code examples and instant feedback.
