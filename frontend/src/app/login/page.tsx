"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-gray-700">
        <h1 className="text-xl font-semibold text-center mb-6">Welcome back!</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
                values,
                { withCredentials: true }
              );
              window.location.href = "/profile";
            } catch {
              setErrors({ email: "Invalid email or password" });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  name="email"
                  type="text"
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Logging in..." : "Log in →"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
