import { ClientConfig } from "agora-rtc-react";

export type Config = ClientConfig & { appId: string; token: string; };

export enum ROUTE {
    ABOUT = "/about",
    CONTACT = "/contact",
    HOME = "/",
    CALL = "/call",
    ANALYTICS = "/analytics",
    DEFAULT = "*"
}