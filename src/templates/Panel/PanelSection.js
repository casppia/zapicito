import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { admin_menu_items } from "../../sections/menu_items/admin_menu";
// import { user_menu_items } from "../../sections/menu_items/user_menu";
import Logo from "../../components/Logo/Logo";
import PanelHeader from "../Header/PanelHeader";
import { useMode, modes } from "../../ModeContext";
import "./PanelSection.scss";

const { Content, Footer, Sider } = Layout;

export const PanelSection = () => {
  const [, setMode] = useMode();
  const navigate = useNavigate();

  const handleClick = ({ key }) => {
    if (key === "signout") {
      //TODO, sign out feature here
    } else {
      navigate(key);
      setMode(modes.VIEW);
    }
  };

  return (
    <Layout hasSider className="panel">
      <Sider breakpoint="lg" collapsedWidth="0" className="panel-sider">
        <Logo onClick={() => handleClick({ key: "/panel" })} />
        <Menu
          theme="dark"
          mode="inline"
          items={admin_menu_items}
          onClick={(e) => handleClick(e)}
        />
      </Sider>
      <Layout>
        <PanelHeader />
        <Content className="panel-content">
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              textAlign: "center",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Zapicito ©2022
        </Footer>
      </Layout>
    </Layout>
  );
};
