import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";
import "@assets/scss/contrast.scss";
import { inject, observer } from "mobx-react";
import {
  getContact, setContact, deletContact
} from "@utils/util";
import { toJS } from "mobx";
import Alert from '@components/alert';

import 'antd/dist/antd.css';
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import EchartBar from "@components/echart_bar_darren";
import EchartLine from "@components/echart_line_darren";
import EchartBarRadius from "@components/echart_barRadius";
import EchartMap from "@components/echart_map"; //这是雪琪写的组建
import EchartRadar from "@components/echart_radar";
import EchartwordCloud from "@components/echart_wordcloud_three";
import EchartCategory from "@components/echart_bar_category";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import ScrollTop from "@components/scrollTop";
import ic_rise from "@assets/images/ip_detail/ic_rise.svg";
import ic_decline from "@assets/images/ip_detail/ic_decline.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_default from "@assets/images/contrast/ic_default_page.png";
import ic_hudong from "@assets/images/ip_detail/ic_hudong.svg";
import ic_search from "@assets/images/ip_detail/ic_search.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import douban from "@assets/images/ip_detail/douban.png";
import iqiyi from "@assets/images/ip_detail/iqiyi_logo.png";
import LeTV_logo from "@assets/images/ip_detail/LeTV_logo.png";
import mangguo from "@assets/images/ip_detail/mangguo.png";
import tengxun from "@assets/images/ip_detail/tengxun.png";
import youku from "@assets/images/ip_detail/youku.png";
import how from "@assets/images/ip_detail/how.png";


import img1 from "@assets/images/contrast/1.png";
import img2 from "@assets/images/contrast/2.png";
import img3 from "@assets/images/contrast/3.png";
import { async } from "q";
import val from "@assets/images/ip_detail/ic_rise.svg";
interface Options {
  show: any,

  message: string,
  aletmessage: string,

  ipTypeSuperiorNumber: string,
  navNub: number,

  _params: object,
  ismove: boolean,
  isTv: boolean,
  aletShow: boolean;

  contastList: any;
  all: {
    BasicData: {
      all: object,
      search: object,
      interate: object,
      media: object,
      fans: object,
      isTv: object,
    },
    assessment: {
      hot: object,
      media: object,
      portrayal: object,
      land: object,
      cloud: object,
    },
    predict: {
      potential: object,
      business: object,
    }
  }

}

//
@inject("nav_store")
@inject("contract")
@observer
export default class User extends React.Component<IProps, Options> {
  constructor(props: any) {
    super(props);
    this.state = {
      ismove: false,
      show: false,
      aletShow: false,
      isTv: false,
      _params: null,
      contastList: JSON.parse(window.localStorage.getItem('contastList')),
      message: '',
      aletmessage: '',
      ipTypeSuperiorNumber: '',
      navNub: 1,
      all: {
        BasicData: {
          all: {},
          search: {},
          interate: {
            nav: 41
          },
          media: {},
          fans: {},
          isTv: {},
        },
        assessment: {
          hot: {},
          media: {},
          portrayal: {},
          land: {},
          cloud: {},
        },
        predict: {
          potential: {},
          business: {},
        }
      }
    }
  }

  async componentDidMount() {
    document.title = "IPEC";
    const { nav_store, user, contract } = this.props;
    const { updateList } = contract;
    let { ismove, contastList, isTv } = this.state; 
    const { userGuid } = JSON.parse(sessionStorage.getItem("user"));
    const _params = await getContact(); //获取到 ipTypeSuperiorNumber isids 参数 
    _params['userGuid'] = userGuid;
    contract.creactData(_params)
    contract.getAcquire({ ..._params, typeId: 5, dayNumber: 10 })
    contract.getAcquire({ ..._params, typeId: 41, dayNumber: 10 })
    contract.getAcquire({ ..._params, typeId: 13, dayNumber: 10 })
    contract.getAcquire({ ..._params, typeId: 14, dayNumber: 10 })

    contract.getFansArea({ ..._params, typeId: 1, ipid: contastList[0].ipids });
    contract.getFansArea({ ..._params, typeId: 2, ipid: contastList[0].ipids });
    contract.getFansArea({ ..._params, typeId: 3, ipid: contastList[0].ipids });
    contract.getPortrait({ ..._params, typeId: 1 });
    contract.getPortrait({ ..._params, typeId: 2 });

    if (_params.ipTypeSuperiorNumber == 5 || _params.ipTypeSuperiorNumber == 7) {
      isTv = true;
      //平台数据对比
      contract.getPlayTrends({ ..._params, type: 1 });
      contract.getPraise(_params);
    }
    if (_params.ipTypeSuperiorNumber == 6) {
      ismove = true;
      //院线票房对比
      contract.getBoxOffice(_params);
      //平台数据对比
      contract.getPlayTrends({ ..._params, type: 1 });
      contract.getPraise(_params);
    }
    this.setState({
      _params: _params,
      ismove: ismove,
      isTv: isTv,
      ipTypeSuperiorNumber: _params.ipTypeSuperiorNumber
    })


    await nav_store.navList();
    this.setoption()
  }
  // componentDidUpdate( ) {
  //   // 如果数据发生变化，则更新图表

