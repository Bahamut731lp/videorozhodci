import React, { createContext, useState } from "react";

type View = "live" | "playback";
const ViewContext = createContext<[View, React.Dispatch<React.SetStateAction<View>>]>(["live", () => {}]);

export function ViewContextProvider({children}) {
    const [state, setState] = useState<View>("live");
    
    return (
        <ViewContext.Provider value={[state, setState]}>
            {children}
        </ViewContext.Provider>
    )
}

export default ViewContext;