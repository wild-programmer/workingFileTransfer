import * as React from "react";
import { inject, observer } from "mobx-react";
import Header from "@components/header";
import Footer from "@components/footer";
import ReactSwiper from "@components/react_swiper";
import "@assets/scss/home.scss";
import { toJS } from "mobx";
import {
  CoreProduct,
  CooperateIp,
  IndustryCase,
  CooperatePartner,
  IpTenType,
  PublicIp
} from "@pages/home/components";

@inject("home")
@inject("ip_list")
@inject("nav_store")
@observer
export default class Home extends React.Component<IProps> {
  async componentDidMount() {
    document.title = "首页";
    const { home, nav_store } = this.props;
    await home.slideList();
    await home.mediaType();
    await home.moduleList();
    await nav_store.navList();
    await home.getPublicIP({ currentPage: 1, pageSize: 20 });
  }

  render() {
    let { home, nav_store, ip_list } = this.props;
    let { slides, modules, publicData, typeData } = home;
    let { headerNav, footerNav } = nav_store;
    modules = toJS(modules);
    return (
      <div className="main-container">
        <div className="header-area">
          <Header data={toJS(headerNav)} style={{ backgroundColor: "#fff" }} history={this.props.history}/>
          <ReactSwiper slide={toJS(slides)}/>
        </div>
        <IpTenType data={typeData} ip_list={ip_list}/>
        <CooperateIp data={modules['cooperateIp']}/>
        <PublicIp data={publicData}/>
        <IndustryCase data={modules['industryCase']}/>
        <CoreProduct data={modules['coreProduct']}/>
        <CooperatePartner data={modules['cooperatePartner']}/>
        {/*{*/}
        {/*modules && modules.map((item: any) => {*/}
        {/*const o = {*/}
        {/*"热门IP推荐": CooperateIp, // 合作IP*/}
        {/*"公示中的IP": PublicIp,*/}
        {/*// "展示IP": IpItem,*/}
        {/*"行业案例": IndustryCase,*/}
        {/*"核心产品": CoreProduct,*/}
        {/*"合作伙伴": CooperatePartner,*/}
        {/*};*/}
        {/*let data = toJS(item);*/}
        {/*console.log(data);*/}
        {/*let Component = o[data.moduleName];*/}
        {/*return <Component key={data.moduleId} data={data}/>;*/}
        {/*})*/}
        {/*}*/}
        <Footer data={toJS(footerNav)}/>
      </div>
    );
  }
}
