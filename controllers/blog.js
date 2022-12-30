const blogRouter = require("express").Router()
const { isUndefined } = require("lodash")
const Blog = require("../models/blogs")
const User = require("../models/users")
const jwt = require("jsonwebtoken")

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1, 
    name: 1
  })
  response.json(blogs)
  })
  
blogRouter.post('/', async (request, response) => {
    const body = request.body

    if (!request.user){
      return response.status(401).json({error: "token missing or invalid"})
    }

    const user = await User.findById(request.user.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: isUndefined(body.likes)?0:body.likes,
      user: user._id
    })
  
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
    
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()
  })

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const blogUserID = blog.user._id.toString()

  if (blogUserID !== request.user.id){
    return response.status(401).json({error: "Blogs can only be deleted by the user who posted them"})
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async(request, response) => {
  const body = request.body
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: isUndefined(body.likes)?0:body.likes
  }
  const newBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new:true})
  response.json(newBlog)

})

  module.exports = blogRouter
  