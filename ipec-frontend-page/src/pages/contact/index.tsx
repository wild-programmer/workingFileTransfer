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
        <Header data={toJS(headerNav)} style={{ backgroundColor: "#fff" }} history={this.props.history}/>
        <div className="main clearfix">
          <div className="static-menu">
            <ul>
              <li><Link to="/who_am_i">公司介绍</Link> </li>
              <li><Link to="/contact" className="curr">联系我们</Link></li>
              <li><Link to="/join">加入我们</Link></li>
              <li><Link to="/rule" className="">法务条款</Link></li>
              <li><Link to="/use">使用条款</Link></li>
              <li><Link to="/rights" >版权声明</Link></li>
            </ul>
          </div>
          <div className="static-container">
            <h1>联系我们</h1>
            <div className="container-inner">
              <h2>联系我们</h2>
              <ul>
                <li>
                  <h3>商务合作</h3>
                  <div>
                    <i className="iconfont icon-email"></i> <a href="mailto: business@cooltour.fun">business@cooltour.fun</a>
                  </div>
                </li>
                <li>
                  <h3>内容合作</h3>
                  <div>
                    <i className="iconfont icon-email"></i> <a href="mailto: business@cooltour.fun">business@cooltour.fun</a>
                  </div>
                </li>
                <li>
                  <h3>在线客服</h3>
                  <div>
                    <i className="iconfont icon-contact"></i> <a href="tel: 021-5280 9679">021-5280 9679</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
