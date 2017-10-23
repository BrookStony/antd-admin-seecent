import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import RolePermission from './RolePermission'
import intl from 'react-intl-universal'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {permissions: {}},
  menuTree = [],
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  ...modalProps
}) => {
  if (!item.permissions) {
    item.permissions = {}
  }

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
        id: item.id,
        permissions: item.permissions,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    afterClose () {
      resetFields() // 必须项，编辑后如未确认保存，关闭时必须重置数据
    },
  }

  const name_label = intl.get('role_name').defaultMessage('Name')

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label={name_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: intl.get('role_name_required_msg').defaultMessage('name is required'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem>
          <RolePermission permissions={item.permissions} menuTree={menuTree}/>
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  menuTree: PropTypes.array.isRequired,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
