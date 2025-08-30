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

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export function Modal({ open, onClose }: ModalProps) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(contentType.Youtube);
    const tagsRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const tagsInput = tagsRef.current?.value;

        if (!title || !link) {
            alert("Please fill in both title and link");
            return;
        }

        const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : [];

        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/content/`, {
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
            if (response.data.success) {
                alert("Content added successfully!");
                
                if (titleRef.current) titleRef.current.value = "";
                if (linkRef.current) linkRef.current.value = "";
                if (tagsRef.current) tagsRef.current.value = "";

                onClose();
            } else {
                alert(response.data.message);
            }
        } 
        catch (err: any) {
            console.error("Error while adding content:", err.response?.data || err.message);
            alert("Error adding content: " + (err.response?.data?.message || err.message));
        }
        finally {
            setLoading(false);
        }
    }
    //closing modal by clicking on outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    //closing modal by pressing esc key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200" 
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300 transform-gpu">
                
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Content</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Close modal"
                    >
                        <CrossIcon size="md" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Input 
                                placeholder="Enter content title" 
                                reference={titleRef}
                                type='text'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Link <span className="text-red-500">*</span>
                            </label>
                            <Input 
                                placeholder="https://example.com" 
                                reference={linkRef}
                                type="url"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <Input 
                                placeholder="tag1, tag2, tag3" 
                                reference={tagsRef}
                                type='text'
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Separate multiple tags with commas
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Content Type
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setType(contentType.Youtube)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                    type === contentType.Youtube
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                <span className="text-sm font-medium">YouTube</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setType(contentType.Twitter)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                    type === contentType.Twitter
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                <span className="text-sm font-medium">Twitter</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setType(contentType.Notion)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                    type === contentType.Notion
                                        ? 'border-gray-800 bg-gray-50 text-gray-800'
                                        : 'border-slate-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.047.935-.56.935-1.167V6.354c0-.606-.233-.933-.746-.887l-15.19.887c-.56.047-.736.327-.736.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.747.934 1.26v16.707c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.934.047-1.401-.233-1.868-.933L.553 20.27c-.514-.654-.234-1.16.327-1.206z"/>
                                </svg>
                                <span className="text-sm font-medium">Notion</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-gray-50 rounded-b-2xl">
                    <Button 
                        variant="secondary" 
                        size="md" 
                        text="Cancel" 
                        onClick={onClose}
                        disabled={loading}
                    />
                    <Button 
                        variant="primary" 
                        size="md" 
                        text={loading ? "Adding..." : "Add Content"}
                        onClick={addContent}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}