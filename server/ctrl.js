require('dotenv').config();
const { CONNECTION_STRING }= process.env
const Sequelize= require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: 'false'
        }
    }
});

module.exports = {
    seed: (req, res) =>{
        sequelize.query(`
        DROP table if exists recipes;

        CREATE TABLE recipes (
            dish_id SERIAL PRIMARY KEY,
            dish VARCHAR(50) NOT NULL,
            ingredients VARCHAR(500) NOT NULL,
            instructions VARCHAR(350) NOT NULL,
            notes VARCHAR(100)
        );

        INSERT INTO recipes(dish, ingredients, instructions, notes)
        VALUES ('Birria Tacos', 'Short Ribs, Chuck Roast, White Onion, Carrots, Garlic, Bay Leaves, Guajillo Peppers, Chicken Bouillon, Salt, Cumin, Oregano, Chili Powder, Quesadilla Cheese, Corn Tortillas', 'https://houseofyumm.com/beef-birria-and-birria-tacos/', NULL),
        ('Jambalaya', 'Chicken Thighs, Shrimp, Andouille Sausage, Onion, Bell Pepper, Celery, Garlic, Crushed Tomatoes, Rice, Green Onion, Parsley, Bay Leaves, Thyme, Chicken Broth, Creole Seasoning, Salt, Pepper, Oil, Hot Sauce, Worcestershire Sauce', 'https://www.africanbites.com/easy-jambalaya/#Recipe-Ingredients', NULL),
        ('Lamb Chops', 'Lamb Chops, Kosher Salt, Black Pepper, Minced Garlic, Parsley, Rosemary, Thyme, Extra-Virgin Olive Oil', 'https://www.jessicagavin.com/rosemary-and-thyme-lamb-chops/', NULL),
        ('Red Velvet Cake', 'Cake Flour, Bakeing Soda, Unsweetened Natural Cocoa Powder, Salt, Unsalted Butter, Granulated Sugar, Vegetable Oil, Eggs, Pure Vanilla Extract, Distilled White Vinegar, Red Food Coloring, Buttermilk, Block Cream Cheese, Confectioners Sugar', 'https://sallysbakingaddiction.com/red-velvet-layer-cake-with-cream-cheese-frosting/', 'Canola can substitute vegetable oil and either liquid or gell food coloring will work.'),
        ('Peach Cobbler', 'Peaches, Water, White Sugar, Brown Sugar, Ground Cinnamon, Ground Nutmeg, Fresh Lemon Juice, Salt, Cornstarch, All-Purpose Flour, Baking Soda, Unsalted Butter', 'https://www.allrecipes.com/recipe/51535/fresh-southern-peach-cobbler/', NULL)
        `).then(()=>{
            console.log('DB seeded')
            res.sendStatus(200)
           .catch((err)=> console.log('error seeding DB', err)) 
        })
    },
    getRecipes: (req, res) =>{
        sequelize.query(`
        SELECT * FROM recipes
        ORDER BY dish_id
        `)
        .then((dbRes)=>{
            res.status(200).send(dbRes[0])
        })
        .catch((err)=> console.log(err))
    },
    newRecipe: (req, res) =>{
        const { dish, ingredients, instructions, notes } = req.body
        if(notes === ''){
            if(dish === '' || ingredients =='' || instructions === ''){
    
                res.status(200).send("Please complete the required field(s)")
            }else{
                sequelize.query(`
                INSERT INTO recipes (dish, ingredients, instructions, notes)
                VALUES ('${dish}', '${ingredients}', '${instructions}', null)`)
                .then((dbRes)=>{
                    res.status(200).send(dbRes[0])
                })
                .catch((err)=> console.log(err))
            }
        }else{
            if(dish === '' || ingredients == '' || instructions === ''){
    
                res.status(200).send("Please complete the required field(s)")
            }else{
                sequelize.query(`
                INSERT INTO recipes (dish, ingredients, instructions, notes)
                VALUES ('${dish}', '${ingredients}', '${instructions}', '${notes}')`)
                .then((dbRes)=>{
                    res.status(200).send(dbRes[0])
                })
                .catch((err)=> console.log(err))
            }
        }
    },
    updateRecipe: (req, res)=>{
        const { id }= req.params
        const { dish, ingredients, instructions, notes }= req.body
        sequelize.query(`
        UPDATE recipes
        SET dish= '${dish}', ingredients= '${ingredients}', instructions= '${instructions}', notes= '${notes}'
        WHERE dish_id= '${id}'
        `)
        .then((dbRes)=>{
            res.status(200).send(dbRes[0])
        })
        .catch((err)=> console.log(err))
    },
    deleteRecipe: (req, res)=>{
       const { id }=req.params
        sequelize.query(`
        DELETE
        FROM recipes
        WHERE dish_id= '${id}'
        `)
        .then((dbRes)=>{
            res.status(200).send(dbRes[0])
        })
        .catch((err)=> console.log(err))
    }
}