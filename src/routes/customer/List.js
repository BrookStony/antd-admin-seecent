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
import { Permission, Operation } from '../../utils/enums'

const confirm = Modal.confirm

const List = ({ permission, onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === Operation.UPDATE) {
      onEditItem(record)
    } else if (e.key === Operation.DELETE) {
      confirm({
        title: intl.get('customer_delete_confirm'),
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
      title: intl.get('customer_avatar').defaultMessage('Avatar'),
      dataIndex: 'avatar',
      key: 'avatar',
      width: 64,
      className: styles.avatar,
      render: text => <img alt={'avatar'} width={24} src={text} />,
    }, {
      title: intl.get('customer_name').defaultMessage('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`customer/${record.id}`}>{text}</Link>,
      sorter: true,
    }, {
      title: intl.get('customer_nickName').defaultMessage('Nick Name'),
      dataIndex: 'nickName',
      key: 'nickName',
    }, {
      title: intl.get('customer_age').defaultMessage('Age'),
      dataIndex: 'age',
      key: 'age',
      sorter: true,
    }, {
      title: intl.get('customer_gender').defaultMessage('Gender'),
      dataIndex: 'isMale',
      key: 'isMale',
      filters: [{
        text: intl.get('male').defaultMessage('Male'),
        value: true,
      }, {
        text: intl.get('female').defaultMessage('Female'),
        value: false,
      }],
      filterMultiple: true,
      render: text => (<span>{text
        ? intl.get('male').defaultMessage('Male')
        : intl.get('female').defaultMessage('Female')}</span>),
    }, {
      title: intl.get('customer_phone').defaultMessage('Phone'),
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: intl.get('customer_email').defaultMessage('Email'),
      dataIndex: 'email',
      key: 'email',
    }, {
      title: intl.get('customer_address').defaultMessage('Address'),
      dataIndex: 'address',
      key: 'address',
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
