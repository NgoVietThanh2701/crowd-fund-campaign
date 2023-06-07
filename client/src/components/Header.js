import React, { Component } from "react";
import { Menu, Icon, Image, Header } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

function HeaderMenu() {
  const router = useRouter();
  return (
    <Menu style={{ marginBottom: "5px", marginTop: "7px"}} >
      <Menu.Item style={{ padding: "0" }}>
          <Link href="/">
            <Image src="https://www.logodesignteam.com/images/portfolio-images/investment-crowdfunding-logo-design/investment-crowdfunding-logo-design-new5.jpg"  
            size="tiny" />
          </Link>
      </Menu.Item>
      <Menu.Item position="right">
        <Link href="/campaigns/new">
          <a>
            <Icon name="add circle" size="large" />
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  );
}

export default HeaderMenu;
