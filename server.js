// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

// database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit:100,
};

// initialize Express app
const app = express();
// helps app to read JSON
app.use(express.json());

// start the server
app.listen(port, () => {
    console.log('Server running on port',port);
});

//Example Route: Get all cards
app.get('/allcards', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cards');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allcards' });
    }
});

app.post('/addcard', async (req, res) => {
    const{ card_name, card_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cards (card_name, card_pic) VALUES (?,?)', [card_name, card_pic]);
        res.status(201).json({message: 'Card '+card_name+' added successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add card '+card_name});
    }
});

app.delete('/deletecard/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM cards WHERE id=' + id);
        res.status(201).json({message: 'Card ' + id + ' deleted successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not delete card '+id});
    }
});

app.put('/updatecard/:id', async (req, res) => {
    const { id } = req.params;
    const { card_name, card_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE cards SET card_name=?, card_pic=? WHERE id=?', [card_name, card_pic, id]);
        res.status(201).json({message: 'Card '+card_name+' updated successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not update card '+id});
    }
});

// route: get all movies
app.get('/allmovies', async (req,res)=> {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM movies');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error for allmovies'});
    }
});

// route: add a new movie
app.post('/addmovie', async (req,res)=> {
    const { movie_title, poster_url } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO movies (movie_title, poster_url) VALUES (?, ?)',
            [movie_title, poster_url]
        );
        res.status(201).json({message: 'Movie ' + movie_title + ' added successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error - could not add movie ' + movie_title});
    }
});

// route: update a movie
app.put('/updatemovie/:id', async (req,res)=> {
    const { movie_title, poster_url } = req.body;
    const { id } = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE movies SET movie_title = ?, poster_url = ? WHERE id = ?',
            [movie_title, poster_url, id]
        );
        res.json({message:'Movie updated successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error - could not update movie'});
    }
});

// route: delete a movie
app.delete('/deletemovie/:id', async (req,res)=> {
    const { id } = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM movies WHERE id = ?',
            [id]
        );
        res.json({message:'Movie deleted successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error - could not delete movie'});
    }
});
