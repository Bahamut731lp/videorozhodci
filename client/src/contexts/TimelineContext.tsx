import React, { createContext, useState } from "react";

export const TimeContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
export const DurationContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
export const SeekingContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
export const PlayingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);

export function TimelineContextProvider({children}) {
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seek, setSeek] = useState(0);
    const [isPlaying, setPlaying] = useState(false);
    
    return (
        <TimeContext.Provider value={[time, setTime]}>
            <DurationContext.Provider value={[duration, setDuration]}>
                <PlayingContext.Provider value={[isPlaying, setPlaying]}>
                    <SeekingContext.Provider value={[seek, setSeek]}>
                        {children}
                    </SeekingContext.Provider>
                </PlayingContext.Provider>
            </DurationContext.Provider>
        </TimeContext.Provider>
    ) 
}


export default TimelineContextProvider;