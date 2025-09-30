import bcrypt from "bcryptjs";
import { v2 } from "cloudinary";


import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";


export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getUserProfile controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userTOModify = await User.findById(id);
    const currentUser = await User.findById(req.user.id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }
    if (!userTOModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({ message: "User Unfollowed" });
    } else {
      //follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      //notification here..
      const newNotification = new Notification({
        from: req.user._id,
        to: userTOModify._id,
        type: "follow",
      });
      await newNotification.save();

      res.status(200).json({ message: "User Followed" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    //lets say 10 diffrent user right (1,2,3,4,5,6,7,8,9,10) and assume some of them i alrady follow so it will filter out those and give me diffrent users it make since right
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const SuggestedUsers = filteredUsers.slice(0, 4);

    SuggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json({ SuggestedUsers });
  } catch (error) {
    console.log("Error in getSuggestedUsers controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
    
export const updateUser = async(req,res) =>{
  const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
  let {profileImg, coverImg} = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if(!user) return res.status(404).json({message: "User not found"});

    if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
      return res.status(400).json({message: "Please provide both current and new password"});
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });    
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }


    if (profileImg) {
      if (user.profileImg) {
        await v2.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]); // with the help of this line we can delete the old image/user profile and replace with the new one here..
      }

     const uploadedResponse =  await v2.uploader.upload(profileImg)
     profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await v2.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]); // with the help of this line we can delete the old image/user profile and replace with the new one here..        
      }

      const uploadedResponse = await v2.uploader.upload(coverImg)
      coverImg = uploadedResponse.secure_url;
    }


    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null; //dont send password in response

    return res.status(200).json({user});

  } catch (error) {
    console.log("Error in updateUser controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
};
