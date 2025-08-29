import { useRef } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export function Signup(){
    const navigate = useNavigate();

    const nameRef = useRef<HTMLInputElement>();
    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    async function signup(){
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        await axios.post("http://localhost:3000/api/v1/user/signup",{
            name,
            email,
            password
        })
        navigate("/signin")
        alert("You have signed up")
    }
    return (
        <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white border min-w-48 p-8 rounded">
                <Input placeholder="Name" reference={nameRef}/>
                <Input placeholder="Email" reference={emailRef}/>
                <Input placeholder="Password" reference={passwordRef}/>

                <div className="flex justify-center pt-4">
                    <Button variant="primary" size="md" text="Signup" fullWidth={true} loading={false} onClick={signup}/>
                </div>
            </div>
        </div>
    )
}