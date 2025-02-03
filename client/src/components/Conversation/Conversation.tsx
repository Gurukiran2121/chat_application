import { Avatar, Card, Flex, Input, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import style from "./Conversation.module.scss";
import { SendOutlined } from "@ant-design/icons";
import { useAppContext } from "../../appContext/AppContext";

const Conversation: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const {
    user,
    postMessage,
    conversation,
    getConversation,
    selectedUserId,
    getRealTimeMessage,
    stopRealTimeMessage,
    isLoadingConversation,
  } = useAppContext();

  const handleMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userMessage = event.target.value;
    setMessage(userMessage);
  };

  useEffect(() => {
    getConversation(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    getRealTimeMessage();

    return () => {
      stopRealTimeMessage();
    };
  }, [conversation]);

  const handlePostMessage = () => {
    postMessage(
      {
        message: message,
      },
      selectedUserId
    );
    setMessage("");
  };

  useEffect(() => {
    // Smooth scroll to bottom when new messages arrive
    if (lastMessageRef.current) {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [conversation]);

  if (isLoadingConversation || !user) {
    return (
      <Spin spinning={true} tip="Loading messages...">
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "calc(100dvh - 64px)",
          }}
        />
      </Spin>
    );
  }

  return (
    <Flex className={style["Conversation-main-container"]}>
      <Flex
        vertical
        justify="space-between"
        className={style["Conversation-box"]}
      >
        <Flex className={style["chats"]} vertical gap={8}>
          {conversation &&
            Array.isArray(conversation) &&
            conversation.length > 0 &&
            (conversation as { message: string; senderID: string }[]).map(
              ({ message, senderID }, index) => (
                <Flex
                  align="center"
                  gap={8}
                  key={senderID}
                  justify={senderID === user?._id ? "end" : "start"}
                  ref={
                    index === conversation.length - 1 ? lastMessageRef : null
                  }
                >
                  {senderID !== user?._id && <Avatar />}{" "}
                  <Card
                    size="small"
                    className={
                      senderID === user?._id
                        ? style["message-sent"]
                        : style["message-received"]
                    }
                  >
                    {message}
                  </Card>
                  {senderID === user?._id && <Avatar />}{" "}
                </Flex>
              )
            )}
        </Flex>

        <Flex className={style["footer"]}>
          <Card className={style["input-box"]} size="small">
            <Flex gap={12}>
              <Input
                variant="borderless"
                placeholder="send message"
                onChange={handleMessage}
                value={message}
                onPressEnter={handlePostMessage}
              />
              <Flex align="center" onClick={handlePostMessage}>
                <SendOutlined
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#d9d9d9",
                  }}
                />
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Conversation;
