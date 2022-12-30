const User = require("../models/users")

const initialUsers = [
    {
        username: "Kookal",
        name: "kooky",
        password: "kkooka"
    },
    {
        username: "izie101",
        name: "izie",
        password: "ohhellothere!"
}
]

const getUsers = async ()=> {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialUsers, getUsers}