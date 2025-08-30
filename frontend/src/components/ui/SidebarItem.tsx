import { type ReactElement } from 'react'

interface SidebarItemProps {
  text: string
  icon: ReactElement
  isActive?: boolean
  count?: number
  onClick?: () => void
}

export const SidebarItem = ({ text, icon, isActive = false, count, onClick }: SidebarItemProps) => {
  return (
    <div 
      className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-colors duration-200 ${
          isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
        }`}>
          {icon}
        </div>
        <span className="font-medium">{text}</span>
      </div>
      
      {count !== undefined && (
        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
          isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-slate-300 text-gray-600 group-hover:bg-gray-300'
        }`}>
          {count}
        </div>
      )}
    </div>
  )
}

export default SidebarItem