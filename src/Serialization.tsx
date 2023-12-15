import { Button, Grid } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { MuiFileInput } from 'mui-file-input'
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
        <Button variant="outlined" onClick={save}>Save Json</Button>
    </div>;
};

export const UploadJSON = (props: { updateData: (data: any) => void }) => {
    const [selectedFile, setSelectedFile] = useState(null) as [File | null, Dispatch<SetStateAction<null | File>>];

    const handleFileChange = (e: any) => {
        const file = e;
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {
        if (selectedFile) {
            console.log(await selectedFile.text());
            props.updateData(JSON.parse(await selectedFile.text()));
        }

    };

    return (
        <div>
            <MuiFileInput value={selectedFile} onChange={handleFileChange} placeholder="Upload a json file" inputProps={{
                accept: ".json"
            }} size="small"/>
            <Button disabled={selectedFile === null} variant="outlined" onClick={handleFileUpload}>
                Upload
            </Button>
        </div>
    );
};