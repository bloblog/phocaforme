import React, { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Main from "./pages/main.jsx";
import Alarm from "./pages/alarm.jsx";
import Chat from "./pages/chat.jsx";
import Profile from "./pages/profile.jsx";
import Login from "./pages/login.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import ChatRoom from "./pages/chatRoom.jsx";
import PostWrite from "./pages/postWrite.jsx";
import Post from "./pages/post.jsx";
import FloatingActionButtons from "./components/UI/FloatingActionButtons.jsx";
import Guide from "./pages/guide.jsx";
import Modify from "./pages/postModify.jsx";
import DetailPost from "./components/PostList/DetailPost.jsx";
import MainPost from "./components/PostList/MainPost.jsx";

import { Grid, Container } from "@mui/material";
import theme from "./styles/theme.jsx";
import { ThemeProvider } from "@mui/material/styles";

import store from "./store2/index.jsx";
// import './firebase-messaging.js';
import NotificationModal from "./components/UI/Modal/NotificationModal.jsx";

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
          <NavBar />
          <FloatingActionButtons />
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
