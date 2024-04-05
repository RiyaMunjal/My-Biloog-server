import express from 'express'
import { addNewPost, deletePost, getAllPost, getSinglePost, updatePost } from '../Controllers/post.controllers.js';
const router=express.Router()

router.get('/', getAllPost);
router.get('/:id', getSinglePost);

router.post('/', addNewPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;

