const express = require("express");
const router = express.Router();
const cards = require("../../data/cards.json");

router.get("/", (req, res) => {
  const {
    colors,
    rarities,
    types,
    chapters,
    missingCard,
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

  res.json({ total, items: newCards });
});

module.exports = router;
