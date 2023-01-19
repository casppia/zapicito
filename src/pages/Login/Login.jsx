import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import BarberFig from "../../assets/barber.svg";
import Logo from "../../assets/logo.png";
import "./Login.scss";

export const LoginPage = () => {
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
          <img className="login-logo" src={Logo} alt="logo" />
          <hr />
          <h1>Welcome back!</h1>
          <p>Please write your credentials</p>
          <Form.Item name="username">
            <Input
              name="username"
              prefix={<UserOutlined style={{color: "#00000073"}} className="site-form-item-icon" />}
              placeholder="Username"
              
            ></Input>
          </Form.Item>
          <Form.Item  name="password">
            <Input.Password
              name="password"
              placeholder="Password"
              prefix={<LockOutlined style={{color: "#00000073"}} className="site-form-item-icon" />}
            ></Input.Password>
          </Form.Item>
          <Form.Item className="ant-custom-remember">
            <Form.Item name="remember" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 23 }}>
            <Button block type="primary" htmlType="submit">
              Log In
            </Button>
          </Form.Item>
          <div className="login-signup">
            Don't have an account? <Link to={"/signup"}>Sign up for free</Link>
          </div>
        </div>
        <div className="login-right">
          <img src={BarberFig} alt="barber-fig" />
        </div>
      </Form>
    </div>
  );
};
