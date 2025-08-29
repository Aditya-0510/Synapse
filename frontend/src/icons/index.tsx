export interface IconProps{
    size: "sm" | "md" | "lg" 
    onClick?: ()=> void
    className?: string
}

export const IconVariants = {
    "sm" : "size-4",
    "md" : "size-6",
    "lg" : "size-8"
}