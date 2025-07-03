import * as React from "react";
import { AppBar, Layout as RaLayout, LayoutProps } from "react-admin";
import CustomMenu from "./CustomMenu";

const Layout: React.FC<LayoutProps> = (props) => {
    return (
        <RaLayout {...props}  menu={CustomMenu}>
            {props.children}
        </RaLayout>
    );
};

export default Layout;
