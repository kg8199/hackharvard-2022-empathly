import "./App.scss";
import { HashRouter, Routes, Route } from "react-router-dom";

import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Call from "./pages/Call";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/call" element={<Call />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
