import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchSuccess, like, dislike } from "../redux/videoSlice.js";
import { subscription } from "../redux/userSlice.js";
import { format } from "timeago.js";
import axios from "axios";
import Recommended from "../components/Recommended.jsx";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.softColor};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const ChannelDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.div`
  font-weight: 500;
`;

const ChannelCounter = styled.div`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.div`
  font-size: 14px;
`;

const SubButton = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        console.log(videoRes);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    if (!currentUser) return;
    await axios.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };
  const handleDislike = async () => {
    if (!currentUser) return;
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };
  const handleSubscribe = async () => {
    if (!currentUser) return;
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/users/unsubscribe/${channel._id}`)
      : await axios.put(`/users/subscribe/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  return (
    <Container>
      <Content>
        {error}
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoURL} controls />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views} views ~ {format(currentVideo?.createdAt)}
          </Info>
          {currentUser && (
            <Buttons>
              <Button onClick={handleLike}>
                {currentVideo?.likes?.includes(currentUser._id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )}
                {currentVideo?.likes?.length}
              </Button>
              <Button onClick={handleDislike}>
                {currentVideo?.dislikes?.includes(currentUser._id) ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOffAltOutlinedIcon />
                )}
                {currentVideo?.dislikes?.length}
              </Button>
              <Button>
                <ReplyOutlinedIcon />
                Share
              </Button>
              <Button>
                <AddTaskOutlinedIcon />
                Save
              </Button>
            </Buttons>
          )}
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel?.image} />
            <ChannelDetails>
              <ChannelName>{channel?.name}</ChannelName>
              <ChannelCounter>
                {channel?.subscribers} subscribers
              </ChannelCounter>
              <Description>{currentVideo?.description}</Description>
            </ChannelDetails>
          </ChannelInfo>
          {currentUser && (
            <SubButton onClick={handleSubscribe}>
              {currentUser.subscribedUsers.includes(channel._id)
                ? "SUBSCRIBED"
                : "SUBSCRIBE"}
            </SubButton>
          )}
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommended tags={currentVideo.tags} />
    </Container>
  );
};

export default Video;
