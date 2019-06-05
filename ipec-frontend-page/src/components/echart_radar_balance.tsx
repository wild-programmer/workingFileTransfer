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
  data: any,
}

const people = [
  { name: '大众热议指数' },
  { name: '媒体关注度' },
  { name: '口碑指数' },
  { name: '专业指数' },
  { name: '代言指数' },
  { name: '潜力预估值' },
];
const art = [
  { name: '大众热议指数' },
  { name: '媒体关注度' },
  { name: '潜力预估值' },
];
export default class EchartsRadarBalance extends React.Component<IProps, any> {
  option() {
    const { data } = this.props;
    let dataTitle;
    if (data.length > 3) {
      dataTitle = people;
    } else {
      dataTitle = art;
    }
    return {
      title: {
        text: ''
      },
      tooltip: {},
      radar: {
        name: {
          textStyle: {
            color: '#343a40',
            backgroundColor: '#fff',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: dataTitle,
      },
      series: [{
        type: 'radar',
        itemStyle: {
          normal: {
            color: '#6248ff'
          },
        },
        data: [
          {
            value: data,
            areaStyle: {
              normal: {
                color: 'rgba(98,72,255,0.10)',
              }
            },
            lineStyle: {
              color: '#6248ff',
            },
          }
        ]
      }]
    };
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