  //   const { nav_store, user,contract } = this.props;
  //   const { updateList } = contract;
  //   let { aletmessage ,aletShow} = this.state;
  //   if(updateList.message != '' && updateList.message !== undefined){
  //     aletmessage = updateList.message;
  //     aletShow = true;
  //   } 
  //   this.setState({
  //     // aletShow:aletShow,
  //     // aletmessage:aletmessage, 
  //   })
  // }
  setoption() {
    let _all = this.state.all;
    this.getoption(_all.BasicData)
    this.getoption(_all.assessment)
    this.getoption(_all.predict)
    this.setState({
      all: _all
    })
  }
  // assessment.land['day']
  getoption(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = {
          day: 10,
          data: null,
          nav: 1,
        }
        if (key == 'search') obj[key]['nav'] = 5;
        if (key == 'interate') obj[key]['nav'] = 41;
        if (key == 'media') obj[key]['nav'] = 13;
        if (key == 'fans') obj[key]['nav'] = 14;
        if (key == 'land') obj[key]['nav'] = 3;
        if (key == 'land') { obj[key]['nav'] = 3; obj[key]['day'] = this.state.contastList[0].ipids };
      }
    }
    // return obj;
  }
  //点击选中30 天 一个月 重新获取接口

  getsourceDay(obj) {
    //匹配到对应参数 并设置对应天数

    const { contract } = this.props;
    let { _params } = this.state;
    let _all = this.state.all;
    switch (obj.source) {
      case 'search':
        _all.BasicData.search['day'] = obj.day;
        obj.data ? _all.BasicData.search['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: 5, dayNumber: obj.day })
        break
      case 'interate':
        _all.BasicData.interate['day'] = obj.day;
        obj.data ? _all.BasicData.interate['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: _all.BasicData.interate['nav'], dayNumber: obj.day })
        break
      case 'media':
        _all.BasicData.media['day'] = obj.day;
        obj.data ? _all.BasicData.media['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: _all.BasicData.media['nav'], dayNumber: obj.day })
        break
      case 'fans':
        _all.BasicData.fans['day'] = obj.day;
        obj.data ? _all.BasicData.fans['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: _all.BasicData.fans['nav'], dayNumber: obj.day })
        break
      case 'cloud':
        _all.assessment.cloud['day'] = obj.day;
        obj.data ? _all.assessment.cloud['data'] = obj.data : '';
        break
      case 'land':
        _all.assessment.land['day'] = obj.day;
        obj.data ? _all.assessment.land['data'] = obj.data : '';
        break
      case 'media2':
        _all.assessment.media['day'] = obj.day;
        obj.data ? _all.assessment.media['data'] = obj.data : '';
        break
      case 'hot':
        _all.assessment.hot['day'] = obj.day;
        obj.data ? _all.assessment.hot['data'] = obj.data : '';
        break

      default:

    }
    this.setState({
      all: _all
    })
  }
  //切换顶部模块
  tagNavNumber(number) {
    this.setState({
      navNub: number
    })
  }
  //切换模块内数据

  tagNavItem(obj) {
    const { contract } = this.props;
    let { _params } = this.state;
    let _all = this.state.all;
    switch (obj.el) {
      case 'interate':
        _all.BasicData.interate['nav'] = obj.nav;
        obj.data ? _all.BasicData.interate['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.interate['day'] })
        break;
      case 'media':
        _all.BasicData.media['nav'] = obj.nav;
        obj.data ? _all.BasicData.media['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.media['day'] })
        break;
      case 'fans':
        _all.BasicData.fans['nav'] = obj.nav;
        obj.data ? _all.BasicData.fans['data'] = obj.data : '';
        contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.fans['day'] })
        break;
      case 'land':
        _all.assessment.land['nav'] = obj.nav;
        obj.data ? _all.assessment.land['data'] = obj.data : '';
        break;
      case 'isTv':
        _all.BasicData.isTv['nav'] = obj.nav;
        obj.data ? _all.BasicData.isTv['data'] = obj.data : '';
        contract.getPlayTrends({ ..._params, type: obj.nav });
        break;
      default:
    }
    this.setState({
      all: _all
    })
  }

  fileter_logo = ipids => {

    // import douban from "@assets/images/ip_detail/douban.png";
    // import iqiyi from "@assets/images/ip_detail/iqiyi_logo.png";
    // import LeTV_logo from "@assets/images/ip_detail/LeTV_logo.png";
    // import mangguo from "@assets/images/ip_detail/mangguo.png";
    // import tengxun from "@assets/images/ip_detail/tengxun.png";
    // import youku from "@assets/images/ip_detail/youku.png";
    switch (ipids) {
      case 44:
        return douban
        break;
      case 47:
        return tengxun
        break;
      case 50:
        return iqiyi
        break;
      case 52:
        return LeTV_logo
        break;
      case 62:
        return youku
        break;
      case 48:
        return mangguo
        break;
      default:
        return ''
    }

  }

  render() {
    const { nav_store, user, contract } = this.props;
    let { listIp, dataScreening, Acquire, interate, media, fans, Portrait, business, landResults, ipProvinceData, xProvince, yProvince, isMoveData, isTvData, dataPraise } = contract.updateList
    let { ipTypeSuperiorNumber, ismove, aletmessage, aletShow, contastList, _params, isTv } = this.state
    let { headerNav, footerNav } = nav_store;
    let BasicData = this.state.all.BasicData;
    let assessment = this.state.all.assessment;
    let predict = this.state.all.predict;
    listIp = toJS(listIp);
    landResults = toJS(landResults);
    dataScreening = toJS(dataScreening);
    return (
      <div className="bg-color userhtml">
        <Header data={headerNav} history={this.props.history} />
        {aletShow &&
          <Alert
            message={aletmessage}
            onClose={() => {
              this.setState({ show: false });
            }}
            onSubmit={() => {
              this.setState({ show: false });
            }} />
        }
        <div className="contrast">
          <div className="contrast_product">
            {listIp && listIp.map((element) => {
              return (
                <div key={element.ipid}>
                  <div className="img">
                    <img src={element.picUrl}></img>
                    <div className="product_tool">
                      <span className="text" title={element.ipName}>{element.ipName}</span>
                      <span
                        onClick={
                          () => {
                            deletContact(element.ipid);
                            if(listIp.length <= 2){
                              this.setState({
                                show:true,
                                message:'至少有两个IP 参与对比将要跳转至IP列表'
                              })
                              this.props.history.push('/ip-list')
                            }else{
                               window.location.reload();
                            }
                           
                          }
                        }
                        className="icon iconfont icon_delete"></span>
                    </div>
                  </div>
                </div>
              )

            })}
          </div>

          <div className="class_fication">
            <div className={this.state.navNub === 1 ? "item active" : "item"} onClick={() => {
              this.tagNavNumber(1)
            }}>
              <span className="icon iconfont icon_model1"></span>
              <span className="text">基础数据</span>
            </div>
            <div className={this.state.navNub === 2 ? "item active" : "item"} onClick={() => {
              this.tagNavNumber(2)
            }}>
              <span className="icon iconfont icon_model2"></span>
              <span className="text">版圈儿评估</span>
            </div>
            <div className={this.state.navNub === 3 ? "item active" : "item"} onClick={() => {
              this.tagNavNumber(3)
            }}>
              <span className="icon iconfont icon_model3"></span>
              <span className="text">版圈儿预测</span>
            </div>
          </div>
          {/* 第三块 */}
          <div className={this.state.navNub === 3 ? "Survey_data show" : "Survey_data"}>
            <div className="default">
              <img src={ic_default} alt="" />
              <div className="tips">此模块正披星戴月开发中， 敬请期待！</div>
            </div>
          </div>
          {/* 第二块 */}
          <div className={this.state.navNub === 2 ? "Survey_data show" : "Survey_data"}>

            <p><span className="icon"><img src={ic_search} alt="" /> </span> 受众画像</p>
            <div className="search height324">
              <EchartBarRadius container="echart-barRadius" data={Portrait}></EchartBarRadius>
            </div>
            <p><span className="icon"><img src={ic_search} alt="" /> </span> 地区分布</p>
            <div className="search_line">
              <ul>
                <li className={assessment.land['nav'] == 3 ? 'active' : ''} onClick={() => {
                  this.tagNavItem({ nav: 3, el: 'land' });
                  contract.getFansArea({ ..._params, typeId: 3, ipid: assessment.land['day'] })
                }}>按省份分布</li>
                <li className={assessment.land['nav'] == 4 ? 'active' : ''} onClick={() => {
                  this.tagNavItem({ nav: 4, el: 'land' });
                  contract.getFansArea({ ..._params, typeId: 4, ipid: assessment.land['day'] })
                }}>按区域</li>
              </ul>
              <div className="search search_land">
                <div className="date-select data-name">
                  {
                    contastList && contastList.map(element => {
                      return (
                        <span key={element.ipids} className={assessment.land['day'] === element.ipids ? "checked" : ""} onClick={() => {
                          this.getsourceDay({ source: 'land', day: element.ipids })
                          contract.getFansArea({ ..._params, typeId: assessment.land['nav'], ipid: element.ipids });
                        }}>{element.name}</span>
                      )
                    })
                  }

                </div>

                <EchartMap data={ipProvinceData} />
                <EchartBarSpecial2 container="echart-bar-special" subtext="" xData={xProvince}
                  yPercent={yProvince} />
              </div>
            </div>
            {
              !ismove && <div>
                <p><span className="icon"><img src={ic_search} alt="" /> </span> 商业价值分析模型</p>
                <div className="search search430">
                  <EchartRadar container="echart-radar" data={business}></EchartRadar>
                </div>
              </div>
            }
            <p><span className="icon"><img src={ic_search} alt="" /> </span> 关键词云</p>
            <div className="search wordCloud">
              <EchartwordCloud container="echart_wordcloud_three" data="[]"></EchartwordCloud>
            </div>
          </div>
          {/* 第一块 */}
          <div className={this.state.navNub === 1 ? "Survey_data show" : "Survey_data"}>
            <p><span className="icon">
              <img src={ic_sjzl} alt="" />
            </span> 数据总览 
            {/* <img src={how} alt=""/> */}
            </p>
            {
              isTv || ismove ? <table>
                <thead>
                  <tr>
                    <th>IP名称</th>
                    <th>上映天数</th>
                    <th>票房累计</th>
                    <th>首映日票房</th>
                    <th>首周票房</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>96 <img src={ic_rise}></img> </td>
                    <td>96 <img src={ic_rise}></img> </td>
                    <td>4567亿 --</td>
                    <td>567 <img src={ic_decline} /></td>
                    <td>567543  <img src={ic_rise}></img>  </td>
                  </tr>
                </tbody>
              </table> : <table>
                  <thead>
                    <tr>
                      <th>IP名称</th>
                      <th>全网热度值</th>
                      <th>媒体指数</th>
                      <th>全网搜索量</th>
                      <th>官微粉丝数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataScreening && dataScreening.map((element) => {
                      let dataScreening1 = element.dataScreening1Status == 1 ? ic_rise : element.dataScreening1Status == 2 ? '--' : ic_decline;
                      let dataScreening2 = element.dataScreening2Status == 1 ? ic_rise : element.dataScreening1Status == 2 ? '--' : ic_decline;
                      let dataScreening3 = element.dataScreening3Status == 1 ? ic_rise : element.dataScreening1Status == 2 ? '--' : ic_decline;
                      let dataScreening4 = element.dataScreening4Status == 1 ? ic_rise : element.dataScreening1Status == 2 ? '--' : ic_decline;
                      return (
                        <tr key={element.ipid}>
                          <td>96 <img src={ic_rise}></img> </td>
                          <td>{element.dataScreening1Value}
                            {dataScreening1 == '--' ? ' --' : <img src={dataScreening1}></img>}
                          </td>
                          <td>{element.dataScreening2Value}亿
                          {dataScreening2 == '--' ? ' --' : <img src={dataScreening2}></img>}   </td>
                          <td>{element.dataScreening3Value}
                            {dataScreening3 == '--' ? ' --' : <img src={dataScreening3}></img>}   </td>
                          <td>{element.dataScreening4Value}
                            {dataScreening4 == '--' ? ' --' : <img src={dataScreening4}></img>}    </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
            }
            {
              ismove && <div>
                <p><span className="icon">
                  <img src={ic_search} alt="" />
                </span> 院线票房对比</p>
                <div className="search search300">
                  <EchartCategory container="echart_bar_Category" data={isMoveData}></EchartCategory>
                </div>
              </div>
            }
            {
              isTv || ismove && <div>
                <p><span className="icon">
                  <img src={ic_search} alt="" />
                </span> 平台数据对比</p>
                <div className="search_line">
                  <ul>
                    <li className={BasicData.isTv['nav'] == 1 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 1, el: 'isTv' }) }}>平台播放量趋势</li>
                    <li className={BasicData.isTv['nav'] == 2 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 2, el: 'isTv' }) }}>平台热度趋势</li>
                  </ul>
                  <div className="search search330">
                    <EchartCategory container="echart_bar_Category" data={isTvData}></EchartCategory>
                  </div>
                </div>
              </div>
            }
            {
              isTv || ismove && <div>
                <p><span className="icon">
                  <img src={ic_sjzl} alt="" />
                </span> 口碑信息</p>
                <table className="koubei">
                  <tbody>
                    {dataPraise && dataPraise.map((element) => {
                      return (
                        <tr key={element.ipid}>
                          <td>96 <img src={ic_rise}></img> </td>
                          {
                            element.list.map((ele) => {
                              return (
                                <td key={ele.typeId}>
                                  <div className="img">
                                    <img src={this.fileter_logo(ele.typeId)}></img>
                                  </div>
                                  <div className="detail">
                                    <span className="first">{ele.typeName}</span>
                                    <span className="last">{ele.dataNumber}</span>
                                  </div>
                                  {/* {dataScreening1 == '--' ? ' --' : <img src={dataScreening1}></img>} */}
                                </td>
                              )

                            })
                          }
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            }

            <p><span className="icon">
              <img src={ic_search} alt="" />
            </span> 搜索基础数据指数</p>
            <div className="search">
              <div className="date-select">
                <span className={BasicData.search['day'] === 10 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'search', day: 10 }) }}>近10天</span>
                <span className={BasicData.search['day'] === 30 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'search', day: 30 }) }}>近30天</span>
              </div>
              <EchartBar container="echart_bar_darren" data={Acquire}></EchartBar>
            </div>
            <p><span className="icon">
              <img src={ic_hudong} alt="" />
            </span> 互动基础数据指数</p>
            <div className="search_line">
              <ul>
                <li className={BasicData.interate['nav'] == 41 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 41, el: 'interate' }) }}>微博超话帖子数</li>
                <li className={BasicData.interate['nav'] == 40 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 40, el: 'interate' }) }}>微博超话阅读数</li>
                <li className={BasicData.interate['nav'] == 9 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 9, el: 'interate' }) }}>微博话题阅读数</li>
                <li className={BasicData.interate['nav'] == 10 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 10, el: 'interate' }) }}>微博话题帖子数</li>
              </ul>
              <div className="search">
                <div className="date-select">
                  <span className={BasicData.interate['day'] === 10 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'interate', day: 10, }) }}>近10天</span>
                  <span className={BasicData.interate['day'] === 30 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'interate', day: 30 }) }}>近30天</span>
                </div>
                <EchartLine container="echart_line_darren" data={interate}></EchartLine>
              </div>
            </div>

            <p><span className="icon">
              <img src={ic_media} alt="" />
            </span> 媒体关注基础数据</p>
            <div className="search_line">
              <ul>
                <li className={BasicData.media['nav'] == 13 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 13, el: 'media' }) }}>百度资讯指数</li>
                <li className={BasicData.media['nav'] == 8 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 8, el: 'media' }) }}>微信公众号文章数</li>
                <li className={BasicData.media['nav'] == 15 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 15, el: 'media' }) }}>微信热度指数</li>
              </ul>
              <div className="search">
                <div className="date-select">
                  <span className={BasicData.media['day'] === 10 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'media', day: 10 }) }}>近10天</span>
                  <span className={BasicData.media['day'] === 30 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'media', day: 30 }) }}>近30天</span>
                </div>
                <EchartLine container="echart_line_darren" data={media}></EchartLine>
              </div>
            </div>
            <p><span className="icon">
              <img src={ic_follower} alt="" />
            </span> 粉丝趋势</p>
            <div className="search_line">
              <ul>
                <li className={BasicData.fans['nav'] == 14 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 14, el: 'fans' }) }}>微博粉丝数</li>
                <li className={BasicData.fans['nav'] == 33 ? 'active' : ''} onClick={() => { this.tagNavItem({ nav: 33, el: 'fans' }) }} >贴吧粉丝数</li>
              </ul>
              <div className="search">
                <div className="date-select">
                  <span className={BasicData.fans['day'] === 10 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'fans', day: 10 }) }}>近10天</span>
                  <span className={BasicData.fans['day'] === 30 ? "checked" : ""} onClick={() => { this.getsourceDay({ source: 'fans', day: 30 }) }}>近30天</span>
                </div>
                <EchartLine container="echart_line_darren" data={fans}></EchartLine>
              </div>
            </div>
          </div>
        </div>

        <ScrollTop contrast={false} />
        {this.state.show &&
          <Toast
            onClose={() => {
              this.setState({ show: false });
            }}
            duration={2}
            message={this.state.message}
          />}
 
        <Footer data={footerNav} />
      </div>
    );
  }
}
