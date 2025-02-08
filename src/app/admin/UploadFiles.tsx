"use client"

import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone'
import { useCallback } from "react";

export default function UploadFiles() {
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const formData = new FormData();

        for (let i = 0; i < acceptedFiles.length; i++) {
            formData.append('audioFiles', acceptedFiles[i]);
        }

        fetch('/api/upload-audio-files', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success(data.message);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div className="max-w-md mx-auto py-10 px-4">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
                <Image
                    width={56}
                    height={56}
                    alt="English Flow"
                    src="/logo.png"
                    className="mx-auto h-14 w-auto"
                />
            </div>

            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-400 rounded-lg" {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p className="text-sm text-white">Drag and drop your files here.</p> :
                        <p className="text-sm text-white text-center">Drag &apos;n&apos; drop some files here,<br />or click to select files</p>
                }
            </div>

            <Toaster
                toastOptions={{
                    style: {
                        fontWeight: 500,
                        fontSize: '14px',
                    }
                }}
            />
        </div>
    );
}
