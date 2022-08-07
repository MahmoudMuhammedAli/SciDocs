import React from "react";
import Typewriter from "typewriter-effect";
import Lottie from "lottie-react";
import typing from "../assets/typing.json";
import working from "../assets/working.json";
export default function Login() {
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
            <h2 className="text-3xl text-red-600 text-center font-semibold w-full mt-9">
              Get Started Now
            </h2>
            <p className="text-gray-900 text-lg ">Enter your name</p>
            <input
              id="name"
              type="text"
              placeholder="Name"
              class="input w-full max-w-xs input-ghost input-bordered"
            />
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
