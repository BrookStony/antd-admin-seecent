import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Checkbox, Table } from 'antd'
import { Permission } from '../../utils/enums'
import { equalSet } from 'utils'
import styles from './RolePermission.less'
import intl from 'react-intl-universal'

const CheckboxGroup = Checkbox.Group

const getPermissionText = (item) => {
  const permissionName = {
    [Permission.SHOW]: '查看',
    [Permission.CREATE]: '新增',
    [Permission.UPDATE]: '修改',
    [Permission.DELETE]: '删除',
    [Permission.UPLOAD]: '上传',
  }
  const optionsPermissionName = item.permissions.map((cur) => {
    return { label: permissionName[cur], value: cur }
  })

  return optionsPermissionName
}

class RolePermission extends Component {

  constructor (props) {
    super(props)
    const { permissions, menuTree } = props
    this.state = {
      userPermission: permissions,
      menuTree: menuTree,
    }
  }

  onChangePermission (checkedValues, item) {
    if (checkedValues.length) {
      this.state.userPermission[item.id] = checkedValues
    } else {
      delete this.state.userPermission[item.id]
    }
    this.setState({ userPermission: this.state.userPermission })
  }

  render () {
    const columns = [{
      title: '菜单选项',
      dataIndex: 'name',
      width: '30%',
      render: (text, record) => (record.icon ?
        <span>
          <Icon type={record.icon} /> {text}
        </span> :
        text),
    }, {
      title: '操作权限',
      width: '60%',
      className: styles['text-left'],
      render: (text, record) => (
        <CheckboxGroup options={getPermissionText(record)} value={this.state.userPermission[record.id]} onChange={checkedValues => this.onChangePermission(checkedValues, record)} />
      ),
    }]

    const rowSelection = {
      onSelect: (record, selected) => {
        if (selected) {
          this.state.userPermission[record.id] = record.permissions
        } else {
          delete this.state.userPermission[record.id]
        }
        this.setState({ userPermission: this.state.userPermission })
      },
      onSelectAll: (selected, selectedRows) => {
        if (selected) {
          const userPermissionAll = selectedRows.reduce((permission, item) => {
            this.state.userPermission[item.id] = item.permissions
            return this.state.userPermission
          }, {})
          this.setState({ userPermission: userPermissionAll })
        } else {
          for (let key in this.state.userPermission) {
            if (Object.prototype.hasOwnProperty.call(this.state.userPermission, key)) {
              delete this.state.userPermission[key]
            }
          }
          this.setState({ userPermission: this.state.userPermission })
        }
      },
      getCheckboxProps: record => ({
        // disabled: false,
        defaultChecked: equalSet(record.permissions, this.state.userPermission[record.id]),
      }),
    }

    const { menuTree } = this.state

    return (
      <Table columns={columns} rowSelection={rowSelection} dataSource={menuTree} rowKey="id" pagination={false}/>
    )
  }
}

RolePermission.propTypes = {
  permissions: PropTypes.object.isRequired,
  menuTree: PropTypes.array.isRequired,
}

export default RolePermission
