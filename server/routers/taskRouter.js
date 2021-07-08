const router = require("express").Router()
const Task = require("../models/taskModel")
const auth = require("../middleware/auth")
const { json } = require("express")
const mongoose = require("mongoose")

router.post("/", auth, async (req, res) => {
    try {
        const {title, description, startDate, endDate} = req.body
        const userid = req.user
        const newTask = new Task({
            userid, title, description, startDate, endDate
        })

        const savedTask = await newTask.save()

        res.json(savedTask)
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

router.get("/", auth, async(req, res) => {
    try {
        const tasks = await Task.find({userid: req.user})

        res.json(tasks)
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

router.delete("/", auth, async(req, res) => {
    try {
        const { id } = req.body
        const result = await Task.deleteOne({_id: mongoose.Types.ObjectId(id)})  
        
        res.json(result)
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

router.post("/update", auth, async(req, res) => {
    try {  
        const {id, title, description, endDate} = req.body

        const result = await Task.findOne({_id: mongoose.Types.ObjectId(id)})

        if (!result) {
            res.status(404).send("data is not found");
          }
          else {
              result.title = title;
              result.description = description;
              result.endDate = endDate;
              result.updateOne();
          }

    } catch(err) {
        res.status(500).send()
    }
})

module.exports = router