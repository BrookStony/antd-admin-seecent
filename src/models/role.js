/* global window */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { config } from 'utils'
import { get, create, remove, update } from 'services/role'
import * as rolesService from 'services/roles'
import * as menusService from 'services/menus'
import { pageModel } from './common'
import store from 'store'
import intl from 'react-intl-universal'

const { query } = rolesService
const { prefix, enableConfigMenus } = config

export default modelExtend(pageModel, {
  namespace: 'role',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    menuList: [],
    isMotion: window.localStorage.getItem(`${prefix}roleIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/security/role') {
          const payload = location.query || { current: 1, pageSize: 10 }

          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
		
    		//查询当前登录用户和用户权限
    		const currentUser = store.get(`${prefix}user`) || {}
    		const userPermissions = store.get(`${prefix}userPermissions`) || {}
    		const userMenus = store.get(`${prefix}userMenus`) || []
    		const currentMenu = userMenus.filter(item => pathToRegexp(item.route || '').exec(location.pathname))
    		const permissions = userPermissions[currentMenu[0].id] || []
    		yield put({ type: 'updateState', payload: { currentUser: currentUser, permissions: permissions} })
      }
    },
	
	* eidtRole ({ payload = {} }, { call, put }) {
	  const { id, modalType} = payload
      const data = yield call(get, {id: Number(id)})
      if (data.success) {
		    let role = data
        let allMenus = []
        if (enableConfigMenus) {
          allMenus = config.menus
        }
        else {
          const { list } = yield call(menusService.query)
          allMenus = list
        }
        
        let menuList = allMenus.map((item) => {
          item.name = intl.get(item.code).defaultMessage(item.name)
          return item
        })
        yield put({
          type: 'showModal',
          payload: {
            modalType: modalType,
		        currentItem: role,
			      menuList: menuList,
          },
        })
      }
    },
	
	* createRole ({ payload = {} }, { call, put }) {
		const role = {}
		const { modalType} = payload
		const { list } = yield call(menusService.query)
		let menuList = list.map((item) => {
		  item.name = intl.get(item.code).defaultMessage(item.name)
		  return item
		})
		yield put({
		  type: 'showModal',
		  payload: {
			 modalType: modalType,
			 currentItem: role,
			 menuList: menuList,
		  },
		})
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.role)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(rolesService.remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ role }) => role.currentItem.id)
      const newRole = { ...payload, id }
      const data = yield call(update, newRole)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}roleIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
