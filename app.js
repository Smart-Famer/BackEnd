const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { restart } = require('nodemon');
app.use(express.json())
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken')
const JWT_SECRET="flkdjfljsdfljdlfaldjgljgflkjdfojgnvljoaijwernfvkjzosjfawerljfojcaef2334556576876891425"


const mongoUrl = "mongodb+srv://yasith-heshan:Mongo1234@cluster0.kafcanq.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl,{
    useNewUrlParser:true
}).then(()=>{console.log("connected to database");})
.catch((e)=>console.log(e))

app.listen(5000,()=>{
    console.log('Server Started')
});

require("./userDetails");

const User = mongoose.model("UserInfo")

app.post("/register",async(req,res)=>{
    const {fname,lname,email,password}=req.body
    try{
        const oldUser = await User.findOne({ email });

        const encryptedPassword = await bcrypt.hash(password,10);
        if(oldUser){
            return res.send({error:"User Exists"});
        }
        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        });
        res.send({status:"ok"})
    }catch(error){
        res.send({status:"error"})
    }
});

app.post("/login-user",async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.json({error:"User Not Found"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({},JWT_SECRET);

        if(res.status(201)){
            return res.json({status:"ok",data:token});
        }else{
            return res.json({error:"error"});
        }
    }
    res.json({status:"error",error:"Invalid Password"});
});

app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
      const useremail = user.email;
      User.findOne({ email: useremail })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });
