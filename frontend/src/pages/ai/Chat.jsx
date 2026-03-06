import ChatScreen from "./components/ChatScreen";
import Sidebar from "./components/Sidebar";

const Chat = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <ChatScreen />
    </div>
  );
};

export default Chat;
