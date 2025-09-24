"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register = () => {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <Formik
        initialValues={{ email: "", password: "", firstName: "", lastName: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
          password: Yup.string().min(8).required(),
          firstName: Yup.string().required(),
          lastName: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, values, {
              withCredentials: true, // important for cookies
            });
            window.location.href = "/profile";
          } catch (err) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <Form className="flex flex-col gap-2">
          <Field name="email" placeholder="Email" className="border p-2" />
          <ErrorMessage name="email" />
          <Field name="password" type="password" placeholder="Password" className="border p-2" />
          <ErrorMessage name="password" />
          <Field name="firstName" placeholder="First name" className="border p-2" />
          <ErrorMessage name="firstName" />
          <Field name="lastName" placeholder="Last name" className="border p-2" />
          <ErrorMessage name="lastName" />
          <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
