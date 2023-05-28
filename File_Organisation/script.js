const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Array to store files
let files = [];
// Array to store two-level directories
let twoLevelDirectories = [];
// Object to store hierarchical directories
let hierarchicalDirectories = {};

// Create a single-level file
app.post('/create-single-file', (req, res) => {
  const fileName = req.body.fileName;
  const fileSize = req.body.fileSize;

  // Check if the file already exists
  const existingFile = files.find(file => file.name === fileName);
  if (existingFile) {
    return res.status(400).send('File already exists.');
  }

  // Create a file object
  const file = {
    name: fileName,
    size: fileSize
  };

  // Add the file to the array
  files.push(file);

  res.send('File created successfully.');
});

// Delete a single-level file
app.post('/delete-single-file', (req, res) => {
  const fileName = req.body.fileName;

  // Find the file index
  const fileIndex = files.findIndex(file => file.name === fileName);
  if (fileIndex === -1) {
    return res.status(404).send('File not found.');
  }

  // Remove the file from the array
  files.splice(fileIndex, 1);

  res.send('File deleted successfully.');
});

// Search for a single-level file
app.post('/search-single-file', (req, res) => {
  const fileName = req.body.fileName;

  // Find the file
  const file = files.find(file => file.name === fileName);
  if (file) {
    res.send(`File found. Name: ${file.name}, Size: ${file.size}`);
  } else {
    res.status(404).send('File not found.');
  }
});

// List all single-level files
app.get('/list-single-files', (req, res) => {
  if (files.length > 0) {
    let fileList = '';
    files.forEach((file, index) => {
      fileList += `File ${index + 1}: Name: ${file.name}, Size: ${file.size}\n`;
    });
    res.send(fileList);
  } else {
    res.send('No files found.');
  }
});

// Create a two-level file
app.post('/create-two-file', (req, res) => {
  const fileName = req.body.fileName;
  const fileSize = req.body.fileSize;
  const userName = req.body.userName;

  // Check if the file already exists in the user's directory
  const existingFile = twoLevelDirectories.some(directory => directory.user === userName && directory.files.some(file => file.name === fileName));
  if (existingFile) {
    return res.status(400).send('File already exists in the user directory.');
  }

  // Find or create the user directory
  let userDirectory = twoLevelDirectories.find(directory => directory.user === userName);
  if (!userDirectory) {
    userDirectory = {
      user: userName,
      files: []
    };
    twoLevelDirectories.push(userDirectory);
  }

  // Create a file object
  const file = {
    name: fileName,
    size: fileSize
  };

  // Add the file to the user's directory
  userDirectory.files.push(file);

  res.send('File created successfully.');
});

// Delete a two-level file
app.post('/delete-two-file', (req, res) => {
  const fileName = req.body.fileName;
  const userName = req.body.userName;

  // Find the user directory
  const userDirectory = twoLevelDirectories.find(directory => directory.user === userName);
  if (!userDirectory) {
    return res.status(404).send('User directory not found.');
  }

  // Find the file index
  const fileIndex = userDirectory.files.findIndex(file => file.name === fileName);
  if (fileIndex === -1) {
    return res.status(404).send('File not found.');
  }

  // Remove the file from the user's directory
  userDirectory.files.splice(fileIndex, 1);

  res.send('File deleted successfully.');
});

// Search for a two-level file
app.post('/search-two-file', (req, res) => {
  const fileName = req.body.fileName;
  const userName = req.body.userName;

  // Find the user directory
  const userDirectory = twoLevelDirectories.find(directory => directory.user === userName);
  if (!userDirectory) {
    return res.status(404).send('User directory not found.');
  }

  // Find the file
  const file = userDirectory.files.find(file => file.name === fileName);
  if (file) {
    res.send(`File found. Name: ${file.name}, Size: ${file.size}`);
  } else {
    res.status(404).send('File not found.');
  }
});

