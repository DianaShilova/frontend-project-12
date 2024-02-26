import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { useSelector } from "react-redux";
import { ChannelModal } from "../components/ChannelModal";
import { ChannelOption } from "../components/channelOption";
import DeletingChannelModal from "../components/DeletingChannelModal";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";

export function HomePage() {
  const authContext = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const { t } = useTranslation();

  const {
    sendMessage,
    sendChannel,
    handleSetChannel,
    deleteChannel,
    renameChannel,
  } = useData();

  const channels = useSelector((store) => store.channels);
  const messages = useSelector((store) => store.messages);
  const currentChannelId = useSelector(
    (store) => store.channels.currentChannelId,
  );

  const filtered = Object.values(messages.entities).filter(
    (message) => message.channelId === currentChannelId,
  );

  const messagesQuantity = filtered.length;

  const wordMessage = (messagesQuantity) => {
    const lastNumber = messagesQuantity % 10;
    if (messagesQuantity === 0) {
      return t("message.numeral.manyCase");
    }
    if (4 < messagesQuantity && messagesQuantity < 21) {
      return t("message.numeral.manyCase");
    } else if (lastNumber === 1) {
      return t("message.numeral.nominativeCase");
    } else if (1 < lastNumber && lastNumber < 5) {
      return t("message.numeral.genitiveCase");
    } else return t("message.numeral.manyCase");
  };

  const renderChannels = () => {
    return channels.ids.map((id) => {
      return (
        <li key={id}>
          <div
            className={
              currentChannelId === id ? "group-channel active" : "group-channel"
            }
          >
            <button
              className="channels-button"
              onClick={() => handleSetChannel(id)}
            >
              # {channels.entities[id].name}
            </button>
            {channels.entities[id].removable && (
              <ChannelOption
                id={id}
                onDelete={() => handleOpenDeleteModal(id)}
                onEdit={() => handleOpenEditModal(id)}
              />
            )}
          </div>
        </li>
      );
    });
  };

  const handleDeleteChannel = async () => {
    try {
      await deleteChannel(selectedChannel);
      toast.success(t("delete"));
    } catch {
      console.log("error");
    } finally {
      setSelectedChannel(null);
    }
  };

  const renderMessages = () => {
    return filtered.map((message) => {
      return (
        <div key={message.id}>
          <b>{message.name}</b>: {message.text}
        </div>
      );
    });
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await sendMessage(input);
      setIsSending(false);
      setInput("");
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSubmitChannel = async (values) => {
    try {
      if (!selectedChannel) {
        await sendChannel(values.channelName);
        toast.success(t("add"));
      } else {
        await renameChannel(selectedChannel, values.channelName);
        toast.success(t("rename"));
      }
      handleCloseChannelModal();
      setSelectedChannel(null);
    } catch (e) {
      console.log("error:", e);
    }
  };

  const handleAddChannel = () => {
    setIsOpenModal(true);
  };

  const handleCloseChannelModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedChannel(id);
    setIsOpenModalDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenModalDelete(false);
  };

  const handleOpenEditModal = (selectedChannel) => {
    setSelectedChannel(selectedChannel);
    setIsOpenModal(true);
  };

  if (!authContext.isAuthenticated) {
    return <Navigate to="/login" />;
  } else
    return (
      <>
        <header>
          <nav>
            <div className="navbarcontainer">
              <a className="nav-login" href="/login">
                DISH Chat
              </a>
              <button onClick={authContext.logout}>{t("nav.exit")}</button>
            </div>
          </nav>
        </header>
        <main className="chat-body">
          <div className="body-container shadow">
            <section className="channels-container">
              <header className="channels-header">
                <b>{t("channelsContainer.channel")}</b>
                <button className="channels-add" onClick={handleAddChannel}>
                  +
                </button>
              </header>
              {channels ? (
                <ul className="channels-list">{renderChannels()}</ul>
              ) : (
                <span>Loading</span>
              )}
            </section>
            <section className="messages-container">
              <div className="messages-header">
                <span>
                  #{" "}
                  {channels.entities[currentChannelId] &&
                    channels.entities[currentChannelId].name}
                  <br /> {messagesQuantity} {wordMessage(messagesQuantity)}
                </span>
              </div>
              <div className="messages-content">
                {messages ? renderMessages() : <span>Loading</span>}
              </div>
              <form className="messages-form" onSubmit={handleSubmitMessage}>
                <div className="messages-input-wrapper">
                  <input
                    className="messages-input"
                    placeholder={t("message.messagesPlaceholder")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                  />
                  <button className="messages-send"></button>
                </div>
              </form>
            </section>
          </div>
        </main>
        <ChannelModal
          onSubmit={handleSubmitChannel}
          isOpen={isOpenModal}
          onClose={handleCloseChannelModal}
          id={selectedChannel}
        />
        <DeletingChannelModal
          onSubmit={handleDeleteChannel}
          isOpen={isOpenModalDelete}
          onClose={handleCloseDeleteModal}
        />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </>
    );
}
