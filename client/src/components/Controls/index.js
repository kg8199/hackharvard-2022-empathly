import "./Controls.scss";
import { useState } from "react";
import { useClient } from "../../settings";
import { useNavigate } from "react-router-dom";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import CallEndIcon from '@mui/icons-material/CallEnd';

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
            <div className="controls__icon" onClick={() => mute("audio")}>
                {trackState.audio ? <MicIcon /> : <MicOffIcon />}
            </div>
            <div className="controls__icon controls__center" onClick={() => mute("video")}>
                {trackState.video ? <VideocamOutlinedIcon /> : <VideocamOffOutlinedIcon />}
            </div>
            <div className="controls__icon controls__right" onClick={() => leaveChannel()}>
                <CallEndIcon fontSize="large" />
            </div>
            {/* <button onClick={() => mute("audio")}>
                {trackState.audio ? "mute" : "unmute"}
            </button>
            <button onClick={() => mute("video")}>
                {trackState.video ? "close video" : "open video"}
            </button>
            <button onClick={() => leaveChannel()}>Leave</button> */}
        </div>
    );
};

export default Controls;