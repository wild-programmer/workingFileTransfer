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
              <li><Link to="/who_am_i">公司介绍</Link> </li>
              <li><Link to="/contact">联系我们</Link></li>
              <li><Link to="/join">加入我们</Link></li>
              <li><Link to="/rule" className="curr">法务条款</Link></li>
              <li><Link to="/use">使用条款</Link></li>
              <li><Link to="/rights" className="">版权声明</Link></li>
            </ul>
          </div>
          <div className="static-container">
              <h1>法务条款</h1>
              <div className="container-inner">
                  <p>
                      <a href="http://www.indexip.cn">IPEC智库</a>（域名<a href="http://www.indexip.cn">www.indexip.cn</a>，以下简称IPEC）是酷拓文化交流（上海）有限公司（以下简称酷拓）开发并所有的独立网站，IPEC不提供任何视听上传服务，所有内容均来自视频分享站点所提供的公开引用资源，所有视频及图文版权均归原作者及其网站所有。本站将竭尽所能注明资源来源，但由于互联网转载的不可预性，无法确认所有内容的版权所有人。若原作者对本站所载视频作品版权的归属存有异议，请联系<a href="mailto: info@cooltour.fun">info@cooltour.fun</a>，我们将在第一时间予以删除。
                      <br/>
                      <br/>
                      IPEC尊重并保护所有使用IPEC用户的个人隐私权，您注册的用户名、电子邮件地址等个人资料，非经您亲自许可或根据相关法律、法规的强制性规定，IPEC不会主动地泄露给第三方。
                      <br/>
                      <br/>
                      任何存在于IPEC上的视频、图文资料均系他人制作或提供，仅为个人观点，不代表IPEC立场。您可能从这些视频、图文资料上获得资讯，IPEC对其合法性概不负责，亦不承担任何法律责任。
                      <br/>
                      <br/>
                      您应该对浏览使用IPEC一切服务自行承担风险。我们不做任何形式的保证：不保证站内搜索结果满足您的要求，不保证网站服务不中断，不保证视频及图文资源的安全性、正确性、及时性、合法性。因网络状况、通讯线路、第三方网站等任何原因而导致您不能正常使用IPEC，IPEC不承担任何法律责任。
                      <br/>
                      <br/>
                      任何单位或个人认为通过IPEC提供的内容可能涉嫌侵犯其信息网络传播权，应该及时向IPEC提出书面权利通知，并提供身份证明、权属证明及详细侵权情况证明。IPEC在收到上述法律文件后，将会依法尽快断开相关链接内容。

                  </p>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
