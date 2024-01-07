import { useContext, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addChannels } from "../slices/channelsSlice.js";
import { addMessages } from "../slices/messagesSlice.js";
import { addMessage } from "../slices/messagesSlice.js";
import { io } from "socket.io-client";
import { AuthContext } from "../contexts/authContext.jsx";

export const useData = () => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);

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
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));
    });
  }, []);

  const sendMessage = async (value) => {
    return new Promise((resolve) => {
      socket.emit(
        "newMessage",
        {
          text: value,
          name: authContext.username,
        },
        () => {
          resolve();
        },
      );
    });
  };
  return { sendMessage };
};
