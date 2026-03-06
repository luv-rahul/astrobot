import { Outlet } from "react-router-dom";
import image from "../assets/image.png";

const AppLayout = () => {
  return (
    <div
      className="text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9), #610303), url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Outlet />
    </div>
  );
};

export default AppLayout;
