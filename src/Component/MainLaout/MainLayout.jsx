import React from 'react';
import Navbar from '../../Shared/Navbar';
import Container from '../../Shared/Container';
import Footer from '../../Shared/Footer';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
      <Container>
          <div>
           <Navbar></Navbar>
           <Outlet></Outlet>
           <Footer></Footer>
        </div>
      </Container>
    );
};

export default MainLayout;