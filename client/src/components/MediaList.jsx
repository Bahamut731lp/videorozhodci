import React, { useContext } from "react";

import { DevicesContext } from "../contexts/DevicesContext";
import Camera from "./Camera";


const WebcamCapture = () => {
    const devices = useContext(DevicesContext);

    return (
        <section id="cam_list" className="flex flex-col items-start gap-4 w-full select-none overflow-y-scroll h-full">
            {
                Object.entries(devices).map(([key, device]) => {
                    return (
                        <Camera 
                            key={key}
                            device={device}
                            label={device.label}
                        />
                    )
                })
            }
        </section>

    );
};

export default WebcamCapture;