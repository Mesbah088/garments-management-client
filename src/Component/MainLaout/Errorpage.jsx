import Lottie from "lottie-react";
import { Link } from "react-router";
import errorLottie from '../../assets/Lotties/Error.json';


const ErrorPage = () => {
    return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
       <Lottie animationData={errorLottie} loop="true"></Lottie>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
      <p className="text-gray-600 mb-6 text-center">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
    );
};

export default ErrorPage;