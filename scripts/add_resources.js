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

const resourceMap = {
  'chapter1_python_programming_fundamentals': [
    { title: "Python Official Documentation", url: "https://docs.python.org/3/" },
    { title: "W3Schools: Python Tutorial", url: "https://www.w3schools.com/python/" }
  ],
  'chapter2_numpy_for_data_handling': [
    { title: "NumPy Quickstart Guide", url: "https://numpy.org/doc/stable/user/quickstart.html" },
    { title: "W3Schools: NumPy Tutorial", url: "https://www.w3schools.com/python/numpy/default.asp" }
  ],
  'chapter3_pandas_data_tables': [
    { title: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
    { title: "Kaggle: Pandas Micro-Course", url: "https://www.kaggle.com/learn/pandas" }
  ],
  'chapter4_matplotlib_drawing_with_data': [
    { title: "Matplotlib Tutorials", url: "https://matplotlib.org/stable/tutorials/index.html" },
    { title: "Python Graph Gallery", url: "https://python-graph-gallery.com/" }
  ],
  'chapter5_supervised_learning': [
    { title: "Scikit-Learn: Supervised Learning", url: "https://scikit-learn.org/stable/supervised_learning.html" },
    { title: "StatQuest: Machine Learning Index", url: "https://www.youtube.com/user/joshstarmer" }
  ],
  'chapter6_unsupervised_learning': [
    { title: "Scikit-Learn: Unsupervised Learning", url: "https://scikit-learn.org/stable/unsupervised_learning.html" },
    { title: "StatQuest: PCA clearly explained", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ" }
  ],
  'part2_neural_networks': [
    { title: "3Blue1Brown: Neural Networks", url: "https://www.3blue1brown.com/topics/neural-networks" },
    { title: "PyTorch Deep Learning Basics", url: "https://pytorch.org/tutorials/beginner/basics/intro.html" }
  ],
  'part3_computer_vision': [
    { title: "Stanford CS231n: Convolutional Neural Networks", url: "https://cs231n.github.io/" },
    { title: "PyTorch Computer Vision Tutorial", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" }
  ],
  'part4_natural_language_processing': [
    { title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course/chapter1/1" },
    { title: "The Illustrated Transformer (Jay Alammar)", url: "https://jalammar.github.io/illustrated-transformer/" }
  ]
};

function getResourcesForFile(filePath) {
  // Return the first match based on the mapping dictionary
  for (const [key, resources] of Object.entries(resourceMap)) {
    if (filePath.includes(key)) {
      return resources;
    }
  }
  return [];
}

walk('./book', function(err, results) {
  if (err) throw err;
  
  const mdFiles = results.filter(f => f.endsWith('.md') && !f.endsWith('README.md'));
  let updatedCount = 0;
  
  mdFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Skip if it already contains the 'resources:' key to prevent duplicates
    if (content.includes('resources:')) {
      return;
    }
    
    const resources = getResourcesForFile(file);
    if (resources.length > 0) {
      let resourceYaml = 'resources:\n';
      resources.forEach(r => {
        resourceYaml += `  - title: "${r.title}"\n    url: "${r.url}"\n`;
      });
      
      // Inject before the end of frontmatter
      if (content.startsWith('---')) {
        const parts = content.split('---');
        if (parts.length >= 3) {
          // parts[0] is empty block, parts[1] is the YAML frontmatter, parts[2...] is Markdown Body
          const originalFrontmatter = parts[1];
          if (!originalFrontmatter.includes('resources:')) {
            const newFrontmatter = originalFrontmatter.replace(/\n$/, '') + '\n' + resourceYaml;
            parts[1] = newFrontmatter;
            fs.writeFileSync(file, parts.join('---'));
            updatedCount++;
          }
        }
      } else {
        // Build a brand new frontmatter wrapper if one doesn't exist
        const newContent = `---\n${resourceYaml}---\n\n${content}`;
        fs.writeFileSync(file, newContent);
        updatedCount++;
      }
    }
  });
  
  console.log(`Successfully updated ${updatedCount} lesson files with targeted external documentation resources.`);
});
