import { EChartOption } from "echarts";

export type BranchData = {
    id: string,
    color: string,
    width: number,
    parent_id:undefined|string
    // from stem to tip
    coordinates: [number, number][],
    children:Record<string, ChildrenData>
    fruit: FruitData|undefined
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
    text_color:string
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

export const FindBranch = (branches:BranchData[], branch_id:string)=>
{
    return branches.find((value) => value.id === branch_id)
}

export const FindBranchIndex = (branches:BranchData[], branch_id:string)=>
{
    return branches.findIndex((value) => value.id === branch_id)
}

export const RemoveBranch = (branches:BranchData[], branch_id:string)=>
{
    const branch_index = FindBranchIndex(branches, branch_id);
    const branch = branches[branch_index];
    branches.splice(branch_index, 1);
    if(branch.parent_id!==undefined)
    {
        const parent_branch = FindBranch(branches, branch.parent_id)!;
        delete parent_branch.children[branch.id];
        branch.parent_id = undefined;
    }
    for(const [child_id, child_data] of Object.entries(branch.children))
    {
        const child_branch = FindBranch(branches, child_id)!;
        child_branch.parent_id = undefined;
    }
}

export const FindBranchIDFromSeriesIndex = (option:EChartOption, seriesIndex:number)=>
{
    return option?.series![seriesIndex]?.id;
}