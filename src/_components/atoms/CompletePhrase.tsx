"use client"

import { useEffect, useState } from "react";
import { checkIcon, playIcon, stopIcon } from "./Icons";

type Params = {
    phraseId: string;
}

export default function CompletePhrase(params: Params) {
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(`phrase-${params.phraseId}-completed`)) {
            setIsCompleted(true);
        }
    }, []);

    const handleComplete = () => {
        if (isCompleted) {
            localStorage.removeItem(`phrase-${params.phraseId}-completed`);
            setIsCompleted(false);
        } else {
            localStorage.setItem(`phrase-${params.phraseId}-completed`, "true");
            setIsCompleted(true);
        }
    }

    return (
        <button onClick={handleComplete} className={`text-xs cursor-pointer rounded-lg`}>
            {checkIcon(24, 24, isCompleted ? "stroke-emerald-400" : "stroke-white")}
        </button>
    )
}