// List all two-level files in a user directory
app.post('/list-two-files', (req, res) => {
  const userName = req.body.userName;

  // Find the user directory
  const userDirectory = twoLevelDirectories.find(directory => directory.user === userName);
  if (!userDirectory) {
    return res.status(404).send('User directory not found.');
  }

  if (userDirectory.files.length > 0) {
    let fileList = '';
    userDirectory.files.forEach((file, index) => {
      fileList += `File ${index + 1}: Name: ${file.name}, Size: ${file.size}\n`;
    });
    res.send(fileList);
  } else {
    res.send('No files found in the user directory.');
  }
});

// Create a hierarchical file
app.post('/create-hierarchical-file', (req, res) => {
  const fileName = req.body.fileName;
  const fileSize = req.body.fileSize;
  const filePath = req.body.filePath;

  // Split the file path into directories
  const directories = filePath.split('/');

  // Get the parent directory object
  let parentDirectory = hierarchicalDirectories;
  for (let i = 0; i < directories.length - 1; i++) {
    const directory = directories[i];
    if (!parentDirectory[directory]) {
      parentDirectory[directory] = {};
    }
    parentDirectory = parentDirectory[directory];
  }

  // Check if the file already exists in the parent directory
  const existingFile = parentDirectory[directories[directories.length - 1]];
  if (existingFile) {
    return res.status(400).send('File already exists in the directory.');
  }

  // Create a file object
  const file = {
    name: fileName,
    size: fileSize
  };

  // Add the file to the parent directory
  parentDirectory[directories[directories.length - 1]] = file;

  res.send('File created successfully.');
});

// Delete a hierarchical file
app.post('/delete-hierarchical-file', (req, res) => {
  const filePath = req.body.filePath;

  // Split the file path into directories
  const directories = filePath.split('/');

  // Get the parent directory object
  let parentDirectory = hierarchicalDirectories;
  for (let i = 0; i < directories.length - 1; i++) {
    const directory = directories[i];
    if (!parentDirectory[directory]) {
      return res.status(404).send('Directory not found.');
    }
    parentDirectory = parentDirectory[directory];
  }

  // Check if the file exists in the parent directory
  const file = parentDirectory[directories[directories.length - 1]];
  if (!file) {
    return res.status(404).send('File not found.');
  }

  // Remove the file from the parent directory
  delete parentDirectory[directories[directories.length - 1]];

  res.send('File deleted successfully.');
});

// Search for a hierarchical file
app.post('/search-hierarchical-file', (req, res) => {
  const filePath = req.body.filePath;

  // Split the file path into directories
  const directories = filePath.split('/');

  // Get the parent directory object
  let parentDirectory = hierarchicalDirectories;
  for (let i = 0; i < directories.length - 1; i++) {
    const directory = directories[i];
    if (!parentDirectory[directory]) {
      return res.status(404).send('Directory not found.');
    }
    parentDirectory = parentDirectory[directory];
  }

  // Check if the file exists in the parent directory
  const file = parentDirectory[directories[directories.length - 1]];
  if (file) {
    res.send(`File found. Name: ${file.name}, Size: ${file.size}`);
  } else {
    res.status(404).send('File not found.');
  }
});

// List all hierarchical files in a directory
app.post('/list-hierarchical-files', (req, res) => {
  const directoryPath = req.body.directoryPath;

  // Split the directory path into directories
  const directories = directoryPath.split('/');

  // Get the parent directory object
  let parentDirectory = hierarchicalDirectories;
  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i];
    if (!parentDirectory[directory]) {
      return res.status(404).send('Directory not found.');
    }
    parentDirectory = parentDirectory[directory];
  }

  const files = Object.entries(parentDirectory);
  if (files.length > 0) {
    let fileList = '';
    files.forEach(([fileName, file]) => {
      if (typeof file === 'object') {
        fileList += `Directory: ${fileName}\n`;
      } else {
        fileList += `File: Name: ${fileName}, Size: ${file}\n`;
      }
    });
    res.send(fileList);
  } else {
    res.send('No files found in the directory.');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
