import React from "react";
import Typewriter from "typewriter-effect";
import Lottie from "lottie-react";
import working from "../assets/working.json";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const { user } = useContext(UserContext);
  const [ username, setUsername ] = React.useState("");
  return (
    <div className="min-h-screen ">
      <div className="hidden lg:flex flex-row p-5 justify-between items-center">
        <h1 className="text-orange-600 text-xl font-bold flex flex-row items-end gap-1 ">
          SciDox <span className="text-red-600 text-lg">Editor</span>
        </h1>
      </div>
      <div className=" flex flex-col lg:flex-row justify-evenly items-center min-h-full pt-20 lg:pt-0">
        <div className=" flex w-full lg:w-[80%] justify-center p-10 lg:p-0">
          <div className="flex flex-col justify-center items-start gap-2">
            <h1 className="text-orange-600 text-4xl lg:text-7xl font-bold flex flex-row items-end gap-3 w-full mb-2 text-center lg:text-start ">
              SciDox{" "}
              <span className="text-red-600 text-2xl lg:text-5xl">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("Editor")
                      .callFunction(() => {})
                      .pauseFor(2500)
                      .start()
                      .deleteAll()
                      .start();
                  }}
                  options={{
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
            </h1>
            <p className="text-gray-800 text-lg">
              Collaborate on scientific documents and share them with the world.
            </p>
            <h2 className="text-3xl text-orange-600 text-center font-bold w-full mt-12 mb-6">
              Get Started <span className="text-red-600">Now</span>
            </h2>
            <p className=" text-lg  text-gray-900">Enter your name</p>
            <input
              id="name"
              type="text"
              placeholder="Name"
              class="p-4 rounded-xl max-w-xs w-full border-2 border-orange-600 focus:border-orange-600 text-gray-900"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <button
              class="btn  mt-3 bg-orange-600 border-orange-600 text-white"
              disabled={username === ""}
            >
              Start Editing
            </button>
          </div>
        </div>
        <div className="flex  lg:w-[70%] justify-center items-end">
          <div className="w-[70%]">
            <Lottie animationData={working} loop={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
