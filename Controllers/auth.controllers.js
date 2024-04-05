import pool from "../database.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const register = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //check if the user already exist
  const q1 = "Select * from user where email=? OR name=?";
  const [result1] = await pool.query(q1, [email, name]); //assuming empty array
  console.log(result1);
  if (result1.length) {
    res.status(400);
    throw new Error("User Already exist");
  }
  const q2 = " Insert into user (name, email, password) values(?,?,?)";
  const hashed_password=await bcrypt.hash(password, 10);
  const result2 = await pool.query(q2, [name, email, hashed_password]);
  console.log(result2);
  res.send("user registered successfully");
});

export const login = expressAsyncHandler(async (req, res) => {
  const {name, password} = req.body;

  // to check if user exist or not
const q1='Select * from user where name=?'
const [result1]=await pool.query(q1, [name])
if(!result1.length){
  res.status(400);
  throw new Error(`User not exist, Go and Register fisrt`);
}

const isMatch=await bcrypt.compare(password, result1[0].password);
if(!isMatch){
  throw new Error(`Either username or password is incorrect`);
}

const { password : existingPassword , ...other}=result1[0];
const token= jwt.sign({id: result1[0].id}, process.env.SECRET_KEY)
res.cookie("token", token, {
  httpOnly:true,
  sameSite:"none",
  secure:true
}).status(200).send(other)
});

export const logout= expressAsyncHandler(async (req, res) =>{
    console.log(req.cookies);
    res.clearCookie('token',  {
      sameSite:"none",
      secure:true
    }).status(200).send('user logged out successully')
});
