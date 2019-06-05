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
              <li><Link to="/join" className="curr">加入我们</Link></li>
              <li><Link to="/rule" className="">法务条款</Link></li>
              <li><Link to="/use">使用条款</Link></li>
              <li><Link to="/rights">版权声明</Link></li>
            </ul>
          </div>
          <div className="static-container">
              <h1>加入我们</h1>
              <div className="container-inner">
                  <h2>加入酷拓</h2>
                  <ul>
                      <li>
                          <div>
                              <i className="iconfont icon-email"></i> <a href="mailto: hr@cooltour.fun">hr@cooltour.fun</a>
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
