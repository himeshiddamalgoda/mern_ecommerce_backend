import express from 'express';
import Users from '../models/userModel.js'


const router = express.Router();

router.post('/register', (req, res) => {

    
    Users.find({email: req.body.email} , (err, docs) => {

        if(docs.length>0)
        {
            return res.status(400).json({ message: 'Email already registered!'})
        }
        else {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const newUser = new Users({name, email, password})
        
            newUser.save()
            .then(() => {
                    res.send('User Registration Success')
            }).catch((err) => {
                res.send('User Registration Failed')
                console.log(err)
            })
        }

        if(err) 
        {
            return res.status(400).json({ message: 'Something went Wrong!'})
        }else {

        }
    })


});


router.post('/login', (req,res) => {
   
    
    Users.find({email : req.body.email, password : req.body.password} , (err , docs) => {

        if(docs.length>0)
        {
            const user ={
                 _id : docs[0]._id ,
                name : docs[0].name ,
                email : docs[0].email
            }
           
            res.send(user)
           
        }
        else{
            return res.status(400).json({ message : 'Invalied Credentials'})
        }
    })
})


router.post('/update', (req,res) => {

    const {userid, updateduser} = req.body
  
    Users.findByIdAndUpdate(userid, {
        name : updateduser.name ,
        email : updateduser.email,
        password : updateduser.password
    } , (err) => {

        if(err) {
            return res.status(400).json({ message : 'Something went wrong!'+ err})
        }else {
            res.send('user dtails updated successfully')
        }
    })
})

router.get('/getallusers', (req, res) => {
    
    Users.find({} , (err, docs) => {

        if(err) {
            return res.status(400).json({ message: 'Something went wrong'})
        }else{
            res.send(docs)
        }

    })

})


router.post('/deleteuser', (req, res) => {

    Users.findByIdAndDelete(req.body.userid , (err) => {

        if(err){
            return res.status(400).json({ message: 'Something went wrong'})
        }
        else{
            res.send('User Deleted Successfully')
        }
    })
})

export default router;