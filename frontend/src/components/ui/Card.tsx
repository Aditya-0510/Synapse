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
interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

function ConfirmDialog({ isOpen, title, onConfirm, onCancel, isLoading }: ConfirmDialogProps) {
    if (!isOpen) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onCancel()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
            onCancel()
        }
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300 transform-gpu">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.19 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Content</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete <span className="font-medium">"{title}"</span>? This action cannot be undone.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-gray-50 rounded-b-2xl">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 cursor-pointer ${
                            isLoading 
                                ? 'bg-red-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </div>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
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
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isDeleting, setIsDeleting] = useState(false);
    const [twitterLoading, setTwitterLoading] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleDeleteClick = () => {
        if (props.readOnly) return;
        setError(null);
        setSuccess(null);
        setShowConfirmDialog(true);
    };

    const deleteContent = async () => {
        if (props.readOnly) return;

        try {
            setIsDeleting(true);
            const response = await axios.delete(`${backendUrl}/content/`, {
                data: { 
                    title: props.title
                },
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            const success = response.data.success;
            if (success) {
                setSuccess("Content deleted successfully!");
                setShowConfirmDialog(false);
                
                setTimeout(() => {
                    if (props.onDelete) {
                        props.onDelete(props.title);
                    }
                }, 1000);
            } else {
                setError(response.data.message || "Failed to delete content");
                setShowConfirmDialog(false);
            }
        } 
        catch (error: any) {
            console.error("Error deleting content:", error);
            setError(error.response?.data?.message || error.message || "Error deleting content");
            setShowConfirmDialog(false);
        } 
        finally {
            setIsDeleting(false);
        }
    };

    const shareContent = () => {
        window.open(props.link, "_blank", "noopener,noreferrer");
    };
    return(
        <>
        <div className={props.className}>
            <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6 max-w-sm min-h-64 hover:shadow-xl transition-shadow duration-300">
                 {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-700 text-xs">{error}</span>
                            </div>
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-700 text-xs">{success}</span>
                            </div>
                        </div>
                    )}
                 
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
                            className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200 group cursor-pointer"
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
                                onClick={handleDeleteClick}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200 group cursor-pointer"
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
        <ConfirmDialog
                isOpen={showConfirmDialog}
                title={props.title}
                onConfirm={deleteContent}
                onCancel={() => setShowConfirmDialog(false)}
                isLoading={isDeleting}
            />
        </>
    )
}