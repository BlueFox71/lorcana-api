const express = require("express");
const router = express.Router();
const cards = require("../../data/cards.json");
const decks = require("../../data/decks.json");

const filterCards = (req) => {
  const {
    colors,
    rarities,
    types,
    chapters,
    missingCard,
    ownedCards,
    search,
    limit,
    offset,
  } = req.query;
  let newCards = [];

  ["1", "2", "3", "4"].forEach((index) => {
    newCards = [...newCards, ...cards[index]];
  });
  if (colors?.length) {
    newCards = newCards.filter((card) => colors.includes(card.color));
  }
  if (rarities?.length) {
    newCards = newCards.filter((card) => rarities.includes(card.rarity));
  }
  if (types?.length) {
    newCards = newCards.filter((card) => types.includes(card.type));
  }
  if (chapters?.length) {
    newCards = newCards.filter((card) => chapters.includes(card.chapter));
  }
  if (missingCard === "true") {
    newCards = newCards.filter(
      (card) => card.quantity === 0 && card.rarity !== "Enchantée"
    );
  }

  if (ownedCards === "true") {
    newCards = newCards.filter((card) => card.quantity > 0);
  }
  if (search) {
    newCards = newCards.filter((card) => {
      const { name } = card;
      return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          search
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        );
    });
  }
  const total = newCards.length;
  if (limit !== undefined && offset !== undefined) {
    newCards = newCards.splice(offset, limit);
  }
  return { items: newCards, total };
};

router.get("/", (req, res) => {
  const { items, total } = filterCards(req);
  res.json({ total, items });
});

router.get("/decks", (req, res) => {
  const { items, total } = filterCards(req);
  const cards = items.filter((item) => item.rarity !== "Enchantée");

  res.json({ total, items: cards });
});

router.get("/remaining-quantities", (req, res) => {
  let newCards = [];

  ["1", "2", "3", "4"].forEach((index) => {
    newCards = [...newCards, ...cards[index]];
  });
  const { colors } = req.query;

  const items = {};
  newCards
    .filter(
      (card) => colors.includes(card.color) && card.rarity !== "Enchantée"
    )
    .forEach((item) => (items[`${item.chapter}_${item.id}`] = item.quantity));

  decks.items.forEach((deck) => {
    if (deck.inventoryCountedInDeck === true) {
      deck.cards.forEach((card) => {
        items[card.id] -= card.quantity;
      });
    }
  });
  res.json({ items: items });
});

module.exports = router;
