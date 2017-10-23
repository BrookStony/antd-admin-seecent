const { config } = require('./common')

const { apiPrefix } = config
let database = [
   {
    id: '1',
    icon: 'laptop',
    code: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
    permissions: [1]
  },
  {
    id: '2',
    code: 'security',
    name: 'security',
    icon: 'safety',
    permissions: [1]
  },
  {   
    id: '21',
    mpid: '2',
    bpid: '2',
    code: 'users',
    name: 'Users',
    icon: 'user',
    route: '/security/user',
    permissions: [1, 2, 3, 4]
  },
  {
    id: '211',
    mpid: '-1',
    bpid: '21',
    code: 'userDetail',
    name: 'User Detail',
    route: '/security/user/:id',
    permissions: [1]
  },
  {
    id: '22',
    mpid: '2',
    bpid: '2',
    code: 'roles',
    name: 'Roles',
    icon: 'team',
    route: '/security/role',
    permissions: [1, 2, 3, 4]
  },
  {
    id: '3',
    code: 'posts',
    name: 'Posts',
    icon: 'database',
    route: '/post',
    permissions: [1, 2, 3, 4]
  },
  {
    id: '4',
    code: 'system',
    name: 'System',
    icon: 'setting',
    permissions: [1]
  },
  {
    id: '41',
     mpid: '4',
    bpid: '4',
    code: 'categories',
    name: 'Categories',
    icon: 'folder',
    route: '/system/category',
    permissions: [1, 2, 3, 4]
  },
  {
    id: '42',
    mpid: '4',
    bpid: '4',
    code: 'tags',
    name: 'Tags',
    icon: 'tags',
    route: '/system/tag',
    permissions: [1, 2, 3, 4]
  },
  {
    id: '5',
    code: 'eecharts',
    name: 'Recharts',
    icon: 'code-o',
    permissions: [1]
  },
  {
    id: '51',
    bpid: '5',
    mpid: '5',
    code: 'lineChart',
    name: 'LineChart',
    icon: 'line-chart',
    route: '/chart/lineChart',
    permissions: [1]
  },
  {
    id: '52',
    bpid: '5',
    mpid: '5',
    code: 'barChart',
    name: 'BarChart',
    icon: 'bar-chart',
    route: '/chart/barChart',
    permissions: [1]
  },
  {
    id: '53',
    bpid: '5',
    mpid: '5',
    code: 'areaChart',
    name: 'AreaChart',
    icon: 'area-chart',
    route: '/chart/areaChart',
    permissions: [1]
  },
  {
    id: '6',
    code: 'customer',
    name: 'Customer',
    icon: 'team',
    route: '/customer',
    permissions: [1, 2, 3, 4]
  },
  {
    id: '61',
    mpid: '-1',
    bpid: '6',
    code: 'customer',
    name: 'Customer Detail',
    route: '/customer/:id',
    permissions: [1]
  },
]

module.exports = {

  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}
