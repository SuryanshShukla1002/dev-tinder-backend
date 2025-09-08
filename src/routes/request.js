const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }



        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // if there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId, toUserId: fromUserId
                }
            ],
        });
        if (existingConnectionRequest) {
            return res.status(404).send({ message: "Connection request already exist!" });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    // Note ->  Here while testing with APi do remember to check it with object id from where the from user has sent request to ToUser
    try {
        const loggendInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepeted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send({
                message: "Status not valid!"
            });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggendInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data });

    } catch (err) {
        res.status(400).send("ERROR:" + err.message);
    }
});


module.exports = requestRouter; 