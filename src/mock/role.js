const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let database = [
  {id: 1, code: 'Admin', name: '管理员', createTime: Mock.mock('@now')},
  {id: 2, code: 'SalesManager', name: '销售主管', createTime: Mock.mock('@now')},
  {id: 3, code: 'Sales', name: '销售', createTime: Mock.mock('@now')},
  {id: 4, code: 'VirtualSales', name: '虚拟销售', createTime: Mock.mock('@now')}
]

let rolePermissionMapList = [
  {roleId: 1, menuId: 1, permissions: [1]},
  {roleId: 1, menuId: 2, permissions: [1]},
  {roleId: 1, menuId: 21, permissions: [1,2,3,4]},
  {roleId: 1, menuId: 22, permissions: [1,2,3,4]},
  {roleId: 1, menuId: 3, permissions: [1,2,3,4]},
  {roleId: 1, menuId: 4, permissions: [1]},
  {roleId: 1, menuId: 41, permissions: [1,2,3,4]},
  {roleId: 1, menuId: 42, permissions: [1,2,3,4]},
  {roleId: 1, menuId: 5, permissions: [1]},
  {roleId: 1, menuId: 51, permissions: [1]},
  {roleId: 1, menuId: 52, permissions: [1]},
  {roleId: 1, menuId: 53, permissions: [1]},
  {roleId: 1, menuId: 6, permissions: [1,2,3,4]},
  {roleId: 1, menuId: 61, permissions: [1]},
  {roleId: 2, menuId: 1, permissions: [1]},
  {roleId: 2, menuId: 3, permissions: [1,2,3,4]},
  {roleId: 2, menuId: 4, permissions: [1]},
  {roleId: 2, menuId: 41, permissions: [1,2,3]},
  {roleId: 2, menuId: 42, permissions: [1,2,3]},
  {roleId: 3, menuId: 1, permissions: [1]},
  {roleId: 3, menuId: 3, permissions: [1]},
  {roleId: 4, menuId: 1, permissions: [1]},
  {roleId: 4, menuId: 3, permissions: [1]}
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

  [`GET ${apiPrefix}/roles`] (req, res) {
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

  [`DELETE ${apiPrefix}/roles`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/role`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/role/:id`] (req, res) {
    const { id } = req.params
	const roleId = Number(id)
    const data = queryArray(database, roleId, 'id')
    if (data) {
      data.permissions = {}
	  rolePermissionMapList.filter(item => {
		if (item.roleId === roleId) {
			data.permissions[item.menuId] = item.permissions
		}
	  })
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/role/:id`] (req, res) {
    const { id } = req.params
	const roleId = Number(id)
    const data = queryArray(database, roleId, 'id')
    if (data) {
      database = database.filter(item => item.id !== roleId)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/role/:id`] (req, res) {
    const { id } = req.params
	const roleId = Number(id)
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === roleId) {
        isExist = true
		//更新角色权限映射表
		let permissions = editItem.permissions
		let newRolePermissionMapList = rolePermissionMapList.filter(rpm => rpm.roleId !== roleId)
		for (let menuId in permissions) {
			newRolePermissionMapList.push({roleId: roleId, menuId: menuId, permissions: permissions[menuId]})
		}
		rolePermissionMapList = newRolePermissionMapList
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
