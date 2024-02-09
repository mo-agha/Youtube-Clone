import express from "express";
import {
  deleteUser,
  dislike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  update,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Update User
router.put("/:id", verifyToken, update);
//Delete User
router.delete("/:id", verifyToken, deleteUser);
//Get User
router.get("/find/:id", getUser);
//Subscribe User
router.put("/subscribe/:id", verifyToken, subscribe);
//Unsubscribe User
router.put("/unsubscribe/:id", verifyToken, unsubscribe);
//Like Video
router.put("/like/:videoId", verifyToken, like);
//Unlike Video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
