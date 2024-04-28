const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihpbk8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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


    app.get('/crafts/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result);
    })



    app.get('/myList/:email',async(req,res)=>{
      console.log(req.params.email);
      const result = await craftCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })


    app.get('/singleProduct/:id',async(req,res)=>{
      const result = await craftCollection.findOne({_id:new ObjectId (req.params.id)})
      res.send(result)
    })


    app.post('/crafts',async(req,res)=>{
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })


    app.put('/updateProduct/:id', async (req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)};
      const options = {upsert : true};
      const updatedProduct = req.body;
      const product = {
        $set:{
          photo: updatedProduct.photo,
          item: updatedProduct.item,
          subCategory: updatedProduct.subCategory,
          description: updatedProduct.description,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          customization: updatedProduct.customization,
          processing: updatedProduct.processing,
          stock: updatedProduct.stock,
          email: updatedProduct.email,
          name: updatedProduct.name,              
        }
      }

      const result = await craftCollection.updateOne(filter,product,options);
      res.send(result);
    })
    

    app.delete('/delete/:id',async(req,res)=>{
      const result = await craftCollection.deleteOne({_id : new ObjectId(req.params.id)})
      console.log(result);
      res.send(result)
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