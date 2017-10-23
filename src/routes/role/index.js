import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import styles from './Modal.less'
import { arrayToTree } from 'utils'
import { Permission} from '../../utils/enums'
import * as rolesService from 'services/roles'
import intl from 'react-intl-universal'

const Role = ({ location, dispatch, role, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, currentUser, permissions, menuList } = role
  const { pageSize } = pagination
  
  // 生成菜单树
  const menuTree = arrayToTree(menuList.filter(_ => _.mpid !== '-1'), 'id', 'mpid')
  
  // 判断操作权限
  const permission = {
  	allowCreate: permissions ? permissions.some(p => p === Permission.CREATE) : false,
  	allowUpdate: permissions ? permissions.some(p => p === Permission.UPDATE) : false,
  	allowDelete: permissions ? permissions.some(p => p === Permission.DELETE) : false
  }
  
  const create_role_title = intl.get('create_role').defaultMessage('Create Role')
  const update_role_title = intl.get('update_role').defaultMessage('Update Role')

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['role/update'],
    title: `${modalType === 'create' ? create_role_title : update_role_title}`,
    wrapClassName: 'vertical-center-modal',
    className: styles.modalWidth,
    menuTree: menuTree,
    onOk (data) {
      dispatch({
        type: `role/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'role/hideModal',
      })
    },
  }

  const listProps = {
    permission,
    dataSource: list,
    loading: loading.effects['role/query'],
    pagination,
    location,
    isMotion,
    onChange (page, filters, sorter) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'role/delete',
        payload: id,
      })
    },
    onEditItem (item) {
	    dispatch({
    		type: 'role/eidtRole',
    		payload: {
    		  modalType: 'update',
    		  id: item.id,
    		},
      })
	 
      /*dispatch({
        type: 'role/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
	  */
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'role/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    permission,
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/role',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/role',
      }))
    },
    onAdd () {
	   dispatch({
		  type: 'role/createRole',
		  payload: {
		    modalType: 'create',
		  },
    })
	  /*
      dispatch({
        type: 'role/showModal',
        payload: {
          modalType: 'create',
        },
      })*/
    },
    switchIsMotion () {
      dispatch({ type: 'role/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'role/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const remove_msg = intl.get('remove').defaultMessage('Remove')
  const remove_records_confirm_msg = intl.get('records_delete_confirm').defaultMessage('Are you sure delete these items?')

  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        permission.allowDelete && selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {intl.get('selected_items', {quality: selectedRowKeys.length}).defaultMessage('Selected ' + selectedRowKeys.length + ' items')}
            <Popconfirm title={remove_records_confirm_msg} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>{remove_msg}</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Role.propTypes = {
  role: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ role, loading }) => ({ role, loading }))(Role)
