import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(false);
  const heading = isLoginForm ? "Login" : "Signup";
  const questionText = isLoginForm ? "New User?" : "Already have an account?";
  const toggleText = isLoginForm ? "Signup" : "Login";
  const toggleForm = () => setIsLoginForm(!isLoginForm);

  return (
    <div className="min-h-screen py-2">
      <h1 className="text-4xl text-center underline">{heading}</h1>
      <div className="flex flex-col justify-center items-center py-6">
        {isLoginForm ? <Login /> : <Signup />}

        <p className="text-xs pt-2">
          {questionText}{" "}
          <span
            onClick={toggleForm}
            className="font-medium underline cursor-pointer"
          >
            {toggleText}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
