import "./Analytics.scss";
import { Checkbox } from "@mui/material";
import { VictoryPie } from "victory-pie";
import { VictoryChart, VictoryLine } from "victory";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const data = [
    { name: "Happy 😊", color: "#6AAB70", percentage: 100/7 },
    { name: "Sad 😔", color: "#BBBC83", percentage: 100/7 },
    { name: "Angry 😡", color: "#F26262", percentage: 100/7 },
    { name: "Disgust 😖", color: "#B865F5", percentage: 100/7 },
    { name: "Fear 😱", color: "#8D8DFB", percentage: 100/7 },
    { name: "Neutral 😐", color: "#D280D2", percentage: 100/7 },
    { name: "Surprise 😲" , color: "#FBBD4B", percentage: 100/7 }
];

const Analytics = () => {
    const navigate = useNavigate();
    const [display, setDisplay] = useState([data[0], data[1], data[2]]);

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
                            {data.map(element => (
                                <tr>
                                    <td style={{ height: "100%", display: "flex", alignItems: "center", fontWeight: 400, paddingTop: 10, flex: 1 }}>
                                        <div style={{ backgroundColor: element.color, height: 10, width: 10, borderRadius: 25, marginRight: 15 }} />
                                        {element.name}
                                    </td>
                                    <td style={{ flex: 1 }}>{element.percentage.toFixed(1)}%</td>
                                    <td>
                                        <Checkbox
                                            disableRipple
                                            checked={display.includes(element)}
                                            onChange={event => {
                                                if (event.target.checked) {
                                                    setDisplay(prev => [...prev, element]);
                                                } else {
                                                    setDisplay(prev => prev.filter(ele => ele !== element))
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
                        </div>
                    </div>
                </div>
                <div className="analytics__content__breakdown">
                    <div className="analytics__breakdown__details">
                        <div className="analytics__content__breakdown__title">Breakdown</div>
                        <div className="analytics__content__breakdown__graph">
                            <VictoryChart>
                                {data.map(element => display.includes(element) && (
                                    <VictoryLine
                                        animate={{ duration: 100 }}
                                        data={[
                                            { x: 2, y: Math.round(Math.random() * 5) },
                                            { x: 4, y: Math.round(Math.random() * 5) },
                                            { x: 6, y: Math.round(Math.random() * 5) },
                                            { x: 8, y: Math.round(Math.random() * 5) }
                                        ]}
                                        style={{ data: { stroke: element.color } }}
                                    />
                                ))}
                            </VictoryChart>
                        </div>
                    </div>
                </div>
                <div style={{ height: 30 }} />
            </div>
        </div>
    );
};

export default Analytics;