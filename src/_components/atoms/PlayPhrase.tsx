"use client"

import mediaUrl from "@/_utils/mediaUrl";
import { useAudioPlayer } from "react-use-audio-player";
import { playIcon, stopIcon } from "./Icons";

type Params = {
    audio: string;
}

export default function PlayPhrase(params: Params) {
    const audioPlayer = useAudioPlayer()

    const playBit = () => {
        const volume = localStorage.getItem('volume_phrases');
        audioPlayer.load(mediaUrl(params.audio), {
            format: 'mp3',
            autoplay: false,
            initialVolume: volume ? parseFloat(volume) / 100 : 0.4
        });
        audioPlayer.play()
    }

    if (audioPlayer.playing) {
        return (
            <button className="cursor-pointer" onClick={() => audioPlayer.stop()}>
                {stopIcon(35, 35)}
            </button>
        )
    }

    return (
        <button className="cursor-pointer" onClick={() => playBit()}>
            {playIcon(35, 35)}
        </button>
    )
}