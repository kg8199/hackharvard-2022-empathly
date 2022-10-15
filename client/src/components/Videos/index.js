import "./Videos.scss";
import { AgoraVideoPlayer } from "agora-rtc-react";

const Video = ({ users, tracks }) => {
    return (
        <div className="videos">
            <AgoraVideoPlayer videoTrack={tracks[1]} className="videos__video" />
            {users && users.map(user => (
                user.videoTrack && <AgoraVideoPlayer videoTrack={user.videoTrack} key={user.uid} className="videos__video" />
            ))}
        </div>
    );
};

export default Video;