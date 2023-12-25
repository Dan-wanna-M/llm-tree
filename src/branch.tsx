// Import React and ECharts components
import _ from 'lodash';
import type { EChartOption, ECharts } from "echarts";
import { BranchData, Context, FindBranch, TreeData } from './data';





export function CreateBranch(chart: ECharts, old_option: EChartOption, branch_data: BranchData, tree_data: TreeData, setOption: (new_option: EChartOption) => void) {
    const onPointDragging = (dataIndex: number, pos: number[]) => {
        let data = chart.getOption().series!.find((value) => value.id === branch_data.id)!.data!;
        let new_data = [...data];
        const position = chart.convertFromPixel({ gridId: "0" }, pos);
        new_data[dataIndex] = position;
        FindBranch(tree_data.branches, branch_data.id)!.coordinates = new_data as any;
        let newOption = {
            series: [
                {
                    id: branch_data.id,
                    data: new_data,
                }
            ]
        };
        const results = Object.entries(branch_data.children).filter((value) => value[1].connection_point_index === dataIndex);
        for (const result of results) {
            const [child_id, child_data] = result;
            const child = FindBranch(tree_data.branches, child_id)!;
            const child_series_data = chart.getOption().series!.find((value) => value.id === child_id)!.data!;
            const new_child_data = [...child_series_data];
            child.coordinates[0] = new_data[dataIndex] as [number, number];
            new_child_data[0] = new_data[dataIndex];
            newOption.series.push({
                id: child_id,
                data: new_child_data,
            });
        }
        setOption(newOption as EChartOption);
    };
    if (old_option.graphic === undefined) {
        old_option.graphic = []
    };
    let end = undefined;
    if (branch_data.fruit !== undefined) {
        end = -1;
    }
    const draggable_points = branch_data.coordinates.slice(0, end).map((xy, dataIndex) => {
        const draggable = branch_data.parent_id === undefined || dataIndex !== 0;
        return {
            type: 'circle',
            id: 'drag_points' + branch_data.id + dataIndex,
            position: chart.convertToPixel({ gridId: "0" }, xy),
            invisible: !draggable,
            shape: { r: tree_data.context.adjusting_position_enabled ? branch_data.width : 0 },
            draggable: draggable,
            ondrag: function (dx: number, dy: number) { onPointDragging(dataIndex, [(this as any).x, (this as any).y]) },
            throttle: 20,
        };
    });
    const new_option: EChartOption = {
        series: [...old_option.series as object[], {
            id: branch_data.id,
            type: 'line',
            lineStyle: { width: branch_data.width, color: branch_data.color },
            data: branch_data.coordinates,
            smooth: true,
            triggerLineEvent: true,
            symbolSize: 0,
            z: -1
        }],
        graphic: [...old_option.graphic as object[], ...draggable_points]
    };
    if (branch_data.fruit !== undefined) {
        (new_option!.graphic as any[]).push({
            type: 'group',
            position: chart.convertToPixel({ gridId: "0" }, branch_data.coordinates[branch_data.coordinates.length - 1]),
            invisible: false,
            draggable: tree_data.context.adjusting_position_enabled,
            ondrag: function (dx: number, dy: number) { onPointDragging(branch_data.coordinates.length - 1, [(this as any).x, (this as any).y]) },
            throttle: 20,
            children: [
                {
                    type: 'rect',
                    id: 'rect' + branch_data.id,
                    left: "center",
                    top: "middle",
                    shape: { ...branch_data.fruit.shape, r: 10 },
                    style: {
                        text: branch_data.fruit.text,
                        fontSize: branch_data.fruit.font_size,
                        textFill:branch_data.fruit.text_color,
                        fill: branch_data.fruit.fill_color,
                        fontWeight:"bold",
                        stroke: branch_data.fruit.stroke_color,
                        lineWidth: 5,
                    },
                    fontWeight: 'bold',
                    bounding: false
                },
                {
                    type: 'image',
                    id: 'image' + branch_data.id,
                    top: "middle",
                    style: {
                        x: branch_data.fruit.shape.width/2+5,
                        y: branch_data.fruit.shape.height,
                        image: branch_data.fruit.image,
                        fill: "#FF0000",
                        width: branch_data.fruit.shape.height,
                        height: branch_data.fruit.shape.height
                    },
                    z: 20
                }
            ]
        });
    }
    return new_option;
}