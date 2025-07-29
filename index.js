const express = require('express');
const app = express();
const cors = require('cors');
//const bodyParser = require("body-parser");
require('dotenv').config()

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmagebg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect the client to the server	(optional starting in v4.7)
//await client.connect();
const tasksCollection = client.db("todolist").collection("tasks");
const userCollection = client.db("todolist").collection("users");

//tasks
app.get("/tasks", async (req, res) => {
  const result = await tasksCollection.find().toArray();
  res.send(result);
});

app.post("/tasks", async (req, res) => {
  const task = req.body;
  const result = await tasksCollection.insertOne(task);
  res.send(result);

})

app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await tasksCollection.deleteOne(query);
  res.send(result);
})
app.put('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedtasks = req.body;
  // const updateDoc = {
  //   $set: {
  //     title: updatedtasks.title,
  //     description: updatedtasks.description,
  //     isDone: updatedtasks.isDone
  //   }
  // };

  const result = await tasksCollection.replaceOne(filter, updatedtasks);
})

app.patch('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const task = { _id: new ObjectId(id) };
  const updateIsDone = { $set: { isDone: req.body.isDone } };
  const result = await tasksCollection.updateOne(task, updateIsDone);
  if (result.modifiedCount > 0) {
    res.send(result);
  }
  else {
    res.status(500).send({ message: 'Error in updating user' });
  }
})

// Send a ping to confirm a successful connection
//await client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");

//run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('todoList  is running')
})

app.listen(port, () => {
  console.log(`TodoList is running on port ${port}`);
})
module.exports = app;