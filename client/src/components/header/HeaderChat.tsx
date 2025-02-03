import { Avatar, Dropdown, Flex, Skeleton, Typography, MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { useAppContext } from "../../appContext/AppContext";
import style from "./header.module.scss";
import { useParams } from "react-router-dom";

const HeaderChat: React.FC = () => {
  const { logOut, user, strangers, isLoadingUsers } = useAppContext();
  const userId = useParams();

  const items: MenuProps["items"] = [
    {
      label: (
        <Flex vertical gap={6}>
          <Avatar size="default" icon={<UserOutlined />} />
          <Typography.Text>{user?.name}</Typography.Text>
          <Typography.Text type="secondary">{user?.email}</Typography.Text>
        </Flex>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Flex role="button" onClick={logOut}>
          LogOut
        </Flex>
      ),
      key: "1",
    },
  ];

  return (
    <Flex
      align="center"
      justify="space-between"
      className={style["main-chat-header"]}
    >
      <Flex align="center">
        {isLoadingUsers ? (
          <Skeleton.Input style={{ display: "flex" }} />
        ) : (
          <>
            {strangers &&
              (strangers as { _id: string; name: string }[]).map(
                (user: { _id: string; name: string }) => {
                  if (user._id === userId.id) {
                    return (
                      <>
                        <Typography.Title level={3}>
                          {user.name}
                        </Typography.Title>
                      </>
                    );
                  }
                }
              )}
          </>
        )}
      </Flex>
      <Flex justify="center" align="center">
        <Dropdown trigger={["click"]} menu={{ items }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default HeaderChat;
