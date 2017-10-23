import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import intl from 'react-intl-universal'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: intl.get('tag_delete_confirm'),
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const update_msg = intl.get('update').defaultMessage('Update')
  const delete_msg = intl.get('delete').defaultMessage('Delete')
  const system_msg = intl.get('tag_type_system').defaultMessage('System')
  const custom_msg = intl.get('tag_type_custom').defaultMessage('Custom')

  const columns = [
    {
      title: intl.get('tag_name').defaultMessage('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`tag/${record.id}`}>{text}</Link>,
      sorter: true,
    }, {
      title: intl.get('tag_type').defaultMessage('Type'),
      dataIndex: 'type',
      key: 'type',
      filters: [{
        text: system_msg,
        value: 1,
      }, {
        text: custom_msg,
        value: 2,
      }],
      filterMultiple: true,
      render: type => (<span>{type == 1 ? system_msg : custom_msg}</span>),
    }, {
      title: intl.get('createTime').defaultMessage('CreateTime'),
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: intl.get('operation').defaultMessage('Operation'),
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: update_msg}, { key: '2', name: delete_msg}]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1250 }}
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
