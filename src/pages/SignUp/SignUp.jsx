import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import BarberFig from "../../assets/barber.svg";
import Logo from "../../assets/logo.png";
import "../Login/Login.scss";
import "react-phone-number-input/style.css";

export const SignUp = () => {
  const [value, setValue] = useState();
  return (
    <div className="login">
      <Form
        name="login"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 23 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="vertical"
      >
        <div className="login-left">
          <div>
            <img className="login-logo" src={Logo} alt="logo" />
          </div>
          <hr />
          <h1>Sign up</h1>
          <p>Create an account and get all the benefits</p>
          <Form.Item
            name="email"
            hasFeedback
            rules={[
              {
                type: "email",
                message: "Please insert a valid e-mail",
              },
              { required: true, message: "Please write your email address" },
            ]}
          >
            <Input
              name="email"
              // prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password
              name="password"
              placeholder="Password"
              // prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item>
            <Input.Group>
              <Row gutter={20}>
                <Col span={12}>
                  <Input placeholder="First name" />
                </Col>
                <Col span={12}>
                  <Input placeholder="Last name" />
                </Col>
              </Row>
            </Input.Group>
          </Form.Item>
          <Form.Item name="phone">
            <PhoneInput
              className="phone-input"
              placeholder="Enter phone number"
              value={value}
              onChange={setValue}
            />
          </Form.Item>
          <Form.Item className="ant-custom-remember">
            <Form.Item name="remember" noStyle>
              <Checkbox>
                I agree with <Link>Terms of Service</Link> and{" "}
                <Link>Privacy Policy.</Link>{" "}
              </Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 23 }}>
            <Button block type="primary" htmlType="submit">
              Sign up
            </Button>
          </Form.Item>
          <div className="login-signup">
            Already have an account? <Link to={"/login"}>Log in</Link>
          </div>
        </div>
        <div className="login-right">
          <div className="login-img">
            <img src={BarberFig} alt="barber-fig" />
          </div>
        </div>
      </Form>
    </div>
  );
};
