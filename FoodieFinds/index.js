const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
app.use(cors());
const port = 3010;

let db;

(async () => {
  db = await open({
    filename: './FoodieFinds/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let results = await db.all(query, []);
  return results;
}

async function getRestaurantById(restaurant_id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let results = await db.all(query, [restaurant_id]);
  return results;
}

async function getRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let results = await db.all(query, [cuisine]);
  return results;
}

async function getRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?  ';
  let results = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return results;
}

async function getRestaurantByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let results = await db.all(query, []);
  return results;
}

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let results = await db.all(query, []);
  return results;
}

async function getDishById(restaurant_id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let results = await db.all(query, [restaurant_id]);
  return results;
}

async function getDishByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let results = await db.all(query, [isVeg]);
  return results;
}

async function getDishByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let results = await db.all(query, []);
  return results;
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await getAllRestaurants();

    if (results.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json({ restaurants: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let restaurant_id = req.params.id;
    let results = await getRestaurantById(restaurant_id);
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No restaurant found' });
    }
    res.status(200).json({ restaurant: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await getRestaurantByCuisine(cuisine);
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No restaurant found' });
    }
    res.status(200).json({ restaurants: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let results = await getRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No restaurant found' });
    }
    res.status(200).json({ restaurants: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await getRestaurantByRating();
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No restaurant found' });
    }
    res.status(200).json({ restaurants: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json({ dishes: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let restaurant_id = req.params.id;
    let results = await getDishById(restaurant_id);
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json({ dish: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let results = await getDishByFilter(isVeg);
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No dish found' });
    }
    res.status(200).json({ dishes: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await getDishByPrice();
    console.log(results);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No dish found' });
    }
    res.status(200).json({ dishes: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
