import './App.css'

import {useEffect, useState} from "react";
import {AgentConnectionController, connectAgent} from "@play-ai/agent-web-sdk";
import {playAIAgentId} from "../config.ts";
import {CallState} from "./call_state.ts";

function supportsHover() {
    return window.matchMedia('(hover: hover)').matches;
}

function App() {
    const [isCallActive, setIsCallActive] = useState(CallState.inactive);
    const [time, setTime] = useState(0);
    const [agentController, setAgentController] = useState<AgentConnectionController>();



    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isCallActive === CallState.active) {
            interval = setInterval(() => {
                const minutes = parseInt((time / 60).toString());
                const seconds = (time % 60).toString();
                document.getElementById('started-ai-talk-container-timer')!.innerHTML = `${minutes}:${seconds}`;
                setTime((time) => time + 1);
            }, 1000);
        }
        return () => {
            clearInterval(interval)
        };
    }, [time, isCallActive]);


    useEffect(() => {
        if (isCallActive === CallState.inactive && agentController) {
            agentController.hangup();
        }
    }, [isCallActive, agentController]);

    const started_ai_talk_container = () => (
        <div className="started-ai-talk-container">
            <div className="started-ai-talk-container-p">
                <div className="animated-sound-img"></div>
                <p className="ai-talk-container-text" id="started-ai-talk-container-timer">00:00</p>
            </div>
            <div className="started-ai-talk-container-p">
                <svg className="off-mic-img" id="off-mic-img" width="800px" height="800px" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 1C13.6452 1 15.0585 1.99333 15.6728 3.41298L7.99997 11.0858V5C7.99997 2.79086 9.79083 1 12 1Z"/>
                    <path
                        d="M6.24997 12C6.24997 12.2632 6.26801 12.5245 6.30342 12.7823L4.25194 14.8338C3.92295 13.9344 3.74997 12.9761 3.74997 12V11.8438C3.74997 11.2915 4.19769 10.8438 4.74997 10.8438H5.24997C5.80226 10.8438 6.24997 11.2915 6.24997 11.8438V12Z"/>
                    <path
                        d="M7.3242 18.7971L3.76773 22.3535C3.3772 22.7441 2.74404 22.7441 2.35352 22.3535L1.64641 21.6464C1.25588 21.2559 1.25588 20.6227 1.64641 20.2322L20.2322 1.64644C20.6227 1.25591 21.2559 1.25591 21.6464 1.64644L22.3535 2.35354C22.744 2.74407 22.744 3.37723 22.3535 3.76776L16 10.1213V12C16 14.2091 14.2091 16 12 16C11.4457 16 10.9177 15.8873 10.4378 15.6835L9.13553 16.9857C9.99969 17.4822 10.986 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0658 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V23H10.75V20.1548C9.51944 19.9662 8.34812 19.5014 7.3242 18.7971Z"/>
                </svg>
                <p className="ai-talk-container-text">Stop</p>
            </div>
        </div>
    )

    const ai_talk_container = () => (
        <div className="ai-talk-container"
            // Change color to white on mouse enter
             onMouseEnter={() => {
                 if (!supportsHover()) return;
                 document.getElementById("on-mic-img")!.style.fill = "#ffffff";
             }}
            // Change color to black on mouse leave
             onMouseLeave={() => {
                 if (!supportsHover()) return;
                 document.getElementById("on-mic-img")!.style.fill = "#000000";
             }}>
            <svg className="on-mic-img" id="on-mic-img" width="800px" height="800px" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5Z"/>
                <path
                    d="M6.25 11.8438V12C6.25 13.525 6.8558 14.9875 7.93414 16.0659C9.01247 17.1442 10.475 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0659 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V22C13.25 22.5523 12.8023 23 12.25 23H11.75C11.1977 23 10.75 22.5523 10.75 22V20.1548C9.02471 19.8903 7.41579 19.0831 6.16637 17.8336C4.61919 16.2865 3.75 14.188 3.75 12V11.8438C3.75 11.2915 4.19772 10.8438 4.75 10.8438H5.25C5.80228 10.8438 6.25 11.2915 6.25 11.8438Z"/>
            </svg>
            <div className="on-mic-img-hover" id="on-mic-img-hover"></div>
            <p className="ai-talk-container-text">Talk</p>
        </div>
    )

    const ai_talk_connecting_container = () => (
        <div className="ai-talk-container"
            // Change color to white on mouse enter
             onMouseEnter={() => {
                 if (!supportsHover()) return;
                 document.getElementById("on-mic-img")!.style.fill = "#ffffff";
             }}
            // Change color to black on mouse leave
             onMouseLeave={() => {
                 if (!supportsHover()) return;
                 document.getElementById("on-mic-img")!.style.fill = "#000000";
             }}>
            <svg className="on-mic-img" id="on-mic-img" width="800px" height="800px" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5Z"/>
                <path
                    d="M6.25 11.8438V12C6.25 13.525 6.8558 14.9875 7.93414 16.0659C9.01247 17.1442 10.475 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0659 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V22C13.25 22.5523 12.8023 23 12.25 23H11.75C11.1977 23 10.75 22.5523 10.75 22V20.1548C9.02471 19.8903 7.41579 19.0831 6.16637 17.8336C4.61919 16.2865 3.75 14.188 3.75 12V11.8438C3.75 11.2915 4.19772 10.8438 4.75 10.8438H5.25C5.80228 10.8438 6.25 11.2915 6.25 11.8438Z"/>
            </svg>
            <div className="on-mic-img-hover" id="on-mic-img-hover"></div>
            <p className="ai-talk-container-text">Wait ...</p>
        </div>
    )

    async function toggleAiTalk() {
        if (isCallActive === CallState.active) {
            return setIsCallActive(CallState.inactive);
        }
        if (isCallActive === CallState.connecting) {
            return;
        }
        try {
            setTime(0);
            // Start call
            console.log("Start call");
            setIsCallActive(CallState.connecting);
            // PlayAI.connectAgent
            const agentConnController = await connectAgent(playAIAgentId, {
                listeners: {
                    // onUserTranscript: (transcript) => console.log(`USER said: "${transcript}".`),
                    // onAgentTranscript: (transcript) => console.log(`AGENT will say: "${transcript}".`),
                    // onUserStartedSpeaking: () => console.log(`USER started speaking...`),
                    // onUserStoppedSpeaking: () => console.log(`USER stopped speaking.`),
                    // onAgentDecidedToSpeak: () => console.log(`AGENT decided to speak... (not speaking yet, just thinking)`),
                    // onAgentStartedSpeaking: () => console.log(`AGENT started speaking...`),
                    // onAgentStoppedSpeaking: () => console.log(`AGENT stopped speaking.`),
                    onHangup: (endedBy: string) => {
                        console.log(`Conversation has ended by ${endedBy.toUpperCase()}\n`);
                        setIsCallActive(CallState.inactive);
                    },
                    onError: (err: Error) => {
                        console.log(`ERROR during conversation: ${JSON.stringify(err)}`)
                        setIsCallActive(CallState.inactive);
                    },
                }
            });

            setAgentController(agentConnController);
            setIsCallActive(CallState.active);
        } catch (error) {
            setIsCallActive(CallState.inactive);
            return console.error('Failed to start conversation:', error);
        }
    }

    let contianer;
    if (isCallActive == CallState.connecting) {
        contianer = ai_talk_connecting_container();
    } else if (isCallActive == CallState.active) {
        contianer = started_ai_talk_container();
    } else {
        contianer = ai_talk_container();
    }

    return (
        <>
            <div className="talk-container" onClick={toggleAiTalk}>
                {contianer}
            </div>
        </>
    )
}

export default App
