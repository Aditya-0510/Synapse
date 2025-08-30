import axios from "axios";
import { useEffect, useState } from "react";

export function useContent(){
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [contents, setContents] = useState([]);
    function refresh(){
        axios.get(`${backendUrl}/content/`,{
            headers: {
                "Authorization" : localStorage.getItem("token")
            }
        })
        .then((response)=>{
            setContents(response.data.content)
        })
    }
    useEffect(() =>{
        refresh();

        let interval = setInterval(()=>{
            refresh()
        },10*1000)

        return()=>{
            clearInterval(interval)
        }
    },[])

    return { contents, refresh };
}