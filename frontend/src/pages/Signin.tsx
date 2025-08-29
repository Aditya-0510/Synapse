import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { useRef, useState } from "react";
import {
  EmailIcon,
  PasswordIcon,
  EyeIcon,
  EyeOffIcon,
} from "../icons/InputIcons";

export function Signin() {
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          email,
          password,
        }
      );

      console.log("Full response:", response.data);
      const token = response.data.token;
      console.log("Extracted token:", token);

      localStorage.setItem("token", token);
      navigate("/dashboard");
      alert("You have signed in");
    } 
    catch (e) {
      console.error("Signin failed:", e);
      alert("Error signing in. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex overflow-hidden">
      <div className="w-full h-full bg-white shadow-2xl flex">
        {/* Left side */}
        <div className="w-full lg:w-1/2 p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">
                Sign in to continue to your account
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                signin();
              }}
            >
              <Input
                placeholder="Email Address"
                type="email"
                reference={emailRef}
                icon={<EmailIcon />}
              />

              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  reference={passwordRef}
                  icon={<PasswordIcon />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                text="Sign In"
                variant="primary"
                size="lg"
                fullWidth={true}
                loading={loading}
              />
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right side  */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
            <p className="text-xl mb-8 text-purple-100">
              Sign in to access your personalized dashboard and continue where you left off.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Access your dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Manage your profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}