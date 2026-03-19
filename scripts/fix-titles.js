#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const titles = {
  // Chapter 2: NumPy
  'chapter2_numpy_for_data_handling/page1_arrays_vs_lists.md': 'Arrays vs. Lists',
  'chapter2_numpy_for_data_handling/page2_creating_arrays.md': 'Creating Arrays',
  'chapter2_numpy_for_data_handling/page3_array_shapes.md': 'Array Shapes',
  'chapter2_numpy_for_data_handling/page4_shape_practice.md': 'Shape Practice',
  'chapter2_numpy_for_data_handling/page5_array_math.md': 'Array Math',
  'chapter2_numpy_for_data_handling/page6_array_operations.md': 'Array Operations',

  // Chapter 3: Pandas
  'chapter3_pandas_data_tables/page1_dataframes_spreadsheets_in_code.md': 'DataFrames: Spreadsheets in Code',
  'chapter3_pandas_data_tables/page2_creating_dataframes.md': 'Creating DataFrames',
  'chapter3_pandas_data_tables/page3_exploring_your_data.md': 'Exploring Your Data',
  'chapter3_pandas_data_tables/page4_selecting_columns_and_rows.md': 'Selecting Columns and Rows',

  // Chapter 4: Matplotlib
  'chapter4_matplotlib_drawing_with_data/page1_why_visualize.md': 'Why Visualize?',
  'chapter4_matplotlib_drawing_with_data/page2_your_first_plot.md': 'Your First Plot',
  'chapter4_matplotlib_drawing_with_data/page3_scatter_plots.md': 'Scatter Plots',
  'chapter4_matplotlib_drawing_with_data/page4_bar_charts_and_histograms.md': 'Bar Charts and Histograms',

  // Chapter 5: Supervised Learning
  'chapter5_supervised_learning_learning_with_answers/page1_what_is_supervised_learning.md': 'What is Supervised Learning?',
  'chapter5_supervised_learning_learning_with_answers/page2_features_and_labels.md': 'Features and Labels',
  'chapter5_supervised_learning_learning_with_answers/page3_train_test_split.md': 'Train/Test Split',
  'chapter5_supervised_learning_learning_with_answers/page4_linear_regression_drawing_lines.md': 'Linear Regression: Drawing Lines',
  'chapter5_supervised_learning_learning_with_answers/page5_linear_regression_practice.md': 'Linear Regression Practice',
  'chapter5_supervised_learning_learning_with_answers/page6_evaluating_models_how_wrong_are_we.md': 'Evaluating Models: How Wrong Are We?',
  'chapter5_supervised_learning_learning_with_answers/page7_mse_practice.md': 'MSE Practice',
  'chapter5_supervised_learning_learning_with_answers/page8_logistic_regression_yes_no_predictions.md': 'Logistic Regression: Yes/No Predictions',
  'chapter5_supervised_learning_learning_with_answers/page9_logistic_regression_practice.md': 'Logistic Regression Practice',
  'chapter5_supervised_learning_learning_with_answers/page10_accuracy_precision_recall.md': 'Accuracy, Precision, Recall',
  'chapter5_supervised_learning_learning_with_answers/page11_classification_metrics_practice.md': 'Classification Metrics Practice',
  'chapter5_supervised_learning_learning_with_answers/page12_k_nearest_neighbors_bird_by_bird.md': 'K-Nearest Neighbors: Bird by Bird',
  'chapter5_supervised_learning_learning_with_answers/page13_knn_practice.md': 'KNN Practice',
  'chapter5_supervised_learning_learning_with_answers/page14_decision_trees_20_questions.md': 'Decision Trees: 20 Questions',
  'chapter5_supervised_learning_learning_with_answers/page15_decision_tree_practice.md': 'Decision Tree Practice',
  'chapter5_supervised_learning_learning_with_answers/page16_overfitting_when_you_memorize_not_learn.md': 'Overfitting: When You Memorize, Not Learn',
  'chapter5_supervised_learning_learning_with_answers/page17_underfitting_too_simple_to_capture_patterns.md': 'Underfitting: Too Simple to Capture Patterns',
  'chapter5_supervised_learning_learning_with_answers/page18_finding_the_sweet_spot.md': 'Finding the Sweet Spot',

  // Chapter 6: Unsupervised Learning
  'chapter6_unsupervised_learning_finding_patterns_without_answers/page1_learning_without_an_answer_key.md': 'Learning Without an Answer Key',
  'chapter6_unsupervised_learning_finding_patterns_without_answers/page2_k_means_clustering_finding_groups.md': 'K-Means Clustering: Finding Groups',
  'chapter6_unsupervised_learning_finding_patterns_without_answers/page3_k_means_practice.md': 'K-Means Practice',
  'chapter6_unsupervised_learning_finding_patterns_without_answers/page4_choosing_k_how_many_groups.md': 'Choosing K: How Many Groups?',
  'chapter6_unsupervised_learning_finding_patterns_without_answers/page5_pca_simplifying_complex_data.md': 'PCA: Simplifying Complex Data',
  'chapter6_unsupervised_learning_finding_patterns_without_answers/page6_pca_visualization_practice.md': 'PCA Visualization Practice',

  // Chapter 7: Neural Networks
  'chapter7_neural_networks_brain_inspired_computing/page1_whats_a_neural_network.md': "What's a Neural Network?",
  'chapter7_neural_networks_brain_inspired_computing/page2_the_perceptron_one_artificial_neuron.md': 'The Perceptron: One Artificial Neuron',
  'chapter7_neural_networks_brain_inspired_computing/page3_perceptron_practice.md': 'Perceptron Practice',
  'chapter7_neural_networks_brain_inspired_computing/page4_activation_functions_the_decision_maker.md': 'Activation Functions: The Decision Maker',
  'chapter7_neural_networks_brain_inspired_computing/page5_activation_function_practice.md': 'Activation Function Practice',
  'chapter7_neural_networks_brain_inspired_computing/page6_loss_functions_measuring_mistakes.md': 'Loss Functions: Measuring Mistakes',
  'chapter7_neural_networks_brain_inspired_computing/page7_loss_calculation_practice.md': 'Loss Calculation Practice',
  'chapter7_neural_networks_brain_inspired_computing/page8_gradient_descent_downhill_to_success.md': 'Gradient Descent: Downhill to Success',
  'chapter7_neural_networks_brain_inspired_computing/page9_learning_rate_step_size_matters.md': 'Learning Rate: Step Size Matters',
  'chapter7_neural_networks_brain_inspired_computing/page10_backpropagation_learning_from_mistakes.md': 'Backpropagation: Learning from Mistakes',
  'chapter7_neural_networks_brain_inspired_computing/page11_building_your_first_neural_network.md': 'Building Your First Neural Network',
  'chapter7_neural_networks_brain_inspired_computing/page12_multi_layer_perceptrons.md': 'Multi-Layer Perceptrons',
  'chapter7_neural_networks_brain_inspired_computing/page13_mlp_practice.md': 'MLP Practice',
  'chapter7_neural_networks_brain_inspired_computing/page14_dropout_randomly_turn_off_neurons.md': 'Dropout: Randomly Turn Off Neurons',
  'chapter7_neural_networks_brain_inspired_computing/page15_adam_optimizer_smart_gradient_descent.md': 'Adam Optimizer: Smart Gradient Descent',

  // Chapter 8: Computer Vision
  'chapter8_teaching_computers_to_see/page1_images_as_numbers.md': 'Images as Numbers',
  'chapter8_teaching_computers_to_see/page2_image_loading_practice.md': 'Image Loading Practice',
  'chapter8_teaching_computers_to_see/page3_convolutional_layers_pattern_detectors.md': 'Convolutional Layers: Pattern Detectors',
  'chapter8_teaching_computers_to_see/page4_convolution_visualization.md': 'Convolution Visualization',
  'chapter8_teaching_computers_to_see/page5_pooling_shrinking_while_keeping_important_stuff.md': 'Pooling: Shrinking While Keeping Important Stuff',
  'chapter8_teaching_computers_to_see/page6_cnn_building_practice.md': 'CNN Building Practice',
  'chapter8_teaching_computers_to_see/page7_pretrained_models_standing_on_giants_shoulders.md': "Pre-trained Models: Standing on Giants' Shoulders",
  'chapter8_teaching_computers_to_see/page8_transfer_learning_practice.md': 'Transfer Learning Practice',

  // Chapter 9: NLP
  'chapter9_teaching_computers_to_read/page1_text_is_just_data_too.md': 'Text is Just Data Too',
  'chapter9_teaching_computers_to_read/page2_tokenization_splitting_text_into_pieces.md': 'Tokenization: Splitting Text into Pieces',
  'chapter9_teaching_computers_to_read/page3_word_embeddings_meaning_as_numbers.md': 'Word Embeddings: Meaning as Numbers',
  'chapter9_teaching_computers_to_read/page4_exploring_embeddings.md': 'Exploring Embeddings',
  'chapter9_teaching_computers_to_read/page5_bert_understanding_context.md': 'BERT: Understanding Context',
  'chapter9_teaching_computers_to_read/page6_bert_for_classification.md': 'BERT for Classification',
  'chapter9_teaching_computers_to_read/page7_language_models_predicting_next_words.md': 'Language Models: Predicting Next Words',
  'chapter9_teaching_computers_to_read/page8_prompting_practice.md': 'Prompting Practice',
  'chapter9_teaching_computers_to_read/page9_transformers_technology_behind_chatgpt.md': 'Transformers: The Technology Behind ChatGPT',
  'chapter9_teaching_computers_to_read/page10_fine_tuning_llms.md': 'Fine-tuning LLMs',
};

const bookDir = path.join(__dirname, '..', 'book');

let updated = 0;
for (const [relPath, newTitle] of Object.entries(titles)) {
  // Find the file by searching subdirectories
  const found = findFile(bookDir, relPath.split('/').pop());
  if (!found) { console.log(`NOT FOUND: ${relPath}`); continue; }

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
