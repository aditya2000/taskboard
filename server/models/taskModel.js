const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    description: {type: String},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true}
})

const Task = mongoose.model("task", taskSchema)

module.exports = Task