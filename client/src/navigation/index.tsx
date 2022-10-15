import { HashRouter, Routes, Route } from "react-router-dom";

import { ROUTE } from "../types";

import {
    About,
    Analytics,
    Call,
    Contact,
    Home,
    PageNotFound
} from "../pages";

const Navigator = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={ROUTE.ABOUT} element={<About />} />
                <Route path={ROUTE.CONTACT} element={<Contact />} />
                <Route path={ROUTE.CALL} element={<Call />} />
                <Route path={ROUTE.ANALYTICS} element={<Analytics />} />
                <Route path={ROUTE.HOME} element={<Home />} />
                <Route path={ROUTE.DEFAULT} element={<PageNotFound />} />
            </Routes>
        </HashRouter>
    );
};

export default Navigator;