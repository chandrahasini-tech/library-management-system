const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");


// REGISTER

router.post("/register", async(req,res)=>{

    try{

        const {name,email,password,phone,address,role} = req.body;

        // CHECK EXISTING USER

        const existingUser = await User.findOne({email});

        if(existingUser){

            return res.status(400).json({
                message:"User already exists"
            });

        }

        // HASH PASSWORD

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        // CREATE USER

        const user = new User({

            name,
            email,
            password:hashedPassword,
            phone,
            address,
            role

        });

        await user.save();

        res.status(201).json({
            message:"Registration successful"
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

module.exports = router;