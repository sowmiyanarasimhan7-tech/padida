const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subscription: { type: Object, required: true } // stores endpoint + keys
})

module.exports = mongoose.model("Subscription", subscriptionSchema)