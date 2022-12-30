const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
require("express-async-errors")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
const blogRouter = require("./controllers/blog")
const userRouter = require("./controllers/user")
const loginRouter = require("./controllers/login")

logger.info("connecting to", config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL)
    .then( ()=> {
        logger.info("connected to MongoDB")
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message)
    })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.getTokenFrom)

app.use("/api/blogs", middleware.extractUser, blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

//app.use(middleware.unKnownEndPoint)
app.use(middleware.errorHandler)

module.exports = app