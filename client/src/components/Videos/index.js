import "./Videos.scss";
import { AgoraVideoPlayer } from "agora-rtc-react";

const Video = ({ users, tracks }) => {
    const data = [];

    data.push([
        { videoTrack: tracks[1], uid: "You" }
    ]);

    if (users.length > 0) {
        data[0].push(users[0]);
    }

    for (let i = 1; i < users.length; i+=2) {
        const arr = [];
        arr.push(users[i]);
        if (i + 1 < users.length) {
            arr.push(users[i + 1]);
        }
        data.push(arr);
    }

    return (
        <div className="videos">
            {data.map(elements => (
                <div className="videos__row">
                    {elements.map(user => (
                        user.videoTrack && <div className="videos__row__wrapper">
                            <div className="videos__row__wrapper__name">{user.uid}</div>
                            <canvas style={{ opacity: 0.5 }} className="videos__row__wrapper__canvas" />
                            <div className="videos__row__wrapper__label" />
                            <AgoraVideoPlayer
                                videoTrack={user.videoTrack}
                                key={user.uid}
                                className="videos__row__wrapper__video"
                                style={{ flex: 1 }}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Video;