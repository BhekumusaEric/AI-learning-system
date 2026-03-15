const fs = require('fs');
const path = require('path');

const part5Dir = path.join(__dirname, '../book/part5_projects_and_assessment');

// 1. Delete empty directories
const dirs = fs.readdirSync(part5Dir, { withFileTypes: true })
  .filter(d => d.isDirectory());

dirs.forEach(d => {
  const chapterPath = path.join(part5Dir, d.name);
  const files = fs.readdirSync(chapterPath);
  if (files.length === 0) {
    fs.rmdirSync(chapterPath);
    console.log(`Deleted empty directory: ${d.name}`);
  }
});

// 2. Rename files to resolve duplicate 'page1_project_overview.md' IDs
const activeDirs = fs.readdirSync(part5Dir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith('chapter'));

activeDirs.forEach(d => {
  const chapterPath = path.join(part5Dir, d.name);
  
  // Extract project/chapter context string, e.g., 'project1' or 'exam'
  let context = d.name.includes('project') ? d.name.match(/(project\d+)/)[0] : 'exam';
  
  const files = fs.readdirSync(chapterPath).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    // If the file is already prefixed, skip renaming
    if (!file.includes(context)) {
      const parts = file.split('_');
      // page1_project_overview.md -> page1_project1_overview.md
      const pageStr = parts.shift(); // 'page1'
      const newName = `${pageStr}_${context}_${parts.join('_')}`;
      
      const oldPath = path.join(chapterPath, file);
      const newPath = path.join(chapterPath, newName);
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} -> ${newName}`);
    }
  });
});

// 3. Re-scan and inject YAML frontmatter
activeDirs.forEach(d => {
  const chapterPath = path.join(part5Dir, d.name);
  const files = fs.readdirSync(chapterPath).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(chapterPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has frontmatter
    if (!content.startsWith('---')) {
      // Create a nice human-readable title
      let title = file
        .replace(/^page\d+_[a-zA-Z0-9]+_/, '') // strip 'page1_project1_'
        .replace(/_/g, ' ')
        .replace('.md', '')
        .replace(/\b\w/g, l => l.toUpperCase());
        
      if (title === 'Overview' || title.includes('Project Overview') || title.includes('Exam Overview')) {
        title = "Project Overview";
      }
      
      const frontmatter = `---\ntitle: "${title}"\ntype: "read"\n---\n\n`;
      fs.writeFileSync(filePath, frontmatter + content);
      console.log(`Injected frontmatter into: ${file}`);
    }
  });
});

console.log('Part 5 Successfully Fixed!');
