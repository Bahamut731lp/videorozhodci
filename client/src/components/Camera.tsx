import React, { useEffect, useRef, useContext, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";
import RecordingContext from "../contexts/RecordingContext";
import ViewContext from "../contexts/ViewContext";
import { TimeContext, PlayingContext, SeekingContext, DurationContext } from "../contexts/TimelineContext";
import LayoutContext from "../contexts/LayoutContext";
import Hls from "hls.js";

Camera.DisabledView = () => {
    return (
        <div className="aspect-video bg-neutral-900 text-neutral-700 grid place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
            </svg>
            <section className="text-center self-start">
                <h1 className="font-bold uppercase tracking-wide leading-loose">Vypnutý zdroj</h1>
                <p className="text-xs">Vypnuté zdroje se nenahrávají.</p>
            </section>
        </div>
    )
}

Camera.Toggle = (props) => {
    return (
        <span className="p-1 absolute top-0 right-0 bg-black z-50 opacity-50 flex items-center gap-1 text-xs">
            <button onClick={() => props.setState(prev => !prev)}>
                {
                    props.state ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                        </svg>

                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>

                    )
                }
            </button>
        </span>
    )
}

Camera.Label = ({ children }) => {
    const [state, setState] = useState(String(children || "Unknown Device"));

    return (
        <span className="w-full absolute bottom-0 z-50 flex items-center gap-1 text-xs">
            <input
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="w-full focus:outline-none p-1 text-neutral-400 bg-black/50 focus:bg-black focus:text-white"
            />
        </span>
    )
}

/**
 * Komponenta pro abstrakci živých přenosů
 */
Camera.Stream = forwardRef((props: { source: string }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current || !Hls.isSupported() || !props.source) return;

        const player = new Hls();
        player.attachMedia(videoRef.current);
        player.loadSource(props.source);

    }, [videoRef, props.source]);

    useImperativeHandle(ref, () => {
        return videoRef.current ?? null;
    }, [videoRef]);

    return (
        <video 
            autoPlay
            muted 
            ref={videoRef} 
            className="aspect-video object-cover"
        />
    );
})

/**
 * Komponenta pro abstrakci hardwarových kamer
 */
Camera.Webcam = forwardRef((props: { source: string }, ref) => {
    const videoConstraints = {
        width: 4096,
        height: 2160,
        aspectRatio: { ideal: 1.777777778 }
    }

    const mediaElementRef = useRef<Webcam>(null);

    useImperativeHandle(ref, () => {
        return mediaElementRef.current?.video ?? null;
    }, [mediaElementRef]);

    return (
        <Webcam ref={mediaElementRef} audio={false} videoConstraints={{ ...videoConstraints, deviceId: props.source }} />
    )
});

