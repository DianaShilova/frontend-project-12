import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import image from "../images/person.png"

export const LoginPage = () => {
    const schema = yup.object().shape({
        nikname: yup.string().required('Отсутствует имя'),
        password: yup.string().required('Отсутствует пароль'),
    })
    return (
        <div className="card-shadow">
            <div className="card-body">
                <div className="img">
                    <img src={image} alt="Войти"></img>
                </div>
                <div>
                <h1 className="text-center mb-4">Войти</h1>
                <Formik
                    initialValues={{
                    nikname: '',
                    password: '',
                    }}
                    validationSchema={schema}
                    onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                    }}
                >
                    {({ errors, touched, isValidating }) => (
                    <Form>
                        <div className="nikname">
                            <label htmlFor="nikname"></label>
                            <Field id="nikname" name="nikname" placeholder="Ваш ник" />
                            {errors.nikname && touched.nikname && <div className="error">{errors.nikname}</div>}
                        </div>
                        <div className="password">
                            <label htmlFor="password"></label>
                         <Field id="password" name="password" placeholder="Пароль" />
                         {errors.password && touched.password && <div className="error">{errors.password}</div>}
                        </div>
                    <button className="buttonSub" type="submit">Войти</button>
                    </Form>
                    )}
                </Formik>
                </div>
            </div>
            <div className="card footer">

            </div>
        </div>
        
    );
}


