import NotionIcon from "../icons/NotionIcon"
import TwitterIcon from "../icons/TwitterIcon"
import YoutubeIcon from "../icons/YoutubeIcon"
import  SidebarItem  from "./ui/SidebarItem"

export function Sidebar(){
    return (
        <div className="h-screen bg-white border-r w-76 fixed left-0 top-0">
            <div className="flex text-2xl pt-8 items-center">
                <div className="pr-2">logo</div>
                Synapse
            </div>
            <div className="pt-8 pl-8 flex gap-4 flex-col">
                <SidebarItem text="Twitter" icon={<TwitterIcon size="md" />} />
                <SidebarItem text="Youtube" icon={<YoutubeIcon size="md" />} />
                <SidebarItem text="Notion" icon={<NotionIcon size="md" />} />
            </div>
        </div>
    )
}