import React, { useContext } from "react";
import ViewContext from "../contexts/ViewContext";
import Button from "./Button";
import { DevicesDispatchContext } from "../contexts/DevicesContext";

export default function View({ children }) {

    return (
        <section className="flex gap-2 w-full">
            {children}
        </section>
    );
}

View.Playback = () => {
    const [view, setView] = useContext(ViewContext);

    return (
        <button onClick={() => setView("playback")} className={`text-xs bg-neutral-800 border border-neutral-600 h-full px-4 py-2 flex-1 ${view == "playback" ? "bg-neutral-600" : ""}`}>
            Záznam
        </button>
    )
}

View.Live = () => {
    const [view, setView] = useContext(ViewContext);

    return (
        <button onClick={() => setView("live")} className={`text-xs bg-neutral-800 border border-neutral-600 h-full px-4 py-2 flex-1 ${view == "live" ? "bg-neutral-600" : ""}`}>
            Živě
        </button>
    )
}

View.Add = () => {
    const addDevice = useContext(DevicesDispatchContext);

    function addStream(event) {
        event.preventDefault();

        const url = window.prompt("Vlož odkaz na m3u8 playlist");
        if (!url) return;

        try {
            new URL(url);
        } catch (_) {
            alert("Byla zadána neplatná URL");
            return;
        }

        const id = crypto.randomUUID();
        addDevice(prev => ({...prev, [url]: { deviceId: id, type: "stream", url }}))
    }

    return (
        <Button onClick={addStream}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
        </Button>
    )
}

View.Reload = () => {
    return (
        <Button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        </Button>
    )
}