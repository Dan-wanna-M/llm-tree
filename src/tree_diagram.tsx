// Import React and ECharts components
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import _, { values } from 'lodash';
import type { EChartOption, EChartsConvertFinder, ECharts, SetOptionOpts } from "echarts";
import { CreateBranch } from './branch';
import { BranchData, Config, TreeData } from './data';
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
        animation: false
    },
    branches: [
    ],
    config: {
        minimum_branch_width: 5,
        branch_width_coefficient: 0.8
    },
    context: {
        id_counter: 0,
        adjusting_position_enabled: false
    }
}

const ComputeWidth = (branches: BranchData[], branch_id: string) => {
    const branch = branches.find(value => value.id === branch_id)!;
    if (branch.children_ids.length === 0) {
        return branch.width;
    }
    let total_width = current_tree_data.config.minimum_branch_width;
    for (const child of branch.children_ids) {
        total_width += ComputeWidth(branches, child);
    }
    branch.width = total_width * current_tree_data.config.branch_width_coefficient;
    return total_width;
}

// Component using echarts-for-react
const MyChartComponent: React.FC = () => {
    const instance = useRef(null);
    const [option, setOption] = useState(current_tree_data.echart_options);
    const [replace, setReplace] = useState(true);
    const [clickedEvent, setClickedEvent] = useState(undefined) as [undefined | any, React.Dispatch<React.SetStateAction<undefined | any>>];

    const onChartReady = () => {
        let diagram = instance.current as any;
        if (diagram === null) {
            return;
        }
        const myChart: ECharts = diagram.getEchartsInstance();
        myChart.on('click', "series.line", (value: any) => {
            console.log(value);
            if (current_tree_data.context.adjusting_position_enabled) {
                setClickedEvent(undefined);
            }
            else {
                setClickedEvent(value);
            }

        });
        myChart.getZr().on('click', (event) => {
            // No "target" means that mouse/pointer is not on
            // any of the graphic elements, which is "blank".
            if (!event.target) {
                setClickedEvent(undefined);
            }
        });
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
        for (const branch of current_tree_data.branches) {
            if (branch.parent_id === undefined) {
                ComputeWidth(current_tree_data.branches, branch.id);
            }
        }
        for (const branch of current_tree_data.branches) {
            newOption = CreateBranch(myChart, newOption, branch, current_tree_data, setOption);
        }
        const index = (newOption.graphic as any[]).findIndex((value) => value.id === "clicked");
        let graphic;
        if (clickedEvent === undefined) {
            graphic = {
                type: 'circle',
                id: 'clicked',
                invisible: true
            };
        }
        else {
            graphic = {
                type: 'circle',
                id: 'clicked',
                position: [clickedEvent.event.offsetX, clickedEvent.event.offsetY],
                invisible: false,
                shape: { r: 5 },
            };
        }

        if (index === -1) {
            (newOption.graphic as any[]).push(graphic);
        }
        else {
            (newOption.graphic as any[])[index] = graphic;
        }

        let final_option = { ...current_tree_data.echart_options, ...newOption };
        // console.log(final_option);
        setOption(final_option);
    }
    useEffect(synchronizeDataAndGraph, [replace, clickedEvent]);
    useEffect(() => setClickedEvent(undefined), [current_tree_data.context.adjusting_position_enabled]);
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
                    let diagram = instance.current as any;
                    if (diagram === null) {
                        return;
                    }
                    const myChart: ECharts = diagram.getEchartsInstance();
                    const clicked_graphic = (myChart?.getOption()?.graphic as any)[0].elements.find((value: any) => value.id === "clicked");
                    if (clicked_graphic && !clicked_graphic.invisible) {
                        console.log(clicked_graphic);
                        branch.coordinates[0] = myChart.convertFromPixel({ gridId: "0" }, clicked_graphic.position) as [number, number];
                        branch.parent_id = clickedEvent.seriesIndex.toString();
                        current_tree_data.branches.find((value) => value.id === clickedEvent.seriesIndex.toString())?.children_ids.push(branch.id);
                    }
                    current_tree_data.branches.push(branch);
                    synchronizeDataAndGraph();
                }} context={current_tree_data.context} updateContext={(context) => {
                    synchronizeDataAndGraph();
                }} config={current_tree_data.config} />
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