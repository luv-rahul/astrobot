import { Link } from "react-router-dom";
import wheel from "../../assets/wheel.png";

const AstrobotPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col-reverse sm:flex-row items-center justify-center px-6 sm:px-10 gap-8 sm:gap-0 w-full">
        <div className="w-full sm:w-1/2 flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
          <div className="flex flex-col gap-2">
            <p className="text-5xl sm:text-6xl lg:text-7xl leading-tight font-semibold">
              YOUR
            </p>
            <p className="text-5xl sm:text-6xl lg:text-7xl text-[#C8191C] leading-tight font-semibold">
              ASTROLOGY
            </p>
            <p className="text-5xl sm:text-6xl lg:text-7xl leading-tight font-semibold">
              UNLEASHED
            </p>
          </div>
          <p className="italic text-xs opacity-70">
            "Where AI meets the stars."
          </p>
          <div className="flex gap-4 w-full">
            <Link
              to="/dashboard"
              className="flex-1 flex items-center justify-center bg-[#555] text-white font-medium text-sm px-4 py-2 hover:bg-[#222] transition"
            >
              Dashboard
            </Link>

            <Link
              to="/ai/chat"
              className="flex-1 flex items-center justify-center bg-[#C8191C] text-white font-medium text-sm px-4 py-2 hover:bg-red-500 transition"
            >
              Chat with AI
            </Link>
          </div>
        </div>
        <div className="w-2/3 sm:w-1/2 flex justify-center">
          <img
            src={wheel}
            alt="wheel"
            className="opacity-50 w-full max-w-xs sm:max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AstrobotPage;
