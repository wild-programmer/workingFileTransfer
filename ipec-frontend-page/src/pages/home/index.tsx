import * as React from "react";
import { inject, observer } from "mobx-react";
import Header from "@components/header";
import Footer from "@components/footer";
import ReactSwiper from "@components/react_swiper";
import "@assets/scss/home.scss";
import { toJS } from "mobx";
import { CoreProduct, CooperateIp, IpItem, IndustryCase, CooperatePartner } from "@pages/home/components";

@inject("home")
@inject("nav_store")
@observer
export default class Home extends React.Component<IProps> {
  async componentDidMount() {
    document.title = "首页";
    const { home, nav_store } = this.props;
    await home.slideList();
    await home.moduleList();
    await nav_store.navList();
  }

  render() {
    let { home, nav_store } = this.props;
    let { slides, modules } = home;
    let { headerNav, footerNav } = nav_store;
    return (
      <div className="main-container">
        <div className="header-area">
          <Header data={toJS(headerNav)} style={{ backgroundColor: "#fff" }} history={this.props.history}/>
          <ReactSwiper slide={toJS(slides)}/>
        </div>
        {
          modules && modules.map((item: any) => {
            const o = {
              "核心产品": CoreProduct,
              "热门IP推荐": CooperateIp, // 合作IP
              "展示IP": IpItem,
              "行业案例": IndustryCase,
              "合作伙伴": CooperatePartner,
            };
            let data = toJS(item);
            // console.log(data);
            let Component = o[data.moduleName];
            return <Component key={data.moduleId} data={data}/>;
          })
        }
        <Footer data={toJS(footerNav)}/>
      </div>
    );
  }
}
