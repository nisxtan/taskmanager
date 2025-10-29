const yup = require("yup");

//registration schema
const registerSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Email must be in proper format."),
  password: yup
    .string()
    .min(6, "Password must atleast be of 6 characters")
    .required("Password is required"),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("email must be in proper format"),
  password: yup.string().required("Password is required"),
});

const updateSchema = yup
  .object({
    username: yup.string(),
    email: yup.string().email("Must be a valid email"),
    password: yup.string().min(6, "Password must be at least 6 characters"),
  })
  .noUnknown(true);

module.exports = {
  registerSchema,
  loginSchema,
  updateSchema,
};
