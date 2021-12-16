import React from 'react'
import 'antd/dist/antd.css'
import { Form, Input, Button} from 'antd'
const FormItem = Form.Item

class LoginForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export const TaskModel = Form.create({ name: 'login' })(LoginForm)