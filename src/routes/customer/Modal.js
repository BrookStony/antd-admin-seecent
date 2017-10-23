import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import city from '../../utils/city'
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
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const name_label = intl.get('customer_name').defaultMessage('Name')
  const nickName_label = intl.get('customer_nickName').defaultMessage('NickName')
  const gender_label = intl.get('customer_gender').defaultMessage('Gender')
  const male_label = intl.get('male').defaultMessage('Male')
  const female_label = intl.get('female').defaultMessage('Female')
  const age_label = intl.get('customer_age').defaultMessage('Age')
  const phone_label = intl.get('customer_phone').defaultMessage('Phone')
  const email_label = intl.get('customer_email').defaultMessage('E-mail')
  const address_label = intl.get('customer_address').defaultMessage('Address')

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label={name_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: intl.get('customer_name_required_msg').defaultMessage('name is required'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={nickName_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('nickName', {
            initialValue: item.nickName,
            rules: [
              {
                required: true,
                message: intl.get('customer_nickName_required_msg').defaultMessage('nickName is required'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={gender_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('isMale', {
            initialValue: item.isMale,
            rules: [
              {
                required: true,
                type: 'boolean',
                message: intl.get('customer_gender_required_msg').defaultMessage('gender is required'),
              },
            ],
          })(
            <Radio.Group>
              <Radio value>{male_label}</Radio>
              <Radio value={false}>{female_label}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label={age_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('age', {
            initialValue: item.age,
            rules: [
              {
                required: true,
                type: 'number',
                message: intl.get('customer_age_required_msg').defaultMessage('age is required'),
              },
            ],
          })(<InputNumber min={18} max={100} />)}
        </FormItem>
        <FormItem label={phone_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('phone', {
            initialValue: item.phone,
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: intl.get('phone_validate_msg').defaultMessage('The input is not valid phone!'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={email_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              {
                required: true,
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: intl.get('email_validate_msg').defaultMessage('The input is not valid E-mail!'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={address_label} hasFeedback {...formItemLayout}>
          {getFieldDecorator('address', {
            initialValue: item.address && item.address.split(' '),
            rules: [
              {
                required: true,
                message: intl.get('customer_address_required_msg').defaultMessage('address is required'),
              },
            ],
          })(<Cascader
            size="large"
            style={{ width: '100%' }}
            options={city}
            placeholder="Pick an address"
          />)}
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
