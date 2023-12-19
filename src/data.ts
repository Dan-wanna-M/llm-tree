import { EChartOption } from "echarts";

export type BranchData = {
    id: string,
    color: string,
    width: number,
    parent_id:undefined|string
    // from stem to tip
    coordinates: [number, number][],
    children:Record<string, ChildrenData>
    fruit: FruitData
}

export type ChildrenData=
{
    connection_point_index:number
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
    branches: BranchData[],
    config:Config,
    context:Context
};

export type Config = {
    minimum_branch_width: number,
    branch_width_coefficient: number,
    point_width_ratio:number
}

export type Context = {
    id_counter:number
    adjusting_position_enabled:boolean
}