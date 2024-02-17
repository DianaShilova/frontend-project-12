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

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const useData = () => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const channelId = useSelector((store) => store.channels.currentChannelId);
  const storemessages = useSelector((store) => store.messages.entities);

  useEffect(() => {
    axios
      .get("/api/v1/data", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        dispatch(addChannels(response.data.channels));
        dispatch(addMessages(response.data.messages));
      });
  }, []);
  const socket = useMemo(() => io(serverUrl), []);

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };
    socket.on("newMessage", handleNewMessage);

    const handleNewChannel = (channel) => {
      dispatch(addChannel(channel));
      handleSetChannel(channel.id);
    };
    socket.on("newChannel", handleNewChannel);

    const handleRemoveChannel = (channel) => {
      dispatch(removeChannel(channel.id));
      handleSetChannel(1);
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
  }, []);

  const handleSetChannel = (id) => {
    dispatch(setChannel(id));
  };

  const sendMessage = async (value) => {
    return new Promise((resolve) => {
      socket.emit(
        "newMessage",
        {
          text: value,
          name: authContext.username,
          channelId,
        },
        () => {
          resolve();
        },
      );
    });
  };

  const sendChannel = async (channelName) => {
    return new Promise((resolve) => {
      socket.emit(
        "newChannel",
        {
          name: channelName,
        },
        () => {
          resolve();
        },
      );
    });
  };

  const deleteChannel = async (id) => {
    return new Promise((resolve) => {
      socket.emit(
        "removeChannel",
        {
          id,
        },
        () => {
          resolve();
        },
      );
    });
  };

  const renameChannel = async (id, name) => {
    return new Promise((resolve) => {
      socket.emit(
        "renameChannel",
        {
          id,
          name,
        },
        () => {
          resolve();
        },
      );
    });
  };

  return {
    sendMessage,
    sendChannel,
    handleSetChannel,
    deleteChannel,
    renameChannel,
  };
};