Camera.Video = ({ device }) => {
    const [isRecording] = useContext(RecordingContext);
    const [isPlaying] = useContext(PlayingContext);
    const [view] = useContext(ViewContext);
    const [time, setTime] = useContext(TimeContext);
    const [, setDuration] = useContext(DurationContext);
    const [seek] = useContext(SeekingContext);
    const [, setLayout] = useContext(LayoutContext);

    const mediaElementRef = useRef<HTMLMediaElement>(null);
    const playbackRef = useRef<HTMLMediaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const startTime = useRef<Date | null>(null);
    const source = device.type == "camera" ? (device.deviceId) : (device.url);
    const playbackURL = new URL("http://localhost:8000/video");
    playbackURL.searchParams.set("device", source);


    /**
     * Handler pro započetí nahrávání
     */
    function startRecording() {
        console.log(mediaElementRef.current);
        mediaRecorderRef.current = new MediaRecorder(mediaElementRef.current.captureStream(), { mimeType: 'video/x-matroska;codecs=avc1' });
        startTime.current = new Date();

        mediaRecorderRef.current.addEventListener('dataavailable', async function (e) {
            fetch("http://127.0.0.1:8000/video", {
                method: "POST",
                headers: {
                    "x-device": device.deviceId
                },
                body: e.data
            });
        });

        mediaRecorderRef.current.start(100);
    }

    /**
     * Handler pro ukončení nahrávání
     */
    function stopRecording() {
        if (!mediaRecorderRef.current || !playbackRef.current || !startTime.current) return;
        mediaRecorderRef.current.stop();
        setDuration(new Date().getTime() - startTime.current!.getTime());
        startTime.current = null;
    }

    function updateTimeline() {
        const value = Math.round(playbackRef.current!.currentTime * 100) / 100;
        setTime(value * 1000);
    }

    useEffect(() => {
        if (!mediaElementRef.current) return;

        if (view == "live") mediaElementRef.current.video?.play();
        else mediaElementRef.current.video?.pause();

    }, [mediaElementRef, view]);

    /**
     * Efekt starající se o spuštění/zastavení nahrávání
     */
    useEffect(() => {
        if (!mediaElementRef.current && !mediaRecorderRef) return;

        if (isRecording) startRecording();
        else stopRecording();
    }, [isRecording, mediaElementRef]);

    /**
     * Efekt starající se o spouštění/zastavení přehrávání
     */
    useEffect(() => {
        if (!playbackRef.current) return;

        if (isPlaying) {
            playbackRef.current.play();
        }
        else {
            playbackRef.current.pause();
        }
    }, [playbackRef, isPlaying]);

    /**
     * Efekt starajícíse o přeskakování ve videu
     */
    useEffect(() => {
        if (!playbackRef.current) return;

        // Čas v proměnné time je v milisekundách, ovšem currentTime potřebuje sekundy.
        playbackRef.current.addEventListener("timeupdate", updateTimeline);

        return () => {
            playbackRef.current?.removeEventListener("timeupdate", updateTimeline);
        }
    }, [playbackRef, time]);

    /**
     * Efekt starajícíse o přeskakování ve videu (resp. elementu)
     */
    useEffect(() => {
        if (!playbackRef.current) return;
        // Čas v proměnné time je v milisekundách, ovšem currentTime potřebuje sekundy.
        playbackRef.current.currentTime = seek / 1000;
    }, [playbackRef, seek]);

    /**
     * Efekt starající se o nastavení času na počátku životního cyklu kamery
     */
    useEffect(() => {
        if (!playbackRef.current) return;

        //Prvotní nastavení času v případě, že se kamera teprve nainstancovala
        playbackRef.current.currentTime = time / 1000;
    }, []);

    function onDrag(event) {
        event.dataTransfer.setData("device", JSON.stringify(device))
    }

    function onClick() {
        setLayout({ width: 1, height: 1, cameras: [device] })
    }

    return (
        <>
            <div
                className="absolute top-0 left-0 object-scale-down"
                onDragStart={onDrag}
                onClick={onClick}
                draggable
            >
                <video muted src={view != "playback" ? "" : playbackURL.href} ref={playbackRef} className={`absolute w-full ${view != "playback" ? "hidden" : "bg-black"}`}></video>
                {
                    device.type == "camera" ? (
                        <Camera.Webcam ref={mediaElementRef} source={device.deviceId} />
                    ) : (
                        <Camera.Stream ref={mediaElementRef} source={device.url} />
                    )
                }
            </div >
        </>
    );
}

Camera.defaultProps = {
    onClick: () => { }
}

export default function Camera(props) {
    const [disabled, setDisabled] = useState(false);

    return (
        <div className="relative cursor-pointer w-full h-auto aspect-video">
            {
                disabled ? (
                    <Camera.DisabledView />
                ) : (
                    <Camera.Video {...props} />
                )
            }

            {
                !props.raw && (
                    <>
                        <Camera.Label>{props.label ?? props.deviceId}</Camera.Label>
                        <Camera.Toggle state={disabled} setState={setDisabled} />
                    </>
                )
            }
        </div >
    );
}