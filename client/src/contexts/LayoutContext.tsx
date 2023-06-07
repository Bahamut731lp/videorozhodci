import React, { createContext, useEffect, useState } from "react";

interface Layout {
    width: number;
    height: number;
    cameras?: string[]
}

const LayoutContext = createContext<[Layout, React.Dispatch<React.SetStateAction<Layout>>]>([{width: 1, height: 1}, () => {}]);

export function LayoutContextProvider({children}) {
    const [state, setState] = useState({width: 1, height: 1});
    
    return (
        <LayoutContext.Provider value={[state, setState]}>
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutContext;