interface InputProps {
  reference?: any;
  placeholder?: string;
}

export function Input({ reference, placeholder }: InputProps){
    return (
        <div>
            <input
                type="text"
                placeholder={placeholder}
                className="px-4 py-2 border rounded m-2"
                ref={reference}
            />
        </div>
    )
}