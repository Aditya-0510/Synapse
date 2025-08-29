import type { ReactElement } from "react";

interface ButtonProps{
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;

}

const variantStyles = {
    "primary": "bg-blue-600 text-white",
    "secondary": "bg-blue-300 text-blue-600"
}

const sizeStyles = {
    "sm": "py-2 px-3",
    "md": "py-2 px-5",
    "lg": "py-2 px-7 "
}

const defaultStyles = "flex gap-2 rounded-lg text-lg items-center justify-center text-xl cursor-pointer"

export const Button = (props: ButtonProps) => {
  return (
    <button 
      onClick={props.onClick} 
      className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullWidth ? "w-full flex justify-center items-center" : ""} ${props.loading ? "opacity-45" : ""}`} disabled={props.loading}>
        {props.startIcon? <div className="pr-2">{props.startIcon}</div>: null}
        {props.text}
        {props.endIcon ? props.endIcon: null}
    </button>
  )
}

