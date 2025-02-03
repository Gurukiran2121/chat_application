import { Avatar, Badge, Flex, Menu, Skeleton, Typography } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./SideMenu.module.scss";
import { useAppContext } from "../../appContext/AppContext";

const SideMenu: React.FC = () => {
  const { id: activeChat } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    allUsers,
    strangers,
    isLoadingUsers,
    setSelectedUserId,
    onlineUsers,
  } = useAppContext();

  useEffect(() => {
    allUsers();
  }, []);

  if (isLoadingUsers) {
    return (
      <Flex vertical gap={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Flex
            key={index}
            gap={8}
            align="center"
            style={{
              padding: "1rem 2rem",
              borderBottom: "1px solid #d9d9d9",
            }}
          >
            <Skeleton.Avatar size="large" active />
            <Skeleton.Input size="small" active />
          </Flex>
        ))}
      </Flex>
    );
  }

  return (
    <Flex vertical className={style["side-menu-container"]}>
      {strangers && (
        <Menu
          mode="inline"
          selectedKeys={activeChat ? [activeChat] : []}
          className={style["menu-container"]}
        >
          {strangers &&
            (strangers as { _id: string; name: string }[]).map(
              (item: { _id: string; name: string }, index: number) => {
                const isOnline = onlineUsers[item._id];

                return (
                  <Menu.Item
                    key={item._id}
                    onClick={() => {
                      setSelectedUserId(item._id);
                      navigate(`/${item._id}`);
                    }}
                    icon={
                      <Badge
                        dot
                        status={isOnline ? "success" : "default"} // Green if online, grey if offline
                        offset={[-5, 35]}
                      >
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                        />
                      </Badge>
                    }
                  >
                    <Flex vertical>
                      <Typography.Text ellipsis strong>
                        {item.name}
                      </Typography.Text>
                      <Typography.Text
                        ellipsis
                        type="secondary"
                        style={{ fontSize: "12px" }}
                      >
                        Ant Design, a design language
                      </Typography.Text>
                      <Typography.Text
                        type={isOnline ? "success" : "secondary"}
                        style={{ fontSize: "12px" }}
                      >
                        {isOnline ? (
                          <Typography.Text
                            style={{ fontSize: "12px" }}
                            type="secondary"
                          >
                            Online
                          </Typography.Text>
                        ) : (
                          <Typography.Text
                            style={{ fontSize: "12px" }}
                            type="secondary"
                          >
                            Offline
                          </Typography.Text>
                        )}
                      </Typography.Text>
                    </Flex>
                  </Menu.Item>
                );
              }
            )}
        </Menu>
      )}
    </Flex>
  );
};

export default SideMenu;
