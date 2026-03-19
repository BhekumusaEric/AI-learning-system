#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fixes = [
  // Project 1: Data Analysis Dashboard
  ['page1_project1_project_overview.md', 'Project Overview: Data Analysis Dashboard'],
  ['page2_project1_data_loading_and_cleaning.md', 'Data Loading and Cleaning'],
  ['page3_project1_exploratory_data_analysis.md', 'Exploratory Data Analysis'],
  ['page4_project1_building_visualizations.md', 'Building Visualizations'],
  ['page5_project1_creating_dashboard.md', 'Creating the Dashboard'],

  // Project 2: Predictive Modeling
  ['page1_project2_project_overview.md', 'Project Overview: Predictive Modeling'],
  ['page2_project2_data_loading_exploration.md', 'Data Loading and Exploration'],

  // Project 3: CNN Classification
  ['page1_project3_project_overview.md', 'Project Overview: CNN Classification'],
  ['page2_project3_data_loading_preprocessing.md', 'Data Loading and Preprocessing'],

  // Project 4: Sentiment Analysis
  ['page1_project4_project_overview.md', 'Project Overview: Sentiment Analysis'],
  ['page2_project4_data_loading_preprocessing.md', 'Data Loading and Preprocessing'],

  // Project 5: Clustering Analysis
  ['page1_project5_project_overview.md', 'Project Overview: Clustering Analysis'],
  ['page2_project5_data_loading_preprocessing.md', 'Data Loading and Preprocessing'],

  // Project 6: Neural Network from Scratch
  ['page1_project6_project_overview.md', 'Project Overview: Neural Network from Scratch'],
  ['page2_project6_data_loading_preparation.md', 'Data Loading and Preparation'],

  // Final Exam
  ['page1_exam_overview.md', 'Exam Overview'],
  ['page2_exam_theoretical_foundations.md', 'Theoretical Foundations'],
  ['page3_exam_practical_implementation.md', 'Practical Implementation'],
  ['page4_exam_project_assessment.md', 'Project Assessment'],
  ['page5_exam_advanced_topics.md', 'Advanced Topics'],
];

const bookDir = path.join(__dirname, '..', 'book');

let updated = 0;
for (const [filename, newTitle] of fixes) {
  const found = findFile(bookDir, filename);
  if (!found) { console.log(`NOT FOUND: ${filename}`); continue; }

  let content = fs.readFileSync(found, 'utf8');
  const original = content;
  content = content.replace(/^title:.*$/m, `title: "${newTitle}"`);
  if (content !== original) {
    fs.writeFileSync(found, content);
    console.log(`✓ ${newTitle}`);
    updated++;
  }
}

console.log(`\nUpdated ${updated} files.`);

function findFile(dir, filename) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const result = findFile(full, filename);
      if (result) return result;
    } else if (entry.name === filename) {
      return full;
    }
  }
  return null;
}
