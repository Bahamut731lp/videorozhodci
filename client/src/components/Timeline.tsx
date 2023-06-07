import React, { useContext, useEffect } from "react"
import { DurationContext, SeekingContext, TimeContext } from "../contexts/TimelineContext";
import * as Time from "../lib/Time";
import RecordingContext from "../contexts/RecordingContext";
import ViewContext from "../contexts/ViewContext";

export default function Timeline() {
    const [duration, setDuration] = useContext(DurationContext);
    const [time, setTime] = useContext(TimeContext);
    const [seek, setSeek] = useContext(SeekingContext);
    const [isRecording] = useContext(RecordingContext);
    const [view] = useContext(ViewContext);
    const isDisabled = isRecording || duration == 0;

    /**
     * Efekt starající se o změnu času při přeskočení uživatelem
     */
    useEffect(() => {
        setTime(seek);
    }, [seek]);

    useEffect(() => {
        async function updateDuration() {
            //const response = await fetch("http://127.0.0.1:8000/duration");
            //const timelineDuration = await response.text();

            //setDuration(timelineDuration);
        }

        if (isRecording == null) return;
        if (!isRecording) updateDuration();
    }, [isRecording]);

    if (view != "playback") return null;

    return (
        <section className={`${isDisabled ? "opacity-50 cursor-not-allowed select-none" : ""} w-full flex items-center gap-2 text-neutral-400`}>
            <time>{Time.getISODuration(time)}</time>
            <input
                id="default-range"
                type="range"
                value={time}
                disabled={isDisabled}
                max={duration}
                step={0.1}
                onChange={(event) => setSeek(Number(event.target.value))}
                className="disabled:opacity-50 w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-700"
            />
            <time>{Time.getISODuration(duration)}</time>
        </section>
    )
}