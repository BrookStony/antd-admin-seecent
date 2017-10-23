const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let database = [
  {id: 1, name: '知识教育', createTime: Mock.mock('@now')},
  {id: 2, name: '营销活动', createTime: Mock.mock('@now')},
  {id: 3, name: '联合营销', createTime: Mock.mock('@now')},
  {id: 4, name: '趣味互动', createTime: Mock.mock('@now')},
  {id: 5, name: '客户服务', createTime: Mock.mock('@now')},
  {id: 6, name: '游戏库', createTime: Mock.mock('@now')},
  {id: 7, name: '调研', createTime: Mock.mock('@now')},
  {id: 8, name: '团购', createTime: Mock.mock('@now')},
  {id: 9, name: '特邀活动', createTime: Mock.mock('@now')}
]

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

  [`GET ${apiPrefix}/categories`] (req, res) {
    const { query } = req
    let { pageSize, page, sortField, sortOrder, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    if (sortField && sortOrder) {
      if ("name" == sortField) {
        if ("ascend" == sortOrder) {
          database.sort(function(a, b){
            return a.name.localeCompare(b.name)
          })
        }
        else {
          database.sort(function(a, b){
            return b.name.localeCompare(a.name)
          })
        }
      }
    }

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'createTime') {
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

  [`DELETE ${apiPrefix}/categories`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/category`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/category/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/category/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/category/:id`] (req, res) {
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
