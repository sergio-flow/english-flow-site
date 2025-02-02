"use client"

import { useEffect, useState } from "react";
import { checkFullIcon, checkIcon } from "./Icons";

type Params = {
    phraseId: number;
}

export default function CompletePhrase(params: Params) {
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!params.phraseId) return;
        
        if (localStorage.getItem(`phrase-${params.phraseId}-completed`)) {
            setIsCompleted(true);
        }
    }, [params.phraseId]);

    const handleComplete = () => {
        if (isCompleted) {
            localStorage.removeItem(`phrase-${params.phraseId}-completed`);
            setIsCompleted(false);
        } else {
            localStorage.setItem(`phrase-${params.phraseId}-completed`, "true");
            setIsCompleted(true);
        }
    }

    if (isCompleted) {
        return (
            <button onClick={handleComplete} className={`text-xs cursor-pointer rounded-lg`}>
                {checkFullIcon(30, 30, "fill-emerald-400")}
            </button>
        )
    }

    return (
        <button onClick={handleComplete} className={`text-xs cursor-pointer rounded-lg`}>
            {checkIcon(30, 30, "stroke-white")}
        </button>
    )
}