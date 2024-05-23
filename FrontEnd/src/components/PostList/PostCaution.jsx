import React from 'react';
import { useNavigate } from 'react-router-dom';

import cautionImg from '../../assets/images/caution.png';

import {
    Button,
    Container,
  } from "@mui/material";

const PostCaution = ({message}) => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
  return (
    <Container id='deleted-post-container'>
      <img id='caution-image' src={cautionImg} width={'100vw'}></img>
      <h2 id='deleted-post-title'>{message}</h2>
      <Button id='go-back-button' onClick={goBack}>뒤로가기</Button>
    </Container>
  );
};

export default PostCaution;
