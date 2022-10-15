import { ClientConfig } from "agora-rtc-react";

export type Config = ClientConfig & { appId: string; token: string; };