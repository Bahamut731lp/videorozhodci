import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = (props) => {
    const videoNode = useRef(null);
    const [player, setPlayer] = useState(null);

    const videoJsOptions = {
        fill: true,
        fluid: true,
        autoplay: true,
        controls: false,
        muted: true,
        preload: "metadata"
    }
    
    useEffect(() => {
        if (videoNode.current) {
            const _player = videojs(videoNode.current, videoJsOptions);
            setPlayer(_player);

            return () => {
                if (player !== null) {
                    player.dispose();
                }
            };
        }
    }, []);

    //Tohle je asi prasárna... přezkoumat... někdy...
    useEffect(() => {
        if (player != null) {
            player.src({src: props.url,type: 'application/x-mpegURL'});
        }
    }, [props.url]);
    
    return (
        <div data-vjs-player>
            <video ref={videoNode} className="video-js"></video>
        </div>
    );
};

export default Video;