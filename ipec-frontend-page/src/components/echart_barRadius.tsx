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
import "@assets/scss/echart_redar.scss";
import { element } from "prop-types";

interface IProps {
  container: any,
  data: any,
}
 
export default class EchartMap extends React.Component<IProps, any> { 
  constructor(props: any) {
    super(props);
    this.state = {
      radiusData: [],
    };
  } 
  option({ prop ,index}) { 
    let _prop = prop;
    // let _prop = { //模拟数据 渲染多个图表 计算百分比， 鼠标放上去显示对应值 
    //编辑好数据 调用N次option 和echarts实例   
    //要根据  yAxisData 判断创建多少个option 创建option模版 
    let _series = [],sum = 0;

    _prop.series.forEach(function(el,index){
      sum += Number(el.data[0])
    })
    _prop.series.forEach(function(el,index){ 
      _series.push({
        name: el.name,
        type: 'bar',
        stack: '总量',
        label: {
          show: false, 
          normal: {
            show: true,
            position: 'insideRight'
          }
        },
        barWidth: 30,
        itemStyle: {
          normal: {
            barBorderRadius: index == 0?[10, 0, 0, 10]:index == _prop.series.length-1?[0, 10, 10, 0]:[0, 0, 0, 0], 
            color:el.color,
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return  Math.round((params.data / sum )*10000)/100+ '%';
              },
            },
            opacity: 0.85
          }
        },
        data: el.data
      })
    })
    return {
      color:[],
      title: {
        text: prop.title,
        left: 21,
        top: 20, 
        textStyle: {
          fontWeight: 'normal',
          fontSize: 12,
        },
      }, 
      tooltip: {
        show: true,
        formatter: function (params) {
          return params.marker +params.name+"<br />"+ params.seriesName + "阶段"+ '人数: ' + params.data  ;
        },
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        show: index == 0,
        data:prop.legend,
        top:70,
        selectedMode:false,
      },
      grid: { 
        left: 50, 
        bottom: 0,
        height:50,
        backgroundColor: 'rgba(0,0,0,0)', 
        borderColor: '#ccc',
        shadowOffsetX: 0,
        containLabel: true,
        borderWidth: 10
      },
      xAxis: {
        show: false,
        type: 'value',
        max: sum, 
      },
 
      yAxis: {
        show: true, 
        nameGap:90,
        axisLine: { show: false },
        axisTick: {  show: false},
        splitLine: { show: false },
        type: 'category', 
        // nameGap:200,
        data: _prop.yAxisData,
 
        nameTextStyle: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 14,
          width:300, 
          rich:{ 

          },
 
        }
      },
      series:  _series
    }
  }

  filterlegent(arr){
    let len = {
      length:0,
      index:0,
    },
    str = "   "; 
    arr.forEach((element,index) => {
      if(len.length < element.length){
        len.length = element.length;
        len.index = index;
      } 
    });
    arr.forEach((element,index) => {
      if(index !== len.index){  
         for(var i = 0;i<(len.length - element.length);i++){
           arr[index] = str+arr[index];
         }
      }
    });
    return arr
  }
  getOption(option) { 
    let _options = []
    //这里可以数据筛选
    let _option = option; 
    if(_option == null || _option == '') {
      return []
    }
    let legent = this.filterlegent(_option.yAxisData);
    _option.yAxisData.forEach((val, index)=>{
      let prop = {
        title: index == 0 ? _option.title : '',
        legend: index == 0 ? _option.legend : '',
        yAxisData: [val],
        series: _option.series[index],
      } 
      _options.push(this.option({ prop ,index}))
    })    
    return _options
  }

  render() {
    //echart-barRadius
    let { container ,data} = this.props;  
      //data = []
      //data = {
      //   legend: []
      //   series: [[{data: ["0"], color: "#EFDBFF", name: "0~19岁"}, {data: ["0"], color: "#EFDBFF", name: "20~29岁"},…],…]
      //   title: "年龄比例"
      //   yAxisData: ["合约男女", "宝贝计划"]
      // }
    const _left = { //模拟数据 渲染多个图表 计算百分比， 鼠标放上去显示对应值
      title: "性别比例 echart_barReadius",
      legend: ['男', '女'],
      yAxisData: ['颐和园', "柴犬馒头", "疯了"],
      series: [
        [{ data: ['50.5'], name: '男' ,color:'#BE98EB '}, { data: ['50.5'], name: '女' ,color:'#82BBFB ' }],
        [{ data: ['100'], name: '男' ,color:'#BE98EB '}, { data: ['100'], name: '女' ,color:'#82BBFB ' }],        
        [{ data: ['80'], name: '男' ,color:'#BE98EB'  }, { data: ['100'], name: '女'  ,color:'#82BBFB ' }], 
      ]
    };
    const _right = {
      title: "年龄比例 echart_barReadius",
      legend: ['0-12', '13-18','19-24','25-34','35-50','50岁以上'],
      yAxisData: ['喵呜琪琪梦', "柴犬馒头", "疯了瑰宝"],
      series: [
        [{ data: ['100'], name: '0-12' ,color:'#BE98EB '}, { data: ['200'], name: '13-18' ,color:'#82BBFB ' }, { data: ['300'], name: '19-24' ,color:'red ' }, { data: ['400'], name: '25-34' ,color:'#82bbfb' }, { data: ['400'], name: '35-50' ,color:'#82bbcb' }, { data: ['400'], name: '50岁以上' ,color:'#822bfb' }],
        [{ data: ['800'], name: '0-12' ,color:'#BE98EB '}, { data: ['700'], name: '13-18' ,color:'#82BBFB ' }, { data: ['600'], name: '19-24' ,color:'#82BBFB ' }, { data: ['500'], name: '25-34' ,color:'#82BBFB' }, { data: ['400'], name: '35-50' ,color:'#82bbcb' }, { data: ['400'], name: '50岁以上' ,color:'#822bfb' }],
        [{ data: ['100'], name: '0-12' ,color:'#BE98EB '}, { data: ['200'], name: '13-18' ,color:'#82BBFB ' }, { data: ['300'], name: '19-24' ,color:'#82BBFB ' }, { data: ['400'], name: '25-34' ,color:'#82BBFB ' }, { data: ['400'], name: '35-50' ,color:'#82bbcb' }, { data: ['400'], name: '50岁以上' ,color:'#822bfb' }]]
    }
    if(data == null || data == undefined){
      data={
        gender:{
          title:'',
          legend:[],
          yAxisData:'',
          series:[[]],
        },
        age:{
          title:'',
          legend:[],
          yAxisData:'',
          series:[[]],
        }
      }
    }
    // const _leftdata = this.getOption(_left); 
    // const _rightdata = this.getOption(_right);  
    const _leftdata = this.getOption(data.gender); 
    const _rightdata = this.getOption(data.age);  
    return (
      <div className={container}>
        <div className="barredius"> 
        {_leftdata && _leftdata.map((obj,index)=>{
          if(index==0){
            return (<div className="heightAuto" key={index}><ReactEcharts option={obj}/></div>)
          }else{
            return (<ReactEcharts option={obj}  key={index}/>)
          }           
          })}  
        </div>
        <div className="barkinglist">
        {_rightdata && _rightdata.map((obj,index)=>{
          if(index==0){
            return (<div className="heightAuto" key={index}><ReactEcharts option={obj}/></div>)
          }else{
            return ( <ReactEcharts option={obj}  key={index}/>)
          }           
          })}  
        </div>
      </div>
    );
  }
}
