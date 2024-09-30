// components/ImageUpload.js
import React, { useRef, useState } from 'react';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '@/firebase/firebase';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button } from '@mantine/core';


const ImageUpload = () => {
    const [file, setFile] = useState<File>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(undefined);
            console.log('no file uploaded');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const storageRef = ref(storage, `images/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error("Error uploading file: ", error);
            alert('File upload failed.');
        }
    };
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input when the label is clicked
        }
    };

    return (
        <div className='hover:cursor-pointer flex flex-col items-start justify-start'>
            <div onClick={handleClick} className='hover:cursor-pointer flex flex-row items-start justify-start'>
                <PencilSquareIcon className="h-5 w-5 text-[#38bdba] mr-2" />
                <label
                    className='text-[#38bdba] text-sm cursor-pointer'
                >
                    Upload Image
                </label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" // Hide the default file input
                    accept="image/*" // Optional: limit to image files
                />
            </div>
        </div>
    );
};

export default ImageUpload;
