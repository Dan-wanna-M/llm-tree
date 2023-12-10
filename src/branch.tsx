// Import React and ECharts components
import _ from 'lodash';
import type { EChartOption, ECharts } from "echarts";
import { BranchData } from './data';





export function CreateBranch(chart: ECharts, old_option: EChartOption, branch_data: BranchData, setOption: (new_option: EChartOption) => void) {
    const coordinates = [branch_data.stem_coordinates, [branch_data.stem_coordinates[0], branch_data.stem_coordinates[1] + branch_data.stem_height], branch_data.tip_coordinates]
    const onPointDragging = (dataIndex: number, pos: number[]) => {
        let data = chart.getOption().series!.find((value) => value.id === branch_data.id)!.data!;
        let new_data = [...data];
        new_data[dataIndex] = chart.convertFromPixel({ gridId: "0" }, pos);
        console.log(new_data);
        let newOption = {
            series: [
                {
                    id: branch_data.id,
                    data: new_data,
                }
            ]
        };
        setOption(newOption as EChartOption);
    }
    const new_option: EChartOption = {
        series: [...old_option.series as object[], {
            id: branch_data.id,
            type: 'line',
            lineStyle: { width: branch_data.width, color: branch_data.color },
            data: coordinates,
            smooth: true,
            symbolSize: 0,
            z: -1
        }],
        graphic: [...old_option.graphic as object[],
        {
            type: 'group',
            position: chart.convertToPixel({ gridId: "0" }, branch_data.tip_coordinates),
            invisible: false,
            draggable: true,
            ondrag: function (dx: number, dy: number) { onPointDragging(2, [(this as any).x, (this as any).y]) },
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
                        fill: branch_data.fruit.fill_color,
                        stroke: branch_data.fruit.stroke_color,
                        lineWidth: 5,
                    },
                    bounding: false
                },
                {
                    type: 'image',
                    id: 'image' + branch_data.id,
                    top: "middle",
                    style: {
                        x: branch_data.fruit.shape.height,
                        y: branch_data.fruit.shape.height,
                        image: branch_data.fruit.image,
                        fill: "#FF0000",
                        width: 50,
                        height: 50
                    },
                    z: 20
                }
            ]

        },

        ]
    }
    console.log(new_option);
    return new_option;
}