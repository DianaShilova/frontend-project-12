import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Formik, Field } from "formik";
import { useSelector } from "react-redux";

export const ChannelModal = (props) => {
  const { isOpen, onClose, onSubmit } = props;
  const channels = useSelector((store) => store.channels.entities);

  const validate = (values) => {
    const errors = {};

    const channelsArr = Object.values(channels);
    const existingChannel = channelsArr.find(
      (ch) => ch.name === values.channelName,
    );

    if (existingChannel) {
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
            channelName: "",
          }}
          validate={validate}
        >
          {({ handleChange, handleBlur, values, errors }) => (
            <form onSubmit={handleSubmit(values)}>
              <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Field
                  onChange={handleChange}
                  value={values.channelName}
                  onBlur={handleBlur}
                  name="channelName"
                />
                {errors.name && <div>{errors.name}</div>}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={errors.name ? true : false}
                  variant="primary"
                >
                  Save changes
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
