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
import "@assets/scss/bar_darren.scss";

interface IProps {
  container: any, 
  data: any
}

export default class EchartLine extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  _moreCharts(xHot, yHot, container) {
    let myChart = echarts.init(document.querySelector("." + container) as HTMLDivElement);
  }

  option() { 
  const { data } = this.props; //替换雷达图分类的值
  // let _data = {
  //   name:['喵呜琪琪梦 echats—line-darren', '柴犬馒头','疯了, 瑰宝'],
  //   xAxis : ['周一','周二','周三','周四','周五','周六','周日'],
  //   series:[[120, 132, 101, 134, 90, 230, 210],[20, 132, 301, 34, 90, 130, 410],[60, 32, 101, 234, 190, 430, 40]],    
  // },
  let  _data = data; 
  let _legend=[],
  _series=[],  
  color=['#FEA39E','#2D8EF8','#9254DE']; 
  _data && _data.name && _data.name.forEach((el,index) => { 
    _series.push({ 
      name:el,
      data:_data.series[index],
      type: "line",
      itemStyle: {
        color: color[index],
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color:color[index],
        }, {
          offset: 1,
          color: "#fff",
        }]),
      },
    })
  });
    return {
      title: {
        left: 21,
        top: 80,
        text:'微博超话帖子数',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 12,
        },
      },
      legend: {
        data: _data?_data.name:[], 
        top: 30,
        left: 21
      },
      grid: {
        y: 140,
        x: 95,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#ccc'
      },
      tooltip: {
        padding: [5, 10],
      },
      // grid: [
      //   { left: 30, right: 30 }
      // ],
      xAxis: { 
        type: 'category',
        axisTick: {
            alignWithLabel: true
        },
        axisLine: {
            onZero: false,
            lineStyle: { 
            }
        },
        data : _data?_data.xAxis:[],
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
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
      series: _series?_series:[],
    };
  }

  render() {
    //container: echart_line_darren
    const { container } = this.props;

    return (
      <div className={container}>
        <div className="redar">
          <ReactEcharts option={this.option()} />
        </div>
      </div> 
    );
  }
}
