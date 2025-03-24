// rafce
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import History from '../pages/user/History'
import Checkout from '../pages/Checkout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Layout from '../layouts/Layout'
import LayoutAdmin from '../layouts/LayoutAdmin'
import Dashboard from '../pages/admin/Dashboard'
import Product from '../pages/admin/Product'
import Category from '../pages/admin/Category'
import Manage from '../pages/admin/Manage'
import LayoutUser from '../layouts/LayoutUser'
import HomeUser from '../pages/user/HomeUser'
import ProtectRouteUser from './ProtectRouteUser'
import ProtectRouteAdmin from './ProtectRouteAdmin'
import EditProduct from '../pages/admin/EditProduct'
import Payment from '../pages/user/Payment'
import ManageOrders from '../pages/admin/ManageOrders'
import Profile from '../pages/user/Profile' // ✅ เพิ่ม import Profile
import { OrderDetail } from '../components/admin/OrderDetail';
import OrderDetailuser from '../pages/user/OrderDetailuser';  // แก้เป็นเส้นทางใหม่
import Shipping from '../pages/user/shipping';
import ContactUs from '../pages/ContactUs'; // นำเข้าหน้า ContactUs
import ProductDetail from "../pages/ProductDetail"; // ✅ นำเข้า ProductDetail
import RedirectHandler from "../pages/RedirectHandler.jsx";

 // ใช้เส้นทางนี้แทน
 // ✅ เพิ่ม import สำหรับ OrderDetailUser


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'shop', element: <Shop /> },
            { path: 'cart', element: <Cart /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'contact-us', element: <ContactUs /> }, // เพิ่มเส้นทางสำหรับ Contact Us
            { path: 'product/:id',element: <ProductDetail />},
            { path: 'redirect', element: <RedirectHandler /> }, // ✅ ต้องใช้ "redirect" ให้ตรงกับ URL


        ]
    },
    {
        path: '/admin',
        element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
        children: [
            { index: true, element: <Dashboard /> }, // หน้า Dashboard สำหรับ Admin
            { path: 'category', element: <Category /> },
            { path: 'product', element: <Product /> },
            { path: 'product/:id', element: <EditProduct /> },
            { path: 'manage', element: <Manage /> },
            { path: 'orders', element: <ManageOrders /> },
            { path: 'orders/:orderId', element: <OrderDetail /> },
            { path: 'orders/:orderId', element: <Dashboard /> }, // ✅ ถูกต้อง


        ]
    },
    {
        path: '/user',
        // element: <LayoutUser />,
        element: <ProtectRouteUser element={<LayoutUser />} />,
        children: [
            { index: true, element: <HomeUser /> },
            { path: 'payment', element: <Payment /> },
            { path: 'history', element: <History /> },
            { path: 'profile', element: <Profile /> },
            { path: 'order-details', element: <OrderDetailuser /> }, // ใช้ OrderDetailuser สำหรับ User  // เพิ่มเส้นทางนี้สำหรับแสดง Order Detail ของ User
            { path: 'shipping', element: <Shipping /> },
        ]
    }

])



const AppRoutes = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRoutes