import { useCallback, useState } from "react";
import "../App.css";
import { useDropzone } from "react-dropzone";

export default function ImageDrop({ imagePreview }: { imagePreview: string | null }) {



    const [imageFile, setImageFile] = useState<File | null>(null);
   
    const { getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: useCallback((file:any) => {
            setImageFile(file);
        }, []),
    })  

    const preview = imageFile ? URL.createObjectURL(imageFile) : null;
    return (
        <div className="image-drop">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag and drop some files here, or click to select files</p>
            )}
            </div>
            Drop Product Image or Receipt here
            {preview && <img src={preview} alt="Preview" />}
        </div>
    );
}