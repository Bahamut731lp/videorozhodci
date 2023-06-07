import React, { useContext } from "react";
import RecordingContext from "../contexts/RecordingContext";
import ViewContext from "../contexts/ViewContext";
import { PlayingContext } from "../contexts/TimelineContext";

export default function TimelineControls() {
    const [isRecording, setRecording] = useContext(RecordingContext);
    const [isPlaying, setPlaying] = useContext(PlayingContext);

    const [view] = useContext(ViewContext);
    
    return (
        <div className="flex gap-2">
            <button disabled={view != "live"} className={`${view != "live" ? "pointer-events-none opacity-50" : ""} ${isRecording ? "bg-red-700 text-white" : "text-red-700"} border border-red-700 p-2 hover:text-white transition duration-75`} onClick={() => setRecording(prev => !prev)}>
                {
                    isRecording ? <>Zastavit Nahrávání</>: <>Spustit Nahrávání</>
                }
            </button>
            <button disabled={view != "playback"} className={`${view != "playback" ? "pointer-events-none opacity-50" : ""} ${isPlaying ? "bg-lime-700 text-white" : "text-lime-700"} border border-lime-700 p-2 hover:text-white transition duration-75`} onClick={() => setPlaying(prev => !prev)}>
                {
                    isPlaying ? <>Zastavit Přehrávání</>: <>Spustit Přehrávání</>
                }
            </button>
        </div>
    )
}