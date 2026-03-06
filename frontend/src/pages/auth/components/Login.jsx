import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../api/api";
import { toast } from "react-toastify";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
    },

    validationSchema: Yup.object({
      emailId: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/,
          "Password must contain 8 characters, uppercase, lowercase, special character and number",
        ),
    }),

    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        if (result.status === 200) {
          console.log(result);
          toast.success("Login successful!");
          navigate("/ai");
        } else {
          toast.error("Login failed!");
        }
      } catch (err) {
        toast.error(err.data?.message || "Login failed!");
        console.error("Login error:", err);
      }
    },
  });

  return (
    <div className="border w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto">
      <form onSubmit={formik.handleSubmit}>
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
          <button type="submit" className="bg-[#f30000] py-2 cursor-pointer">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
