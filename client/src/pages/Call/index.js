import "./Call.scss";
import { useEffect, useState } from "react";
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from "../../settings";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Controls from "../../components/Controls";
import Videos from "../../components/Videos";
import { useLocation } from "react-router-dom";

const Call = () => {
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const [time, setTime] = useState("");
    const { state } = useLocation();
    const { username } = state;

    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            const strTime = hours + ':' + minutes + ' ' + ampm;
            setTime(strTime);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const init = async name => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);

                if (mediaType === "video") {
                    setUsers(prevUsers => [...prevUsers, user]);
                }

                if (mediaType === "audio") {
                    user.audioTrack.play();
                }
            });

            client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "audio") {
                    if (user.audioTrack) {
                        user.audioTrack.stop();
                    }
                }

                if (mediaType === "video") {
                    setUsers(prevUsers => prevUsers.filter(element => element.uid !== user.uid));
                }
            });

            client.on("user-left", user => {
                setUsers(prevUsers => prevUsers.filter(element => element.uid !== user.uid));
            });

            try {
                await client.join(config.appId, name, config.token, username);
            } catch (e) {
                console.log(e);
            }

            if (tracks) await client.publish([tracks[0], tracks[1]]);
            setStart(true);
        };

        if (ready && tracks) {
            try {
                init(channelName);
            } catch (e) {
                console.log(e);
            }
        }
    }, [channelName, client, ready, tracks]);

    return (
        <div className="call">
            <div className="call__content">
                <div className="call__content__header">
                    <div className="call__content__header__time">{time}</div>
                    <div className="call__content__header__profile">
                        <AccountCircleIcon fontSize="large" />
                        <div className="call__content__header__profile__name">{username}</div>
                    </div>
                </div>
                <div className="call__content__videos">
                    {ready && tracks && <Videos users={users} tracks={tracks} />}
                </div>
                <Controls tracks={tracks} setStart={setStart} />
            </div>
        </div>
    );
};

export default Call;