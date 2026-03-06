import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation, useSendMessageMutation } from "../../../api/api";

const ChatScreen = () => {
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { message: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await sendMessage({ message: values.message }).unwrap();
        console.log("Message sent:", result);
        resetForm();
      } catch (err) {
        toast.error(err.data?.message || "Failed to send message");
        console.error("Send message error:", err);
      }
    },
  });

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();
      if(result.status === 200) {
        toast.success("Logout Successful!");
        navigate("/");
      }
      else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] text-white h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h2 className="font-semibold text-lg">AstroBot</h2>
        <div className="flex items-center gap-2">
          <img
            className="w-9 h-9 rounded-3xl object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfE8XWOVe86hLGi8m9mgPTsva_KWjTHbT9iQ&s"
            alt="avatar"
          />
          <span className="text-xs text-gray-400">Online</span>
          <button
            onClick={handleLogout}
            className="text-xs bg-[#c8191c] px-3 py-2 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent text-xs">
        <div className="self-start bg-[#1f1f1f] px-4 py-2 max-w-xs">
          Hello! How can I help you today? 🔮
        </div>
      </div>

      <div className="p-4 border-t border-white/20 flex gap-2 text-xs">
        <form onSubmit={formik.handleSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            name="message"
            placeholder="Enter Query"
            className="flex-1 bg-[#1f1f1f] px-4 py-2 text-white outline-none placeholder-gray-400"
            value={formik.values.message}
            onChange={formik.handleChange}
          />
          <button
            type="submit"
            disabled={isSending}
            className="bg-[#C8191C] px-4 py-2 hover:opacity-90 transition"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
