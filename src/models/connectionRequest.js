const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // refrence to the user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepeted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }

}, { timestamps: true });


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // Check if from and to userId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot Send connection to your self");
    }
    next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;