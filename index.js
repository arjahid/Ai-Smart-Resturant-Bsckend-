const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 3600;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const orderCollection=client.db('Ai-Smart-Resturant').collection('order');

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
    app.post('/menucart',async(req,res)=>{
      const newCard=req.body;
      newCard.createdAt=new Date();
      const result=await cartCollection.insertOne(newCard);
      res.send(result);
    })
    app.get('/menucart', async (req, res) => {
     const result = await cartCollection.find().toArray();
     res.send(result);
    });
    app.delete('/menucart/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await cartCollection.deleteOne(query);
      res.send(result);
    })
    // ⁡⁢⁣⁣order related api⁡
    app.post('/orders',async(req,res)=>{
      const order=req.body;
      order.status='pending';
      order.createdAt= new Date();
      const result=await orderCollection.insertOne(order);
      res.send(result);
    })
    app.get('/orders', async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });
    app.patch('/orders/:id',async(req,res)=>{
      const {id}=req.params;
      const {status}=req.body;
      const result=await orderCollection.updateOne({_id:new ObjectId(id)},{$set:{status:status}});
      res.send(result);
    })
    // jwt token
    app.post('/jwt',(req,res)=>{
      const user=req.body;
      const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
      res.send({token});
    })
    
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