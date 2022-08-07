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
            .deleteAll()
            .callFunction(() => {
              console.log("All strings were deleted");
            })
            .start();
        }}
      />
      <h1 className="underline text-red-200">test</h1>
    </div>
  );
}
