import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { Permission, Operation } from '../../utils/enums'
import styles from './List.less'
import intl from 'react-intl-universal'

const confirm = Modal.confirm

const List = ({ permission, onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === Operation.UPDATE) {
      onEditItem(record)
    } else if (e.key === Operation.DELETE) {
      confirm({
        title: intl.get('role_delete_confirm'),
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const update_msg = intl.get('update').defaultMessage('Update')
  const delete_msg = intl.get('delete').defaultMessage('Delete')
  let menuOptions = []
  if (permission.allowUpdate) menuOptions.push({key: Operation.UPDATE, name: update_msg})
  if (permission.allowDelete) menuOptions.push({key: Operation.DELETE, name: delete_msg})

  const columns = [
    {
      title: intl.get('role_name').defaultMessage('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`role/${record.id}`}>{text}</Link>,
      sorter: true,
    }, {
      title: intl.get('createTime').defaultMessage('CreateTime'),
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: intl.get('operation').defaultMessage('Operation'),
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
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
  permission: PropTypes.object,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
