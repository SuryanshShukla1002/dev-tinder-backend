const express = require("express");
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAVE_DATA = "firstName lastName age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAVE_DATA);



        res.json({ message: "Data fetched Successfully: ", data: connectionRequests });
    } catch (err) {
        res.status(404).send("ERROR " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepeted" },
                { fromUserId: loggedInUser._id, status: "accepeted" }
            ]
        }).populate("fromUserId", USER_SAVE_DATA);

        const data = connectionRequests.map((row) => row.fromUserId);

        res.json({ data });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = userRouter;