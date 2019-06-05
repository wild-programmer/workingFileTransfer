import * as React from "react";
import echarts from "echarts";
import ReactEcharts from 'echarts-for-react';
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';

interface IPie {
  data: any;
}

@inject("detail")
@observer
export default class EchartPieHoollow extends React.Component<IPie, any> {
  option() {
    return {
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c}<br/>" + "占总播放量的{d}%"
      },
      color: ["#6248ff", "#816dff", "#A191ff", "#cob6ff", "#e0daff"],
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              // show: false,
              // position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          // labelLine: {
          //   normal: {
          //     show: false
          //   }
          // },
          data: this.props.data,
        }
      ]
    };
  }

  render() {

    return (
      <div className="echart-pie-hollow">
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
