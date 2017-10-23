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
import intl from 'react-intl-universal'

const Role = ({ location, dispatch, category, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = category
  const { pageSize } = pagination

  const create_category_title = intl.get('create_category').defaultMessage('Create Role')
  const update_category_title = intl.get('update_category').defaultMessage('Update Role')

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['category/update'],
    title: `${modalType === 'create' ? create_category_title : update_category_title}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `category/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'category/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['category/query'],
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
        type: 'category/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'category/showModal',
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
          type: 'category/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
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
        pathname: '/category',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/category',
      }))
    },
    onAdd () {
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'category/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'category/multiDelete',
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
        selectedRowKeys.length > 0 &&
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
  category: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ category, loading }) => ({ category, loading }))(Role)
