import * as React from "react";
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IProps {
  container: any,
  xHot: any,
  yHot: any,
  subtext: string
}

export default class EchartLine extends React.Component<IProps, any> {
  constructor(props) {
    super(props);

  }

  _moreCharts(xHot, yHot, container) {
    let myChart = echarts.init(document.querySelector("." + container) as HTMLDivElement);
  }

  option() {
    const { subtext} = this.props;
    return {
      title: {
        subtext,
      },
      tooltip: {},
      //  grid: {
      //   left: "3%",
      //   right: "1%"
      // },
      xAxis: {
        type: "category",
        data: this.props.xHot,
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
        type: "value",
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
      series: [{
        data: this.props.yHot,
        type: "line",
        itemStyle: {
          color: "#6248ff",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#9b7eff",
          }, {
            offset: 1,
            color: "#fff",
          }]),
        },
      }],
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
