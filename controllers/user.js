const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/users")

userRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", {
        url: 1, title: 1, author: 1
    })
    response.json(users)
})

userRouter.post("/", async (request, response) => {
    const {username, name, password} = request.body

    if (!username || username.length < 3){
        return response.status(400).json({
            error: "username must be atleast 3 characters long"
        })
    }
    if (!password || password.length < 3){
        return response.status(400).json({
            error: "password must be atleast 3 characters long"
        })
    }
    
    const existingUser = await (await User.findOne({username}))
    if(existingUser) {
        return response.status(400).json({
            error: "username must be unique"
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name, 
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter