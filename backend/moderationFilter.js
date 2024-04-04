// wordFilter.js
const fs = require('fs');
const path = require('path');

// Function to load inappropriate words from a file
const loadInappropriateWords = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'cursedWords.txt'), 'utf-8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const words = data.split('\n').filter(word => word.trim());
            resolve(words);
        });
    });
};

// Function to check for inappropriate words in a given text
const containsInappropriateWords = (text, inappropriateWords) => {
    return inappropriateWords.some(word => new RegExp(`\\b${word}\\b`, 'gi').test(text));
};

module.exports = { loadInappropriateWords, containsInappropriateWords };
