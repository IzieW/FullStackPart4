const countBy = require('lodash').countBy
const groupBy = require("lodash").groupBy

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce((a, b) => a+b, 0)
}

const favouriteBlog = (blogs) => {
    if (blogs.length === 0){
        return null
    }

    const maxLikes = Math.max(...blogs.map(blog=> blog.likes))
    const favourite = blogs.find(blog => blog.likes === maxLikes)
    return {
        title: favourite.title,
        author: favourite.author,
        likes: favourite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0){
        return null
    }
    const counts = countBy(blogs.map(blog => blog.author))
    const maxBlogs = Math.max(...Object.values(counts))
    return {
        author: Object.keys(counts).find(key => counts[key]===maxBlogs),
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    const authors = groupBy(blogs, i => i.author)
    const likes = Object.keys(authors).map(author => (authors[author].map(obj => obj.likes).reduce((a, b)=> a+b, 0)))
    return {
        author: Object.keys(authors)[likes.indexOf(Math.max(...likes))],
        likes: Math.max(...likes)
        }
}

module.exports = {dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes}