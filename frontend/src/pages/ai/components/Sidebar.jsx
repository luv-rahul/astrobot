const Sidebar = () => {
  return (
    <div className="w-1/5 h-screen border-r border-white/20 p-4 flex flex-col bg-[#0f0f0f]">
      <h1 className="text-lg font-semibold pb-3 border-b border-white/20">
        🔮 AstroBot
      </h1>

      <button className="mt-4 bg-[#C8191C] py-2 text-sm cursor-pointer hover:opacity-90 transition">
        + New Chat
      </button>

      <div className="mt-5 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
          Chat History
        </h2>

        <div className="flex flex-col gap-1 overflow-y-auto pr-1 sidebar-scroll">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="text-sm px-3 py-2 rounded-md cursor-pointer hover:bg-white/10 transition"
            >
              Chat Title {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
