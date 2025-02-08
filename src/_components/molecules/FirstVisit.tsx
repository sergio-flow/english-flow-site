"use client"

import fetchIpInfo from "@/_utils/fetchIpInfo"
import { Language } from "@/_utils/fetchLanguages"
import { redirect } from "next/navigation"
import { useEffect, useRef } from "react"

type Params = {
    languages: Language[]
}

const FirstVisit = (params: Params) => {

    const firstRunRef = useRef(true)

    useEffect(() => {
        const handleVisit = async () => {
            const cached = localStorage.getItem('firstVisit')
            if (cached) return

            localStorage.setItem('firstVisit', 'true')
            const ipInfo = await fetchIpInfo()

            const language = params.languages.find(l => l.countryCode === ipInfo.country)

            redirect(`/${language?.countryCode.toLowerCase()}/${language?.languageCode.toLowerCase()}`)
        }

        if (firstRunRef.current) {
            firstRunRef.current = false
            handleVisit()
        }
    }, [])


    return <></>
}

export default FirstVisit