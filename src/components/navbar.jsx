import React from "react";

import { Breadcrumb, Layout, Menu, theme, Switch } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const Navbar = () => {
    const navigate = useNavigate()
  const data = ["Upload", "Generate", "View", "Gallery"];
  const items = new Array(data.length).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: data[index],
  }));

  console.log("test", items);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const handleChange = (key) => {
    const navigateData = items.find((elm) => elm.key === key).label.toLowerCase();
    navigate(`/${navigateData}`)
  };
  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
          onClick={({ key }) => {
            handleChange(key)
            // setItemName(items.find((elm) => elm.key === key).label);
        }}
        //   onClick={(e) => handleChange(e)}
        />
        <div style={{ color: "#fff" }}>
          {" "}
          dark <Switch defaultChecked onChange={onChange} /> light{" "}
        </div>
      </Header>
      <Content
        style={{
          padding: "10px 48px",
          minHeight: "500px",
          
        }}
      >
        <Outlet />
        {/* <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </div> */}
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};
export default Navbar;
