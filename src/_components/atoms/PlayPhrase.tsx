"use client"

import mediaUrl from "@/_utils/mediaUrl";
import { useEffect } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { playIcon, stopIcon } from "./Icons";

type Params = {
    audio: string;
}

export default function PlayPhrase(params: Params) {
    const audioPlayer = useAudioPlayer()

    useEffect(() => {
        audioPlayer.load(mediaUrl(params.audio), {
            format: 'mp3',
            autoplay: false,
        });
    }, []);

    if (audioPlayer.playing) {
        return (
            <button onClick={() => audioPlayer.pause()}>
                {stopIcon(35, 35)}
            </button>
        )
    }
    return (
        <button onClick={() => audioPlayer.play()}>
            {playIcon(35, 35)}
        </button>
    )
}