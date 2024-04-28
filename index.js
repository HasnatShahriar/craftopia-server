const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json());

// craftopia
// 9vHViDW9xrQVEaCw

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihpbk8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db('craftsDB').collection('crafts');

    const userCollection = client.db('craftsDB').collection('users');

    app.get('/crafts',async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })



    app.get('/crafts/:id', async (req, res) => {
      const craftId = req.params.id;
      try {
        const craft = await craftCollection.findOne({ _id: new ObjectId(craftId) });
        if (craft) {
          res.send(craft);
        } else {
          res.status(404).send({ error: 'Craft not found' });
        }
      } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
      }
    });


    app.post('/crafts',async(req,res)=>{
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

    app.get('/myList/:email',async(req,res)=>{
      console.log(req.params.email);
      const result = await craftCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

    // user related api
    app.post('/users',async(req,res)=>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',async(req,res)=>{
  res.send('Craftopia server is running')
})

app.listen(port,()=>{
  console.log(`Craftopia server is running on port: ${port} `);
})