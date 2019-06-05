import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/Contact.scss";
import Header from "@components/header";
import Footer from "@components/footer";
import { toJS } from "mobx";
import default_img from "@assets/images/default_img_ip.png";
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
      <div className="body">
        <Header data={toJS(headerNav)} style={{ backgroundColor: "#fff" }} history={this.props.history}/>
        <div className="about-container">
          <div className="about-content">
            <h4 className="title">关于版圈儿</h4>
            <div className="flex">
              <img src={default_img} alt=""/>
              <div className="flex-right">
                <p>“中国品牌授权365（http://www.chinalicensing365.com/）”隶属于中国玩具和婴童用品协会，
                  作为国内最具公信力的由政府指导和由非盈利机构运营的第三方IP备案查询平台，中国品牌授权
                  365旨在集合各行业广泛的授权商及被授权商资源，打通信息壁垒，解决品牌授权领域普遍存在的
                  信息不对称现象，有力推动各类授权IP与被授权企业之间的商业对接，并为合法备案的IP在遭遇法律
                  纠纷时提供司法佐证依据。
                </p>
                <p style={{ marginBottom: '0' }}>
                  IPEC智库（www.indexip.cn ）是IP产业生态链的推动者，提供IP商务服务、IP衍生品开发、IP社区经营、
                  IP多元经营等内容变现增值方案及服务，为IP生命注入长尾效应。为业内人士查询IP信息、了解行业动态、
                  匹配商业合作契机提供优质渠道和工具
                </p>
              </div>
            </div>
            <p>在中国品牌授权365的指导下，IPEC智库改版推出全新战略版图：版圈儿，IP人，来版圈儿。</p>
            <p>版圈儿将集合各行业广泛的授权商及被授权商资源，打通信息壁垒，解决品牌授权领域普遍存在的信息
              不对称现象，有力推动各类授权IP与被授权企业之间的商业对接，构建数字化IP生态圈。
            </p>
            <p>版圈儿将致力于打造最全面的IP生态链，推进中国知识版权的发展。提供全面的IP授权名录查询方便您
              自助筛选、多维度的IP数据分析助力您职能决策、版圈儿溯源链助您智能化授权、打造IP生态圈扩大IP影响力等。
            </p>
            <p>依托酷拓在IP行业的丰富经验，以及IPEC智库强有力的数据分析与行业洞察能力，版圈儿将以全面精准
              的数据解读与深入多维的用户研究相结合的方式，为IP品牌从定位到传播提供全方位品牌与营销管理及专业的
              智囊服务，深度链接IP运营、内容营销等垂直场景，为IP产业增值赋能。
            </p>
            <p>版圈儿怀揣赤子意志，诚意期待携手IP产业各方互利同行，共建共享数字化IP生态圈。为IP行业的健康、
              持续发展注入属于自己的能量。
            </p>
            <p className="last-child">版圈儿路上，一起酷拓未来！</p>
          </div>
        </div>
        <Footer data={toJS(footerNav)}/>
      </div>
    );
  }
}
