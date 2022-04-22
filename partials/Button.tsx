import { FunctionComponent, ReactChild } from "react";
import { TailSpin } from "react-loader-spinner";

interface ButtonProps{
    label: ReactChild;
    submitting?: boolean;
    disabled?: boolean;
    type?: "primary" | "default" | "danger";
    onMouseDown: () => void;
}

export const Button: FunctionComponent<ButtonProps> = (props) => {
    const { label, submitting, type, disabled, onMouseDown } = props;

    let colorClasses = `bg-zinc-700 text-white`;
    if (type === "primary") colorClasses = "bg-blue-3 text-white";
    if (type === "danger") colorClasses = "bg-rating-red text-white";
    
    return (
        <button 
            className={`flex font-ui items-center gap-x-2 py-2 px-2 rounded-md ${colorClasses} justify-between flex-row ${disabled ? "opacity-60" : "opacity-100"}`}
            onMouseDown={onMouseDown}
            disabled={disabled || submitting}
        >
            {submitting ? <TailSpin color="white" height={18} width={18} /> : null}{label}
        </button>
    )
}