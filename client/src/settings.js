import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "b5ab6e05fb9a4c6ab2d24deb5fba9cad";
const token = "007eJxTYHAz4UtTWVc58V7RscZAifULOb5YaUYdzVwZLfg96MyXfz8UGJJME5PMUg1M05IsE02SzRKTjFKMTFJSk4ACiZbJiSluml7JDYGMDLWPrZgZGSAQxGdhyE3MzGNgAAB48yCS";

export const config = {
    mode: "rtc",
    codec: "vp8",
    appId,
    token
};

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";