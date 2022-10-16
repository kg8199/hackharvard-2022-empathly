import "./Call.scss";
import { useEffect, useState } from "react";
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from "../../settings";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Controls from "../../components/Controls";
import Videos from "../../components/Videos";
import { useLocation, useNavigate } from "react-router-dom";
import { VictoryPie } from "victory-pie";
import * as faceapi from "face-api.js";

const data = [
    { name: "Happy 😊", color: "#6AAB70", percentage: 100/7 },
    { name: "Sad 😔", color: "#BBBC83", percentage: 100/7 },
    { name: "Angry 😡", color: "#F26262", percentage: 100/7 },
    { name: "Disgust 😖", color: "#B865F5", percentage: 100/7 },
    { name: "Fear 😱", color: "#8D8DFB", percentage: 100/7 },
    { name: "Neutral 😐", color: "#D280D2", percentage: 100/7 },
    { name: "Surprise 😲" , color: "#FBBD4B", percentage: 100/7 }
];

const mapEmotionToEmoji = {
    "happy": "😊",
    "sad": "😔",
    "angry": "😡",
    "disgusted": "😖",
    "fearful": "😱",
    "neutral": "😐",
    "surprised": "😲"
}

const Call = () => {
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const [time, setTime] = useState("");
    const { state } = useLocation();
    const { username } = state;
    const navigate = useNavigate();
    const [showOverview, setShowOverview] = useState(false);

    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    const leaveChannel = async (path) => {
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        navigate(path);
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        document.head.appendChild(script);
        return () => script.parentNode.removeChild(script);      
    }, []);

    useEffect(() => {
        const generateOutput = async (video) => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            if (detections.length) {
                const expressions = detections[0].expressions;
                const max = Object.keys(expressions).reduce((a, v) => Math.max(a, expressions[v]), -Infinity);
                const result = Object.keys(expressions).filter(v => expressions[v] === max)[0];
                video.parentElement.parentElement.previousSibling.innerHTML = `${result} ${result && result in mapEmotionToEmoji && mapEmotionToEmoji[result]}`
            }
        };

        const detect = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            
            setInterval(() => {
                const videos = document.getElementsByTagName("video");

                for (let i = 0; i < videos.length; i++) {
                    const video = videos[i];
                    generateOutput(video);
                }
            }, 100);
        };

        detect();
    }, []);

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
            {showOverview && (<div className="call__overview">
                <div className="call__overview__modal">
                    <div className="call__overview__modal__content">
                        <div className="call__overview__modal__content__title">Here is a quick overview of your meeting</div>
                        <div className="call__overview__modal__content__graph">
                            <div className="call__overview__modal__content__graph__piechart">
                                <VictoryPie
                                    colorScale={data.map(element => element.color)}
                                    data={data.map(element => element.percentage)}
                                    style={{
                                        data: {
                                          stroke: "white", strokeWidth: 1
                                        },
                                        labels: {
                                          fontSize: 0
                                        }
                                    }}
                                />
                            </div>
                            <div className="call__overview__modal__content__graph__stats">
                                {data.map(element => (
                                    <div className="call__overview__modal__content__graph__stats__stat" key={element.name}>
                                        <div className="call__overview__modal__content__graph__stats__stat__color" style={{ backgroundColor: element.color }} />
                                        <div className="call__overview__modal__content__graph__stats__stat__name">{element.name}</div>
                                        <span>-</span>
                                        <div className="call__overview__modal__content__graph__stats__stat__percentage">{element.percentage.toFixed(1)}%</div>  
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="call__overview__modal__content__submission">
                            <div className="call__overview__modal__content__submission__description">View the breakdown of your meeting in a detailed manner</div>
                            <button className="call__overview__modal__content__submission__expand" onClick={() => leaveChannel("/analytics")}>Expand</button>
                            <div className="call__overview__modal__content__submission__leave">
                                <button onClick={() => leaveChannel("/")}>Leave</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
            <div className="call__content">
                <div className="call__content__header">
                    <div className="call__content__header__time">{time}</div>
                    <div className="call__content__header__profile">
                        <AccountCircleIcon fontSize="large" />
                        <div className="call__content__header__profile__name">{username}</div>
                    </div>
                </div>
                <div className="call__content__videos">
                    {!showOverview && ready && tracks && <Videos users={users} tracks={tracks} />}
                </div>
                <Controls tracks={tracks} onLeave={() => setShowOverview(true)} />
            </div>
        </div>
    );
};

export default Call;