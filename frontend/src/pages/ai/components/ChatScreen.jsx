import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSendMessageMutation } from "../../../api/api";
import ChatHeader from "./ChatHeader";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today? 🔮" },
  ]);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formik = useFormik({
    initialValues: { message: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        resetForm();
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: values.message },
        ]);
        setIsBotLoading(true);
        const result = await sendMessage(values.message).unwrap();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: result.message },
        ]);
        setIsBotLoading(false);
      } catch (err) {
        toast.error(err.data?.message || "Failed to send message");
        console.error("Send message error:", err);
        setIsBotLoading(false);
      }
    },
  });

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] text-white h-screen">
      <ChatHeader />
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent text-xs">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`px-4 py-2 max-w-xs wrap-break-words rounded ${
              msg.sender === "user"
                ? "self-end bg-[#C8191C] text-white"
                : "self-start bg-[#1f1f1f] text-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isBotLoading && (
          <div className="self-start bg-[#1f1f1f] text-gray-200 px-4 py-2 max-w-xs rounded">
            <span>Loading...</span>
          </div>
        )}
        <div ref={scrollRef}></div>
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
            className="bg-[#C8191C] px-4 py-2 cursor-pointer hover:bg-[#b05253]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
