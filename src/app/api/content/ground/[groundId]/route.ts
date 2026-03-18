import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Mock content data for different grounds
const GROUND_CONTENT = {
  'python-fundamentals': [
    {
      id: 'python-intro',
      title: 'Introduction to Python',
      description: 'Learn the basics of Python syntax and programming concepts.',
      type: 'text',
      difficulty: 'Beginner',
      estimatedTime: 15,
      content: `# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Key Features:
- Easy to learn syntax
- Dynamic typing
- Extensive standard library
- Cross-platform compatibility

## Basic Syntax:

\`\`\`python
# Hello World
print("Hello, World!")

# Variables
name = "Alice"
age = 25

# Basic operations
result = 10 + 5
print(f"Result: {result}")
\`\`\`

This lesson covers the fundamental concepts you'll need to start programming in Python.`,
      progress: null,
    },
    {
      id: 'python-variables',
      title: 'Variables and Data Types',
      description: 'Understanding variables, data types, and basic operations.',
      type: 'code',
      difficulty: 'Beginner',
      estimatedTime: 20,
      content: `# Variables and Data Types

## Practice: Creating Variables

Create variables of different data types and perform operations with them.

\`\`\`python
# String variable
name = "Python Learner"

# Integer variable
year = 2024

# Float variable
pi_approx = 3.14159

# Boolean variable
is_learning = True

# Print all variables
print(f"Name: {name}")
print(f"Year: {year}")
print(f"Pi: {pi_approx}")
print(f"Learning: {is_learning}")
\`\`\``,
      progress: null,
    },
    {
      id: 'python-functions',
      title: 'Functions and Methods',
      description: 'Learn to write reusable code with functions.',
      type: 'code',
      difficulty: 'Beginner',
      estimatedTime: 25,
      content: `# Functions and Methods

## Practice: Writing Functions

Write a function that converts temperature from Celsius to Fahrenheit.

\`\`\`python
def celsius_to_fahrenheit(celsius):
    # Convert Celsius to Fahrenheit
    # Formula: F = C × 9/5 + 32
    return celsius * 9/5 + 32

# Test the function
print(f"0°C = {celsius_to_fahrenheit(0)}°F")  # Should be 32.0
print(f"20°C = {celsius_to_fahrenheit(20)}°F")  # Should be 68.0
print(f"100°C = {celsius_to_fahrenheit(100)}°F")  # Should be 212.0
\`\`\``,
      progress: null,
    },
  ],
  'data-science-ml': [
    {
      id: 'numpy-intro',
      title: 'NumPy Fundamentals',
      description: 'Learn the basics of NumPy for numerical computing.',
      type: 'code',
      difficulty: 'Intermediate',
      estimatedTime: 30,
      content: `# NumPy Fundamentals

NumPy is the fundamental package for scientific computing with Python.

## Key Concepts:
- N-dimensional arrays
- Mathematical functions
- Linear algebra operations
- Random number generation

## Practice: Array Operations

\`\`\`python
import numpy as np

# Create arrays
array_1d = np.array([1, 2, 3, 4, 5])
array_2d = np.array([[1, 2], [3, 4]])

print("1D Array:", array_1d)
print("1D Shape:", array_1d.shape)
print("2D Array:")
print(array_2d)
print("2D Shape:", array_2d.shape)

# Basic operations
print("Sum:", np.sum(array_1d))
print("Mean:", np.mean(array_1d))
print("Max:", np.max(array_1d))
\`\`\``,
      progress: null,
    },
  ],
};

// GET: Fetch content for a specific ground
export async function GET(request: Request, { params }: { params: Promise<{ groundId: string }> }) {
  try {
    const { groundId } = await params;

    if (!groundId) {
      return NextResponse.json(
        { error: 'Ground ID is required' },
        { status: 400 }
      );
    }

    // Get content for the specified ground
    const content = GROUND_CONTENT[groundId as keyof typeof GROUND_CONTENT] || [];

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch ground content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}