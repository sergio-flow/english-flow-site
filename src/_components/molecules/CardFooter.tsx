"use client"

import { useEffect, useRef, useState } from "react";
// import { useAudioRecorder } from 'react-audio-voice-recorder';
import { useAudioPlayer } from 'react-use-audio-player';
import { recordIcon, stopIcon, studyIcon } from "../atoms/Icons";
import StudyModal from "../organisms/StudyModal";

export default function CardFooter() {
    const [showStudyModal, setShowStudyModal] = useState(false)

    const audioPayer = useAudioPlayer()

    const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

    const audioPlayer = useAudioPlayer()

    useEffect(() => {
        if (audioBlob) {
            audioPlayer.load(URL.createObjectURL(audioBlob), {
                format: 'mp3',
                autoplay: false,
            });
        }
    }, [audioBlob]);

    return (
        <>
            {audioBlob && (
                <>
                    {!audioPlayer.playing && (
                        <div className="flex items-center gap-2 px-4">
                            <button onClick={() => audioPlayer.play()} className="text-xs w-full bg-orange-400 p-2 rounded-4xl font-bold uppercase cursor-pointer text-gray-800">
                                Play recording
                            </button>
                        </div>
                    )}

                    {audioPlayer.playing && (
                        <div className="flex items-center gap-2 px-4">
                            <button onClick={() => audioPlayer.play()} className="text-xs w-full bg-orange-400 p-2 rounded-4xl font-bold uppercase cursor-pointer text-gray-800">
                                Stop
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className="columns-2 items-center gap-4 mt-2 bg-black/20 border-t border-gray-700 rounded-bl-lg rounded-br-lg mt-auto">
                <div onClick={() => setShowStudyModal(true)} className="flex items-center gap-2 p-2 justify-center cursor-pointer hover:bg-white/5">
                    {studyIcon(24, 24, "fill-white/60")} <span className="text-xs font-semibold uppercase text-white/40">Study</span>
                </div>

                {!isRecording && (
                    <div onClick={() => startRecording()} className="flex items-center gap-2 p-2 justify-center cursor-pointer hover:bg-white/5">
                        {recordIcon(24, 24, "fill-white/60")} <span className="text-xs font-semibold uppercase text-white/40">Record</span>
                    </div>
                )}

                {isRecording && (
                    <div onClick={() => stopRecording()} className="flex items-center gap-2 p-2 justify-center cursor-pointer bg-sky-400">
                        {stopIcon(24, 24, "fill-white")} <span className="text-xs font-semibold uppercase text-white">Recording...</span>
                    </div>
                )}


                {/* <div className="flex items-center gap-2 p-2 justify-center bg-orange-400 rounded-lg">
                {recordIcon(24, 24, "fill-white")} <span className="text-xs font-semibold uppercase text-white">Record</span>
            </div> */}
            </div>

            <StudyModal open={showStudyModal} setOpen={setShowStudyModal} />
        </>
    )
}

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob]: any = useState(null);
    const mediaRecorderRef: any = useRef(null);
    const audioChunksRef: any = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event: any) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(audioBlob);

                // Clean up the stream properly
                mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
                mediaRecorderRef.current = null; // Reset the reference
            };

            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return { isRecording, startRecording, stopRecording, audioBlob };
};