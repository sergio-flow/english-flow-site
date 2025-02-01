"use client"

import { useState } from "react";
import { recordIcon, studyIcon } from "../atoms/Icons";
import StudyModal from "../organisms/StudyModal";

export default function CardFooter() {
    const [showStudyModal, setShowStudyModal] = useState(false)

    return (
        <>
            <div className="columns-2 items-center gap-4 mt-2 bg-black/20 border-t border-gray-700 rounded-bl-lg rounded-br-lg">
                <div onClick={() => setShowStudyModal(true)} className="flex items-center gap-2 p-2 justify-center cursor-pointer hover:bg-white/5">
                    {studyIcon(24, 24, "fill-white/60")} <span className="text-xs font-semibold uppercase text-white/40">Study</span>
                </div>

                <div className="flex items-center gap-2 p-2 justify-center cursor-pointer hover:bg-white/5">
                    {recordIcon(24, 24, "fill-white/60")} <span className="text-xs font-semibold uppercase text-white/40">Record</span>
                </div>

                {/* <div className="flex items-center gap-2 p-2 justify-center bg-orange-400 rounded-lg">
                {recordIcon(24, 24, "fill-white")} <span className="text-xs font-semibold uppercase text-white">Record</span>
            </div> */}
            </div>

            <StudyModal open={showStudyModal} setOpen={setShowStudyModal} />
        </>
    )
}