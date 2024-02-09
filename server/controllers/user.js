import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can only update your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can only delete your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const subscribe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.subscribedUsers.includes(req.params.id)) {
    return res.status(400).json("User already subscribed!");
  } else {
    try {
      await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { subscribedUsers: req.params.id },
      });
      res.status(200).json("Subscribed to " + req.params.id);
    } catch (err) {
      next(err);
    }
  }
};
export const unsubscribe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.subscribedUsers.includes(req.params.id)) {
    return res.status(400).json("User not subscribed!");
  } else {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).json("Unsubscribed!");
    } catch (err) {
      next(err);
    }
  }
};
export const like = async (req, res, next) => {
  const userId = await req.user.id;
  const videoId = await req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res.status(200).json("Video liked!");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const userId = await req.user.id;
  const videoId = await req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("Video disliked!");
  } catch (err) {
    next(err);
  }
};
