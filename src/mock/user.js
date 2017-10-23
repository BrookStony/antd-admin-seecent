const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

const userList = [
  {
    id: '1',
	  roleId: 1,
    username: 'admin',
    password: 'admin',
    nickName: 'admin',
    phone: '18621888888',
    age: 25,
    address: Mock.mock('@county(true)'),
    isMale: true,
    email: 'admin@antd.com',
    createTime: Mock.mock('@datetime'),
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '2',
	  roleId: 2,
    username: 'guest',
    password: 'guest',
    nickName: 'guest',
    phone: '18621888888',
    age: 25,
    address: Mock.mock('@county(true)'),
    isMale: true,
    email: 'admin@antd.com',
    createTime: Mock.mock('@datetime'),
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '3',
	  roleId: 3,
    username: 'test',
    password: 'test',
    nickName: 'test',
    phone: '18621888888',
    age: 25,
    address: Mock.mock('@county(true)'),
    isMale: true,
    email: 'admin@antd.com',
    createTime: Mock.mock('@datetime'),
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
]

let database = userList

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {

  [`POST ${apiPrefix}/user/login`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const { username, password } = req.body
    const user = userList.filter(item => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      res.json({ success: true, message: 'Ok' })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${apiPrefix}/user/logout`] (req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`GET ${apiPrefix}/user`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = userList.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        user.username = userItem[0].username
        user.id = userItem[0].id
		    user.roleId = userItem[0].roleId
      }
    }
    response.user = user
    res.json(response)
  },

  [`GET ${apiPrefix}/users`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    const { query } = req
    let { pageSize, page, sortField, sortOrder, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    if (sortField && sortOrder) {
      if ("username" == sortField) {
        if ("ascend" == sortOrder) {
          database.sort(function(a, b){
            return a.username.localeCompare(b.username)
          })
        }
        else {
          database.sort(function(a, b){
            return b.username.localeCompare(a.username)
          })
        }
      }
      else if ("age" == sortField) {
        if ("ascend" == sortOrder) {
          database.sort(function(a, b){
            return a.age - b.age
          })
        }
        else {
          database.sort(function(a, b){
            return b.age - a.age
          })
        }
      }
    }

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/users`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/user`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/user/:id`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/user/:id`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/user/:id`] (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
