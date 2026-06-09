const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
describe('dummy', () => {
    test('dummy returns one', () => {
      const blogs = []

      const result = listHelper.dummy(blogs)
      assert.strictEqual(result, 1)
    })
})


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const emptyList = []

  const listWithThreeBlogs = [
    {
        "_id": "6a0e0cc75a95e0b5519163e9",
        "title": "a",
        "author": "aa",
        "url": "a.com",
        "likes": 123,
        "__v": 0
    },
    {
        "_id": "6a0e0ce35a95e0b5519163ea",
        "title": "b",
        "author": "aa",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },
    {
        "_id": "6a1339512d09c2cefbdc227d",
        "title": "bbb",
        "author": "aab",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    }
]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('empty list has zero likes' , ()=>{
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result,0)
  })

    test('likes of 3 blogs calculated correctly' , ()=>{
    const result = listHelper.totalLikes(listWithThreeBlogs)
    assert.strictEqual(result,2591)
  })

})


describe('favourite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const emptyList = []

  const listWithFoourBlogs = [
    {
        "_id": "6a0e0cc75a95e0b5519163e9",
        "title": "a",
        "author": "aa",
        "url": "a.com",
        "likes": 123,
        "__v": 0
    },
    {
        "_id": "6a0e0ce35a95e0b5519163ea",
        "title": "b",
        "author": "aa",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },
    {
        "_id": "6a1339512d09c2cefbdc227d",
        "title": "bbb",
        "author": "aab",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },

        {
        "_id": "123",
        "title": "fff",
        "author": "ffff",
        "url": "aba.com",
        "likes": 123456,
        "__v": 0
    }

]

  test('when list has only one blog that is favorite', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    //console.log(result)
    assert.strictEqual(result, listWithOneBlog[0])
  })
  test('epty list has empty favotite', () => {
    const result = listHelper.favoriteBlog(emptyList)
    //console.log(result)
    assert.deepStrictEqual(result, {})
  })
  test('long list should favorite with most likes', () => {
    const result = listHelper.favoriteBlog(listWithFoourBlogs)
    //console.log(result)
    assert.strictEqual(result, listWithFoourBlogs[3])
  })
})




describe('most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const emptyList = []

  const listWithFoourBlogs = [
    {
        "_id": "6a0e0cc75a95e0b5519163e9",
        "title": "a",
        "author": "a",
        "url": "a.com",
        "likes": 123,
        "__v": 0
    },
    {
        "_id": "6a0e0ce35a95e0b5519163ea",
        "title": "b",
        "author": "a",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },
    {
        "_id": "6a1339512d09c2cefbdc227d",
        "title": "bbb",
        "author": "a",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },

        {
        "_id": "123",
        "title": "fff",
        "author": "ffff",
        "url": "aba.com",
        "likes": 123456,
        "__v": 0
    },
    {
        "_id": "121233",
        "title": "ffff",
        "author": "ffff",
        "url": "aba.com",
        "likes": 123456,
        "__v": 0
    }

]

  test('when list has only one blog the author is that with one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    //console.log(result)
    const t = {"author": listWithOneBlog[0].author, "blogs": 1}
    assert.deepStrictEqual(result, t)
  })

  test("multiple blogs list returns the most blogs author with correct n of blogs", ()=>{
    const result = listHelper.mostBlogs(listWithFoourBlogs)
    const t = {"author": "a", "blogs": 3}
    assert.deepStrictEqual(result,t)
  })

  test("empty blog list empty object", ()=>{
    const result = listHelper.mostBlogs(emptyList)
    const t = {}
    assert.deepStrictEqual(result,t)
  })

})


describe('most likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const emptyList = []

  const listWithFoourBlogs = [
    {
        "_id": "6a0e0cc75a95e0b5519163e9",
        "title": "a",
        "author": "a",
        "url": "a.com",
        "likes": 123,
        "__v": 0
    },
    {
        "_id": "6a0e0ce35a95e0b5519163ea",
        "title": "b",
        "author": "a",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },
    {
        "_id": "6a1339512d09c2cefbdc227d",
        "title": "bbb",
        "author": "a",
        "url": "a.com",
        "likes": 1234,
        "__v": 0
    },

        {
        "_id": "123",
        "title": "fff",
        "author": "ffff",
        "url": "aba.com",
        "likes": 123456,
        "__v": 0
    },
    {
        "_id": "121233",
        "title": "ffff",
        "author": "ffff",
        "url": "aba.com",
        "likes": 123456,
        "__v": 0
    }

]

  test('when list has only one blog the author is that with one blog and likes those likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    //console.log(result)
    const t = {"author": listWithOneBlog[0].author, "likes": listWithOneBlog[0].likes}
    assert.deepStrictEqual(result, t)
  })

  test("multiple blogs list returns the most blogs author with correct likes", ()=>{
    const result = listHelper.mostLikes(listWithFoourBlogs)
    const t = {"author": "ffff", "likes": 246912}
    assert.deepStrictEqual(result,t)
  })

  test("empty blog list empty object", ()=>{
    const result = listHelper.mostLikes(emptyList)
    const t = {}
    assert.deepStrictEqual(result,t)
  })

})