import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios"
import { useRef } from "react";

export function Signin(){
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    async function signin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
        const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
            email,
            password
        });

        console.log("Full response:", response.data);  
        const token = response.data.token;
        console.log("Extracted token:", token);

        localStorage.setItem("token", token);
        navigate("/dashboard");
        alert("You have signed in");
    } 
    catch (error) {
        console.error("Signin failed:", error.response?.data || error.message);
        alert("Signin failed");
    }
}

    return (
        <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white border min-w-48 p-8 rounded">
                <Input placeholder="Email" reference={emailRef}/>
                <Input placeholder="Password"reference={passwordRef}/>

                <div className="flex justify-center pt-4">
                    <Button variant="primary" size="md" text="Signin" fullWidth={true} loading={false} onClick={signin}/>
                </div>
            </div>
        </div>
    )
}