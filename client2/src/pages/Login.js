import React from "react";
import Typewriter from "typewriter-effect";
import Lottie from "lottie-react";
import typing from "../assets/typing.json";
import working from "../assets/working.json";
export default function Login() {
  return (
    <div className="text-3xl font-bold underline ">
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("Hello World!")
            .callFunction(() => {})
            .pauseFor(2500)
            .start();
        }}
      />
      <h1 className="underline text-red-200">oh tailwind my tailwind</h1>
      <Lottie animationData={typing} loop={false} />
      <Lottie animationData={working} loop={false} />
    </div>
  );
}
