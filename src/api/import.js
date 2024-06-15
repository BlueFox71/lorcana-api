const express = require("express");
const router = express.Router();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/cards.json');
const data = require("../../data/cards.json");

router.post('/', (req, res) => {
  const {cards, chapter} = req.body;

  data[chapter] = cards
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file', err);
        return res.status(500).send('Error writing to file');
      }
      res.send('File has been updated');
    });
  });

  module.exports = router;