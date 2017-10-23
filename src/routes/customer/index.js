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
import { Permission} from '../../utils/enums'
import intl from 'react-intl-universal'

const Customer = ({ location, dispatch, customer, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, currentUser, permissions } = customer
  const { pageSize } = pagination

  // 判断操作权限
  const permission = {
	allowCreate: permissions ? permissions.some(p => p === Permission.CREATE) : false,
	allowUpdate: permissions ? permissions.some(p => p === Permission.UPDATE) : false,
	allowDelete: permissions ? permissions.some(p => p === Permission.DELETE) : false
  }
  
  const create_customer_title = intl.get('create_customer').defaultMessage('Create Customer')
  const update_customer_title = intl.get('update_customer').defaultMessage('Update Customer')

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['customer/update'],
    title: `${modalType === 'create' ? create_customer_title : update_customer_title}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `customer/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'customer/hideModal',
      })
    },
  }

  const listProps = {
	permission,
    dataSource: list,
    loading: loading.effects['customer/query'],
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
        type: 'customer/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'customer/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'customer/updateState',
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
        pathname: '/customer',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/customer',
      }))
    },
    onAdd () {
      dispatch({
        type: 'customer/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'customer/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'customer/multiDelete',
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

Customer.propTypes = {
  customer: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ customer, loading }) => ({ customer, loading }))(Customer)
