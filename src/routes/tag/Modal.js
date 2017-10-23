import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
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
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const name_label = intl.get('tag_name').defaultMessage('Name')
  const type_label = intl.get('tag_type').defaultMessage('Type')
  const system_msg = intl.get('tag_type_system').defaultMessage('System')
  const custom_msg = intl.get('tag_type_custom').defaultMessage('Custom')

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label={name_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: intl.get('tag_name_required_msg').defaultMessage('name is required'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={type_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: item.type,
            rules: [
              {
                required: true,
                type: 'number',
                message: intl.get('tag_type_required_msg').defaultMessage('type is required'),
              },
            ],
          })(
            <Radio.Group>
              <Radio value={1}>{system_msg}</Radio>
              <Radio value={2}>{custom_msg}</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
