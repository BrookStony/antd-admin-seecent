/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import * as roleService from 'services/role'
import queryString from 'query-string'
import store from 'store'
import intl from 'react-intl-universal'

const { prefix, enableConfigMenus } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {},
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      const { success, user } = yield call(query, payload)
      const { locationPathname } = yield select(_ => _.app)
      if (success && user) {
        let allMenus = []
        if (enableConfigMenus) {
          allMenus = config.menus
        }
        else {
          const { list } = yield call(menusService.query)
          allMenus = list
        }
        
    		const { roleId } = user
    		//获取当前用户角色
    		const role = yield call(roleService.get, {id: roleId})
    		let permissions = {}
    		let userMenus = []
    		if (role.success) {
    		  //获取用户权限
    			permissions = role.permissions || {}
    			user.permissions = permissions
    			userMenus = allMenus.map((item) => {
    			  item.name = intl.get(item.code).defaultMessage(item.name)
    			  return item
    			})

          if (enableConfigMenus) {
            if (role.code === 'Admin') {
              permissions = config.adminPermissions
            }
            else if(role.code === 'SalesManager') {
              permissions = config.salesManagerPermissions
            }
            else if(role.code === 'Sales') {
              permissions = config.salesPermissions
            }
            else {
              permissions = config.virtualSalesPermissions
            }
          }

          //获取用户菜单
          userMenus = allMenus.filter((item) => {
            const cases = [
              permissions[item.id] ? true : false
            ]
            return cases.every(_ => _)
          })
    		}
    		
        //缓存当前登录用户和用户权限、菜单
    		store.set(`${prefix}user`, user)
    		store.set(`${prefix}userPermissions`, permissions)
    		store.set(`${prefix}userMenus`, userMenus)
        
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu: userMenus,
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/dashboard',
          }))
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
