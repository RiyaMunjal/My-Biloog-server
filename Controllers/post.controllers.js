import expressAsyncHandler from "express-async-handler";
import pool from "../database.js";
import jwt from "jsonwebtoken";

export const getAllPost = expressAsyncHandler(async (req, res) => {
  const q = req.query.cat
    ? "Select * from post where cat=? "
    : "Select * from post ";
  const [result] = await pool.query(q, [req.query?.cat]);
  res.status(200).send(result);
});

export const getSinglePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const q =
    "select name, title, cat, p.id as id ,  description, date, p.image, u.image as user_img from user u JOIN post p ON u.id=p.uid where p.id=?";

  const [result] = await pool.query(q, [id]);
  res.status(200).send(result);
});

export const addNewPost = expressAsyncHandler(async (req, res) => {
  const { title, description, img , cat } = req.body;

  console.log(req.cookies);
  const token = req.cookies?.token;
  if (!token) {
    res.status(400);
    throw new Error(`User Not logged in`);
  }

  const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

  console.log(decodedData);
  const value = { ...decodedData };
  console.log(value);
  const id = decodedData.id;
  console.log(typeof id);

  const q = `INSERT into post(title, description, image, cat, uid) values (?,?,?,?,?)`;
  const [result] = await pool.query(q, [title, description, img, cat, id]);
  console.log(result);
  res.status(201).send("post has been added");
});

export const updatePost = expressAsyncHandler(async (req, res) => {
  const { title, description, cat, img } = req.body;
  const postid = req.params.id;
  const token = req.cookies?.token;
  if (!token) {
    res.status(400);
    throw new Error(`User Not Logged in`);
  }
  console.log(1);
  const decodedData = await jwt.verify(token, process.env.SECRET_KEY);
  console.log(2);
  const { id } = decodedData;
  console.log(id);

  const q ="Update post SET title=?, description=?, image=? , cat=? where uid=? and id=?";
  const [result] = await pool.query(q, [
    title,
    description,
    img,
    cat,
    id,
    postid,

  ]);
  console.log(result);
  res.status(200).send(`post updated Successfully`);
});

export const deletePost = expressAsyncHandler(async (req, res) => {
    const postid=req.params.id;
    const token = req.cookies?.token;
    if (!token) {
      res.status(400);
      throw new Error(`User Not Logged in`);
    }
    const decodedData = await jwt.verify(token, process.env.SECRET_KEY);
    const { id } = decodedData;
  
    const q='delete from post where id=? AND uid=?'
    const [result]=await pool.query(q, [postid, id]);
    console.log(result);
    res.status(200).send('post has been deleted')
});
