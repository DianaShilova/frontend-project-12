import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import useData from '../hooks/useData';
import ChannelModal from '../components/ChannelModal';
import ChannelOption from '../components/channelOption';
import DeletingChannelModal from '../components/DeletingChannelModal';
import { AuthContext } from '../contexts/authContext';

import './home.css';

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const [input, setInput] = useState('');
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
      return t('message.numeral.manyCase');
    }
    if (messagesQuantity > 4 && messagesQuantity < 21) {
      return t('message.numeral.manyCase');
    } if (lastNumber === 1) {
      return t('message.numeral.nominativeCase');
    } if (lastNumber > 1 && lastNumber < 5) {
      return t('message.numeral.genitiveCase');
    } return t('message.numeral.manyCase');
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedChannel(id);
    setIsOpenModalDelete(true);
  };

  const handleOpenEditModal = (selectedChannel) => {
    setSelectedChannel(selectedChannel);
    setIsOpenModal(true);
  };

  const handleCloseChannelModal = () => {
    setIsOpenModal(false);
  };

  const renderChannels = () => channels.ids.map((id) => (
    <li key={id}>
      <div
        className={
              currentChannelId === id ? 'group-channel active' : 'group-channel'
            }
      >
        <button
          className={
                currentChannelId === id
                  ? 'w-100 rounded-0 text-start text-truncate btn btn-secondary'
                  : 'channels-button'
              }
          name={channels.entities[id].name}
          onClick={() => handleSetChannel(id)}
          id={channels.entities[id].name}
          type="button"
        >
          <span className="me-1">#</span>
          {channels.entities[id].name}
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
  ));

  const handleDeleteChannel = async () => {
    try {
      await deleteChannel(selectedChannel);
      toast.success(t('delete'));
    } catch {
      console.log('error');
    } finally {
      setSelectedChannel(null);
    }
  };

  const renderMessages = () => filtered.map((message) => (
    <div key={message.id}>
      <b>{message.name}</b>
      :
      {message.text}
    </div>
  ));

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(filter.clean(input));
      setInput('');
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSubmitChannel = async (values) => {
    try {
      if (!selectedChannel) {
        const { data } = await sendChannel(filter.clean(values.channelName));
        handleSetChannel(data.id);
        toast.success(t('add'));
      } else {
        await renameChannel(selectedChannel, filter.clean(values.channelName));
        toast.success(t('rename'));
      }
      handleCloseChannelModal();
      setSelectedChannel(null);
    } catch (e) {
      console.log('error:', e);
    }
  };

  const handleAddChannel = () => {
    setIsOpenModal(true);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenModalDelete(false);
  };

  if (!authContext.isAuthenticated) {
    return <Navigate to="/login" />;
  } return (
    <>
      <header>
        <nav>
          <div className="navbarcontainer">
            <a className="nav-login" href="/login">
              Hexlet Chat
            </a>
            <button type="button" onClick={authContext.logout}>{t('nav.exit')}</button>
          </div>
        </nav>
      </header>
      <main className="chat-body">
        <div className="body-container shadow">
          <section className="channels-container">
            <header className="channels-header">
              <b>{t('channelsContainer.channel')}</b>
              <button type="button" className="channels-add" onClick={handleAddChannel}>
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
                #
                {' '}
                {channels.entities[currentChannelId]
                    && channels.entities[currentChannelId].name}
                <br />
                {' '}
                {messagesQuantity}
                {' '}
                {wordMessage(messagesQuantity)}
              </span>
            </div>
            <div className="messages-content">
              {messages ? renderMessages() : <span>Loading</span>}
            </div>
            <form className="messages-form" onSubmit={handleSubmitMessage}>
              <div className="messages-input-wrapper">
                <input
                  className="messages-input"
                  aria-label="Новое сообщение"
                  placeholder={t('message.messagesPlaceholder')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                />
                <button aria-label="message-send" type="button" className="messages-send" />
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
    </>
  );
};

export default HomePage;
