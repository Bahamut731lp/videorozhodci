import React from "react"

export default function Button({ children, ...props }: React.ComponentProps<"button">) {
    return (
        <button className="bg-neutral-700 p-1" {...props}>
            {children}
        </button>
    )
}
