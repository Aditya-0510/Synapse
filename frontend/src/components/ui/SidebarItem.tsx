import { type ReactElement } from 'react'

interface SidebarItemProps {
  text: string
  icon: ReactElement
}

const SidebarItem = ({ text, icon }: SidebarItemProps) => {
  return (
    <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-300 rounded'>
        {icon} 
        <span>{text}</span>
      
    </div>
  )
}

export default SidebarItem
