import React from "react";
import Lottie from "lottie-react";
import error from "../assets/error.json";
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col md:flex-row  justify-evenly items-center">
          <h1 className="text-3xl md:text-5xl text-red-600 font-bold text-center">
            Something went wrong!
          </h1>
          <Lottie animationData={error} loop={true} />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
