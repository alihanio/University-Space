import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@gmail\.com$/, "Email must be a valid Gmail address")
    .required("Email is required"),

  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const SignUpValidate = Yup.object().shape({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@gmail\.com$/, "Email must be a valid Gmail address")
    .required("Email is required"),

  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const AddEventValidate = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),

  date: Yup.string().required("Date is required"),
});

export { schema, SignUpValidate, AddEventValidate };
