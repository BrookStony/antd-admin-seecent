//const APIV1 = 'http://localhost:8000/api/v1'
const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

const menus = [
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
  }
]

const adminPermissions = {1: [1], 2: [1], 21: [1,2,3,4], 211: [1], 22: [1,2,3,4], 3: [1,2,3,4], 4: [1], 41: [1,2,3,4], 42: [1,2,3,4]}
const salesManagerPermissions = {1: [1], 3: [1,2,3,4], 4: [1], 42: [1,2,3]}
const salesPermissions = {1: [1], 3: [1], 4: [1], 42: [1]}
const virtualSalesPermissions = {1: [1]}

module.exports = {
  name: 'AntD Admin',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin  © 2017 Seecent',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  enableConfigMenus: false,
  menus,
  adminPermissions,
  salesManagerPermissions,
  salesPermissions,
  virtualSalesPermissions,
  CORS: ['http://localhost:8000/'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    // userLogin: `http://localhost:8000/users/token`,
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    roles: `${APIV1}/roles`,
    categories: `${APIV1}/categories`,
    posts: `${APIV1}/posts`,
    tags: `${APIV1}/tags`,
    customers: `${APIV1}/customers`,
    user: `${APIV1}/user/:id`,
    role: `${APIV1}/role/:id`,
    category: `${APIV1}/category/:id`,
    tag: `${APIV1}/tag/:id`,
    customer: `${APIV1}/customer/:id`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV1}/test`,
  },
}
