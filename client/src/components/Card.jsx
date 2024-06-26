import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import { useState, useEffect } from "react";
import axios from "axios";

const Container = styled.div`
  width: ${(props) => props.type !== "small" && "360px"};
  margin-bottom: ${(props) => (props.type === "small" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "small" && "flex"};
  gap: 5px;
`;

const Img = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "small" ? "120px" : "202px")};
  background-color: #999;
  border-radius: 5px;
  flex: 1;
`;

const Data = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type === "small" ? "5px" : "16px")};
  gap: 12px;
  flex: 1;
`;

const ChannelImg = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "small" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  console.log(video);
  const [channel, setChannel] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (video.userId) {
          const res = await axios.get(`/users/find/${video.userId}`);
          setChannel(res.data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        {error}
        <Img type={type} src={video.imageURL} />
        <Data type={type}>
          <ChannelImg type={type} src={channel.image} />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel.name}</ChannelName>
            <Info>
              {video.views} views ~ {format(video.createdAt)}
            </Info>
          </Texts>
        </Data>
      </Container>
    </Link>
  );
};

export default Card;
