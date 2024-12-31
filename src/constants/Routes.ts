import HomeView from "@/pages/Home/HomeView";
import LoginView from "@/pages/Login/LoginView";
import ProductsView from "@/pages/Products/ProductsView";
import { FC } from "react";


export const routes: MappedAuthRouteType[] = [
    {
        path: "/",
        element: HomeView,
        allowedRoles: ["admin"],
        isUsedLayout: true
    }, {
        path: "/products",
        element: ProductsView,
        allowedRoles: ["admin"],
        isUsedLayout: true
    }
];


export const MappedAuthRoute: MappedAuthRouteType[] = [
    {
        path: "/login",
        element: LoginView,
        allowedRoles: ["guest"],
        isUsedLayout: true
    },

]

export interface MappedAuthRouteType {
    path: string;
    element: () => JSX.Element | FC<{}> | any;
    allowedRoles: string[];
    isUsedLayout: boolean;
}

