import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "6e0a6ef0ffb0458baee0b52f01b12012";
const token = "007eJxTYOD9U//EUaXglt7OU7oSb2U5ykVij+3k92YKanIsehDwKFeBIck0Mcks1cA0Lcky0STZLDHJKMXIJCU1CSiQaJmcmFJd653cEMjI0HQ2kpmRAQJBfBaG3MTMPAYGAAA9HwE=";

export const config = {
    mode: "rtc",
    codec: "vp8",
    appId,
    token
};

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";