import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../api/api";

const Profile = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const profile = data?.message?.data || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: profile.fullName || "",
      dob: profile.dob || "",
      birthTime: profile.birthTime || "",
      birthPlace: profile.birthPlace || "",
    },

    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Full Name is required")
        .min(4, "Full Name must be at least 4 characters")
        .max(25, "Full Name must be 4-25 characters long"),

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
        const result = await updateProfile(values).unwrap();

        toast.success(result.message || "Profile Updated");
        navigate("/ai");
      } catch (err) {
        toast.error(err.data?.message || "Something went wrong!");
        console.error("Update Error:", err);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  const details = [
    { label: "Full Name", value: formik.values.fullName },
    { label: "Date of Birth", value: formik.values.dob },
    { label: "Birth Time", value: formik.values.birthTime },
    { label: "Birth Place", value: formik.values.birthPlace },
  ];

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Rahul Kumar",
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "text",
      placeholder: "31/12/1990",
    },
    {
      name: "birthTime",
      label: "Birth Time",
      type: "text",
      placeholder: "02:30 pm",
    },
    {
      name: "birthPlace",
      label: "Birth Place",
      type: "text",
      placeholder: "Delhi",
    },
  ];

  return (
    <div className="min-h-screen text-neutral-200 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase mb-2 font-medium">
            Dashboard
          </p>
          <h1 className="text-4xl font-light text-white tracking-tight">
            Update <span className="text-[#c8191c]">Profile</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-[#222] p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {fields.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs tracking-widest uppercase text-neutral-400 mb-1.5 font-medium">
                    {label}
                  </label>

                  <input
                    className={`w-full bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-600 border
                    ${
                      formik.touched[name] && formik.errors[name]
                        ? "border-red-500"
                        : "border-white/10"
                    }`}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched[name] && formik.errors[name] && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {formik.errors[name]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-[#c8191c] hover:bg-[#a55557] cursor-pointer text-white text-xs font-medium py-3"
              >
                Save Profile
              </button>
            </form>
          </div>

          <div className="space-y-4 lg:sticky lg:top-8">
            <div className="bg-[#222] p-6">
              <p className="text-xs tracking-widest uppercase mb-5 font-medium">
                Updated Profile
              </p>

              <div className="space-y-4">
                {details.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between pb-4 border-b border-white/10"
                  >
                    <span className="text-xs text-neutral-500 uppercase tracking-wider w-28">
                      {label}
                    </span>

                    <span className="text-sm text-right">
                      {value || <span className="text-xs">Not filled</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
