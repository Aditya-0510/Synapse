import {Router} from "express"
import jwt from "jsonwebtoken"
import { UserModel } from "../db.js"; 
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "ddd"

const userRouter = Router()

userRouter.post("/signup", async (req,res) => {
    const { name, email, password } = req.body;
    console.log(email);
    try{
        const existingUser = await UserModel.findOne({ 
            email: email 
        });
        if (existingUser) {
            return res.status(409).send({
                message: "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password,5)
        await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
        })

        res.send({
            message: "User created",
            success: true
        })
    }
    catch(e){
        res.status(500).send({
            message: "Error in creating user",
            success: false
        })
    }
})

userRouter.post("/signin", async (req,res) => {
    const { email, password } = req.body;
    console.log(email + password);
    try{
        const user = await UserModel.findOne({
            email: email
        })
        // console.log(user);
        if(!user){
            return res.send({
                message: "user not found"
            })
        }
        const match = await bcrypt.compare(password,user.password);
        if(match){
            const token = jwt.sign({
                id: user._id
            },JWT_SECRET)

            res.send({
                message: "user logged in succesfully",
                token: token,
                success: true
            })
        }
        else{
            return res.status(401).send({
                message: "incorrect password",
                success: false
            })
        }
    }
   
    catch(e){
       res.status(500).send({
            message: "Error in logging user",
            success: false
        })
    }
})


export default userRouter