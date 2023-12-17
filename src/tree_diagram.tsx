// Import React and ECharts components
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';
import type { EChartOption, EChartsConvertFinder, ECharts, SetOptionOpts } from "echarts";
import { CreateBranch } from './branch';
import { Config, TreeData } from './data';
import { SaveJSON, UploadJSON } from './Serialization';
import BranchDataEditor from './editor';
import { Button, Grid } from '@mui/material';

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
            id: "0",
            min: -200,
            max: 200,
            type: 'value',
            axisLine: { onZero: false }
        },
        yAxis: {
            id: "0",
            min: -200,
            max: 200,
            type: 'value',
            axisLine: { onZero: false }
        },
        series: [
        ],
        grid: {
            id: "0",
            left: "5%",
            top: "5%",
            right: "2%",
            bottom: "5%"
        },
        graphic: [],
    },
    branches: [
    ],
    config: {
        minimum_branch_width: 5,
        branch_width_coefficient: 0.5
    },
    context: {
        id_counter: 0,
        adjusting_position_enabled: false
    }
}

// Component using echarts-for-react
const MyChartComponent: React.FC = () => {
    const instance = useRef(null);
    const [option, setOption] = useState(current_tree_data.echart_options);
    const [replace, setReplace] = useState(true);

    const onChartReady=()=>{
        let diagram = instance.current as any;
        if (diagram === null) {
            return;
        }
        const myChart: ECharts = diagram.getEchartsInstance();
        /*myChart.on('click',"series.line", (value:any)=>{
            console.log(value)
        });*/
        synchronizeDataAndGraph();
    }

    const synchronizeDataAndGraph = () => {
        let diagram = instance.current as any;
        if (diagram === null) {
            return;
        }
        const myChart: ECharts = diagram.getEchartsInstance();
        let newOption = { ...current_tree_data.echart_options };
        if (replace === true) {
            myChart.setOption(current_tree_data.echart_options, true);
            setReplace(false);
        }
        console.log(myChart.getOption());
        for (const branch of current_tree_data.branches) {
            newOption = CreateBranch(myChart, newOption, branch, current_tree_data, setOption);
        }
        let final_option = { ...current_tree_data.echart_options, ...newOption };
        // console.log(final_option);
        setOption(final_option);
    }
    useEffect(synchronizeDataAndGraph, [replace]);

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
        <Grid container>
            <Grid item xs={10} style={{ height: '90vh' }}>
                <ReactECharts
                    ref={instance}
                    option={option}
                    lazyUpdate={true}
                    onChartReady={onChartReady}
                    notMerge={replace}
                    style={{ height: '90vh' }}

                />
            </Grid>
            <Grid item xs={2}>
                <BranchDataEditor updateData={(branch) => {
                    current_tree_data.branches.push(branch);
                    synchronizeDataAndGraph();
                }} context={current_tree_data.context} updateContext={(context) => {
                    synchronizeDataAndGraph();
                }} />
            </Grid>
        </Grid>
        <SaveJSON data={current_tree_data} />
        <UploadJSON updateData={(data) => {
            current_tree_data = data;
            setReplace(true);
        }} />
        <div>
            <Button onClick={GetImage} variant="outlined">Get Image</Button>
        </div>
    </>);
};

export default MyChartComponent;