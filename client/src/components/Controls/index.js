import { useState } from "react";
import { useClient } from "../../settings";
import { useNavigate } from "react-router-dom";

const Controls = ({ tracks, setStart }) => {
    const client = useClient();
    const [trackState, setTrackState] = useState({ video: true, audio: true });
    const navigate = useNavigate();

    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        navigate("/");
    };

    const mute = async type => {
        if (type === "audio") {
            await tracks[0].setEnabled(!trackState.audio);
            setTrackState(ps => ({ ...ps, audio: !ps.audio }));
        } else if (type === "video") {
            await tracks[1].setEnabled(!trackState.video);
            setTrackState(ps => ({ ...ps, video: !ps.video }));
        }
    };

    return (
        <div className="controls">
            <button onClick={() => mute("audio")}>
                {trackState.audio ? "mute" : "unmute"}
            </button>
            <button onClick={() => mute("video")}>
                {trackState.video ? "close video" : "open video"}
            </button>
            <button onClick={() => leaveChannel()}>Leave</button>
        </div>
    );
};

export default Controls;