import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../../api/api";
import { toast } from "react-toastify";

const ChatHeader = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();
      if (result.status === 200) {
        toast.success("Logout Successful!");
        navigate("/");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
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
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
