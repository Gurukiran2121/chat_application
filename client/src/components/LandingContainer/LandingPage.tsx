import { Flex, Typography } from "antd";
import React from "react";
import LandingPageImage from "../../../public/chatIllustration.png";
import style from "./LandingPage.module.scss";

const LandingPage: React.FC = () => {
  return (
    <Flex vertical>
      <Flex
        className={style["landing-page-container"]}
        justify="center"
        vertical
      >
        <Flex
          justify="center"
          className={style["landing-page-image-container"]}
        >
          <img src={LandingPageImage} className={style["landing-page-image"]} />
        </Flex>
      </Flex>
      <Flex justify="center">
        <Typography.Title>Welcome to chat</Typography.Title>
      </Flex>
    </Flex>
  );
};

export default LandingPage;
