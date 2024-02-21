import React, { useContext } from "react";
import image from "../images/person.png";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Formik, Field } from "formik";
import FormBootstrap from "react-bootstrap/Form";
import * as yup from "yup";
import axios from "axios";
import InputGroup from "react-bootstrap/InputGroup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/authContext";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const SignupPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t("signupForm.validation.username"))
      .required(t("signupForm.validation.missField"))
      .max(20, "signupForm.validation.username"),
    password: yup
      .string()
      .required(t("signupForm.validation.missField"))
      .min(6, t("signupForm.validation.password")),
    confirmPassword: yup
      .string()
      .required(t("signupForm.validation.missField"))
      .test(
        "same-password",
        t("signupForm.validation.confirmPassword"),
        (value, context) => {
          return value === context.parent.password;
        },
      ),
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
            <img src={image} alt={t("image.registration")}></img>
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
                    t("signupForm.validation.userAlreadyExists"),
                  );
                }
              }
            }}
          >
            {({ errors, touched, values, handleChange }) => (
              <Form className="signup-form-container">
                <h1>{t("signupForm.registration")}</h1>
                <div className="username input">
                  <label htmlFor="username"></label>
                  <Field
                    id="username"
                    name="username"
                    placeholder={t("signupForm.username")}
                    required
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
                    placeholder={t("signupForm.password")}
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
                    placeholder={t("signupForm.confirmPassword")}
                    type="password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="error">{errors.confirmPassword}</div>
                  )}
                  {/* <FormBootstrap.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <FormBootstrap.Label>Email address</FormBootstrap.Label>
                    <InputGroup hasValidation>
                      <FormBootstrap.Control
                        name="username"
                        placeholder="name@example.com"
                        value={values.username}
                        isValid={touched.username && !errors.username}
                        isInvalid={!!errors.username}
                        onChange={handleChange}
                      />
                      <FormBootstrap.Control.Feedback type="invalid" tooltip>
                        {errors.username}
                      </FormBootstrap.Control.Feedback>
                    </InputGroup>
                  </FormBootstrap.Group> */}
                </div>
                <div></div>
                <button className="buttonSub" type="submit">
                  {t("signupForm.register")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
