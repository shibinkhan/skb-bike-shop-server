require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

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

        const database = client.db('SKB-Bike-Shop')
        const bikesCollection = database.collection('bikes');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');

        // bikes : POST a bike
        app.post('/bikes', async (req, res) => {
            const bike = req.body;
            console.log(bike);
            const bikeAddResult = await bikesCollection.insertOne(bike);
            res.json(bikeAddResult);
        });

        // bikes : GET all
        app.get('/bikes', async (req, res) => {
            const cursor = bikesCollection.find({});
            const bikeAddResult = await cursor.toArray();
            res.send(bikeAddResult);
        });

        // bikes : GET six orders
        app.get('/bikes/six', async (req, res) => {
            const cursor = bikesCollection.find();
            const bikeAddResult = await cursor.limit(6).toArray();
            res.send(bikeAddResult);
        });

        // bikes : GET a bike
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const bike = await bikesCollection.findOne(query);
            res.json(bike);
        });

        // bikes : DELETE a bike
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteResult = await bikesCollection.deleteOne(query);
            res.json(deleteResult);
        });

        // orders : POST an order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const orderResult = await ordersCollection.insertOne(order);
            res.json(orderResult);
        });
        
        // orders : GET all orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orderResult = await cursor.toArray();
            res.send(orderResult);
        });
        
        // orders : DELETE an order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteResult = await ordersCollection.deleteOne(query);
            res.json(deleteResult);
        });

        // orders : PUT/Update Status
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('put', id);
            const query = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: 'Approved' } };
            const updateResult = await ordersCollection.updateOne(query, updateDoc);
            res.json(updateResult);
        });

        // reviews : POST a review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const reviewResult = await reviewsCollection.insertOne(review);
            res.json(reviewResult);
        });

        // reviews : GET all reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviewResult = await cursor.toArray();
            res.send(reviewResult);
        });

        // users : POST a user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const userResult = await usersCollection.insertOne(user);
            res.json(userResult);
        });

        // users : PUT/Update
        app.put('/users', async (req, res) => {
            const user = req.body;
            // console.log('put', user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const userResult = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(userResult);
        });

        // admin : PUT/Update
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const userResult = await usersCollection.updateOne(filter, updateDoc);
            res.json(userResult);
        });

        // admin : GET 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log('put', user);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            };
            res.json({ admin: isAdmin });
        });
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