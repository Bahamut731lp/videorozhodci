import _ from "lodash";
import React, { useState, useCallback, useEffect, createContext } from "react"

export const DevicesContext = createContext({});
export const DevicesDispatchContext = createContext<React.Dispatch<React.SetStateAction<{}>>>(() => {});

interface ExtendedMediaInfo extends MediaDeviceInfo {
    active: boolean
}

export default function DevicesContextProvider({ children }) {
    const [devices, setDevices] = useState({});

    const handleDevices = useCallback(
        (mediaDevices: MediaDeviceInfo[]) => {
            const filteredDevices: InputDeviceInfo[] = mediaDevices.filter(({ kind }) => kind === "videoinput");
            const entries: [string, ExtendedMediaInfo][] = filteredDevices.map(v => [v.deviceId, {...v.toJSON(), type: "camera", name: "", active: false} as ExtendedMediaInfo]);

            setDevices(Object.fromEntries(entries));
        },
        [setDevices]);

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    )
    
    return (
        <DevicesContext.Provider value={devices}>
            <DevicesDispatchContext.Provider value={setDevices}>
                {children}
            </DevicesDispatchContext.Provider>
        </DevicesContext.Provider>
    )
}