import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/bar_darren.scss";

interface IProps {
  container: any,
  data: any,
}
export default class EchartMap extends React.Component<IProps, any> {
  option() { 
    const { data } = this.props; 
    // let _data = {
    //   title:'百度搜索指数Echart_bar_darren',
    //   legend:['喵呜琪琪梦', '柴犬馒头', '疯狂，瑰宝'],
    //   xAxis:['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/6', '3/8', '3/59', '3/10'],
    //   series:[[320, 332, 301, 334, 390, 98, 77, 101, 99, 40],[220, 182, 191, 234, 290, 301, 334, 390, 98, 77],[150, 232, 201, 154, 190, 98, 77, 101, 99, 40]]
    // },
    let _data = { 
      title:'',
      legend:[],
      xAxis:[],
      series:[]
    }; 
    if(data) _data = data;
    let  _legend = [],
    _series = [];
    _data.legend.forEach((val,index) => {
      _legend.push({
        name: val,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bolder'
        },
        icon: 'circle'//格式为'image://+icon文件地址'，其中image::后的//不能省略
      })
      _series.push({
        name: val,
        type: 'bar',
        barGap: 0,
        data: _data.series[index],
      })
    });
    return {
      color: ['#FEA39E', '#2D8EF8', '#6248FF', '#e5323e'],
      title: {
        text: _data.title,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 12,
        },
        left: 21,
        top: 80,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          snap: true,
        },
        padding: [5, 10],
      },
      legend: {
        // data: ['喵呜琪琪梦', '柴犬馒头', '疯狂，瑰宝'],
        data: _legend,
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
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data:_data.xAxis
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: _series
    }
  }

  render() {
    //echart_bar_darren
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
