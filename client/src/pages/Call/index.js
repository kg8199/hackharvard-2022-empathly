import "./Call.scss";
import { useEffect, useState } from "react";
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from "../../settings";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Controls from "../../components/Controls";
import Videos from "../../components/Videos";
import { useLocation, useNavigate } from "react-router-dom";
import { VictoryPie } from "victory-pie";
import * as faceapi from "face-api.js";
import { Switch } from "@mui/material";

const emotions = ["happy", "sad", "angry", "disgusted", "fearful", "neutral", "surprised"];

const mapEmotionToEmoji = {
    "happy": "😊",
    "sad": "😔",
    "angry": "😡",
    "disgusted": "😖",
    "fearful": "😱",
    "neutral": "😐",
    "surprised": "😲"
};

const mapEmotionToColor = {
    "happy": "#6AAB70",
    "sad": "#BBBC83",
    "angry": "#F26262",
    "disgusted": "#B865F5",
    "fearful": "#8D8DFB",
    "neutral": "#D280D2",
    "surprised": "#FBBD4B"
};

var lastRecord = 0;
const data = [];

const Call = () => {
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const [time, setTime] = useState("");
    const { state } = useLocation();
    const { username } = state;
    const navigate = useNavigate();
    const [showOverview, setShowOverview] = useState(false);
    const [aggregates, setAggregates] = useState([]);
    const [accessible, setAccessible] = useState(false);

    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    const leaveChannel = async (path) => {
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        navigate(path, { state: { data } });
    };

    useEffect(() => {
        document.addEventListener("keypress", e => {
            if (e.key === "s") {
                let count = {};
                for (let i = 0; i < 4; i++) {
                    const emotion = data[data.length-1-i][1];
                    if (!count[emotion]) {
                        count[emotion] = 0;
                    }
                }

                let res = "";
                let max = -1;

                for (let k in count) {
                    if (count[k] > max) {
                        res = k;
                        max = count[k]
                    }
                }

                var msg = new SpeechSynthesisUtterance();
                msg.text = "The overall feeling in the room is " + res;
                window.speechSynthesis.speak(msg);
            } else if ((e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4")) {
                const videos = document.getElementsByTagName("video");
                const index = Number(e.key) - 1;
                
                if (index < videos.length) {
                    for (let i = 0; i < videos.length; i++) {
                        videos[i].parentNode.classList.remove("selected");
                    }

                    const video = videos[index];
                    video.parentNode.classList.add("selected");

                    const name = video.parentNode.parentNode.parentNode.firstChild.innerHTML;
                    let emotion = video.parentNode.parentNode.parentNode.children.item(2).innerHTML;
                    emotion = emotion.substring(0, emotion.length - 2);

                    var msg = new SpeechSynthesisUtterance();
                    msg.text = name + (index === 0 ? " are" : " is") + " feeling " + emotion;
                    window.speechSynthesis.speak(msg);
                }
            }
        })
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        document.head.appendChild(script);
        return () => script.parentNode.removeChild(script);      
    }, []);

    useEffect(() => {
        const generateOutput = async (video, timestamp) => {
            try {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                if (detections.length) {
                    const expressions = detections[0].expressions;
                    const max = Object.keys(expressions).reduce((a, v) => Math.max(a, expressions[v]), -Infinity);
                    const result = Object.keys(expressions).filter(v => expressions[v] === max)[0];
                    let canvas = video.parentElement.parentElement.previousSibling.previousSibling;
                    if (accessible) {
                        canvas.style.backgroundColor = mapEmotionToColor[result];
                    } else {
                        canvas.style.backgroundColor = "transparent";
                    }
                    data.push([timestamp, result]);
                    lastRecord = timestamp;
                    video.parentElement.parentElement.previousSibling.innerHTML = `${result} ${result && result in mapEmotionToEmoji && mapEmotionToEmoji[result]}`;
                }
            } catch (e) {
                console.log("detection not wokring")
            }
        };

        let intervalId;

        const detect = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            
            intervalId = setInterval(() => {
                const timestamp = Date.now();
                const videos = document.getElementsByTagName("video");

                for (let i = 0; i < videos.length; i++) {
                    const video = videos[i];
                    generateOutput(video, timestamp);
                }
            }, 100);
        };

        detect();

        return () => {
            clearInterval(intervalId)
        };
    }, [accessible]);

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
                    console.log(user.audioTrack.play)
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
                                    colorScale={aggregates.map(element => element.color)}
                                    data={aggregates.map(element => element.percentage)}
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
                                {aggregates.map(element => (
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
                    <div className="call__content__header__time">
                        {time}
                        <div className="call__content__header__time__switch">
                            <div className="call__content__header__time__switch__label">Accessible Mode</div>
                            <Switch checked={accessible} onChange={event => setAccessible(event.target.checked)} />
                        </div>
                    </div>
                    <div className="call__content__header__profile">
                        <AccountCircleIcon fontSize="large" />
                        <div className="call__content__header__profile__name">{username}</div>
                    </div>
                </div>
                <div className="call__content__videos">
                    {!showOverview && ready && tracks && <Videos users={users} tracks={tracks} />}
                </div>
                <Controls tracks={tracks} onLeave={() => {
                    const counts = {};
                    for (let i = 0; i < data.length; i++) {
                        const emotion = data[i][1];
                        if (!counts[emotion]) {
                            counts[emotion] = 0;
                        }
                        counts[emotion] += 1;
                    }
                    const agg = [];
                    for (let i = 0; i < emotions.length; i++) {
                        const emotion = emotions[i];
                        agg.push({
                            name: `${emotion} ${mapEmotionToEmoji[emotion]}`,
                            color: mapEmotionToColor[emotion],
                            percentage: ((counts[emotion] | 0) / data.length) * 100
                        });
                    }
                    setAggregates(agg);
                    setShowOverview(true);
                }} />
            </div>
        </div>
    );
};

export default Call;