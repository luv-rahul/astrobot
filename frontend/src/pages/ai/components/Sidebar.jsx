import { useGetHistoryQuery } from "../../../api/api";

const Sidebar = () => {
  const { data: history, isLoading, isError } = useGetHistoryQuery();

  if (isLoading) {
    return (
      <div className="w-1/5 h-screen border-r border-white/20 p-4 flex flex-col bg-[#0f0f0f]">
        <h1 className="text-lg font-semibold pb-3 border-b border-white/20">
          🔮 AstroBot
        </h1>
        <div className="mt-4 text-center text-gray-500">
          Loading chat history...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-1/5 h-screen border-r border-white/20 p-4 flex flex-col bg-[#0f0f0f]">
        <h1 className="text-lg font-semibold pb-3 border-b border-white/20">
          🔮 AstroBot
        </h1>
        <div className="mt-4 text-center text-red-500">
          Failed to load chat history. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/5 h-screen border-r border-white/20 p-4 flex flex-col bg-[#0f0f0f]">
      <h1 className="text-lg font-semibold pb-3 border-b border-white/20">
        🔮 AstroBot
      </h1>

      <div className="mt-5 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
          Chat History
        </h2>

        <div className="flex flex-col gap-1 overflow-y-auto pr-1 sidebar-scroll">
          {history && history?.message?.length > 0 ? (
            history.message.map((chat, index) => (
              <div
                key={index}
                className="text-sm px-3 py-2 border-b border-[#222] cursor-pointer hover:bg-white/10 transition "
              >
                {chat.title || `Chat Title ${index + 1}`}{" "}
                {/* Display chat title */}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 px-3 py-2">
              No chat history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
