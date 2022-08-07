import React from "react";
import Typewriter from "typewriter-effect";

export default function Login() {
  return (
    <div className="text-3xl font-bold underline hidden">
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
    </div>
  );
}
