import React from "react";
import { Button, Card, Flex, Form, Input, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import style from "./login.module.scss";
import { useAppContext } from "../../appContext/AppContext";

const LogIn: React.FC = () => {

  const { login } = useAppContext();

  return (
    <Layout className={style["login-form-main-container"]}>
      <Layout.Content>
        <Flex align="center" justify="center" className={style["login-box"]}>
          <Card>
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              style={{
                maxWidth: 360,
              }}
              onFinish={login}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
                or <NavLink to={"/signup"}>Register now!</NavLink>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Layout.Content>
    </Layout>
  );
};

export default LogIn;
