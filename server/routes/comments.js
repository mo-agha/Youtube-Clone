import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Add a Comment
router.post("/", verifyToken, addComment);

//Remove a Comment
router.delete("/:id", verifyToken, deleteComment);

//Get Comments
router.get("/:videoId", getComments);

//Edit Comment
router.put("/:id", verifyToken, updateComment);

export default router;
