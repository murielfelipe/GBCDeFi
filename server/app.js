const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

/* GET API rates. */
app.get("/rates", async function (req, res, next) {
  axios
    .get(
      "https://www.quandl.com/api/v3/datasets/FRED/DPRIME.json?api_key=sbVoyriisY6fszmUcehV"
    )
    .then((response) => {
      let stock = {};
      let dataNowDayRates = response.data.dataset.data[0];
      stock.rate = dataNowDayRates[1];
      stock.date = dataNowDayRates[0];
      console.log("Rate", stock.rate);
      console.log("Date", stock.date);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(stock, 1, 4));
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
