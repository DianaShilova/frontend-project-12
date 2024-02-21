import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import image from "../images/person.png";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

export const LoginPage = () => {
  const schema = yup.object().shape({
    username: yup.string().required("Отсутствует имя"),
    password: yup.string().required("Отсутствует пароль"),
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
              <button onClick={authContext.logout}>Выйти</button>
            </div>
          </nav>
        </header>
        <div className="card-shadow">
          <div className="card-body">
            <div className="img">
              <img src={image} alt="Войти"></img>
            </div>
            <div>
              <h1 className="text-center mb-4">Войти</h1>
              <Formik
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
                {({ errors, touched, isValidating }) => (
                  <Form>
                    <div className="username">
                      <label htmlFor="username"></label>
                      <Field
                        id="username"
                        name="username"
                        placeholder="Ваш ник"
                      />
                      {errors.username && touched.username && (
                        <div className="error">{errors.username}</div>
                      )}
                    </div>
                    <div className="password">
                      <label htmlFor="password"></label>
                      <Field
                        id="password"
                        name="password"
                        placeholder="Пароль"
                      />
                      {errors.password && touched.password && (
                        <div className="error">{errors.password}</div>
                      )}
                    </div>
                    <div></div>
                    <button className="buttonSub" type="submit">
                      Войти
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="card footer">
            <div className="registration">
              <span>Нет аккаунта?</span>
              <a href="/signup">Регистрация</a>
            </div>
          </div>
        </div>
      </>
    );
};
