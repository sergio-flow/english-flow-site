"use client"

import Slider from 'rc-slider';
import { useEffect, useState } from 'react';

export default function VolumePhrases() {
    const [defaultValue, setDefaultValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        const volume = localStorage.getItem('volume_phrases');
        setDefaultValue(parseInt(volume || "40"));
    }, []);

    const completeSliding = (value: number) => {
        localStorage.setItem('volume_phrases', value.toString());
    }

    if (!defaultValue) return null;

    return (
        <div>
            <Slider
                defaultValue={defaultValue}
                handleStyle={{ backgroundColor: '#1e2938', borderColor: '#ff8905', width: 20, height: 20, opacity: 1, borderWidth: 3, boxShadow: "0 0 6px -2px #000" }}
                trackStyle={{ backgroundColor: '#ff8905', height: 10 }}
                railStyle={{ backgroundColor: '#404653', height: 10 }}
                dotStyle={{ borderColor: '#ff8905', height: 20 }}
                activeDotStyle={{ borderColor: '#ff8905', width: 20, height: 20 }}
                onChangeComplete={(value: number | number[]) => completeSliding(Array.isArray(value) ? value[0] : value)}
            />
        </div>
    )
}