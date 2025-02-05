"use client"

import { useRef, useState } from "react";
import { useAudioPlayer } from 'react-use-audio-player';
import { recordIcon, stopIcon, studyIcon } from "../atoms/Icons";
import StudyModal from "../organisms/StudyModal";
import TypePhrase from "@/_types/TypePhrase";

type Params = {
    countryCode: string;
    languageCode: string;
    phrase: TypePhrase;
    texts: {
        [key: string]: string;
    }
}

export default function CardFooter(params: Params) {
    const [showStudyModal, setShowStudyModal] = useState(false)

    const { countryCode, languageCode, phrase, texts } = params

    const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

    const audioPlayer = useAudioPlayer()

    const playBit = () => {
        if (!audioBlob) return;
        const volume = localStorage.getItem('volume_recordings');
        audioPlayer.load(URL.createObjectURL(audioBlob), {
            format: 'mp3',
            autoplay: false,
            initialVolume: volume ? parseFloat(volume) / 100 : 0.8
        });
        audioPlayer.play()
    }

    return (
        <>
            {audioBlob && (
                <>
                    {!audioPlayer.playing && (
                        <div className="flex items-center gap-2 px-4">
                            <button onClick={() => playBit()} className="text-xs w-full bg-orange-400 p-2 rounded-4xl font-bold uppercase cursor-pointer text-gray-800">
                                {texts.play}
                            </button>
                        </div>
                    )}

                    {audioPlayer.playing && (
                        <div className="flex items-center gap-2 px-4">
                            <button onClick={() => audioPlayer.play()} className="text-xs w-full bg-orange-400 p-2 rounded-4xl font-bold uppercase cursor-pointer text-gray-800">
                                {texts.stop}
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className="columns-2 items-center gap-4 mt-2 bg-black/20 border-t border-gray-700 rounded-bl-lg rounded-br-lg mt-auto">
                <div onClick={() => setShowStudyModal(true)} className="flex items-center gap-2 p-2 justify-center cursor-pointer hover:bg-white/5">
                    {studyIcon(24, 24, "fill-white/60")} <span className="text-[10px] font-bold uppercase text-white/40">{texts.study}</span>
                </div>

                {!isRecording && (
                    <div onClick={() => startRecording()} className="flex items-center gap-2 p-2 justify-center cursor-pointer hover:bg-white/5">
                        {recordIcon(24, 24, "fill-white/60")} <span className="text-[10px] font-bold uppercase text-white/40">{texts.record}</span>
                    </div>
                )}

                {isRecording && (
                    <div onClick={() => stopRecording()} className="flex items-center gap-2 p-2 justify-center cursor-pointer bg-sky-400">
                        {stopIcon(24, 24, "fill-white")} <span className="text-[10px] font-bold uppercase text-white">{texts.recording}</span>
                    </div>
                )}


                {/* <div className="flex items-center gap-2 p-2 justify-center bg-orange-400 rounded-lg">
                {recordIcon(24, 24, "fill-white")} <span className="text-xs font-semibold uppercase text-white">Record</span>
            </div> */}
            </div>

            <StudyModal
                countryCode={countryCode}
                languageCode={languageCode}
                phrase={phrase}
                open={showStudyModal}
                setOpen={setShowStudyModal}
            />
        </>
    )
}

export const texts = {
    study: 'Study',
    record: 'Record',
    stop: 'Stop',
    play: 'Play recording',
    recording: 'Recording...',
}

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [audioBlob, setAudioBlob] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const mediaRecorderRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const audioChunksRef = useRef<any>([]); // eslint-disable-line @typescript-eslint/no-explicit-any

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
                mediaRecorderRef.current.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
                mediaRecorderRef.current = null; // Reset the reference
            };

            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return { isRecording, startRecording, stopRecording, audioBlob };
};