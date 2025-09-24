/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Login = () => {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email().required("Email is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
              values,
              { withCredentials: true } // cookies for JWT
            );
            window.location.href = "/profile";
          } catch (err: any) {
            console.error(err);
            setErrors({ email: "Invalid email or password" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-2">
            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="border p-2"
            />
            <ErrorMessage name="email" component="div" className="text-red-500" />

            <Field
              name="password"
              type="password"
              placeholder="Password"
              className="border p-2"
            />
            <ErrorMessage name="password" component="div" className="text-red-500" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white p-2 mt-2"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
