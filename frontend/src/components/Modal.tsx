import CrossIcon from '../icons/CrossIcon'
import { Button } from "../components/ui/Button"
import { Input } from './Input'
import { useRef, useState } from 'react'
import axios from 'axios';

enum contentType {
    Youtube = "youtube",
    Twitter = "twitter",
    Notion = "notion"
}

export function Modal( { open, onClose} ){
    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>();
    const [type, setType] = useState(contentType.Youtube);
    const tagsRef = useRef<HTMLInputElement>();

    

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const tagsInput = tagsRef.current?.value;

        const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : [];

        try {
            const response = await axios.post("http://localhost:3000/api/v1/content/", {
                link,
                type,
                title,
                tags
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token") 
                }
            });

            console.log("Response:", response.data);
            if (response.data.success) alert("Content added");
            else alert(response.data.message);
        } 
        catch (err: any) {
            console.error("Error while adding content:", err.response?.data || err.message);
            alert("Error adding content: " + (err.response?.data?.message || err.message));
        }
        onClose()
    }


    return (
        <div>
            {open &&<div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-60 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span className="bg-white opacity-100 p-4 roounded">
                        <div className="flex justfiy-end cursor-pointer" onClick={onClose}>
                            <CrossIcon size="md" />
                        </div>
                        <div>
                            <Input placeholder="Title" reference={titleRef}/>
                            <Input placeholder="Link" reference={linkRef}/>
                            <Input placeholder="Tags" reference={tagsRef}/>
                        </div>
                        <div>
                            <h1>Type</h1>
                            <div className='flex gap-2 p-4'>
                                <Button text='Youtube'  variant={type === contentType.Youtube ? "primary" : "secondary"} size='md' onClick={()=>{
                                    setType(contentType.Youtube)
                                }}/>
                                <Button text='Twitter'  variant={type === contentType.Twitter ? "primary" : "secondary"} size='md' onClick={()=>{
                                    setType(contentType.Twitter)
                                }}/>
                                <Button text='Notion'  variant={type === contentType.Notion ? "primary" : "secondary"} size='md' onClick={()=>{
                                    setType(contentType.Notion)
                                }}/>
                            </div>
                        </div>
                            <div className='flex justify-center'>
                                <Button variant="primary" size='md' text='Submit' onClick={addContent}></Button>
                            </div>
                        
                    </span>
                </div>

            </div>}
        </div>
    )
}