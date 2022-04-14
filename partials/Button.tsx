import { FunctionComponent } from "react";
import { TailSpin } from "react-loader-spinner";

interface ButtonProps{
    label: string;
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
            className={`flex items-center gap-x-2 py-2 px-2 rounded-md ${colorClasses}`}
            onMouseDown={onMouseDown}
            disabled={disabled || submitting}
        >
            {submitting ? <TailSpin color="white" height={18} width={18} /> : null}<span>{label}</span>
        </button>
    )
}