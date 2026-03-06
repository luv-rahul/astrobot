import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center">
        <h1 className={`text-[160px] sm:text-[220px] font-black`}>
          4<span className="text-[#f30000]">0</span>4
        </h1>

        <p className="text-xs tracking-[4px] uppercase text-white/50 flex items-center gap-2 mb-4">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-[#f30000] inline-block`}
          />
          Page not found
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#c8191c] text-white text-xs tracking-[3px] uppercase px-9 py-2.5 cursor-pointer hover:bg-[#555]"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
