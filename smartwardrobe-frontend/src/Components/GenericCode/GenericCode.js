import { Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          label: (
            <span className={!item?.key?.includes("submenu") && "Dropdown-Maintext"}>
              {item.label} {!item?.key?.includes("submenu") && <DownOutlined style={{ marginLeft: "8px" }} />}
            </span>
          ),
          key: item.key,
          children: renderMenuItems(item.children), // Recursively render children
        };
      }
      
      // Check if the item has a custom component to render
      return {
        label: item.component ? <item.component /> : item.label,
        key: item.key,
      };
    });
  };

export const GenericDropdownMenu = ({ menuData }) => {
  const menuItems = renderMenuItems(menuData);
  return (
<>
    {/* <div className="header-menus"> */}
      <Menu
        style={{ backgroundColor: "#014d4e", borderBottom: "none", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem", marginLeft: "8px"}}
        mode="horizontal"
        items={menuItems}
        className="custom-menu"
        />
    {/* </div> */}
        </>
  );
};
