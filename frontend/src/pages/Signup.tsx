import { useRef, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  EmailIcon,
  PasswordIcon,
  EyeIcon,
  EyeOffIcon,
} from "../icons/InputIcons";

export function Signup() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signup() {
    setLoading(true);
    try {
      const name = nameRef.current?.value;
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      await axios.post(`${backendUrl}/user/signup`, {
        name,
        email,
        password,
      });
      navigate("/signin");
      alert("You have signed up");
    } 
    catch (e) {
        console.error("Signup failed:", e);
        alert("Error signing up. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex overflow-hidden">
      <div className="w-full h-full bg-white shadow-2xl flex">
        {/* Left side  */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
            <p className="text-xl mb-8 text-blue-100">
              Create your account and unlock access to amazing features designed
              just for you.
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
                <span>Secure and encrypted</span>
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
                <span>Easy setup process</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Sign up to get started with your account
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                signup();
              }}
            >
              <Input
                placeholder="Full Name"
                reference={nameRef}
                icon={<UserIcon />}
              />

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

              <Button
                text="Create Account"
                variant="primary"
                size="lg"
                fullWidth={true}
                loading={loading}
              />
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}