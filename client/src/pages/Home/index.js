import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate("/call")}>Join Call</button>
        </div>
    );
};

export default Home;