import * as React from "react";
import "@assets/scss/scrollTop.scss"
import houde from "@assets/images/contrast/houd.png";
import backtop from "@assets/images/backtop.png";
import wechatcode from "@assets/images/code.jpg";
import code2 from "@assets/images/code2.png";
import { element } from "prop-types";
import { Link } from "react-router-dom";



interface IAvatarProps extends IComponentProps { 
  contrast:boolean,
  
}

interface ITimeInputState {
  isShow:any
}


export default class Toast extends React.Component<IAvatarProps,ITimeInputState> {
  timeId = 0; 
  constructor(props:any){
    super(props)  
    this.state = { isShow:false, };
  }
  componentDidMount(): void { 
  }
  componentWillUnmount(): void {
    
  }
   ScrollTop = (number = 0, time) => {
    if (!time) {
      document.body.scrollTop = document.documentElement.scrollTop = number;
      return number;
    }
    const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime; // 计算循环的次数
    let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
    let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
    let scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
        spacingInex--;
        this.ScrollTop(nowTop += everTop, null);
      } else {
        clearInterval(scrollTimer); // 清除计时器
      }
    }, spacingTime);
  };

  render() { 
    const {contrast,data,deletContast} = this.props; 
    const {isShow} = this.state; 
    console.log("data@")
    console.log(data)
    return (
      <ul className="industry_ul">
      {/* <li className="user_iconlist">
        <i ><img src={iconKefu2}></img></i>
      </li> */}
      {
        contrast && !isShow ?  <li className="contrast" onClick={
          ()=>{
            this.setState({
              isShow:true
            })
          }
        }>
        已
        添
        加
        对
        比
        <img src={houde} alt=""/>
        </li>: contrast ?<div className="contrastBox">
          <div className="left" onClick={
            ()=>{
              this.setState({
                isShow:false
              })
            }
          }>
            已
            添
            加
            对
            比
          <img src={houde} alt=""/>
          </div>
          <div className="right">
            {
              contrast && data.map(element=>{
                return (
                  <p key={element.ipids}>
                    {element.name}
                  <span className="icon iconfont icon_delete"
                  onClick={()=>{
                    deletContast(element.ipids)
                  }}></span>
                </p>
                )
              })
            }            
            {/* <p>
              疯了，瑰宝
            <span className="icon iconfont icon_delete"></span>
          </p> */}
          {
            contrast && data.length >=2 ?  <Link to={`/contrast`}>
             <button className="see" >
             查看对比
           </button></Link>: <button className="see" onClick={()=>{ 
           }}>
             查看对比
           </button>
          }
          </div>
        </div>:''
      } 
      <li className="code_iconlist">
        <i><img src={code2} /></i>
        <div className="code">
          <div className="codeIn">
            <img src={wechatcode} />
            <p>关注微信公众号</p>
          </div>
        </div>
      </li>
      <li className="top_iconlist" onClick={() => {
        this.ScrollTop(0, 200);
      }}>
        {/* <li className="top_iconlist" onClick={()=>{document.body.scrollTop = document.documentElement.scrollTop = 0}}> */}
        <i><img src={backtop} /></i>
      </li>

    </ul>
    );
  }
}
