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
              <li><Link to="/rule" className="">法务条款</Link></li>
              <li><Link to="/use">使用条款</Link></li>
              <li><Link to="/rights" className="curr">版权声明</Link></li>
            </ul>
          </div>
          <div className="static-container">
          <h1>版权声明</h1>
            <div className="container-inner">
                <h2>版权声明：</h2>
                <p>
                    1. IPEC对其发行的或与合作伙伴共同发行的作品享有版权，受各国版权法及国际版权公约的保护。 <br/>
                    2.对于上述版权内容，超越合理使用范畴、并未经本公司书面许可的使用行为，我公司均保留追究法律责任的权利。
                </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
