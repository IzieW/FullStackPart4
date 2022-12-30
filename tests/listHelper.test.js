const {dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes} = require("../utils/list_helper")

test("dummy returns one", ()=> {
    const blogs = []
    const results = dummy(blogs)
    expect(results).toBe(1)
})

const dummyBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

describe("total likes", ()=> {
    test("of empty list is zero", ()=> {
        expect(totalLikes([])).toBe(0)
    })

    test("when a list has only one blog equals that likes of that", ()=> {
        expect(totalLikes([dummyBlogs[0]])).toBe(7)
    })
    test("of a bigger list is calculated correclty", ()=> {
        expect(totalLikes(dummyBlogs)).toBe(36)
    })
})

describe("favourite blog", ()=> {
    test("returns blog with most likes from list", ()=>{
        const favourite = favouriteBlog(dummyBlogs)
        expect(favourite.title).toBe("Canonical string reduction")
    })
    test("if list is empty returns null", ()=> {
        expect(favouriteBlog([])).toBe(null)
    })
    })

describe("most blogs", ()=> {
    test("Finds author with greatest number of blogs", ()=> {
        const result = mostBlogs(dummyBlogs)
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3
          })
    })

    test("if list is empty returns null", ()=> {
        expect(mostBlogs([])).toBe(null)
    })
})

describe("most likes", ()=> {
    test("Returns name and total like of author with most likes", ()=> {
        const result = mostLikes(dummyBlogs)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})