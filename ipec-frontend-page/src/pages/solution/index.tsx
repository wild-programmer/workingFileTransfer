
import * as React from "react";
import '@assets/scss/solution.scss';
import { inject, observer } from "mobx-react";
import Header from "@components/header";
import Footer from "@components/footer";
import { toJS } from "mobx";
import { Link } from "react-router-dom";
import wechatcode from "@assets/images/code.jpg";
import code2 from "@assets/images/code2.png";
import backtop from "@assets/images/backtop.png";


const ScrollTop = (number = 0, time) => {
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
      ScrollTop(nowTop += everTop, null);
    } else {
      clearInterval(scrollTimer); // 清除计时器
    }
  }, spacingTime);
};

@inject("nav_store")  
@observer
export default class Contact extends React.Component<IProps> {
  async componentDidMount() {
    const { nav_store } = this.props;
    await nav_store.navList();
  }
  render() {
    let { nav_store } = this.props;
    let { headerNav, footerNav } = nav_store;
    return (

      <div className="solution-index">
        <Header data={toJS(headerNav)} style={{ backgroundImage: 'linear-gradient(12deg, #7f55a9, #3c1371)' }} history={this.props.history} />
        <div className="main_top" >
        <ul className="solution-tag clearfix">
          <li>
            <div>
              <div className="svg-lib"></div>
              <h2>IP投资智库</h2>
              <p>
                丰富的行业经验，数据分析及行业洞察，打造IP品牌定位与生命周期模型，与内容生产方共同打造IP战略。
              </p>
            </div>
          </li>
          <li>
            <div>
              <div className="svg-brand"></div>
              <h2>IP品牌管家</h2>
              <p>
                DFI品牌管理模型及五维内容传播策略矩阵为IP品牌从定位到传播提供全方位品牌与营销管理。
              </p>
            </div>
          </li>
          <li>
            <div>
              <div className="svg-service"></div>
              <h2>IP增值服务</h2>
              <p>
                IP社群化经营、商务扩展及内容变现增值方案，为IP的商业价值注入长尾效应，延长生命周期。
              </p>
            </div>
          </li>
        </ul>
        <ul className="solution-tag-sub clearfix">
            <li className="svg-celebrity"></li> 
            <li className="svg-movie"></li>
            <li className="svg-acg"></li>
          </ul>
        </div>

        <div className="main">
          <div>
            <div className="lib-panel clearfix panel-box">
              <div className="">
                <h3>
                  <span className="svg-lib inblock"></span>
                  <span className="inblock">IP投资智库</span>
                </h3>
                <p>
                  全方位精准数据支撑、多角度用户洞察，以数据分析为依据，与用户研究相结合的方式提出内容解决方案，为IP投资方向提供专业智囊服务。

                </p>
              </div>
              <div className="">
                <div className="svg-lib-detail"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="lib-panel clearfix panel-box lib-panel-2">
              <div className="">
                <div className="svg-lib-detail-2"></div>
              </div>
              <div className="">
                <h3>
                  <span className="svg-lib inblock"></span>
                  <span className="inblock">IP投资智库</span>
                </h3>
                <p>
                  以大数据调研为基础，消费者调研和分析为核心洞察，深入消费者了解他们的习惯、偏好，积累并收集连续数据，掌握消费者不断变化的新想法。
                  <br />
                  <br />
                  通过焦点座谈、创意工坊等多种定性研究方式，针对性地深入洞察用户行为、习惯及喜好变化背后的原因。最终结合数据分析结果，为决策规划制定提供帮助。
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="brand-panel clearfix panel-box">
              <div className="">
                <h3>
                  <span className="svg-brand inblock"></span>
                  <span className="inblock">IP品牌管家</span>
                </h3>
                <h4>IP化战略定位 | IP化品牌创意 | IP化传播策略</h4>
                <p className="mb0">
                  DFI品牌管理模型及五维内容传播策略矩阵为IP品牌从定位到传播提供全方位营销服务。
                  </p>
              </div>
              <div className="">
                <div className="svg-brand-detail-2"></div>
                <div className="pos-div svg-brand-detail"></div>
                <div className="pos-div">DFI-IP定位模型</div>
              </div>
            </div>
          </div>

          <div>
            <div className="service-panel clearfix panel-box">
              <h3>
                <span className="svg-service inblock"></span>
                <span className="inblock">IP增值服务</span>
              </h3>
              <ul>
                <li>
                  <div>
                    <div className="svg-service-detail-1"></div>
                    <p>
                      植入合作 <br />
                      形象授权
                  </p>
                  </div>
                </li>
                <li>
                  <div>
                    <div className="svg-service-detail-2"></div>
                    <p>
                      实物周边 <br />
                      增值变现
                  </p>
                  </div>
                </li>
                <li>
                  <div>
                    <div className="svg-service-detail-3"></div>
                    <p>
                      社群经营 <br />
                      体验为王
                  </p>
                  </div>
                </li>
                <li>
                  <div>
                    <div className="svg-service-detail-4"></div>
                    <p>
                      多元变体 <br />
                      扩大渗透
                  </p>
                  </div>
                </li>
              </ul>

            </div>
          </div>

        </div>

        <ul className="industry_ul">
          {/* <li className="user_iconlist">
            <i ><img src={iconKefu2}></img></i>
          </li> */}
          <li className="code_iconlist">
            <i ><img src={code2}></img></i>
            <div className="code" >
              <div className="codeIn">
                <img src={wechatcode}></img>
                <p>关注微信公众号</p>
              </div>
            </div>
          </li>
          <li className="top_iconlist" onClick={() => { ScrollTop(0, 200) }}>
            {/* <li className="top_iconlist" onClick={()=>{document.body.scrollTop = document.documentElement.scrollTop = 0}}> */}
            <i ><img src={backtop}></img></i>
          </li>

        </ul>
        <Footer data={footerNav} />
      </div>
    );
  }


}
