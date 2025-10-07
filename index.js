const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 3600;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lsdr1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const menuCollection=client.db('Ai-Smart-Resturant').collection('menu');
    const cartCollection=client.db('Ai-Smart-Resturant').collection('cart');

    // ⁡⁢⁣⁣menu related api⁡
    app.post('/menu',async(req,res)=>{
      const newItem=req.body;
      newItem.createdAt = new Date();
      const result=await menuCollection.insertOne(newItem);
      res.send(result);
    })
    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray();
        res.send(result);
    })
    // ⁡⁢⁣⁣cart related api⁡
    app.post('/menucard',async(req,res)=>{
      const newCard=req.body;
      newCard.createdAt=new Date();
      const result=await cartCollection.insertOne(newCard);
      res.send(result);
    })
    app.get('/menucart', async (req, res) => {
      try {
        // No user filtering for now; return all cart documents
        const result = await cartCollection.find({}).toArray();
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error fetching menucard:', err);
        return res.status(500).json({ error: 'Failed to fetch menucard' });
      }
    });
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('hello your server is ready to use');
})


app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})