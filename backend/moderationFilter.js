// moderation.js
const fs = require('fs');
const path = require('path');

const loadInappropriateWords = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'cursedWords.txt'), 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const words = data.split('\n').filter(word => word.trim());
                resolve(words);
            }
        });
    });
};

const containsInappropriateWords = (text, inappropriateWords) => {
    return inappropriateWords.some(word => new RegExp(`\\b${word}\\b`, 'gi').test(text));
};

module.exports = { loadInappropriateWords, containsInappropriateWords };
