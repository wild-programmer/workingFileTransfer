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
export default class EchartMap extends React.Component<IProps, any> {
  option() {
    const { data } = this.props; //替换雷达图分类的值
    // let _data = {
    //   name:['喵呜琪琪梦 echats——dadar', '柴犬馒头','疯了, 瑰宝'],
    //   series:[[1000, 1400, 1800,3000,2000,5000,22,22],[8000, 2400, 2800,4000,1000,6000,11,11],[5000, 3400, 3800,7000,4000,1000,33,33]],
    //   indicator:[
    //     { name: '大众热议指数', max: 8000 },
    //     { name: '媒体关注度', max: 8000 },
    //     { name: '潜力预估指数', max: 8000 },
    //     { name: '口碑指数', max: 8000 },
    //     { name: '专业指数2', max: 8000 },
    //     { name: '代言指数2', max: 8000 },
    //     { name: '专业指数', max: 8000 },
    //     { name: '代言指数', max: 8000 },
    //   ], 
    //   legend:[[6.6,6.6,6.6],[6.6,6.6,6.6],[61.6,16.6,16.6]]
    // },
    
    let _data = {
      indicator: [[{max: 100, name: "大众热议指数"}, {max: 100, name: "媒体关注度"}, {max: 100, name: "潜力预估指数"}]],
      name: ["颐和园", "中华春节符号 年娃春妮"],
      series: [[97, 97, 70.63], [60, 60, 60], [20, 50, 80]],
    },
    _legend=[],
    _series=[]; 
    
    _data && _data.name.forEach((el,index) => {
      _legend.push({
        name: el,
        icon: 'circle',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bolder'
        }
      });
      _series.push({
        name: el,
        value: _data.series[index],
      })
    });
    return {
      title: {
        text: ''
      },
      color:['#FEA39E','#2D8EF8','#9254DE'],
      tooltip: {},
      legend: {
        // data: ['喵呜琪琪梦', '柴犬馒头','疯了, 瑰宝'], 
        right: 70,
        data: _legend,
        itemGap: 100
      },
      grid: {
        left: 0,
        bottom: 0,
        height: 320,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ccc',
        shadowOffsetX: 0,
        containLabel: true,
        borderWidth: 10
      },
      radar: {
        center: ['25%', '50%'],
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator:_data&&_data.indicator
      },
      series: [{
        type: 'radar',
        data:_series,
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
            <p>媒体关注数</p>
            <p className="score">6.6分</p>
            <p>潜力预估指数</p>
            <p className="score">6.6分</p>
          </div>
          <div className="padding-left25">
            <p>大众热议指数</p>
            <p className="score">6.6分</p>
            <p>媒体关注数</p>
            <p className="score">6.6分</p>
            <p>潜力预估指数</p>
            <p className="score">6.6分</p>
          </div>
          <div className="padding-left35">
            <p>大众热议指数</p>
            <p className="score">61.6分</p>
            <p>媒体关注数</p>
            <p className="score">16.6分</p>
            <p>潜力预估指数</p>
            <p className="score">16.6分</p>
          </div>
        </div>
      </div>
    );
  }
}
