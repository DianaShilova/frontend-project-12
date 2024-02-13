import React, { useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Formik, Field } from "formik";
import { useSelector } from "react-redux";

export const ChannelModal = (props) => {
  const { isOpen, onClose, onSubmit, id } = props;
  const channels = useSelector((store) => store.channels.entities);
  const inputEl = useRef(null);
  const channel = useSelector((store) => store.channels.entities[id]);

  useEffect(() => {
    if (isOpen) {
      inputEl.current.focus();
    }
  }, [isOpen]);

  const validate = (values) => {
    const errors = {};

    const channelsArr = Object.values(channels);
    const existingChannel = channelsArr.find(
      (ch) => ch.name === values.channelName,
    );

    if (!channel && existingChannel) {
      errors.name = "Такой канал уже существует";
    }
    if (!values.channelName) {
      errors.name = "Обязательное поле";
    }
    return errors;
  };

  const handleSubmit = (values) => (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="modal show">
      <Modal show={isOpen} onHide={onClose}>
        <Formik
          initialValues={{
            channelName: channel ? channel.name : "",
          }}
          validate={validate}
        >
          {({ handleChange, handleBlur, values, errors }) => (
            <form onSubmit={handleSubmit(values)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {id ? "Переименовать канал" : "Добавить канал"}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Field
                  className="modal-input"
                  innerRef={inputEl}
                  onChange={handleChange}
                  value={values.channelName}
                  onBlur={handleBlur}
                  name="channelName"
                />
                {errors.name && (
                  <div className="error-modal">{errors.name}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Отменить
                </Button>
                <Button
                  type="submit"
                  disabled={errors.name ? true : false}
                  variant="primary"
                >
                  Отправить
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

//1. добавить formik
//2. yup валидация
//3. список каналов для уникальности канала
