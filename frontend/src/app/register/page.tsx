"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-gray-700">
        <h1 className="text-xl font-semibold text-center mb-6">Registration</h1>

        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
          validationSchema={Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string()
              .required("Password is required")
              .min(8, "At least 8 characters")
              .matches(/[A-Z]/, "One uppercase required")
              .matches(/[a-z]/, "One lowercase required")
              .matches(/[0-9]/, "One number required")
              .matches(/[^a-zA-Z0-9]/, "One special character required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
                values,
                { withCredentials: true }
              );
              window.location.href = "/profile";
            } catch (err) {
              console.error(err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  name="firstName"
                  placeholder="First name"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="lastName"
                  placeholder="Last name"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="email"
                  type="email"
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
                {isSubmitting ? "Registering..." : "Continue →"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
