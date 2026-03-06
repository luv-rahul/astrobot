import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="container mx-auto text-center pt-[20%] min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-5xl md:text-7xl font-bold">YOUR PATH TO</h1>
        <h2 className="text-5xl md:text-7xl font-bold text-[#C8191C]">
          AI ASTROLOGER
        </h2>
        <p className="italic text-sm md:text-base max-w-md">
          Unlock your future with AI-driven astrology tailored just for you.
        </p>

        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-[#C8191C] hover:bg-[#da7071] text-white font-semibold px-2 py-1"
        >
          Get Started
          <ChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
