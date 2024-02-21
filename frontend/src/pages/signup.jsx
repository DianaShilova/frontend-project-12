import React, { useContext } from "react";
import image from "../images/person.png";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Formik, Field } from "formik";
import * as yup from "yup";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const SignupPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup
      .string()
      .required("Отсутствует имя")
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов"),
    password: yup
      .string()
      .required("Отсутствует пароль")
      .min(6, "Не менее 6 символов"),
    confirmPassword: yup
      .string()
      .required("Пароли должны совпадать")
      .test("same-password", "Пароли должны совпадать", (value, context) => {
        return value === context.parent.password;
      }),
  });

  return (
    <>
      <header>
        <nav>
          <div className="navbarcontainer">
            <a className="nav-login" href="/login">
              DISH Chat
            </a>
          </div>
        </nav>
      </header>
      <div className="signup">
        <div className="signup-container">
          <div className="signup-image-container">
            <img src={image} alt="регистрация"></img>
          </div>
          <Formik
            initialValues={{
              username: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={schema}
            onSubmit={async (values, formikBag) => {
              try {
                const { data } = await axios.post(
                  `${serverUrl}/api/v1/signup`,
                  values,
                );
                authContext.setToken(data);
                navigate("/");
              } catch (error) {
                if (error.response.status === 409) {
                  formikBag.setFieldError(
                    "username",
                    "Такой пользователь уже существует",
                  );
                }
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="signup-form-container">
                <h1>Регистрация</h1>
                <div className="username input">
                  <label htmlFor="username"></label>
                  <Field
                    id="username"
                    name="username"
                    placeholder="Имя пользователя"
                  />
                  {errors.username && touched.username && (
                    <div className="error">{errors.username}</div>
                  )}
                </div>
                <div className="password input">
                  <label htmlFor="password"></label>
                  <Field
                    id="password"
                    name="password"
                    placeholder="Пароль"
                    type="password"
                  />
                  {errors.password && touched.password && (
                    <div className="error">{errors.password}</div>
                  )}
                </div>
                <div className="confirmPassword input">
                  <label htmlFor="confirmPassword"></label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Подтвердите пароль"
                    type="password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="error">{errors.confirmPassword}</div>
                  )}
                </div>
                <div></div>
                <button className="buttonSub" type="submit">
                  Зарегистрироваться
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
