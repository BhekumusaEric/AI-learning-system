const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const specificResourceMap = {
  // Python Fundamentals
  "page1_your_first_python_program": [{ title: "Python print() function", url: "https://docs.python.org/3/library/functions.html#print" }],
  "page2_hello_world_challenge": [{ title: "W3Schools: Python Syntax", url: "https://www.w3schools.com/python/python_syntax.asp" }],
  "page3_storing_things_variables": [{ title: "W3Schools: Python Variables", url: "https://www.w3schools.com/python/python_variables.asp" }],
  "page4_variable_practice": [{ title: "Python Types and Variables", url: "https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator" }],
  "page5_lists_shopping_for_data": [{ title: "Python Data Structures: Lists", url: "https://docs.python.org/3/tutorial/datastructures.html" }],
  "page6_list_challenge": [{ title: "W3Schools: Python Lists", url: "https://www.w3schools.com/python/python_lists.asp" }],
  "page7_for_loops_doing_things_repeatedly": [{ title: "Python Control Flow: for statements", url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" }],
  "page8_loop_practice": [{ title: "W3Schools: Python For Loops", url: "https://www.w3schools.com/python/python_for_loops.asp" }],
  "page9_if_statements_making_decisions": [{ title: "Python Control Flow: if statements", url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements" }],
  "page10_if_else_challenge": [{ title: "W3Schools: Python If...Else", url: "https://www.w3schools.com/python/python_conditions.asp" }],
  "page11_functions_reusable_code_blocks": [{ title: "Defining Functions in Python", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" }],
  "page12_function_writing_practice": [{ title: "W3Schools: Python Functions", url: "https://www.w3schools.com/python/python_functions.asp" }],

  // Numpy
  "page1_arrays_vs_lists": [{ title: "NumPy Quickstart: The Basics", url: "https://numpy.org/doc/stable/user/quickstart.html#the-basics" }],
  "page2_creating_arrays": [{ title: "NumPy: Array Creation", url: "https://numpy.org/doc/stable/user/quickstart.html#array-creation" }],
  "page3_array_shapes": [{ title: "NumPy: ndarray.shape", url: "https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html" }],
  "page4_shape_practice": [{ title: "NumPy: Changing the shape of an array", url: "https://numpy.org/doc/stable/user/quickstart.html#changing-the-shape-of-an-array" }],
  "page5_array_math": [{ title: "NumPy: Basic Operations", url: "https://numpy.org/doc/stable/user/quickstart.html#basic-operations" }],
  "page6_array_operations": [{ title: "NumPy: Universal Functions (ufunc)", url: "https://numpy.org/doc/stable/user/quickstart.html#universal-functions" }],

  // Pandas
  "page1_dataframes_spreadsheets_in_code": [{ title: "Pandas: Intro to Data Structures", url: "https://pandas.pydata.org/docs/user_guide/dsintro.html" }],
  "page2_creating_dataframes": [{ title: "Pandas: DataFrame Object", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html" }],
  "page3_exploring_your_data": [{ title: "Pandas: Essential Basic Functionality", url: "https://pandas.pydata.org/docs/user_guide/basics.html" }],
  "page4_selecting_columns_and_rows": [{ title: "Pandas: Indexing and Selecting Data", url: "https://pandas.pydata.org/docs/user_guide/indexing.html" }],

  // Matplotlib
  "page1_why_visualize": [{ title: "Matplotlib: Usage Guide", url: "https://matplotlib.org/stable/tutorials/introductory/usage.html" }],
  "page2_your_first_plot": [{ title: "Matplotlib: Pyplot tutorial", url: "https://matplotlib.org/stable/tutorials/introductory/pyplot.html" }],
  "page3_scatter_plots": [{ title: "Matplotlib: matplotlib.pyplot.scatter", url: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html" }],
  "page4_bar_charts_and_histograms": [{ title: "Matplotlib: matplotlib.pyplot.bar", url: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.bar.html" }],

  // Supervised Learning
  "page1_what_is_supervised_learning": [{ title: "IBM: What is Supervised Learning?", url: "https://www.ibm.com/topics/supervised-learning" }],
  "page2_features_and_labels": [{ title: "Google ML Crash Course: Framing", url: "https://developers.google.com/machine-learning/crash-course/framing/ml-terminology" }],
  "page3_train_test_split": [{ title: "Scikit-Learn: train_test_split", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html" }],
  "page4_linear_regression_drawing_lines": [{ title: "Scikit-Learn: Linear Regression", url: "https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares" }],
  "page5_linear_regression_practice": [{ title: "StatQuest: Linear Regression", url: "https://www.youtube.com/watch?v=nk2CQITm_eo" }],
  "page6_evaluating_models_how_wrong_are_we": [{ title: "Scikit-Learn: Model Evaluation", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" }],
  "page7_mse_practice": [{ title: "Scikit-Learn: mean_squared_error", url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html" }],
  "page8_logistic_regression_yes_no_predictions": [{ title: "Scikit-Learn: Logistic Regression", url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression" }],
  "page9_logistic_regression_practice": [{ title: "StatQuest: Logistic Regression", url: "https://www.youtube.com/watch?v=yIYKR4sgzI8" }],
  "page10_accuracy_precision_recall": [{ title: "Google ML Crash Course: Classification", url: "https://developers.google.com/machine-learning/crash-course/classification/accuracy" }],
  "page11_classification_metrics_practice": [{ title: "Scikit-Learn: Classification Report", url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html" }],
  "page12_k_nearest_neighbors_bird_by_bird": [{ title: "Scikit-Learn: Nearest Neighbors", url: "https://scikit-learn.org/stable/modules/neighbors.html" }],
  "page13_knn_practice": [{ title: "StatQuest: K-Nearest Neighbors", url: "https://www.youtube.com/watch?v=HVXime0nQeI" }],
  "page14_decision_trees_20_questions": [{ title: "Scikit-Learn: Decision Trees", url: "https://scikit-learn.org/stable/modules/tree.html" }],
  "page15_decision_tree_practice": [{ title: "StatQuest: Decision Trees", url: "https://www.youtube.com/watch?v=7VeUPuVNf6I" }],
  "page16_overfitting_when_you_memorize_not_learn": [{ title: "AWS: What is Overfitting?", url: "https://aws.amazon.com/what-is/overfitting/" }],
  "page17_underfitting_too_simple_to_capture_patterns": [{ title: "IBM: Overfitting vs Underfitting", url: "https://www.ibm.com/topics/overfitting" }],
  "page18_finding_the_sweet_spot": [{ title: "Scikit-Learn: Cross-Validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html" }],

  // Unsupervised Learning
  "page1_learning_without_an_answer_key": [{ title: "IBM: What is Unsupervised Learning?", url: "https://www.ibm.com/topics/unsupervised-learning" }],
  "page2_k_means_clustering_finding_groups": [{ title: "Scikit-Learn: K-Means", url: "https://scikit-learn.org/stable/modules/clustering.html#k-means" }],
  "page3_k_means_practice": [{ title: "StatQuest: K-Means Clustering", url: "https://www.youtube.com/watch?v=4b5d3muPQmA" }],
  "page4_choosing_k_how_many_groups": [{ title: "Wikipedia: Elbow Method (clustering)", url: "https://en.wikipedia.org/wiki/Elbow_method_(clustering)" }],
  "page5_pca_simplifying_complex_data": [{ title: "Scikit-Learn: PCA", url: "https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html" }],
  "page6_pca_visualization_practice": [{ title: "StatQuest: PCA Main Ideas", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ" }],

  // Neural Networks
  "page1_whats_a_neural_network": [{ title: "3Blue1Brown: What is a Neural Network?", url: "https://www.3blue1brown.com/lessons/neural-networks" }],
  "page2_the_perceptron_one_artificial_neuron": [{ title: "Wikipedia: Perceptron", url: "https://en.wikipedia.org/wiki/Perceptron" }],
  "page3_perceptron_practice": [{ title: "Towards Data Science: Perceptron Explained", url: "https://towardsdatascience.com/what-is-a-perceptron-basics-of-neural-networks-c4eaaeca16ce" }],
  "page4_activation_functions_the_decision_maker": [{ title: "ML Glossary: Activation Functions", url: "https://ml-cheatsheet.readthedocs.io/en/latest/activation_functions.html" }],
  "page5_activation_function_practice": [{ title: "PyTorch: Non-linear Activations", url: "https://pytorch.org/docs/stable/nn.html#non-linear-activations-weighted-sum-nonlinearity" }],
  "page6_loss_functions_measuring_mistakes": [{ title: "Google ML Crash Course: Descending into ML", url: "https://developers.google.com/machine-learning/crash-course/descending-into-ml/video-lecture" }],
  "page7_loss_calculation_practice": [{ title: "PyTorch: Loss Functions", url: "https://pytorch.org/docs/stable/nn.html#loss-functions" }],
  "page8_gradient_descent_downhill_to_success": [{ title: "3Blue1Brown: Gradient Descent", url: "https://www.3blue1brown.com/lessons/gradient-descent" }],
  "page9_learning_rate_step_size_matters": [{ title: "Machine Learning Mastery: Learning Rate", url: "https://machinelearningmastery.com/understand-the-dynamics-of-learning-rate-on-deep-learning-neural-networks/" }],
  "page10_backpropagation_learning_from_mistakes": [{ title: "3Blue1Brown: Backpropagation", url: "https://www.3blue1brown.com/lessons/backpropagation-calculus" }],
  "page11_building_your_first_neural_network": [{ title: "PyTorch: Build the Neural Network", url: "https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html" }],
  "page12_multi_layer_perceptrons": [{ title: "PyTorch: nn.Sequential", url: "https://pytorch.org/docs/stable/generated/torch.nn.Sequential.html" }],
  "page13_mlp_practice": [{ title: "PyTorch: Optimizing Model Parameters", url: "https://pytorch.org/tutorials/beginner/basics/optimization_tutorial.html" }],
  "page14_dropout_randomly_turn_off_neurons": [{ title: "PyTorch: nn.Dropout", url: "https://pytorch.org/docs/stable/generated/torch.nn.Dropout.html" }],
  "page15_adam_optimizer_smart_gradient_descent": [{ title: "PyTorch: optim.Adam", url: "https://pytorch.org/docs/stable/generated/torch.optim.Adam.html" }],

  // Computer Vision
  "page1_images_as_numbers": [{ title: "Stanford CS231n: Image Classification", url: "https://cs231n.github.io/classification/" }],
  "page2_image_loading_practice": [{ title: "PyTorch: Torchvision Datasets", url: "https://pytorch.org/vision/stable/datasets.html" }],
  "page3_convolutional_layers_pattern_detectors": [{ title: "Stanford CS231n: Convolutional Networks", url: "https://cs231n.github.io/convolutional-networks/" }],
  "page4_convolution_visualization": [{ title: "Setosa: Image Kernels Visualized", url: "https://setosa.io/ev/image-kernels/" }, { title: "PyTorch: nn.Conv2d", url: "https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html" }],
  "page5_pooling_shrinking_while_keeping_important_stuff": [{ title: "PyTorch: nn.MaxPool2d", url: "https://pytorch.org/docs/stable/generated/torch.nn.MaxPool2d.html" }],
  "page6_cnn_building_practice": [{ title: "PyTorch: Training a Classifier", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html" }],
  "page7_pretrained_models_standing_on_giants_shoulders": [{ title: "PyTorch: Torchvision Models", url: "https://pytorch.org/vision/stable/models.html" }],
  "page8_transfer_learning_practice": [{ title: "PyTorch: Transfer Learning Tutorial", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" }],

  // NLP
  "page1_text_is_just_data_too": [{ title: "Hugging Face: What is NLP?", url: "https://huggingface.co/learn/nlp-course/chapter1/2" }],
  "page2_tokenization_splitting_text_into_pieces": [{ title: "Hugging Face: Tokenizers", url: "https://huggingface.co/learn/nlp-course/chapter2/4" }],
  "page3_word_embeddings_meaning_as_numbers": [{ title: "Jay Alammar: The Illustrated Word2vec", url: "https://jalammar.github.io/illustrated-word2vec/" }],
  "page4_exploring_embeddings": [{ title: "PyTorch: nn.Embedding", url: "https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html" }],
  "page5_bert_understanding_context": [{ title: "Jay Alammar: A Visual Guide to BERT", url: "https://jalammar.github.io/a-visual-guide-to-using-bert-for-the-first-time/" }],
  "page6_bert_for_classification": [{ title: "Hugging Face: Sequence Classification", url: "https://huggingface.co/docs/transformers/tasks/sequence_classification" }],
  "page7_language_models_predicting_next_words": [{ title: "Jay Alammar: The Illustrated GPT-2", url: "https://jalammar.github.io/illustrated-gpt2/" }],
  "page8_prompting_practice": [{ title: "Learn Prompting Framework", url: "https://learnprompting.org/docs/intro" }],
  "page9_transformers_technology_behind_chatgpt": [{ title: "Jay Alammar: The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }],
  "page10_fine_tuning_llms": [{ title: "Hugging Face: Fine-tune a pretrained model", url: "https://huggingface.co/docs/transformers/training" }]
};

walk('./book', function(err, results) {
  if (err) throw err;
  
  const mdFiles = results.filter(f => f.endsWith('.md') && !f.endsWith('README.md'));
  let updatedCount = 0;
  
  mdFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const fileName = path.basename(file, '.md');
    // Default fallback to Scikit-Learn if we missed something, otherwise map it
    const resources = specificResourceMap[fileName] || [{ title: "Towards Data Science Tutorial", url: "https://towardsdatascience.com/" }];
    
    let resourceYaml = 'resources:\n';
    resources.forEach(r => {
      resourceYaml += `  - title: "${r.title}"\n    url: "${r.url}"\n`;
    });
    
    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        // Find existing resources block and remove it to replace it
        let originalFrontmatter = parts[1];
        
        // Remove existing resources logic (using simple string replace for 'resources:' down to the end or next root key)
        // Safer approach: recreate it manually since our frontmatter only has title/type/resources
        const titleMatch = originalFrontmatter.match(/title:\s*".*"/);
        const typeMatch = originalFrontmatter.match(/type:\s*".*"/);
        
        const t = titleMatch ? titleMatch[0] : 'title: "Lesson"';
        const y = typeMatch ? typeMatch[0] : 'type: "read"';
        
        const newFrontmatter = `\n${t}\n${y}\n${resourceYaml}`;
        parts[1] = newFrontmatter;
        fs.writeFileSync(file, parts.join('---'));
        updatedCount++;
      }
    }
  });
  
  console.log(`Successfully precision-updated ${updatedCount} lesson files with highly specific external documentation targets.`);
});
