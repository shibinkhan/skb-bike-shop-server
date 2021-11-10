require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// midlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j92oy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server() {
    try {
        await client.connect();
        console.log('Database is Connected.');

        const database = client.db('Doctors-Portal')
        // const appointmentsCollection = database.collection('appointments');
        // const usersCollection = database.collection('users');

    }
    finally {
        // await client.close();
    };
};
server().catch(console.dir);

app.get('/', (req, res) => {
    res.send('SKB Bike Shop Server is running!');
});

app.listen(port, () => {
    console.log('Listening, port no:', port);
});