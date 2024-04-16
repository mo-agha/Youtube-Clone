import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Comment from "./Comment.jsx";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.softColor};
  background: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchComments();
  }, [videoId]);

  return (
    <Container>
      {error}
      {currentUser && (
        <NewComment>
          <Avatar src={currentUser.image} />
          <Input placeholder="Add a Comment..." />
        </NewComment>
      )}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
