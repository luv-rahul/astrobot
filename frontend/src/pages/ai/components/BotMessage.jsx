const BotMessage = ({ data }) => {
  // If it's a plain string, render as-is
  if (typeof data === "string") {
    return <p className="text-gray-200 text-xs">{data}</p>;
  }

  // Structured astrology response
  return (
    <div className="flex flex-col gap-3 text-xs text-gray-200">
      {/* Summary */}
      {data.summary && (
        <p className="text-gray-100 leading-relaxed">{data.summary}</p>
      )}

      {/* Cards: Career, Finance, Love, Health */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "career", label: "💼 Career", color: "border-blue-500" },
          { key: "finance", label: "💰 Finance", color: "border-green-500" },
          { key: "love", label: "❤️ Love", color: "border-pink-500" },
          { key: "health", label: "🧘 Health", color: "border-yellow-500" },
        ].map(
          ({ key, label, color }) =>
            data[key] && (
              <div
                key={key}
                className={`bg-[#2a2a2a] border-l-2 ${color} rounded p-2`}
              >
                <p className="font-semibold text-white mb-1">{label}</p>
                <p className="text-gray-300 leading-relaxed">{data[key]}</p>
              </div>
            ),
        )}
      </div>

      {/* Advice */}
      {data.advice?.length > 0 && (
        <div className="bg-[#2a2a2a] rounded p-2">
          <p className="font-semibold text-white mb-1">📌 Advice</p>
          <ul className="list-disc list-inside flex flex-col gap-1">
            {data.advice.map((tip, i) => (
              <li key={i} className="text-gray-300 leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Important Dates */}
      {data.important_dates?.length > 0 && (
        <div className="bg-[#2a2a2a] rounded p-2">
          <p className="font-semibold text-white mb-1">📅 Important Dates</p>
          <div className="flex flex-wrap gap-2">
            {data.important_dates.map((date, i) => (
              <span
                key={i}
                className="bg-[#C8191C]/20 text-[#f87171] border border-[#C8191C]/40 px-2 py-0.5 rounded text-xs"
              >
                {date}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BotMessage;
