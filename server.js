require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
require('dotenv')

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/test/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});


const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
