import { EChartOption } from "echarts";

export type BranchData = {
    id: string,
    color: string,
    width: number,
    stem_coordinates: [number, number],
    stem_height: number,
    tip_coordinates: [number, number],
    fruit: FruitData
}

export type FruitData = {
    text: string | undefined,
    font_size: string,
    shape: { width: number, height: number },
    stroke_color: string
    fill_color: string
    image: string
}

export type TreeData = {
    echart_options: EChartOption;
    branches: BranchData[]
};