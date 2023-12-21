import React, { useEffect, useState } from 'react';
import { BranchData, ChildrenData, Config, Context } from './data';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { Checkbox, Grid, TextField, Typography, styled } from '@mui/material';
import { Label } from '@mui/icons-material';
import { MuiFileInput } from 'mui-file-input';

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.caption,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: 16
}));

const BranchDataEditor = (props:
    {
        config: Config,
        context: Context,
        updateContext: (context: Context) => void,
        updateData: (branch: BranchData) => void,
    }) => {
    const [lastform, setFormData] = useState({
        id: props.context.id_counter.toString(),
        color: '#FF0000',
        width: props.config.minimum_branch_width,
        coordinates: [[0, 0], [20, 20], [80, 100], [100, 150]] as [[number, number], [number, number], [number, number], [number, number]],
        children: {},
        parent_id: undefined,
        fruit: {
            text: 'LLM',
            font_size: '2em',
            shape: { width: 100, height: 50 },
            stroke_color: '#FF0000',
            fill_color: '#FF0000',
            image: '',
            text_color: '#FFFFFF',
        } as any | undefined
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: lastform,
        onSubmit: async (branch) => {
            const new_branch = { ...branch };
            new_branch.id = props.context.id_counter.toString();
            if (!fruit_enabled) {
                new_branch.fruit = undefined;
            }
            if (image) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log(reader.result);
                    props.context.id_counter += 1;
                    new_branch.fruit.image = reader.result;
                    branch.fruit.image = reader.result;
                    props.updateContext({ ...props.context });
                    props.updateData(new_branch);
                    setFormData(branch);
                };
                reader.readAsDataURL(image);
            }
            else{
                props.context.id_counter += 1;
                props.updateContext({ ...props.context });
                props.updateData(new_branch);
                setFormData(branch);
            }
        },
    });
    const [fruit_enabled, set_fruit_enabled] = useState(true);
    const [image, setImage] = useState(undefined);
    const handleFileChange = (e: any) => {
        const file = e;
        setImage(file);
    };
    useEffect(() => { props.updateContext(props.context) }, [props.context]);
    return (
        <Grid container item rowSpacing={1}>
            <Grid item xs={12}>
                <Typography align={"center"} variant='h4'>Branch Editor</Typography>
            </Grid>
            <Grid item xs={6}>
                <Div>ID</Div >
            </Grid>
            <Grid item xs={6}>
                <TextField size="small"
                    id="id"
                    name="id"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.id}
                    disabled={true}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Branch Color</Div >
            </Grid>
            <Grid item xs={6}>
                <input style={{ width: "8vw", height: "4vh" }}
                    id="color"
                    name="color"
                    type="color"
                    onChange={formik.handleChange}
                    value={formik.values.color}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Enable Fruit</Div>
            </Grid>
            <Grid item xs={6}>
                <Checkbox defaultChecked onChange={(event) => {
                    set_fruit_enabled(event.target.checked);
                }} />
            </Grid>
            <Grid item xs={6}>
                <Div>Fruit Text</Div>
            </Grid>
            <Grid item xs={6}>
                <TextField size="small"
                    disabled={!fruit_enabled}
                    id="fruit.text"
                    name="fruit.text"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.text}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Fruit Font Size</Div>
            </Grid>
            <Grid item xs={6}>
                <TextField size="small"
                    disabled={!fruit_enabled}
                    id="fruit.font_size"
                    name="fruit.font_size"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.font_size}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Fruit Fill Color</Div>
            </Grid>
            <Grid item xs={6}>
                <input style={{ width: "8vw", height: "4vh" }}
                    disabled={!fruit_enabled}
                    id="fruit.fill_color"
                    name="fruit.fill_color"
                    type="color"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.fill_color}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Fruit Text Color</Div>
            </Grid>
            <Grid item xs={6}>
                <input style={{ width: "8vw", height: "4vh" }}
                    disabled={!fruit_enabled}
                    id="fruit.text_color"
                    name="fruit.text_color"
                    type="color"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.text_color}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Fruit Stroke Color</Div>

            </Grid>
            <Grid item xs={6}>
                <input style={{ width: "8vw", height: "4vh" }}
                    disabled={!fruit_enabled}
                    id="fruit.stroke_color"
                    name="fruit.stroke_color"
                    type="color"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.stroke_color}
                />
            </Grid>
            <Grid item xs={6}>
                <Div>Fruit Width</Div>
            </Grid>
            <Grid item xs={6}>
                <TextField size="small"
                    disabled={!fruit_enabled}
                    id="fruit.shape.width"
                    name="fruit.shape.width"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.shape.width}
                />
            </Grid>
            <Grid item xs={6}>
                <Div >Fruit Height</Div>
            </Grid>
            <Grid item xs={6}>
                <TextField size="small"
                    disabled={!fruit_enabled}
                    id="fruit.shape.height"
                    name="fruit.shape.height"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.fruit.shape.height}
                />
            </Grid>
            <Grid item xs={6}>
                <Div >Fruit Image</Div>
            </Grid>
            <Grid item xs={6}>
                <MuiFileInput value={image} onChange={handleFileChange} placeholder="Upload a fruit image" inputProps={{
                    accept: "image/*"
                }} size="small" />
            </Grid>
            <form style={{ width: "100vw" }} onSubmit={formik.handleSubmit}>
                <Grid item xs={12}>
                    <Button type="submit">Submit</Button>
                </Grid>
            </form>
            <Grid item xs={12}>
                <Button onClick={() => {
                    props.context.adjusting_position_enabled = !props.context.adjusting_position_enabled;
                    props.updateContext({ ...props.context });
                }}>{!props.context.adjusting_position_enabled ? "Start adjust branch positions" : "End adjust branch positions"}</Button>
            </Grid>
        </Grid>
    );
};

export default BranchDataEditor;