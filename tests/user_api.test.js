const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

const User = require("../models/users")
const Blog = require("../models/blogs")
const helper = require("./user_helper")


beforeEach(async ()=> {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe("when there are some notes saved", ()=> {
    test("all notes are returned as json", async ()=> {
        const response = await api.get("/api/users")
            .expect(200)
            .expect("Content-Type", /application\/json/)
        
        expect(response.body).toHaveLength(helper.initialUsers.length)
        const usernames = response.body.map(user => user.username)
        expect(usernames).toContain(helper.initialUsers[0].username)
    })
})

describe("creating new users", ()=>  {
    test("succeeds when username and password are valid and username is unique", async ()=> {
    const newUser = {
        username: "izieo",
        name: "isa",
        password: "catsRcool"
    }
    await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    
    const usersAtEnd = await helper.getUsers()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain("izieo")
})

    test("fails with status code 400 if username invalid", async ()=>{
        const invalidUser = {
            username: "k",
            name: "kooka",
            password: "word"
        }

        await api.post("/api/users")
            .send(invalidUser)
            .expect(400)

    const invalidUser2 = {
        name: "kooka",
        password: "word"
    }

    await api.post("/api/users")
            .send(invalidUser2)
            .expect(400)
    })

    test("fails with status code 400 when password is invalid", async ()=> {
        const invalidUser = {
            username: "snoopy",
            name: "kook",
            password: "w"
        }

        await api.post("/api/users")
        .send(invalidUser)
        .expect(400)

        const invalidUser2 = {
            username: "snoopy",
            name: "kook"
        }

        await api.post("/api/users")
        .send(invalidUser2)
        .expect(400)
    })

    test("fails with status code 400 if username is not unique", async ()=> {
        const userDupe = helper.initialUsers[0]
        await api.post("/api/users")
        .send(userDupe)
        .expect(400)
    })
})
