// Import React and ECharts components
import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import cloneDeep from 'lodash.clonedeep';
import _ from 'lodash';

// Component using echarts-for-react
const MyChartComponent: React.FC = () => {
    const DEFAULT_DATA = [
        [40, -10],
        [-30, -5],
        [-76.5, 20],
        [-63.5, 40],
        [-22.1, 50]
    ];
    const DEFAULT_OPTION = {
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
            min: -100,
            max: 70,
            type: 'value',
            axisLine: { onZero: false }
          },
          yAxis: {
            min: -30,
            max: 60,
            type: 'value',
            axisLine: { onZero: false }
        },
        series: [{
            id: 'a',
            smooth: true,
            type: 'line',
            data: DEFAULT_DATA,
            symbolSize: 20,
        },
        ],
        grid: {
            top: '8%',
            bottom: '12%'
        }
    };
    const instance = useRef(null);
    const [option, setOption] = useState(DEFAULT_OPTION);
    function AddDraggable(myChart: any) {
        if (option == DEFAULT_OPTION)
        {
            const newOption: any = option;
            myChart.setOption(newOption);
            //let myChart = (instance.current as any).getEchartsInstance();
            let data = newOption.series[0].data;
            let throttled_drag = _.throttle(onPointDragging, 1)
            newOption.graphic = data.map(function (item:any, dataIndex:any) {
                return {
                  type: 'circle',
                  position: myChart.convertToPixel('grid', item),
                  shape: {
                    cx: 0,
                    cy: 0,
                    r: 20
                  },
                  invisible: true,
                  draggable: true,
                  ondrag: function (dx: number, dy: number) {
                    onPointDragging(dataIndex, [(this as any).x, (this as any).y]);
                  },
                  z: 100,
                  throttle: 20
                };
              });
            setOption(newOption);
        }
        function onPointDragging(dataIndex: number, pos: number[]) {
            let diagram = (instance.current as any).getEchartsInstance();
            let data = option.series[0].data;
            let new_data =[...data];
            new_data[dataIndex] = diagram.convertFromPixel('grid', pos);
            let newOption = {series: [
                {
                    id: 'a',
                    smooth: true,
                    type: 'line',
                    data: new_data,
                    symbolSize: 20,
                }
            ]};
            setOption(newOption as any);
        }
    }

    function clickBtn() {
        let diagram = instance.current as any;
        if (diagram === null)
        {
            return;
        }
        const base64 = diagram.getEchartsInstance().getDataURL();
        const img = new Image();
        img.src = base64;
        const newWin = window.open('', '_blank');
        (newWin as any).document.write(img.outerHTML);
    }
    
    return (<>
        <ReactECharts
            ref={instance}
            option={option}
            lazyUpdate={true}
            onChartReady={AddDraggable}
            style={{ height: 800 }}
        />
        <div>
            <button onClick={clickBtn}>click here to get the DataURL of chart.</button>
        </div>
    </>);
};

export default MyChartComponent;