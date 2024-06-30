const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../data/decks.json");
const decks = require("../../data/decks.json");

//createDeck
router.post("/", (req, res) => {
  const { deck } = req.body;

  const getMaxId = (items) => {
    return items.reduce((maxId, item) => Math.max(maxId, item.id), 0);
  };

  let id = getMaxId(decks["items"]) + 1;
  const newItem = {
    id,
    color1: deck.color1,
    color2: deck.color2,
    countCards: deck.countCards,
    inventoryCountedDeck: deck.inventoryCountedDeck,
    name: deck.name,
    user: deck.user,
    cards: deck.cards,
  };
  decks["items"].push(newItem);
  fs.writeFile(filePath, JSON.stringify(decks, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return res.status(500).send("Error writing to file");
    }
    res.json({ id });
  });
});

//getDecks
router.get("/", (_, res) => {
  const { items } = decks;
  res.json({ total: items.length, items });
});

//getDeck
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const { items } = decks;
  res.json({ deck: items.find((item) => Number(item.id) === Number(id)) });
});

//updateDeck
router.put("/:id", (req, res) => {
  const deckId = parseInt(req.params.id, 10);
  const updatedDeck = req.body.deck;

  const deckIndex = decks["items"].findIndex((item) => item.id === deckId);

  if (deckIndex === -1) {
    return res.status(404).send("Deck not found");
  }

  decks["items"][deckIndex] = {
    ...decks["items"][deckIndex],
    ...updatedDeck,
  };

  fs.writeFile(filePath, JSON.stringify(decks, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return res.status(500).send("Error writing to file");
    }
    res.send("Deck has been updated");
  });
});

//duplicateDeck
router.post("/duplicate/:id", (req, res) => {
  const deckId = parseInt(req.params.id, 10);
  const { items } = decks;
  const deck = items.find((item) => Number(item.id) === Number(deckId));

  const getMaxId = (items) => {
    return items.reduce((maxId, item) => Math.max(maxId, item.id), 0);
  };

  let id = getMaxId(decks["items"]) + 1;
  const newItem = {
    id,
    color1: deck.color1,
    color2: deck.color2,
    countCards: deck.countCards,
    inventoryCountedDeck: false,
    name: deck.name + " (dupliqué)",
    user: deck.user,
    cards: deck.cards,
  };
  decks["items"].push(newItem);
  fs.writeFile(filePath, JSON.stringify(decks, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return res.status(500).send("Error writing to file");
    }
    res.json({ id });
  });
});

//deleteDeck
router.delete("/:id", (req, res) => {
  const deckId = parseInt(req.params.id, 10);
  const { items } = decks;
  const newItems = items.filter((item) => Number(item.id) !== Number(deckId));
  decks["items"] = newItems;
  fs.writeFile(filePath, JSON.stringify(decks, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return res.status(500).send("Error writing to file");
    }
    res.send("Deck has been deleted");
  });
});

module.exports = router;
