import React, { useState } from 'react';
import { FruitData } from './data';

const FruitDataEditor = () => {
    const [fruitData, setFruitData] = useState<FruitData>({
        text: '',
        font_size: '',
        shape: { width: 0, height: 0 },
        stroke_color: '',
        fill_color: '',
        image: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFruitData({ ...fruitData, [e.target.name]: e.target.value });
    };

    const handleShapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFruitData({
            ...fruitData,
            shape: { ...fruitData.shape, [e.target.name]: parseInt(e.target.value) }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(fruitData);
        // Here, you can do something with the fruitData, like sending it to a server
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Text:</label>
                <input type="text" name="text" value={fruitData.text} onChange={handleChange} />
            </div>
            <div>
                <label>Font Size:</label>
                <input type="text" name="font_size" value={fruitData.font_size} onChange={handleChange} />
            </div>
            <div>
                <label>Width:</label>
                <input type="number" name="width" value={fruitData.shape.width} onChange={handleShapeChange} />
                <label>Height:</label>
                <input type="number" name="height" value={fruitData.shape.height} onChange={handleShapeChange} />
            </div>
            <div>
                <label>Stroke Color:</label>
                <input type="text" name="stroke_color" value={fruitData.stroke_color} onChange={handleChange} />
            </div>
            <div>
                <label>Fill Color:</label>
                <input type="text" name="fill_color" value={fruitData.fill_color} onChange={handleChange} />
            </div>
            <div>
                <label>Image URL:</label>
                <input type="text" name="image" value={fruitData.image} onChange={handleChange} />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default FruitDataEditor;