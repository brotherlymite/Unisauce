import React from "react";
import { Box, Text } from "rebass/styled-components";

import Header from "../../components/Header";
import UniSauce from "./components/UniSauce";


type Props = {};

const Home = (props: Props) => {
  return (
    <>
      <Header />
      <UniSauce />
    </>
  );
};

export default Home;
