import "./Call.scss";
import { useEffect, useState } from "react";
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from "../../settings";
import Controls from "../../components/Controls";
import Videos from "../../components/Videos";

const Call = () => {
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);

    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

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
                await client.join(config.appId, name, config.token, null);
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
            <div className="call__buttons">
                {ready && tracks && (
                    <Controls tracks={tracks} setStart={setStart} />
                )}
            </div>
            <div className="call__videos">
                {ready && tracks && (
                    <Videos users={users} tracks={tracks} />
                )}
            </div>
        </div>
    );
};

export default Call;