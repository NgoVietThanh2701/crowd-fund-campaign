import React from "react";
import Header from "./Header";
import { Container, Image } from "semantic-ui-react";

const Layout = (props) => {

  return (
    <div >
      <Container >
        <Header/>
        {props.children}
      </Container>
    </div>
  );
};


export default Layout;
