import "./Home.scss";
import Navbar from "../../components/Navbar";
import LandingImage from "../../assets/landing.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [name, setName] = useState("");

    return (
        <div className="home">
            <Navbar />
            <div className="home__body">
                <div className="home__body__content">
                    <div className="home__body__content__title">AI Powered Emotion Analysis</div>
                    <div className="home__body__content__description">Empath.ly uses AI to help you empathize with your employees, friends, and loved ones - be it over video, in person, or in the metaverse.</div>
                    <input
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`${error && "home__body__content__inputerror"}`}
                    />
                    <button
                        onClick={() => {
                            console.log(name)
                            if (name.length === 0) {
                                setError(true);
                                console.log("error set")
                            } else {
                                setError(false);
                                navigate("/call");
                            }
                        }}
                    >
                        Join a meeting
                    </button>
                </div>
                <div className="home__body__image">
                    <img src={LandingImage} />
                </div>
            </div>
        </div>
    );
};

export default Home;