const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const cardsApi = require('./api/cards')
const importApi = require('./api/import')
const decksApi = require('./api/decks')

app.use('/cards', cardsApi)
app.use('/import', importApi)
app.use('/decks', decksApi)

app.get("/", (req, res) => {
  res.send("Bienvenue dans Lorcana-API");
});


app.listen(port, () => {});
