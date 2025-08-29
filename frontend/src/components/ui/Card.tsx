
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

async function DeleteContent(title){
    await axios.delete("http://localhost:3000/api/v1/content/",{
        title
    })
}

export function Card( props: CardProps){
    return(
        <div >
            <div className="bg-white rounded-md shadow-md border-slate-100 p-4 max-w-72 min-h-56  border">
                 <div className="flex justify-between">
                    <div className='flex gap-4 items-center text-md'>
                        <StartIcon type={props.type} />
                        {props.title}
                    </div>
                    <div className='flex gap-4 items-center'>
                        <ShareIcon
                            size="md"
                            onClick={() => window.open(props.link, "_blank", "noopener,noreferrer")}
                            className="cursor-pointer"
                        />
                        <DeleteIcon size='md' onClick={<DeleteContent title={props.title} />} className="cursor-pointer" />
                    </div>
                 </div>
                 <div className="pt-4">
                    {props.type === "twitter" && 
                        <blockquote className='twitter-tweet'>
                            <a href={props.link}></a>
                        </blockquote>
                    }
                    {props.type === "youtube" && 
                        <iframe className='w-full' src={props.link.replace("watch","embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    }
                    {props.type === "notion" &&
                        <iframe className='w-full' src={props.link} width="100%" height="600" frameBorder="0" allowFullScreen />
                    }
                 </div>
            </div>
        </div>
    )
}