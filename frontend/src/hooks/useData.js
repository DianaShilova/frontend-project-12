import { useContext, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addChannels,
  addChannel,
  setChannel,
  removeChannel,
  updateChannel,
} from "../slices/channelsSlice.js";
import { addMessages, removeMessages } from "../slices/messagesSlice.js";
import { addMessage } from "../slices/messagesSlice.js";
import { io } from "socket.io-client";
import { AuthContext } from "../contexts/authContext.jsx";
import { useNavigate } from "react-router-dom";

// const serverUrl = process.env.REACT_APP_SERVER_URL;

export const useData = () => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const channelId = useSelector((store) => store.channels.currentChannelId);
  const navigate = useNavigate();
  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  useEffect(() => {
    const channelsRequest = axios.get("/api/v1/channels", { headers });
    const messagesRequest = axios.get("/api/v1/messages", { headers });

    Promise.all([channelsRequest, messagesRequest])
      .then(([channelsData, messagesData]) => {
        dispatch(addChannels(channelsData.data));
        dispatch(addMessages(messagesData.data));
      })
      .catch((error) => {
        if (error.statusCode === 401) {
          navigate("/login");
        }
      });
  }, []);

  const socket = useMemo(() => {
    if (authContext.isAuthenticated) {
      return io();
    }
    return null;
  }, [authContext.isAuthenticated]);

  useEffect(() => {
    if (!socket) {
      return navigate("/login");
    }
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };
    socket.on("newMessage", handleNewMessage);

    const handleNewChannel = (channel) => {
      dispatch(addChannel(channel));
    };
    socket.on("newChannel", handleNewChannel);

    const handleRemoveChannel = (channel) => {
      dispatch(removeChannel(channel.id));
      handleSetChannel("1");
      dispatch(removeMessages(channel.id));
    };
    socket.on("removeChannel", handleRemoveChannel);

    const handleEditChannel = ({ id, name }) => {
      dispatch(updateChannel({ id, name }));
    };
    socket.on("renameChannel", handleEditChannel);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newChannel", handleNewChannel);
      socket.off("removeChannel", handleRemoveChannel);
      socket.off("renameChannel", handleEditChannel);
    };
  }, [socket]);

  const handleSetChannel = (id) => {
    dispatch(setChannel(id));
  };

  const sendMessage = async (value) => {
    return axios.post(
      "/api/v1/messages",
      {
        text: value,
        name: authContext.username,
        channelId,
      },
      { headers },
    );
  };

  const sendChannel = async (channelName) => {
    return axios.post(
      "/api/v1/channels",
      {
        name: channelName,
      },
      { headers },
    );
  };

  const deleteChannel = async (id) => {
    return axios.delete(`/api/v1/channels/${id}`, { headers });
  };

  const renameChannel = async (id, name) => {
    return axios.patch(
      `/api/v1/channels/${id}`,
      {
        id,
        name,
      },
      { headers },
    );
  };

  return {
    sendMessage,
    sendChannel,
    handleSetChannel,
    deleteChannel,
    renameChannel,
  };
};
