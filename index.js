const express = require('express')
const cors = require('cors')

const jwt = require('jsonwebtoken');



const cookieParser = require('cookie-parser');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000 ;


//MIDDLE WARE 

app.use( cors({

  origin: ['http://localhost:5173'],
  credentials:true
}   ))
app.use(express.json())

app.use(cookieParser())




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



//my middleware

const logger = async(req,res,next) => {
  console.log('called', req.host , req.originalUrl  )

  next()
}


const verifyToken = async(req,res,next) => {
  
  const token = req.cookies?.token;

  console.log('middle of toeken in middleware', token)

  if(!token){
    return res.status(401).send({message:'not authorized'})
  }


  jwt.verify(token,process.env.Access_token , (err,decoded)=>{
    if(err){

      console.log(err)
      return res.status(401).send({message: 'unauthorized'})
    }

    console.log('value in the token',decoded)
  req.user = decoded;
    next()
  } )

  
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const servicecollection = client.db('car_arena').collection('services');
   
   
    const orderscollection = client.db('car_arena').collection('orders');

   

  //auth / jwt related api

  app.post('/jwt', logger,   async(req, res) => {
       
    const user = req.body 
    console.log(user)

    const token = jwt.sign(user , process.env.Access_token, {expiresIn: '1h'} )
 
    
    res

    .cookie('token', token , {
      httpOnly:true,
      secure:false,
      sameSite:'none'
    })

    .send({success: true});



}
)
  









    //service related api
    app.get('/services', logger,async(req,res) => {

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
        projection: {  title: 1,  price: 1 ,  service_id: 1 , img:1 },
      };
    



    const result = await servicecollection.findOne(query , options)
     res.send(result);
  

   }  )


   // jesob oder dewa hoise segula onno page e dekano... nij user er jnno

   app.get('/orders',logger, async(req,res) => {
   
  
    //querry , jate kore user tar orders dekte pare... querry maddhme fielter kora hoi orders.

    console.log(req.query.email);

   // console.log('tokennnnnn',req.cookies.token)

   console.log('user in the valid token ', req.user )


   if(req.query.email !== req.user.email){

    return res.status(403).send({message:'forbidden access'})
   }

    let query = {};

    if(req.query?.email){

      query = {email : req.query.email}
    }





    const cursor = orderscollection.find(query)

    const result = await cursor.toArray();

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


app.patch('/orders/:id',async(req,res) => {


  const id = req.params.id
  const filter = { _id: new ObjectId(id)}





 const updatedbooking = req.body;


 const uporder = {
     
  $set: {
      status : updatedbooking.status
     
  },


};

const result = await orderscollection.updateOne(filter,uporder)

 console.log(result)


}





) 



//database theke delete kora . ERPOR CLIENT SIDE E EVENT HANDLE E FETCH KORTE HBE.
app.delete('/orders/:id', async(req,res) => {

  const id = req.params.id

  console.log('delted from database',id)

  const query = { _id: new ObjectId(id)};
  
  const result = await orderscollection.deleteOne(query)
   
  res.send(result);


 }  )







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




  