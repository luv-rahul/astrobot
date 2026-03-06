import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSignupMutation } from "../../../api/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      emailId: "",
      password: "",
      dob: "",
      birthTime: "",
      birthPlace: "",
    },

    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Full Name is required")
        .min(4, "Full Name must be at least 4 characters")
        .max(25, "Full Name must be 4-25 characters long"),

      emailId: Yup.string()
        .required("Email is required")
        .email("Invalid Email Id"),

      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/,
          "Password must contain 8 characters, uppercase, lowercase, special character and number",
        ),

      dob: Yup.string()
        .required("Date of Birth is required")
        .matches(
          /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
          "Invalid Date of Birth. Format: DD/MM/YYYY",
        ),

      birthTime: Yup.string()
        .required("Birth Time is required")
        .matches(
          /^(1[0-2]|[1-9]):[0-5][0-9]\s?(am|pm)$/i,
          "Invalid Time. Format: HH:MM am/pm",
        ),

      birthPlace: Yup.string()
        .required("Birth Place is required")
        .min(2, "Birth Place is too short"),
    }),

    onSubmit: async (values) => {
      try {
        const result = await signup(values).unwrap();
        if (result.status === 200) {
          console.log(result);
          toast.success("Signup successful!");
          navigate("/ai");
        } else {
          toast.error("Signup failed!");
        }
      } catch (err) {
        toast.error(err.data?.message || "Signup failed!");
        console.error("Signup error:", err);
      }
    },
  });

  return (
    <div className="border w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-1 my-2 text-sm">
          <label>Full Name</label>
          <input
            className="border border-white py-1 px-2"
            type="text"
            name="fullName"
            placeholder="Rahul Kumar"
            value={formik.values.fullName || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <span className="text-red-500 text-xs">
              {formik.errors.fullName}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-2 text-sm">
          <label>Email</label>
          <input
            className="border border-white py-1 px-2"
            type="email"
            name="emailId"
            placeholder="abcd123@gmail.com"
            value={formik.values.emailId || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.emailId && formik.errors.emailId && (
            <span className="text-red-500 text-xs">
              {formik.errors.emailId}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-2 text-sm">
          <label>Password</label>
          <input
            className="border border-white py-1 px-2"
            type="password"
            name="password"
            placeholder="********"
            value={formik.values.password || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-500 text-xs">
              {formik.errors.password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-2 text-sm">
          <label>Date of Birth</label>
          <input
            className="border border-white py-1 px-2"
            type="text"
            name="dob"
            placeholder="31/12/1990"
            value={formik.values.dob || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dob && formik.errors.dob && (
            <span className="text-red-500 text-xs">{formik.errors.dob}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-2 text-sm">
          <label>Birth Time</label>
          <input
            className="border border-white py-1 px-2"
            type="text"
            name="birthTime"
            placeholder="2:30 pm"
            value={formik.values.birthTime || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.birthTime && formik.errors.birthTime && (
            <span className="text-red-500 text-xs">
              {formik.errors.birthTime}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-2 text-sm">
          <label>Birth Place</label>
          <input
            className="border border-white py-1 px-2"
            type="text"
            name="birthPlace"
            placeholder="Delhi"
            value={formik.values.birthPlace || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.birthPlace && formik.errors.birthPlace && (
            <span className="text-red-500 text-xs">
              {formik.errors.birthPlace}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-2 text-sm">
          <button type="submit" className="bg-[#f30000] py-2 cursor-pointer">
            {isLoading ? "Submitting..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
