import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const getUserProfile = async (req, res)=>{
    const { username} = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log("Error in getUserProfile controller:", error);
        res.status(500).json({message: "Internal Server Error"});
        
    }
};

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userTOModify = await User.findById(id);
        const currentUser = await User.findById(req.user.id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({error:"You cannot follow/unfollow yourself"});
        }
        if (!userTOModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            // Unfollow the user
            await User.findByIdAndUpdate(id,{$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});

            //TODO return the id of the user as a response here later.

            res.status(200).json({ message: "User Unfollowed" });

        } else {
            //follow the user
            await User.findByIdAndUpdate(id,{$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});

            //notification here..
            const newNotification = new Notification({
                from: req.user._id,
                to: userTOModify._id,
                type: "follow",
            });
            await newNotification.save();

            //TODO return the id of the user as a response here later.
            res.status(200).json({ message: "User Followed" });
        }
    } catch (error) {
        console.log("Error in followUnfollowUser controller:", error);
        res.status(500).json({message: "Internal Server Error"});
        
    }
};