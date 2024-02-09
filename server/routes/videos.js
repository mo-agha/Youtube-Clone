import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getByTags,
  getVideo,
  random,
  search,
  subscribers,
  trend,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Create a Video
router.post("/", verifyToken, addVideo);

//Update a Video
router.put("/:id", verifyToken, updateVideo);

//Delete a Video
router.delete("/:id", verifyToken, deleteVideo);

//Get a Video
router.get("/find/:id", getVideo);

//Increment Video Views
router.put("/view/:id", addView);

//Trending Videos
router.get("/trend", trend);

//Random Videos
router.get("/random", random);

//Subscribers Videos
router.get("/subscribers", verifyToken, subscribers);

//Get Video By Search
router.get("/search", search);

//Get Video By Tags
router.get("/tags", getByTags);

export default router;
