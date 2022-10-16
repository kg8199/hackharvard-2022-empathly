import "./Analytics.scss";
import { Checkbox } from "@mui/material";
import { VictoryPie } from "victory-pie";
import { VictoryChart, VictoryLine } from "victory";
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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

const Analytics = () => {
    const navigate = useNavigate();
    const { state: { data } } = useLocation();
    const [display, setDisplay] = useState(["happy" + " " + mapEmotionToEmoji["happy"], "sad" + " " + mapEmotionToEmoji["sad"], "angry" + " " + mapEmotionToEmoji["angry"]]);

    const counts = {};
    for (let i = 0; i < data.length; i++) {
        const emotion = data[i][1];
        if (!counts[emotion]) {
            counts[emotion] = 0;
        }
        counts[emotion] += 1;
    }
    let max = -1;
    let maxNum = null;
    let min = data.length;
    let minNum = null;
    for (let k in counts) {
        if (counts[k] > max) {
            max = counts[k]
            maxNum = k;
        }
        if (counts[k] < min) {
            min = counts[k];
            minNum = k;
        }
    }

    const lines = [
        `${maxNum} was the most common emotion in the meeting`,
        `${minNum} was the least common emotion during the meeting`
    ];

    const agg = [];
    for (let i = 0; i < emotions.length; i++) {
        const emotion = emotions[i];
        agg.push({
            name: `${emotion} ${mapEmotionToEmoji[emotion]}`,
            color: mapEmotionToColor[emotion],
            percentage: ((counts[emotion] | 0) / data.length) * 100
        });
    }

    let dict = {};
    for (let i = 0; i < data.length; i++) {
        const [timestamp, emotion] = data[i];
        if (!dict[emotion]) {
            dict[emotion] = [];
        }
        dict[emotion].push(timestamp);
    }

    for (let k in dict) {
        let d = {};
        for (let i = 0; i < dict[k].length; i++) {
            if (!d[dict[k][i]]) {
                d[dict[k][i]] = 0;
            }
            d[dict[k][i]] += 1;
        }
        dict[k] = d;
    }

    let final = {};

    for (let k in dict) {
        const arr = [];
        for (let j in dict[k]) {
            arr.push({ x: j, y: dict[k][j] });
        }
        final[k] = arr;
    }

    return (
        <div className="analytics">
            <div className="analytics__floating-button" onClick={() => navigate("/")}>
                <LogoutIcon fontSize="large" style={{ color: "white" }} />
            </div>
            <div className="analytics__content">
                <div className="analytics__content__details">
                    <div className="analytics__content__details__title">Detailed Analysis</div>
                    <div className="analytics__content__details__content">
                        <table>
                            <tr style={{ borderBottom: "1px solid #5A5A5A" }}>
                                <th style={{ flex: 1 }}>Emotion</th>
                                <th style={{ flex: 1 }}>Percentage</th>
                                <th>Select Data</th>
                            </tr>
                            <div style={{ height: 10 }} />
                            {agg.map(element => (
                                <tr>
                                    <td style={{ height: "100%", display: "flex", alignItems: "center", fontWeight: 400, paddingTop: 10, flex: 1 }}>
                                        <div style={{ backgroundColor: element.color, height: 10, width: 10, borderRadius: 25, marginRight: 15 }} />
                                        {element.name}
                                    </td>
                                    <td style={{ flex: 1 }}>{element.percentage.toFixed(1)}%</td>
                                    <td>
                                        <Checkbox
                                            disableRipple
                                            checked={display.includes(element.name)}
                                            onChange={event => {
                                                if (event.target.checked) {
                                                    setDisplay(prev => [...prev, element.name]);
                                                } else {
                                                    setDisplay(prev => prev.filter(ele => ele !== element.name))
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </table>
                        <div className="analytics__content__details__content__graph">
                            <div className="analytics__content__details__content__graph__pie">
                                <VictoryPie
                                    colorScale={agg.map(element => element.color)}
                                    data={agg.map(element => element.percentage)}
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
                        </div>
                    </div>
                </div>
                <div className="analytics__content__breakdown">
                    <div className="analytics__breakdown__details">
                        <div className="analytics__content__breakdown__title">Breakdown</div>
                        <div className="analytics__content__breakdown__content">
                            <div className="analytics__content__breakdown__content__graph">
                                <VictoryChart>
                                    {agg.map(element => display.includes(element.name) && final[element.name.substring(0, element.name.length - 3)] && (<VictoryLine
                                            animate={{ duration: 100 }}
                                            data={final[element.name.substring(0, element.name.length - 3)].map(({ x, y }) => ({ x: (x / 100000000000), y }))}
                                            style={{ data: { stroke: element.color } }}
                                        />
                                    ))}
                                </VictoryChart>
                            </div>
                            <div className="analytics__content__breakdown__content__lines">
                                <ul>
                                    {lines.map(line => {
                                        const element = line.split(" ").map(word => {
                                            if (mapEmotionToColor[word]) {
                                                return `<span style="color: ${mapEmotionToColor[word]}">${word}</span>`
                                            }
                                            return word;
                                        }).join(" ");
                                        return (
                                            <li
                                                dangerouslySetInnerHTML={{ __html: element }}
                                                style={{ marginBottom: 25 }}
                                            ></li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: 30 }} />
            </div>
        </div>
    );
};

export default Analytics;