import { useEffect, useState } from 'react'
import ShareIcon from '../../icons/ShareIcon'
import DeleteIcon from '../../icons/DeleteIcon'
import NotionIcon from '../../icons/NotionIcon'
import YoutubeIcon from '../../icons/YoutubeIcon'
import TwitterIcon from '../../icons/TwitterIcon'
import axios from 'axios'

interface CardProps{
    className?: string
    type: "twitter" | "youtube" | "notion"
    title: string
    link: string
    onDelete?: (title: string) => void
    readOnly?: boolean  
}

function StartIcon({ type }: { type: string }) {
    return (
        <>
            {type === "notion" && <NotionIcon size="md" />}
            {type === "youtube" && <YoutubeIcon size="lg" />}
            {type === "twitter" && <TwitterIcon size="md"/>}
        </>
    )
}

export function Card( props: CardProps){
    const [isDeleting, setIsDeleting] = useState(false);
    const [twitterLoading, setTwitterLoading] = useState(true);

    useEffect(() => {
        if (props.type === "twitter") {
            setTwitterLoading(true);
            
            const loadTwitterEmbed = () => {
                if ((window as any).twttr?.widgets) {
                    (window as any).twttr.widgets.load().then(() => {
                        setTwitterLoading(false);
                    });
                } else {
                    setTimeout(() => {
                        if ((window as any).twttr?.widgets) {
                            (window as any).twttr.widgets.load().then(() => {
                                setTwitterLoading(false);
                            });
                        } else {
                            setTwitterLoading(false);
                        }
                    }, 2000);
                }
            };

            setTimeout(loadTwitterEmbed, 100);
        }
    }, [props.type, props.link]);

    const deleteContent = async () => {
        if (props.readOnly) return;
        if (!confirm(`Are you sure you want to delete "${props.title}"?`)) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await axios.delete("http://localhost:3000/api/v1/content/", {
                data: { 
                    title: props.title
                },
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            const success = response.data.success;
            if (success) {
                alert("Content deleted successfully!");
                
                if (props.onDelete) {
                    props.onDelete(props.title);
                }
            } else {
                alert("Failed to delete content: " + response.data.message);
            }
        } 
        catch (error: any) {
            console.error("Error deleting content:", error);
            alert("Error deleting content: " + (error.response?.data?.message || error.message));
        } 
        finally {
            setIsDeleting(false);
        }
    };

    const shareContent = () => {
        window.open(props.link, "_blank", "noopener,noreferrer");
    };
    return(
        <div className={props.className}>
            <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6 max-w-sm min-h-64 hover:shadow-xl transition-shadow duration-300">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-5 items-center">
                        <div className="flex-shrink-0">
                            <StartIcon type={props.type} />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm truncate max-w-40" title={props.title}>
                            {props.title}
                        </h3>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={shareContent}
                            className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200 group"
                            title="Open link"
                            disabled={isDeleting}
                        >
                            <ShareIcon
                                size="md"
                                className="text-gray-500 group-hover:text-blue-600 cursor-pointer"
                            />
                        </button>
                        {!props.readOnly && (
                            <button
                                onClick={deleteContent}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200 group"
                                title="Delete content"
                                disabled={isDeleting}
                            >
                                <DeleteIcon 
                                    size="md" 
                                    className={`cursor-pointer transition-colors duration-200 ${
                                        isDeleting 
                                            ? 'text-gray-400 animate-pulse' 
                                            : 'text-gray-500 group-hover:text-red-600'
                                    }`}
                                />
                            </button>
                        )}
                    </div>
                </div>

                 <div className="pt-4 space-y-3">
                    {props.type === "twitter" && (
                        <div className="relative">
                            {twitterLoading && (
                                <div className="border rounded-lg p-6 bg-gray-50 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                                        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                            )}
                            
                            <div className={twitterLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'}>
                                <blockquote className='twitter-tweet'>
                                    <a href={props.link.replace("x","twitter")}></a>
                                </blockquote>
                            </div>
                        </div>
                    )}

                    {props.type === "youtube" && 
                        <iframe className='w-full' src={props.link.replace("watch","embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    }
                    {props.type === "notion" &&
                        <iframe className='w-full' src={props.link} width="100%" height="600" frameBorder="0" allowFullScreen />
                    }
                 </div>
                 <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 truncate" title={props.link}>
                        🔗 {props.link}
                    </p>
                </div>
            </div>
        </div>
    )
}