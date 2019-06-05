import * as React from "react";
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IPEchartBar {
  container: string,
  xHot: any,
  yHot: any,
  subtext: any,
}

export default class EchartBar extends React.Component<IPEchartBar, any> {

  // componentDidMount() {
  //   const { container } = this.props;
  //   this._changeOption(container, option);
  //
  // }

  // _changeOption(container, option) {
  //   let myChart = echarts.init(document.querySelector("." + container) as HTMLDivElement);
  //   myChart.setOption(option);
  // }

  option() {
    const { xHot, yHot, subtext } = this.props;
    let option = {
      title: {
        subtext,
      },
      tooltip: {},
      // grid: [
      //   { left: 30, right: 30 }
      // ],
      xAxis: {
        type: 'category',
        // barWidth: 50,
        data: xHot,
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#999999",
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
      },
      series: [
        {
          type: "bar",
          barMaxWidth : 30,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: "#7B3DCB" },
                  { offset: 0.5, color: "#bf2dd0" },
                  { offset: 1, color: "#FF86FF" },
                ],
              ),
            },
            emphasis: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: "#7B3DCB" },
                ],
              ),
            },
          },
          data: yHot,
        },
      ],
    };
    return option;
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()} lazyUpdate={true}/>
      </div>
    );
  }
}
