import React from 'react'

type Props = {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    children: React.ReactNode;
}

const Button = ({ onClick, className, disabled = false, type = 'button', loading = false, children }: Props) => {
    return (


        <button
            onClick={onClick}
            className={`relative overflow-hidden group ${className} rounded-md px-4 py-2 border-button-secondary/20 border cursor-pointer text-[18px] font-[500] h-full`}
            disabled={disabled}
            type={type}
        >
            <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-300
                           opacity-100 group-hover:opacity-0 group-hover:-translate-y-2"
            >
                {loading ? 'Loading...' : children}
            </span>
            <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-300
                           opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            >
                {loading ? 'Loading...' : children}
            </span>
            <span className="invisible">{loading ? 'Loading...' : children}</span>
        </button>


    )
}

export default Button