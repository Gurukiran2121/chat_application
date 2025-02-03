import React from "react";
import { Button, Form, Input, Layout, Flex, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import style from "./signup.module.scss";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../appContext/AppContext";

const SignUp: React.FC = () => {
  const { signUp } = useAppContext();

  return (
    <Layout className={style["signup-page-main-container"]}>
      <Layout.Content>
        <Flex align="center" justify="center" className={style["signup-box"]}>
          <Card>
            <Form
              className={style["signup-form"]}
              name="login"
              initialValues={{
                remember: true,
              }}
              onFinish={signUp}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
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
              {/* <Form.Item>
             <Flex justify="space-between" align="center">
               <Form.Item name="remember" valuePropName="checked" noStyle>
                 <Checkbox>Remember me</Checkbox>
               </Form.Item>
               <a href="">Forgot password</a>
             </Flex>
           </Form.Item> */}

              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Sign up
                </Button>
                or <NavLink to={"/login"}>Log in!</NavLink>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Layout.Content>
    </Layout>
  );
};

export default SignUp;
