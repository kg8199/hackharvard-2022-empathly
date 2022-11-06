import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "6e0a6ef0ffb0458baee0b52f01b12012";
const token = "007eJxTYLD6khI5YdMSq+9Gn/SK3sy9P0Xj++3kPaGz0h4d5lmafixYgSHJNDHJLNXANC3JMtEk2SwxySjFyCQlNQkokGiZnJhyfEt6ckMgI4P07FhmRgYIBPFZGHITM/MYGABVESMl";

export const config = {
    mode: "rtc",
    codec: "vp8",
    appId,
    token
};

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";