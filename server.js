import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import bodyParser from 'body-parser';

import productRoute from './routes/productRoutes.js'
import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'


// app config
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(bodyParser.json());

// db config
const mongoDBURL = 'mongodb+srv://himesh:himesh123@amazon.xmc8h.mongodb.net/mern-ecommerce?retryWrites=true&w=majority'

mongoose.connect(mongoDBURL, 
    {
        useCreateIndex: true,
        useUnifiedTopology:true,
        useNewUrlParser:true
});

let dbConnect = mongoose.connection

dbConnect.once('error' , () => {
    console.log(`MongoDB Connection failed`);
})

dbConnect.once("open" , () => {
    console.log("Mongo DB Connection Successfull");
})


// API routing

app.use('/api/products', productRoute)

app.use('/api/users', userRoute)

app.use('/api/orders', orderRoute)




// listen
app.listen(port, () => console.log(`Node JS server started`))