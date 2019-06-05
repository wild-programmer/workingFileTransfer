import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/Contact.scss"; 
import Header from "@components/header";
import { toJS } from "mobx";
import { Link } from "react-router-dom";
 

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
      <div className="body contact-container">
        <Header data={toJS(headerNav)} style={{ backgroundColor: "#2e3943" }} history={this.props.history}/>
        <div className="main clearfix">
          <div className="static-menu">
            <ul>
              <li><Link to="/who_am_i" className="curr">公司介绍</Link> </li>
              <li><Link to="/contact">联系我们</Link></li>
              <li><Link to="/join">加入我们</Link></li>
              <li><Link to="/rule" className="">法务条款</Link></li>
              <li><Link to="/use">使用条款</Link></li>
              <li><Link to="/rights" >版权声明</Link></li>
            </ul>
          </div>
          <div className="static-container">
            <h1>公司介绍</h1>
            <div className="container-inner">
                <p>
                    酷拓COOLTOUR，文化娱乐领域内领先的IP价值一体化管理者，倡导IP品牌化经营，与行业共同打造内容价值管理新生态，实现IP文化价值与商业价值的共赢。<br/><br/>

                    酷拓文化交流（上海）有限公司背靠上海新海润文化发展有限公司、Interpret Global及NORMCORE Group，结合国外先进的方法论以及国内发展的特殊性，酷拓在娱乐文化行业内思维的不断深化，为内容生产方提供从IP战略、策略定位、品牌管理与营销一站式服务。<br/><br/>

                    酷拓共有3块核心业务：IP投资智库、IP品牌管家、IP增值服务，业务辐射三次元名人、影视、综艺，以及二次元游戏、动漫等领域，为内容生产方度身定制解决方案。
                </p>
                <h2>IP投资智库</h2>
                <p>
                    酷拓通过自身丰富的行业经验、全方位精准数据支撑及多角度用户调查，为IP投资方提供专业智囊服务，与内容生产方共同打造IP战略。以数据调研及分析为依据，与用户研究相结合的方式，以大数据调研为基础，消费者调研和分析为核心洞察，通过焦点座谈、创意工坊等多种定性研究方式，深入消费者了解他们的习惯、偏好，与IP方合作，积累并收集连续数据，针对性地深入洞察用户行为、习惯及喜好变化背后的原因，掌握消费者不断变化的新想法。
                </p>
                <h2>IP品牌管家</h2>
                <p>
                    酷拓拥有IP品牌化的DFI品牌管理模型及五维内容传播策略矩阵，帮助IP品牌管理及实施营销策略规划。
                </p>
                <h2>
                    IP增值服务
                </h2>
                <p>
                    提供IP商务服务、IP衍生品开发、IP社区经营、IP多元经营等内容变现增值方案及服务，为IP生命注入长尾效应。同时，开放IP方服务平台IPEC(www.indexip.cn)，为业内人士查询IP信息、了解行业动态、匹配商业合作契机提供优质渠道和工具。
                    <br/>
                    <br/>
                    酷拓期待在泛娱乐时代中，与您携手共赢，酷拓未来。

                </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
