// Import React and ECharts components
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';
import type { EChartOption, EChartsConvertFinder, ECharts, SetOptionOpts } from "echarts";
import { CreateBranch } from './branch';
import { Config, TreeData } from './data';
import { SaveJSON, UploadJSON } from './Serialization';
import FruitDataEditor from './editor';

let current_tree_data: TreeData = {
    echart_options: {
        // Define your chart options here
        title: {
            text: 'Large language model evolution',
            left: 'center'
        },
        tooltip: {},
        legend: {
            data: []
        },
        xAxis: {
            min: -200,
            max: 200,
            type: 'value',
            axisLine: { onZero: false }
        },
        yAxis: {
            min: -200,
            max: 200,
            type: 'value',
            axisLine: { onZero: false }
        },
        series: [
        ],
        grid: {
            id: "0",
            top: '8%',
            bottom: '12%'
        },
        graphic: []
    },
    branches: [
    ]
}

const config: Config = {
    minimum_branch_width: 5,
    branch_width_coefficient: 0.5
}

// Component using echarts-for-react
const MyChartComponent: React.FC = () => {
    const instance = useRef(null);
    const [option, setOption] = useState(current_tree_data.echart_options);
    const synchronizeDataAndGraph = () => {
        let diagram = instance.current as any;
        if (diagram === null) {
            return;
        }
        const myChart: ECharts = diagram.getEchartsInstance();
        if (option == current_tree_data.echart_options) {
            let newOption = option;
            myChart.setOption(newOption);
            for (const branch of current_tree_data.branches) {
                newOption = CreateBranch(myChart, newOption, branch, current_tree_data, setOption);
            }
            setOption(newOption);
        }
    }
    useEffect(synchronizeDataAndGraph, [option]);

    const GetImage = () => {
        let diagram = instance.current as any;
        if (diagram === null) {
            return;
        }
        const base64 = diagram.getEchartsInstance().getDataURL();
        const img = new Image();
        img.src = base64;
        const newWin = window.open('', '_blank');
        (newWin as any).document.write(img.outerHTML);
    }

    return (<>
        <div style={{ display: 'flex', justifyContent: 'centre' }}>
            <ReactECharts
                ref={instance}
                option={option}
                lazyUpdate={true}
                onChartReady={synchronizeDataAndGraph}
                style={{ width: '90vw', height: '90vh' }}
            />
            <FruitDataEditor />
        </div>
        <SaveJSON data={current_tree_data} />
        <UploadJSON updateData={(data) => {
            current_tree_data = data;
            setOption(current_tree_data.echart_options);
        }} />
        <div>
            <button onClick={GetImage}>Get Image</button>
        </div>
    </>);
};

export default MyChartComponent;