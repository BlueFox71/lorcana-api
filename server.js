const cards = require("./data/cards.json");

const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

app.use(cors());

// Endpoint GET avec queryParams
app.get("/api/cards", (req, res) => {
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
  let newCards = [...cards];
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

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}`);
});
