import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    console.log(req.params.userId);
    if (video.userId === req.user.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can only update your videos!"));
    }
  } catch (err) {
    next(err);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (video.userId === req.user.id) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("Video successfully removed!");
    } else {
      return next(createError(403, "You can only delete your videos!"));
    }
  } catch (err) {
    next(err);
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};
export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("View added!");
  } catch (err) {
    next(err);
  }
};
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const subscribers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedUsers = user.subscribedUsers;
    const subVideos = await Promise.all(
      subscribedUsers.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    res
      .status(200)
      .json(subVideos.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const getByTags = async (req, res, next) => {
  const tagList = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tagList } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
