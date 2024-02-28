import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import image from "../images/person.png";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormBootstrap from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export const LoginPage = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    username: yup.string().required(t("loginForm.validationLogin.empty")),
    password: yup.string().required(t("loginForm.validationLogin.empty")),
  });

  const authContext = useContext(AuthContext);

  if (authContext.isAuthenticated) {
    return <Navigate to="/" />;
  } else
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
        <div className="sign in">
          <div className="signin-container signin">
            <div className="card-body">
              <div className="signup-image-container">
                <img src={image} alt={t(image.login)}></img>
              </div>

              <Formik
                className="signin-form-container"
                initialValues={{
                  username: "",
                  password: "",
                }}
                validationSchema={schema}
                onSubmit={async (values, formikBag) => {
                  try {
                    await authContext.login(values);
                  } catch (error) {
                    formikBag.setFieldError("password", error.message);
                  }
                }}
              >
                {({ errors, touched, handleChange, values }) => (
                  <Form className="signup-form-container">
                    <h1 className="text-center mb-4">{t("loginForm.enter")}</h1>
                    <FormBootstrap.Group
                      className="username input mb-3"
                      controlId="username"
                    >
                      <InputGroup hasValidation>
                        <FormBootstrap.Control
                          name="username"
                          placeholder={t("loginForm.nickname")}
                          value={values.username}
                          isValid={touched.username && !errors.username}
                          isInvalid={!!errors.username}
                          onChange={handleChange}
                        />
                        <FormBootstrap.Control.Feedback type="invalid" tooltip>
                          {errors.username}
                        </FormBootstrap.Control.Feedback>
                      </InputGroup>
                    </FormBootstrap.Group>
                    <FormBootstrap.Group
                      className="password input mb-3"
                      controlId="password"
                    >
                      <InputGroup hasValidation>
                        <FormBootstrap.Control
                          name="password"
                          placeholder={t("loginForm.password")}
                          value={values.password}
                          isValid={touched.password && !errors.password}
                          isInvalid={!!errors.password}
                          onChange={handleChange}
                          type="password"
                        />
                        <FormBootstrap.Control.Feedback type="invalid" tooltip>
                          {errors.password}
                        </FormBootstrap.Control.Feedback>
                      </InputGroup>
                    </FormBootstrap.Group>
                    <button className="buttonSign" type="submit">
                      {t("loginForm.enter")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer">
              <div className="registration">
                <span>
                  {t("footer.haveNotAccount")}
                  <a href="/signup">{t("footer.registration")}</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};
