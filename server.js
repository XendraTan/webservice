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
    queuelimit: 0,
};

// initialize Express app
const app = express();
// helps app to read JSON
app.use(express.json());

// start the server
app.listen(port, () => {
    console.log('Server running on port',port);
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
