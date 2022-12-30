const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

const Blog = require("../models/blogs")
const User = require("../models/users")
const helper = require("./blogtest_helper")

const jwt = require("jsonwebtoken")

beforeEach(async ()=> {
    // Populate test DB with blogs
    await Blog.deleteMany()
    await Blog.insertMany(helper.initialBlogs)

    // Populate test DB with users
    await User.deleteMany()
    await User.insertMany(helper.initialUsers)
}
)


describe("When calling blogs", ()=> {
    test("Api returns correct amount of blog posts as json", async ()=> {
        await api.get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
        const blogs = await helper.getItemsFromDB()
    
        expect(blogs.length).toBe(helper.initialBlogs.length)
    })
    
    test("Unique identifier of a given post is named id", async ()=> {
        const blogs = await helper.getItemsFromDB()
        expect(blogs[0].id).toBeDefined()
    })
})

describe("when saving new posts", ()=> {
    test("new post succeeds with valid token", async () => {

        token = await helper.getToken()

        const newBlog = {
            title: "Kooks",
            author: "Izzy",
            url: "www.kooks.com",
            likes: 1000
        }


        await api.post("/api/blogs")
                .set("Authorization", `bearer ${token}`)
                .send(newBlog)
                .expect(201)
    })

    test("new post fails with status code 401 if token not provided", async ()=> {
        const newBlog = {
            title: "Kooks",
            author: "Izzy",
            url: "www.kooks.com",
            likes: 1000
        }

        await api.post("/api/blogs")
            .send(newBlog)
            .expect(401)
    })
    test("If unspecified, likes default to zero", async ()=> {
        const token = await helper.getToken()

        const noLikes = {
            title: "kooks",
            author: "Izzy",
            url: "www.kooks.com"
        }
    
        await api
            .post("/api/blogs")
            .set("Authorization", `bearer ${token}`)
            .send(noLikes)
            .expect(201)
        
        const blogs = await helper.getItemsFromDB()
        expect(blogs.pop().likes).toBe(0)
    })

    test("If title or url properties are missing request fails", async () => {
        const token = await helper.getToken()

        const missingTitle = {
            author: "izzy",
            url: "www.kooks.com"
        }
    
        await api
            .post("/api/blogs")
            .set("Authorization", `bearer ${token}`)
            .send(missingTitle)
            .expect(400)
    
        const missingUrl = {
            title: "Kooks",
            author: "izzy",
            likes: 1
        }
    
        await api
            .post("/api/blogs")
            .set("Authorization", `bearer ${token}`)
            .send(missingUrl)
            .expect(400)
    })
})

describe("Deleting a blog post", ()=> {
    test("succeeds when users are the same", async () => {
        const token = await helper.getToken()

        const blogToDelete = {
            title: "Test Blog",
            author: "Izzy",
            url: "www.kooks.com",
            likes: 1000
        }

        await api.post("/api/blogs")
                .set("Authorization", `bearer ${token}`)
                .send(blogToDelete)
                .expect(201)
        
        const blogs = await helper.getItemsFromDB()

        expect(blogs).toHaveLength(helper.initialBlogs.length +1 )

        const idToDelete = blogs.pop().id

        await api.delete(`/api/blogs/${idToDelete}`)
                .set("Authorization", `bearer ${token}`)
                .expect(204)
        
        const blogsAfterDeletion = await helper.getItemsFromDB()
        expect(blogsAfterDeletion).toHaveLength(helper.initialBlogs.length)
    }) 

    test("fails with status code 401 when users are not the same", async ()=> {
        const blogToDelete = {
            title: "Test Blog",
            author: "Izzy",
            url: "www.kooks.com",
            likes: 1000
        }

        // user posts one blog
        const token = await helper.getToken()

        await api.post("/api/blogs")
                .set("Authorization", `bearer ${token}`)
                .send(blogToDelete)
                .expect(201)
        
        let blogs = await helper.getItemsFromDB()
        expect(blogs).toHaveLength(helper.initialBlogs.length +1 )

        const idToDelete = blogs.pop().id
        
        // New user tries to delete
        const users = await User.find({})
        const newUser = users[1]

        const tokenToBeSigned = {
            username: newUser.username,
            id: newUser.id
        }
        const newToken = jwt.sign(tokenToBeSigned, process.env.SECRET)

        await api.delete(`/api/blogs/${idToDelete}`)
                .set("Authorization", `bearer ${newToken}`)
                .expect(401)

    })
})

/*
test("Updates blog post with valid id", async ()=> {
    const blogs = await helper.getItemsFromDB()
    const toUpdate = blogs[0]

    const updatedBlog = {
        likes: 3
    }

    await api
        .put(`/api/blogs/${toUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
    
    const updatedBlogs = await helper.getItemsFromDB()
    expect(updatedBlogs[0].likes).toBe(3)
})*/

afterAll(()=> {
    mongoose.connection.close()
})