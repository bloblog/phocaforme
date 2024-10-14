import React, { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Main from "@/pages/main.jsx";
import Alarm from "@/pages/alarm/page.jsx";
import Chat from "@/pages/chat/page.jsx";
import Profile from "@/pages/mypage/page.jsx";
import Login from "@/pages/login/page.jsx";
import ChatRoom from "@/pages/chat/chatRoom.jsx";
import PostWrite from "@/pages/postwrite/page.jsx";
import Post from "@/pages/post/page.jsx";
import Guide from "@/pages/guide/page.jsx";
import Modify from "@/pages/postmodify/[postId]/page.jsx";

import DetailPost from "@/pages/postdetail/[postId]/page";
import MainPost from "@/containers/postList/MainPost";
import NavBar from "@/containers/navBar/index.jsx";
import FloatingActionButtons from "@/components/FloatingActionButtons.jsx";

import theme from "@/styles/theme.jsx";
import { ThemeProvider } from "@mui/material/styles";

import store from "@/store/index.jsx";
import NotificationModal from "@/components/Modal/NotificationModal.jsx";
// import '@/firebase-messaging.js';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ScrollToTop />
          <FloatingActionButtons />
          <NavBar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="/alarm" element={<Alarm />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatroom/:roomId" element={<ChatRoom />} />
            <Route path="/write" element={<PostWrite />} />
            <Route path="/post" element={<Post />} />
            <Route path="/mainpost" element={<MainPost />} />
            <Route path="/post/:id" element={<DetailPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/help" element={<Guide />} />
            <Route path="/modify/:id" element={<Modify />} />
          </Routes>
          <NotificationModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onNotificationSelect={(value) =>
              console.log("Notification selected: ", value)
            }
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
