import * as React from "react";
import ReactEcharts from "echarts-for-react"; 
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_redar.scss";

interface IProps {
  container: any, 
  data:any,
}
export default class EchartMap extends React.Component<IProps, any> {  
  option() {
    const { data } = this.props; //替换雷达图分类的值
    return {
      title: {
        text: ''
      },
      tooltip: {},
      legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [ 
          { name: '大众热议', max: 80000 },
          { name: '媒体关注', max: 80000 },
          { name: '潜力预估指数', max: 80000 }
        ]
      },
      series: [{
        name: '？？？',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [ 
          {
            value: [5000, 14000, 28000],
            // name: '实际开销'
          }
        ]
      }]
    }
  }

  render() {
    //echart-radar
    const { container } = this.props;
    return (
      <div className={container}>
        <div className="redar">
            <ReactEcharts option={this.option()} />
        </div> 
        <div className="echart-news">
          <div>
            <p>大众热议指数</p>
            <p className="score">6.6分</p>
          </div>
          <div>
            <p>媒体关注数</p>
            <p className="score">16.6分</p>
          </div>
          <div className="margin-right0">
            <p>潜力预估指数</p>
            <p className="score">26.6分</p>
          </div>
        </div>
      </div>
    );
  }
}
