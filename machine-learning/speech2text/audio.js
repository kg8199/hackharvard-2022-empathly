const env = require('node:process');
const axios = require("axios")
const audioURL = "https://bit.ly/3yxKEIY" //substitute this with the Url of the video chat audio

//please create an env variable in your machine corresponding to the API key

const APIKey = process.env.ASSEMBLYAI_API_KEY
const refreshInterval = 5000
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: APIKey,
    "content-type": "application/json",
  },
})
const getTranscript = async () => {
    // Sends the audio file to AssemblyAI for transcription
    const response = await assembly.post("/transcript", {
        audio_url: audioURL,
        sentiment_analysis: true,
        entity_detection:true,
        iab_categories: true,
    })

    
    // Interval for checking transcript completion
    const checkCompletionInterval = setInterval(async () => {
        const transcript = await assembly.get(`/transcript/${response.data.id}`)
        const transcriptStatus = transcript.data.status
    
        if (transcriptStatus !== "completed") {
        console.log(`Transcript Status: ${transcriptStatus}`)
        } else if (transcriptStatus === "completed") {
        console.log("\nTranscription completed!\n")
        let transcriptText = transcript.data.text
        console.log(`Your transcribed text:\n\n${transcriptText}`)
        let trascriptSentiment = transcript.data.sentiment_analysis_results
        console.log(trascriptSentiment)
        clearInterval(checkCompletionInterval)
        }
    }, refreshInterval)
    }
    
getTranscript()

// const axios = require("axios");
  
// const assembly = axios.create({
//     baseURL: "https://api.assemblyai.com/v2",
//     headers: {
//         authorization: process.env.ASSEMBLYAI_API_KEY,
//         "content-type": "application/json",
//     },
// });
// assembly
//     .post("/transcript", {
//         audio_url: "https://bit.ly/3yxKEIY",
//         sentiment_analysis: true
//     }).then((res) => console.log(res.data)).catch((err) => console.error(err));