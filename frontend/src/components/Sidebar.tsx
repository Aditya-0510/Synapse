import NotionIcon from "../icons/NotionIcon"
import TwitterIcon from "../icons/TwitterIcon"
import YoutubeIcon from "../icons/YoutubeIcon"
import  SidebarItem  from "./ui/SidebarItem"

interface SidebarProps {
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
  contentCounts: {
    all: number
    twitter: number
    youtube: number
    notion: number
  }
}

export function Sidebar({ activeFilter, onFilterChange, contentCounts }: SidebarProps){
    return (
        <div className="h-screen bg-white border-r border-slate-300 w-76 fixed left-0 top-0 shadow-sm">
            <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Synapse</h1>
            <p className="text-xs text-gray-500">Knowledge Hub</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-6">
        <div className="space-y-2">
          {/* All Items */}
          <SidebarItem
            text="All Content"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
              </svg>
            }
            isActive={activeFilter === null}
            count={contentCounts.all}
            onClick={() => onFilterChange(null)}
          />
          
          {/* Divider */}
          <div className="my-4">
            <div className="border-t border-slate-300"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4 mb-2 px-4">
              Content Types
            </p>
          </div>

          {/* Twitter */}
          <SidebarItem
            text="Twitter"
            icon={<TwitterIcon size="md" />}
            isActive={activeFilter === 'twitter'}
            count={contentCounts.twitter}
            onClick={() => onFilterChange('twitter')}
          />

          {/* YouTube */}
          <SidebarItem
            text="YouTube"
            icon={<YoutubeIcon size="md" />}
            isActive={activeFilter === 'youtube'}
            count={contentCounts.youtube}
            onClick={() => onFilterChange('youtube')}
          />

          {/* Notion */}
          <SidebarItem
            text="Notion"
            icon={<NotionIcon size="md" />}
            isActive={activeFilter === 'notion'}
            count={contentCounts.notion}
            onClick={() => onFilterChange('notion')}
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {contentCounts.all} items in your brain
          </p>
        </div>
      </div>
            
        </div>
    )
}