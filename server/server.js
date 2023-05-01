const express = require('express');
const cors = require('cors');
require('dotenv').config();
const controller= require('./ctrl');


const app = express();

app.use(express.json());
app.use(cors());

const { PORT } = process.env
const { getRecipes, newRecipe, deleteRecipe, updateRecipe }= controller;
const { seed }= require('./ctrl')

app.post('/seed', seed)

app.get('/recipes', getRecipes);
app.post('/recipes', newRecipe);
app.put('/recipes/:id', updateRecipe);
app.delete('/recipes/:id', deleteRecipe);

app.listen(PORT, () => console.log(`up and running on port ${PORT}`))