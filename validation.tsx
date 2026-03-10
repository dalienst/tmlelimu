import * as Yup from "yup";

const RegistrationSchema = Yup.object().shape({
    // first_name: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(5, "Password cannot be less than 5 characters")
        .required("This field is required")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 5 characters, one uppercase, one number and one special case character"
        ),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Confirm Password does not match"),
});

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(5, "Password cannot be less than 5 characters")
        .required("This field is required"),
});

const ProfileSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").max(100, "Too Long!"),
    email: Yup.string().email("Invalid email"),
    username: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
    bio: Yup.string().min(2, "The bio is too short!"),
});

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
});

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    code: Yup.string().required("Code is required"),
    password: Yup.string()
        .min(5, "Password cannot be less than 5 characters")
        .required("Password is required")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special character"
        ),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
});

const CreateSopSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    file: Yup.mixed().required("A document file is required"),
});

const UpdateSopSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    file: Yup.mixed().nullable(), // Optional for updates
});

export { 
    RegistrationSchema, 
    ProfileSchema, 
    LoginSchema, 
    ForgotPasswordSchema, 
    ResetPasswordSchema, 
    CreateSopSchema, 
    UpdateSopSchema
};
