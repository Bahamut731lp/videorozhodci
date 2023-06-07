import React, { createContext, useState } from "react";

const RecordingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);

export function RecordingContextProvider({children}) {
    const [state, setState] = useState(false);
    
    return (
        <RecordingContext.Provider value={[state, setState]}>
            {children}
        </RecordingContext.Provider>
    )
}

export default RecordingContext;