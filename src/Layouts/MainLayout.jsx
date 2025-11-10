import React from 'react';
import Navbar from '../pages/Navbar';
import { Outlet } from 'react-router';
import Footer from '../pages/Footer';

const MainLayout = () => {
    return (
        <div>
               <Navbar></Navbar>
               <Outlet></Outlet>
               <Footer></Footer>
        </div>
    );
};

export default MainLayout;