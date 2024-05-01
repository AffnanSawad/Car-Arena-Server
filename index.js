const express = require('express')
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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


    const servicecollection = client.db('car_arena').collection('services');
   
   
    const orderscollection = client.db('car_arena').collection('orders');


    app.get('/services', async(req,res) => {

        const cursor = servicecollection.find()
   
        const result = await cursor.toArray();
   
        res.send(result);
   
   
       }  )






       //get one data specifically

  app.get('/services/:id', async(req,res) => {

    const id = req.params.id

   // console.log('delted from database',id)

    const query = { _id: new ObjectId (id)};


     
    const options = {
     
        // Include only the `title` and `imdb` fields in the returned document
        projection: {  title: 1,  price: 1 ,  service_id: 1  },
      };
    



    const result = await servicecollection.findOne(query , options)
     res.send(result);
  

   }  )



   //orders => client => server

   app.post('/orders', async(req, res) => {
       
    const user = req.body 
    console.log(user)
    
    //node crud mongo db => usasge exmple => insert a document
    const result = await orderscollection.insertOne(user);
    
    res.send(result);



}
)







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Car-Arena IS RUNNING')
  })
  
  app.listen(port, () => {
    console.log(`Car-Arena IS RUNNING on port ${port}`)
  })




  