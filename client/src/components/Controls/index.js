import "./Controls.scss";
import { useState } from "react";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import CallEndIcon from '@mui/icons-material/CallEnd';

const Controls = ({ tracks, onLeave }) => {
    const [trackState, setTrackState] = useState({ video: true, audio: true });

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
            <div className="controls__icon" style={{ backgroundColor: trackState.audio ? "#3C4043" : "#EA4335" }} onClick={() => mute("audio")}>
                {trackState.audio ? <MicIcon /> : <MicOffIcon />}
            </div>
            <div className="controls__icon controls__center" style={{ backgroundColor: trackState.video ? "#3C4043" : "#EA4335" }} onClick={() => mute("video")}>
                {trackState.video ? <VideocamOutlinedIcon /> : <VideocamOffOutlinedIcon />}
            </div>
            <div className="controls__icon controls__right" onClick={() => onLeave()}>
                <CallEndIcon fontSize="large" />
            </div>
        </div>
    );
};

export default Controls;