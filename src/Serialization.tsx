import { Dispatch, SetStateAction, useState } from "react";

export const SaveJSON = (props: { data: any; }) => {
    const save = () => {
        const jsonData = JSON.stringify(props.data);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    return <div>
        <button onClick={save}>Save Json</button>
    </div>;
};

export const UploadJSON = (props: { updateData: (data:any)=>void }) => {
    const [selectedFile, setSelectedFile] = useState(null) as [File | null, Dispatch<SetStateAction<null | File>>];

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };
    const handleUpload = async () => {
        if (selectedFile) {
            console.log(await selectedFile.text());
            props.updateData(JSON.parse(await selectedFile.text()));
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};