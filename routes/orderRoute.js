import express from 'express'
const router = express.Router();
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51JDN3CIgj5ZpCQRphggijPXDxjfK4tXpUj35JNPRlW6SFj2J8a5yCySsSSPsgW3Cq36RHI2DdaV8ZN3x38waBdge00NHVzgF5c');
import { v4 as uuidv4 } from 'uuid';

import Order from '../models/orderModel.js'

router.post('/placeorder', async(req, res) => {

    const {token , cartItems , currentUser , subtotal} = req.body

    // creating customer
    const customer = await stripe.customers.create({
        email : token.email,
        source : token.id
    })

    // creating payment(stripe.charges.create-> accept two parameters 1 payment details & 2 idempotencykey)
    const payment = await stripe.charges.create({
        amount : subtotal*100 ,
        currency : 'inr' ,
        customer : customer.id ,
        receipt_email : token.email
    },{
        idempotencyKey : uuidv4() //generate unique key for every transaction payment
    })

    if(payment){
        const order = new Order({
            userId : currentUser._id,
            name : currentUser.name,
            email : currentUser.email,
            orderItems : cartItems,
            shipppingAddress : {
                address : token.card.address_line1,
                city : token.card.address_city,
                postalCode : token.card.address_zip,
                country : token.card.address_country
            },
            orderAmount : subtotal,
            transactionId : payment.source.id,
            isDelivered : false
        })
        order.save(err => {
            if(err){
                return res.status(400).json({ message: 'Something went wrong'});
            }else{
                res.send('Order Placed Successfully')
            }
        })
    }else{
        return res.status(400).json({ message: 'Payment Failed'})
    }
 
});


router.post('/getordersbyuserid', (req,res) => {

    const userid = req.body.userid
    console.log(userid)
    Order.find({userId :userid} , (err, docs) => {
        
        if(err)
        {
            return res.status(400).json({ message : 'Something went wrong!'})
        }else {
            res.send(docs)
            
        }
    })

})


router.post('/getorderbyid', (req,res) => {

    const orderid = req.body.orderid

    Order.find({_id : orderid} , (err, docs) => {
        
        if(err)
        {
            return res.status(400).json({ message : 'Something went wrong!'})
        }else {
            res.send(docs[0])
        }
    })

})

router.get("/getallorders", (req,res) => {

    Order.find({}, (err,docs) => {

        if(err){
            return res.status(400).json({ message : 'Something went wrong'})
        }else{
            res.send(docs)
        }

    })

})


export default router