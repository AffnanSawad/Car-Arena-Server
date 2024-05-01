const express = require('express')
const cors = require('cors')

const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000 ;


//MIDDLE WARE 

app.use( cors())
app.use(express.json())




//mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.5qhzsjb.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Car-Arena IS RUNNING')
  })
  
  app.listen(port, () => {
    console.log(`Car-Arena IS RUNNING on port ${port}`)
  })