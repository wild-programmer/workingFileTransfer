import * as React from "react";
import echarts from "echarts";
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
    //   xAxis:'院线票房数（万）', 
    //   legend:[],
    //   yAxis:['复仇者联盟1','复仇者联盟2','复仇者联盟3'],
    //   series:[[320, 302, 301]],
    // };
    // let _data = {
    //   xAxis:'院线票房数（万）', 
    //   legend:['芒果TV', '搜狐视频','爱奇艺'],
    //   yAxis:['复仇者联盟1','复仇者联盟2','复仇者联盟3'],
    //   series:[[320, 302, 301],[120, 132, 101], [220, 182, 191]],
    // };

    let _data = data; 
   let _legend = [],
    _series = [],
    _bottom ='3%';
    if(_data) if(_data.series.length>1){ 
       _data.series.forEach((val,index) => { 
        _series.push({
          name: _data.legend[index], 
          type: 'bar',
          stack: '总量',
          label: {
              normal: { 
                  position: 'insideRight'
              }
          }, 
          data: val
        })
      });
    }else{
      _bottom ='15%';
      _series.push({ 
        type: 'bar',
        stack: '总量',
        label: {
            normal: { 
                position: 'insideRight'
            }
        },
        itemStyle: {
          normal: {
              color: new echarts.graphic.LinearGradient(
                  .5, 0, 0, 1,
                  [
                      {offset: 0, color: '#933EFE'}, 
                      {offset: 1, color: '#2853FF'}
                  ]
              )
          },
        },
        data: _data.series[0]
      })
    }
   
    return {
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    color:['#F06000','#E50013','#9254DE '],
    legend: {
      top: 30,
      left: 30,
      data:_data && _data.legend
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: _bottom,
        height:'71%',
        width:900,
        containLabel: true
    },
    xAxis:  {
        type: 'value',
        name:'院线票房数（万）'
    },
    yAxis: {
        type: 'category',
        data: _data &&_data.yAxis,
        scale : true,
        max : 2,
        min : 0, 
        axisTick:{
          show:false,
          // interval:2,
          // length:2,
        },
        interval:30,
        minInterval: 3,
        maxInterval:5
    },
    series: _series && _series
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
