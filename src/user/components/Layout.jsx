import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ChatBotWidget from '../components/ChatBotWidget';


const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatBotWidget />
    </>
  );
};

export default Layout;
