import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { useSelector } from "react-redux";
import "./home.css";

export function HomePage() {
  const authContext = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  console.log(isSending);

  const { sendMessage } = useData();

  const channels = useSelector((store) => store.channels);
  const messages = useSelector((store) => store.messages);
  const messagesQuantity = messages.ids.length;

  const renderChannels = () => {
    return channels.ids.map((id) => {
      const channel = channels.entities[id];
      return (
        <li key={id}>
          <button className="channels-button">
            # {channels.entities[id].name}
          </button>
        </li>
      );
    });
  };

  const renderMessages = () => {
    return messages.ids.map((id) => {
      const message = messages.entities[id];
      return (
        <div key={message.id}>
          <b>{message.name}</b>: {message.text}
        </div>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const result = await sendMessage(input);
      console.log(result);
      setIsSending(false);
      setInput("");
    } catch (e) {
      console.log("error", e);
    }
  };

  if (!authContext.isAuthenticated) {
    return <Navigate to="/login" />;
  } else
    return (
      <>
        <header>
          <nav className="navbar">
            <div className="navbarcontainer">
              <a>DISH Chat</a>
              <button onClick={authContext.logout}>Выйти</button>
            </div>
          </nav>
        </header>
        <main className="chat-body">
          <div className="body-container shadow">
            <section className="channels-container">
              <header className="channels-header">
                <b>Каналы</b>
                <button className="channels-add">+</button>
              </header>
              <div>
                {channels ? (
                  <ul className="channels-list">{renderChannels()}</ul>
                ) : (
                  <span>Loading</span>
                )}
              </div>
            </section>
            <section className="messages-container">
              <div className="messages-header">
                <span>
                  # general <br /> {messagesQuantity} сообщений
                </span>
              </div>
              <div className="messages-content">
                <div className="text-break">
                  {messages ? renderMessages() : <span>Loading</span>}
                </div>
              </div>
              <form className="messages-form" onSubmit={handleSubmit}>
                <div className="messages-input-wrapper">
                  <input
                    className="messages-input"
                    placeholder="Введите сообщение..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                  />
                  <button className="messages-send">
                    {isSending ? "Sending" : "Send"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </>
    );
}
