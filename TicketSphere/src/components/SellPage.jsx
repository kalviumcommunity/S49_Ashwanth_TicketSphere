import React, { useState } from "react";
import "./Sell.css";
import { useDropzone } from 'react-dropzone';

export default function SellPage() {
    const [eventName, setEventName] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [price, setPrice] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const updatedFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setUploadedFiles(updatedFiles);
        },
    });

    const handleEventNameChange = (event) => {
        setEventName(event.target.value);
    };

    const handleEventLocationChange = (event) => {
        setEventLocation(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('eventName', eventName);
        formData.append('eventLocation', eventLocation);
        formData.append('price', price);
        uploadedFiles.forEach(file => formData.append('images', file));

        try {
            const response = await fetch('http://localhost:3000/sell', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('Event has been successfully submitted!');
            
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            
        }
    };

    return (
        <div>
            <h1>Sell Your Tickets</h1>
            <p>List your ticket below</p>
            <form onSubmit={handleSubmit}>
            <label>
    Event Name:
    <input type="text" name="eventName" value={eventName} onChange={handleEventNameChange} />
</label>
<br />
<label>
    Event Location:
    <input type="text" name="eventLocation" value={eventLocation} onChange={handleEventLocationChange} />
</label>
<br />
<label>
    Price:
    <input type="number" name="price" value={price} onChange={handlePriceChange} />
</label>
<br />
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>Drag and drop Event Poster here or click to browse.</p>
                    {uploadedFiles.length > 0 && (
                        <div>
                            <h2>Preview</h2>
                            {uploadedFiles.map((file, index) => (
                                <img key={index} src={file.preview} alt={`Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
                            ))}
                        </div>
                    )}
                </div>
                <br />
                <button type="submit">Submit</button>
            </form>
            <a href="/">Go home</a>
        </div>
    );
}
