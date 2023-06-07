import React, { CSSProperties, useContext, useEffect, useState } from "react"
import Camera from "./Camera";
import LayoutContext from "../contexts/LayoutContext";

function Tile(props) {
    const [device, setDevice] = useState(props.id || null);

    useEffect(() => {
        if ((props.id ?? null) != null) setDevice(props.id);
    }, [props]);

    function onDragOver(event) {
        event.preventDefault();
    }

    function onDrop(event) {
        event.preventDefault();
        setDevice(JSON.parse(event.dataTransfer.getData("device")))
    }

    return (
        <section id="preview" className="w-full h-full overflow-hidden bg-neutral-800 mx-auto grid place-items-center" onDrop={onDrop} onDragOver={onDragOver}>
            {
                (!device) ? (
                    <h1 className="text-neutral-600 text-center">Klikněte na jeden z aktivních pohledů pro zobrazení zvětšeného pohledu</h1>
                ) : (
                    <div className="relative cursor-pointer aspect-video mx-auto w-full h-full ">
                        <Camera device={device} raw></Camera>
                    </div>
                )
            }
        </section>
    )
}

export default function MediaPreview() {
    const [layout] = useContext(LayoutContext);

    const style: CSSProperties = {
        gridTemplateColumns: `repeat(${layout.width}, 1fr)`,
        gridTemplateRows: `repeat(${layout.height}, 1fr)`
    }

    const cameras = layout.cameras ?? [];
    const tiles = new Array(layout.width * layout.height).fill("")

    if (cameras.length > 0) tiles.splice(0, cameras.length, ...cameras)

    return (
        <div className="max-h-[82vh] h-full grid w-full gap-1" style={style}>
            {
                tiles.map((v, i) => <Tile key={i} id={v}></Tile>)
            }
        </div>
    );
}