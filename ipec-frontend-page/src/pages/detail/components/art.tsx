import * as React from "react";
import { Link } from "react-router-dom";
import EchartBar from "@components/echart_bar";
import EchartLine from "@components/echart_line";
import EchartPie from "@components/echart_pie";
import EchartMap from "@components/echart_map";
import EchartBarSpecial from "@components/echart_bar_special";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import EchartWordcloud from "@components/echart_wordcloud";
import EchartPieHollow from "@components/echart_pie_hollow";
import ic_ip_type from "@assets/images/ip_detail/ic_ip_type.svg";
import ic_case from "@assets/images/ip_detail/ic_case.svg";
import ic_value from "@assets/images/ip_detail/ic_value.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_cnxh from "@assets/images/ip_detail/ic_cnxh.svg";
import ic_area from "@assets/images/ip_detail/ic_area.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_wordcloud from "@assets/images/ip_detail/ic_wordcloud.svg";
import ic_content_validity from "@assets/images/ip_detail/ic_content_validity.svg";
import ic_cooperate from "@assets/images/ip_detail/ic_cooperate.svg";
import ic_Picture_details from "@assets/images/ip_detail/ic_Picture_details.svg";
import ic_show from "@assets/images/ip_detail/ic_show.svg";
import ic_search from "@assets/images/ip_detail/ic_search.svg";
import ic_hudong from "@assets/images/ip_detail/ic_hudong.svg";
import ic_default_page from "@assets/images/ip_detail/ic_default_page.png";
import ic_editor_pr from "@assets/images/ip_detail/ic_editor_pr.svg";
import ic_upload from "@assets/images/ip_detail/ic_upload.svg";
import ic_download from "@assets/images/ip_detail/ic_download.svg";
import "@assets/fonts2.0/iconfont.css";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import Alert from '@components/alert';
import default_img from '@assets/images/default_img_product.png';
import _isFunc from 'lodash/isFunction';
import { toJS } from 'mobx';
import EchartsRadarBalance from '@components/echart_radar_balance';
import ic_product from "@assets/images/ip_detail/ic_representative_works.svg";
import ic_brand from "@assets/images/ip_detail/ic_co_branding.svg";
import ic_upcomingg from "@assets/images/ip_detail/ic_upcoming.svg";
import Swipers from "@pages/detail/components/swiper";
import _isArray from 'lodash/isArray';
import _chunk from 'lodash/chunk';
import _isEmpty from "lodash/isEmpty";
import topFun from "../components/detail-top-public";
import _ from 'lodash';
import Scrollbars from "react-custom-scrollbars";
import icon_dou from "@assets/images/ip_icon_dou.png";
import Certification from '@pages/detail/components/certification';
import Vip from '@pages/detail/components/vip';
import ic_yxpf from "@assets/images/ip_detail/ic_yxpf.svg";
import ic_ptqs from "@assets/images/ip_detail/ic_ptqs.svg";
import ic_kbxx from "@assets/images/ip_detail/ic_kbxx.svg";
import EchartDataZoom from '@components/echart_dataZoom';
import EchartDataZoomTwo from '@components/echart_dataZoom_two';
import douban from '@assets/images/ip_detail/douban.png';
import iqiyi from '@assets/images/ip_detail/Iqiyi_logo.png';
import leshi from '@assets/images/ip_detail/LeTV_logo.png';
import mangguo from '@assets/images/ip_detail/mangguo.png';
import tengxun from '@assets/images/ip_detail/tengxun.png';
import youku from '@assets/images/ip_detail/youku.png';
import EchartDataZoomBoxOffice from '@components/echart_dataZoom_boxOffice';
import {
  getContact, setContact, deletContact
} from "@utils/util";
import { async } from "q";
import _find from "lodash/find";

const icon_k_v = {
  up: "ic_rise iconic_rise up",
  blance: "ic_ unbiased iconic_unbiased blance",
  down: "ic_decline iconic_decline down",
};
const hot = [
  { name: "百度搜索指数", typeId: 5, type: "hot" },
  { name: "搜狗搜索指数", typeId: 6, type: "hot" },
];

const blog = [
  { name: "微博超话帖子数", typeId: 41, type: "blog" },
  { name: "微博超话阅读数", typeId: 40, type: "blog" },
  { name: "微博话题阅读数", typeId: 9, type: "blog" },
  { name: "微博话题帖子数", typeId: 10, type: "blog" },
];

const media = [
  { name: "百度资讯指数", typeId: 13, type: "media" },
  { name: "微信公众号文章数", typeId: 8, type: "media" },
  { name: "微信热度指数", typeId: 15, type: "media" },
];
const fans = [
  { name: "微博粉丝数", typeId: 14, type: "fans" },
  { name: "贴吧粉丝数", typeId: 33, type: "fans" },
];
const platform = [
  { name: "平台播放量趋势", typeId: 1, type: "platform" },
  { name: "平台热度趋势", typeId: 2, type: "platform" },
];
const dayStatus = {
  hot: [
    { dayNumber: 10, name: "近10天", type: "hot" },
    { dayNumber: 30, name: "近30天", type: "hot" }
  ],
  blog: [
    { dayNumber: 10, name: "近10天", type: "blog" },
    { dayNumber: 30, name: "近30天", type: "blog" }
  ],
  media: [
    { dayNumber: 10, name: "近10天", type: "media" },
    { dayNumber: 30, name: "近30天", type: "media" }
  ],
  fans: [
    { dayNumber: 10, name: "近10天", type: "fans" },
    { dayNumber: 30, name: "近30天", type: "fans" }
  ],
  boxOffice: [
    { dayNumber: 10, name: "近10天", type: "boxOffice" },
    { dayNumber: 30, name: "近30天", type: "boxOffice" }
  ],
  platform: [
    { dayNumber: 10, name: "近10天", type: "platform" },
    { dayNumber: 30, name: "近30天", type: "platform" }
  ]
};
const numberKV = {
  1: '形象',
  2: '文创艺术',
  3: '图书',
  4: '网文',
  5: '电视剧',
  6: '电影',
  7: '综艺',
  8: '明人名人',
  9: '动画',
  10: '漫画',
};
const typeKV = {
  44: '豆瓣评分',
  48: '芒果评分',
  62: '优酷评分',
  47: '腾讯评分',
  50: '爱奇艺评分',
  52: '乐视评分',
};

interface IpArtProps extends IComponentProps {
  id: number,
  history?: any;
  ipTypeNumber: number;
}

interface IpArtState {
  currentIndex: number,
  tabs: any[],
  cityAreaNum: number,
  hotCurrent: number,
  blogCurrent: number,
  mediaCurrent: number,
  platformCurrent: number,
  fansDayNumber: number,
  fansCurrent: number,
  hotDayNumber: number,
  blogDayNumber: number,
  mediaDayNumber: number,
  platformDayNumber: number,
  boxOfficeDayNumber: number,
  flag: any,
  show: boolean,
  message: string,
  certification: boolean,
  compareFlag: boolean,
  userData: any,
}

@inject('detail')
@observer
export default class IpArt extends React.Component<IpArtProps, IpArtState> {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 1,
      tabs: [
        { tabName: "IP相关介绍", id: 1 },
        { tabName: "基础数据", id: 2 },
        { tabName: "版圈儿评估", id: 3 },
        { tabName: "版圈评测", id: 4 },
      ],
      // 热度指数 (typeId)- 5/6/11/15;
      // 微博趋势 - 10/9/14/16/12
      // 媒体指数 - 13/8
      cityAreaNum: 1,
      hotCurrent: 5,
      blogCurrent: 41,
      mediaCurrent: 13,
      fansCurrent: 14,
      platformCurrent: 1,
      hotDayNumber: 10,
      blogDayNumber: 10,
      mediaDayNumber: 10,
      fansDayNumber: 10,
      platformDayNumber: 10,
      boxOfficeDayNumber: 10,
      flag: "",
      show: false,
      message: "",
      certification: false,
      compareFlag: false,
      userData: JSON.parse(sessionStorage.getItem("user")),
    };
  }

  async componentDidMount() {
    const { detail } = this.props;
    const { detailList: followStatus } = detail;
    // this.props.detail.ipDetailData.ipGuid ==
    if (followStatus === true) {
      this.setState({ flag: true });
    } else {
      this.setState({ flag: false });
    }
  }

  // async componentDidUpdate( nextContext: any){
  //   const { detail ,contastList} = this.props;
  //   const { compareFlag } = this.state;
  // if(compareFlag){
  //   contastList.forEach(element => {
  //     if( element.ipids == detail.ipDetailData.ipGuid) this.setState({compareFlag:true})
  //   });
  // }
  // }

  private icon(name: string): string {
    let iconObj = {
      "豆瓣评分": douban,
      "爱奇艺评分": iqiyi,
      "乐视评分": leshi,
      "芒果评分": mangguo,
      "腾讯评分": tengxun,
      "优酷评分": youku
    };
    return iconObj[name];
  }

  // 数据总览  ip相关 切换
  _showTab(item: any) {

    if (item.id === 2) {
      return (
        <i className="iconfont ic_data iconic_data"/>
      );
    } else if (item.id === 1) {
      return (
        <i className="iconfont ic_ip_introduce iconic_ip_introduce"/>
      );
    } else if (item.id === 3) {
      return (
        <i className="iconfont iconestimate estimate"/>
      );
    } else {
      return (
        <i className="iconfont iconcalculate calculate"/>
      );
    }
  }

  async _clickTab(item: any) {
    const { detail, id: ipid, ipTypeNumber } = this.props;
    this.setState({
      currentIndex: item.id
    });

    let dataParam = {}, dataParam2 = {}, dataParam3 = {}, dataParam4 = {}, type = null;
    if (item.id === 2) {
      dataParam = { dayNumber: 10, ipid, typeId: 5, type: "hot" };
      dataParam2 = { dayNumber: 10, ipid, typeId: 41, type: "blog" };
      dataParam3 = { dayNumber: 10, ipid, typeId: 13, type: "media" };
      dataParam4 = { dayNumber: 10, ipid, typeId: 14, type: "fans" };
      await detail.echartChangeStatus(dataParam);
      await detail.echartChangeStatus(dataParam2);
      await detail.echartChangeStatus(dataParam3);
      await detail.echartChangeStatus(dataParam4);
      if (ipTypeNumber === 5) {
        // 电视剧
        await detail.getBroadcastPlatform({ ipid });
        await detail.getPublicPraise({ ipid });
        await detail.getBroadcastTrend({ type: 1, dayNumber: 10, ipid });
      } else if (ipTypeNumber === 6) {
        // 电影
        await detail.getBoxOffice({ dayNumber: 10, ipid });
        await detail.getPublicPraise({ ipid });
        await detail.getBroadcastTrend({ type: 1, dayNumber: 10, ipid });
      } else if (ipTypeNumber === 7) {
        // 综艺
        await detail.getBroadcastPlatform({ ipid });
        await detail.getPublicPraise({ ipid });
        await detail.getBroadcastTrend({ type: 1, dayNumber: 10, ipid });
      }

    } else if (item.id === 1) {

    } else if (item.id === 3 && !_isEmpty(this.state.userData)) {
      // 版圈儿评估
      const { userGuid, realStatus } = this.state.userData;
      if (userGuid !== null && realStatus === 1) {
        await detail.getFansAreaData({ userGuid, ipid, typeId: 1 });
        await detail.getFansAreaData({ userGuid, ipid, typeId: 2 });
        await detail.getFansAreaData({ userGuid, ipid, typeId: 3 });
        await detail.getFansAreaData({ userGuid, ipid, typeId: 4 });
        if (ipTypeNumber === 8) {
          type = 'people';
        }
        console.log(type);
        await detail.getBusinessData({ userGuid, ipid, ipTypeSuperiorNumber: ipTypeNumber }, type);
        await detail.getWordData({ userGuid, ipid });
      }

    } else if (item.id === 4) {

    }
  }

  async _getStatus(detail, id, flag) {
    if (sessionStorage.getItem("user") !== null) {
      let userGuid = JSON.parse(sessionStorage.getItem("user")).userGuid;
      await detail.getFollowStatus({ userGuid, isFollow: flag, ipid: Number(id) });
    } else {
      let message = "您还未登陆！";
      this._state(message);
    }
  }

  async _getCompare(detail, id, flag) {
    if (sessionStorage.getItem("user") !== null) {
      let userGuid = JSON.parse(sessionStorage.getItem("user")).userGuid;
      flag === 0 ? this.setState({ compareFlag: false }) : this.setState({ compareFlag: true });
      // await detail.getFollowStatus({ userGuid, isFollow: flag, ipid: Number(id) });
    } else {
      let message = "您还未登陆！";
      this._state(message);
    }
  }

  _totalDataClass(item) {
    if (item === 1) {
      return (
        <i className={`iconfont ${icon_k_v.up}`}/>
      );
    } else if (item === 2) {
      return (
        <i className={`iconfont  ${icon_k_v.blance}`}/>
      );
    } else if (item === 3) {
      return (
        <i className={`iconfont  ${icon_k_v.down}`}/>
      );
    } else {
      return;
    }
  }

  // 省份/区域 tab切换
  setcityAreaNum(num) {
    this.setState({
      cityAreaNum: num,
    });
  }

  async _selectLi(item) {
    const { detail } = this.props;
    let dataParam = {};
    const { hotDayNumber, blogDayNumber, mediaDayNumber, fansDayNumber, userData } = this.state;
    let userGuid;
    if (!_isEmpty(userData)) {
      userGuid = userData.userGuid;
    } else {
      userGuid = null;
    }
    if (item.type === "hot") {
      this.setState({
        hotCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: hotDayNumber };
    } else if (item.type === "blog") {
      this.setState({
        blogCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: blogDayNumber };
    } else if (item.type === "media") {
      this.setState({
        mediaCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: mediaDayNumber };

    } else if (item.type === "fans") {
      this.setState({
        fansDayNumber: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: fansDayNumber };
    }
    await detail.echartChangeStatus(dataParam);

  }

  async _selectDay(item) {
    const { detail, } = this.props;
    const { hotCurrent, blogCurrent, mediaCurrent, fansCurrent, userData } = this.state;
    let dataParam = {};
    let userGuid;
    if (!_isEmpty(userData)) {
      userGuid = userData.userGuid;
    } else {
      userGuid = null;
    }
    if (item.type === "hot") {
      this.setState({
        hotDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: hotCurrent };
    } else if (item.type === "blog") {
      this.setState({
        blogDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: blogCurrent };

    } else if (item.type === "media") {
      this.setState({
        mediaDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: mediaCurrent };
    } else if (item.type === "fans") {
      this.setState({
        fansDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: fansCurrent };
    }
    await detail.echartChangeStatus(dataParam);
  }

  async _boxOfficeDay(item: any) {
    const { detail, id: ipid } = this.props;
    this.setState({
      boxOfficeDayNumber: item.dayNumber
    });
    let dataParam = { dayNumber: item.dayNumber, ipid };
    await detail.getBoxOffice(dataParam);
  }

  async _platformLi(item: any) {
    const { detail, id: ipid } = this.props;
    const { platformDayNumber } = this.state;
    this.setState({
      platformCurrent: item.typeId
    });
    let dataParam = { type: item.typeId, dayNumber: platformDayNumber, ipid };
    await detail.getBroadcastTrend(dataParam);
  }

  async _platformDay(item: any) {
    const { detail, id: ipid } = this.props;
    const { platformCurrent } = this.state;
    this.setState({
      platformDayNumber: item.dayNumber
    });
    let dataParam = { type: platformCurrent, dayNumber: item.dayNumber, ipid };
    await detail.getBroadcastTrend(dataParam);
  }

  _state(message) {
    this.setState({
      show: true,
      message, // "您还未登陆或者实名认证!",
    });
  }

  _userGuid(id, realStatus) {
    //  && realStatus === null && Number(realStatus) !== 1
    const { ipTypeNumber } = this.props;
    let message = "您还未登陆或者实名认证";
    if (sessionStorage.getItem("user") === null) {
      return (
        <div className="base-line flex-row with-margin-top-32">
          <span onClick={() => {
            this._state(message);
          }} className="btn edit-btn-custom justify-content-center align-items-center">
            <img src={ic_editor_pr} alt=""/>
            编辑IP信息
          </span>
          <span
            onClick={() => {
              this._state(message);
            }}
            className="btn edit-btn-custom  justify-content-center
                  align-items-center with-margin-left-20 upload-work">
            <img src={ic_upload} alt=""/>
            上传商务资料
          </span>
          <span
            onClick={() => {
              this._state(message);
            }}
            className="btn edit-btn-custom justify-content-center
                      align-items-center with-margin-left-20 upload_data">
            <img src={ic_download} alt=""/>
            下载资料
          </span>
        </div>
      );

    } else {
      return (
        <div className="base-line flex-row with-margin-top-32">
          <Link to={`/update/${ipTypeNumber}/${id}`}
                className="btn edit-btn-custom justify-content-center align-items-center">
            <img src={ic_editor_pr} alt=""/>
            编辑IP信息
          </Link>
          <a onClick={() => {
            this.callbackChild(true);
          }}
             className="btn edit-btn-custom justify-content-center
                  align-items-center with-margin-left-20 upload-work">
            <img src={ic_upload} alt=""/>
            上传商务资料
          </a>
          <a
            // onClick={async () => {
            //   await detail.getDownload({ ipid: id });
            //
            // }}
            onClick={() => {
              this.callbackChildModel(true);
            }}
            className="btn edit-btn-custom justify-content-center
                      align-items-center with-margin-left-20 upload_data">
            <img src={ic_download} alt=""/>
            下载资料
          </a>
        </div>
      );

    }
  }

  private callbackChild = (o: any) => {
    _isFunc(this.props.callbackParent) && this.props.callbackParent(o);
  };

  private callbackChildModel = (o: any) => {
    _isFunc(this.props.callback) && this.props.callback(o);
  };

  _public(item: any, ipTypeNumber: number) {
    const doRender = topFun[ipTypeNumber];
    return _.isFunction(doRender) && doRender(item);
  }

  _totalData(item: any) {
    if (item === 1 || item === 2) {
      return (
        <tr>
          <td>全网热度值</td>
          <td>媒体指数</td>
          <td>全网搜索量</td>
          <td>官网粉丝数</td>
        </tr>
      );
    } else if (item === 5 || item === 7) {
      return (
        <tr>
          <td>上线天数</td>
          <td>累计播放量</td>
          <td>昨日播放量</td>
          <td>今日播放量</td>
        </tr>
      );
    } else if (item === 6) {
      return (
        <tr>
          <td>上映天数</td>
          <td>票房累计</td>
          <td>首映日票房</td>
          <td>首周票房</td>
        </tr>
      );
    } else if (item === 8) {
      return (
        <tr>
          <td>全网热度值</td>
          <td>媒体指数</td>
          <td>合作品牌数</td>
          <td>微博粉丝数</td>
        </tr>
      );
    }
  }

  _findipids = () => {
    const { detail, contastList } = this.props;
    const { compareFlag } = this.state;
    let istrue = false;
    if (!!contastList) {
      contastList.map(val => {
        if (val.ipids == this.props.detail.ipDetailData.ipGuid) {
          istrue = true;
        }
      });
    }
    return istrue;
  };

  render() {
    const {
      tabs, currentIndex, cityAreaNum, hotCurrent, blogCurrent, mediaCurrent, fansCurrent,
      hotDayNumber, blogDayNumber, mediaDayNumber, fansDayNumber, show, message, flag,
      platformCurrent, platformDayNumber, boxOfficeDayNumber, compareFlag, userData
    } = this.state;
    const { detail, id, ipTypeNumber, callbackcontastList, contastList } = this.props;
    const {
      ipDetailData,
      detailList: {
        ipArtDetailList,
        ipArtLikeData,
        ipCaseData,
        ipWordCloudData,
        ipSexData, ageData, agePercent,
        ipProvinceData, xProvince, yProvince, xArea, yArea,
        xBlog, yBlog, xMedia, yMedia,
        xHot, yHot, xfan, yfan,
        ipPeopleList,
      },
      ipTotalData,
      starList: {
        repProductionList,
        coBrands,
        upcomingProductionList,
      },
      businessData, boxOfficeData, boxOfficeDate,
      broadcastTrendData, broadcastTrendDate, publicPraiseData, broadcastPlatformData, broadcastPlatformData2,
    } = detail;
    let isShow1 = currentIndex === 1 ? "block" : "none";
    let isShow2 = currentIndex === 2 ? "block" : "none";
    let isShow3 = currentIndex === 3 ? "block" : "none";
    let isShow4 = currentIndex === 4 ? "block" : "none";
    let options: object = {
      effect: "slide", pagination: ".swiper-pagination", loop: false,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
    };
    let arr: any[] = [];
    let arr2: any[] = [];
    if (_isArray(repProductionList)) {
      arr = _chunk(repProductionList, 4);
      arr2 = _chunk(upcomingProductionList, 2);
      if (arr.length > 1 || arr2.length > 1) {
        options = {
          effect: "slide", loop: true, pagination: null,
          nextButton: ".swiper-button-next",
          prevButton: ".swiper-button-prev",
          autoplay: false,
        };
      }
    }
    // console.log(broadcastPlatformData);
    return (
      <div className="art-container special-container">
        {/*顶部主体内容*/}
        {!_isEmpty(ipDetailData) &&
        <div className="detail-top-container">
          <div className="detail-base-area">
            <div className="ip-img">
              <img src={ipDetailData.ipPicUrl} alt=""/>
              <span className="tag">{numberKV[ipTypeNumber]}</span>
            </div>
            <div className="detail-base-text-area flex-column justify-content-between">
              <div>
                <div className="first-line flex-row align-items-end ">
                  <span className="ip-title word-ellipsis">{ipDetailData.ipName}</span>
                  {this._findipids() ? <span className="ip-care-status ip-compare-status active"
                                             onClick={async () => {
                                               deletContact(ipDetailData.ipGuid);
                                               callbackcontastList(JSON.parse(localStorage.getItem('contastList')));
                                               // await this._getCompare(detail, id, 0);
                                             }}>
                            <i className="iconfont vs iconvs_pr"/>已对比
                      </span> :
                    <span className="ip-care-status ip-compare-status "
                          onClick={async () => {
                            let _ipNumber = JSON.parse(localStorage.getItem('ipTypeSuperiorNumber'));
                            let _nowipNumber = ipDetailData.ipTypeSuperiorNumber;
                            console.log(_ipNumber);
                            console.log(_nowipNumber);
                            if (_ipNumber == _nowipNumber || _ipNumber == null) {
                              if (contastList.length >= 3) {
                                this.setState({
                                  show: true,
                                  message: '同时最多添加三种对比',
                                });
                              } else {
                                setContact({
                                  name: ipDetailData.ipName,
                                  ipids: ipDetailData.ipGuid,
                                }, _nowipNumber);
                                callbackcontastList(JSON.parse(localStorage.getItem('contastList')));
                              }

                            } else {
                              this.setState({
                                show: true,
                                message: '类别不一样，不能进行对比',
                              });
                            }

                            // await this._getCompare(detail, id, 1);
                          }}>
                          <i className="iconfont vs iconvs_pr"/>
                          加入对比
                        </span>}
                  {flag &&
                  <span className="ip-care-status active "
                        onClick={async () => {
                          if (sessionStorage.getItem("user") !== null) {
                            this.setState({
                              flag: false
                            });
                          }
                          await this._getStatus(detail, id, 0);
                        }}>
                              <i className="iconfont ic_follow iconic_praise"/>已关注
                            </span>
                  }
                  {!flag &&
                  <span className="ip-care-status "
                        onClick={async () => {
                          if (sessionStorage.getItem("user") !== null) {
                            this.setState({
                              flag: true
                            });
                          }
                          await this._getStatus(detail, id, 1);
                        }}>
                            <i className="iconfont ic_follow iconic_praise"/>加入关注
                          </span>
                  }
                </div>
                <Scrollbars style={{ height: 202 }}>
                  {this._public(ipDetailData, ipTypeNumber)}
                </Scrollbars>
              </div>
              {this._userGuid(id, ipDetailData.realStatus)}
            </div>
          </div>
          <div className="widget-tags">
            <h5 className="area-title"><img src={ic_ip_type} alt=""/>IP类型</h5>
            <ul className="ip-type flex-wrap flex-row">
              {ipDetailData.ipTypeNumberNames && ipDetailData.ipTypeNumberNames.map((i, k) => {
                return (
                  <li key={k}><Link to="">{i}</Link></li>
                );
              })}
            </ul>
            {ipCaseData && <h5 className="area-title"><img src={ic_case} alt=""/>IP相关案例</h5>}
            {ipCaseData && ipCaseData.map((i, index) => {
              return (
                <div className="ip-type ip-case flex-wrap flex-row justify-content-between" key={index}>
                  <div className="type-img"><img src={i.picUrl} alt=""/></div>
                  <div className="type-detail flex-column justify-content-between">
                    <p className="word-ellipsis">{i.postTitle}</p>
                    <p className="attention  flex-row justify-content-between">
                            <span className="attention_num iconfont ic_praise iconic_praise">
                              {i.portalPostLikeCount}
                            </span>
                      <span className="date ">
                            {i.postSource}&nbsp;|&nbsp;{moment(i.createDate).format('YYYY/MM/DD')}
                          </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        }
        <div className="tab-container">
          <div className="tab-title justify-content-around">
            <div className="tab-title-content">
              {tabs && tabs.map((item, index) => {
                return (
                  <span key={index} className={`${currentIndex === item.id ? "active" : ""}`}
                        onClick={async () => {
                          await this._clickTab(item);
                        }}>
                    {this._showTab(item)}
                    {item.tabName}
                    </span>
                );
              })}
            </div>
          </div>
          {!_isEmpty(ipDetailData) &&
          <div className="tab-content " style={{ "display": isShow1 }}>
            {ipDetailData.ipDesc && <div className="module-box ">
              <p className="area-title"><img src={ic_content_validity} alt=""/>IP简介</p>
              <div className="area-content">
                <div className="area-words">
                  {ipDetailData.ipDesc}
                </div>
              </div>
            </div>
            }
            {
              ipTypeNumber !== 8 && !_isEmpty(ipDetailData.prodect) && JSON.parse(ipDetailData.prodect).length > 0 &&
              <div className="module-box">
                <p className="area-title"><img src={ic_show} alt=""/>IP素材图库</p>
                <div className="area-content ">
                  <div className="area-box flex-row justify-content-around">
                    {JSON.parse(ipDetailData.prodect).map((v, k) => {
                      return (
                        <div className="box" key={k}>
                          <img src={`${v.picPrefix}${v.pic}`} alt=""/>
                          <p className="word-ellipsis">{v.title} </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
            {
              ipTypeNumber !== 8 && !_isEmpty(ipDetailData.cooperationCase) && JSON.parse(ipDetailData.cooperationCase).length > 0 &&
              <div className="module-box">
                <p className="area-title"><img src={ic_cooperate} alt=""/>衍生品/合作案例</p>
                <div className="area-content">
                  <div className="area-box flex-row justify-content-around">
                    {JSON.parse(ipDetailData.cooperationCase).map((v, k) => {
                      return (
                        <div className="box" key={k}>
                          <img src={`${v.picPrefix}${v.pic}`} alt=""/>
                          <p className="word-ellipsis">{v.title} </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
            {
              ipTypeNumber === 8 && !_isEmpty(coBrands) &&
              <div className="people-content">
                <div className="right-brand module-box">
                  <p className="area-title"><img src={ic_brand} alt=""/>合作品牌</p>
                  <div className="area-content">
                    {
                      coBrands && coBrands.split(",").map((i, k) => {
                        return (
                          <span className="word-ellipsis" key={k}>-{i}</span>
                        );
                      })
                    }
                  </div>
                </div>
                <div className="star-top-more flex-column">
                  <div className="star-div flex-row ">
                    {arr.length > 0 && <div className="child-star-div left-star-div  ">
                      <p className="area-title"><img src={ic_product} alt=""/>代表作品</p>
                      <div className="area-content swiper-star">
                        <Swipers options={{ ...options }}>
                          {
                            arr && arr.map((item: any, index: number) => (
                              <div key={index} className="swiper-slide  swipe-slide-area">
                                {item && item.map((i: any, idx: number) => (
                                  <div key={idx} className="swipe-slide-custom ">
                                    <img src={i.picUrl || default_img} alt=""/>
                                    <div className="cooperate-ip-last-line">
                                      {i.ipName}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          }
                        </Swipers>
                      </div>
                    </div>
                    }
                    {arr2.length > 0 &&
                    <div className="child-star-div">
                      <p className="area-title"><img src={ic_upcomingg} alt=""/>即将上映</p>
                      <div className="area-content swiper-star right-swiper">
                        <Swipers options={{ ...options }}>
                          {
                            arr2 && arr2.map((item: any, index: number) => (
                              <div key={index} className="swiper-slide  swipe-slide-area">
                                {item && item.map((i: any, idx: number) => (
                                  <div key={idx} className="swipe-slide-custom ">
                                    <img src={i.picUrl || default_img} alt=""/>
                                    <div className="cooperate-ip-last-line">{i.ipName}</div>
                                  </div>
                                ))}
                              </div>
                            ))
                          }
                        </Swipers>
                      </div>
                    </div>
                    }
                  </div>
                </div>

              </div>
            }
            {
              !_isEmpty(ipDetailData.companyDetailVO) &&
              <div className="module-box">
                <p className='area-title'>
                  <img src={ic_Picture_details} alt=""/>
                  {ipTypeNumber === 8 ? "经济公司介绍" : "IP所属公司介绍"}
                </p>
                <div className="area-content book-area-content flex justify-content-between">
                  {ipTypeNumber !== 8 && <div className="img">
                    <img src={default_img} alt=""/>
                  </div>}
                  {ipDetailData.companyDetailVO.map((item, index) => {
                    return (
                      <div className="img-detail" key={index}>
                        <div className="title flex justify-content-between">
                          <h4>{item.companyName}</h4>
                          <div className="button-group flex justify-content-between">
                            {/*<button>联系他</button>*/}
                            {/* todo 跳转企业详情时判断企业是否 认证过*/}
                            <button><Link to="/company"><i className="iconfont iconai44"/>查看企业主页</Link></button>
                          </div>
                        </div>
                        <p>{item.companyDesc}</p>
                        <div className="contact-detail flex-row justify-content-around">
                          <span>电话：{item.companyAbbreviation}</span>
                          <span>邮箱：{item.companyMailbox}</span>
                          {/*<span>网址：<a></a></span>*/}
                          <span>地址：{item.companyAddress}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            {
              ipTypeNumber > 0 && ipTypeNumber < 3 && ipDetailData.detail &&
              <div className="module-box">
                <p className="area-title"><img src={ic_Picture_details} alt=""/>图文详情</p>
                <div className="area-content book-area-content">
                  <div className="area-words" dangerouslySetInnerHTML={{ __html: ipDetailData.detail }}/>
                </div>
              </div>
            }
            {Number(ipTypeNumber) > 4 && Number(ipTypeNumber) < 8 && !_isEmpty(ipPeopleList) &&
            <div className="module-box">
              <p className="area-title"><img src={ic_cnxh} alt=""/>影人相关播放量</p>
              <div className="area-content like-content">
                <div className="area-box flex-row justify-content-around">
                  {
                    ipPeopleList && ipPeopleList.map((item, index) => {
                      return (
                        <div className="box" key={index}>
                          <div className="child-box">
                            <img src={item.picUrl} alt=""/>
                            <div className="hover-bg">
                              {/*<span>近三年播放量: {item.playbackVolume}</span>*/}
                              <span>微博粉丝数量: {item.postBarAttentionsNum}</span>
                              <span>贴吧关注数量: {item.weiboFansNum}</span>
                            </div>
                          </div>
                          <p>{item.ipName}</p>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            }
            {
              !_isEmpty(ipArtLikeData) && <div className="module-box">
                <p className="area-title"><img src={ic_cnxh} alt=""/>猜你喜欢</p>
                <div className="area-content like-content">
                  <div className="area-box flex-row justify-content-around">
                    {
                      ipArtLikeData && ipArtLikeData.map((item, index) => {
                        return (
                          <div className="box" key={index}>
                            <img src={item.picUrl} alt=""/>
                            < div className="box-name justify-content-between">
                              <p className="name word-ellipsis">{item.ipName}</p>
                              {
                                Number(ipTypeNumber) > 4 && Number(ipTypeNumber) < 8 &&
                                <div className="item-dou  justify-content-between align-items-center">
                                  <img src={icon_dou} alt=""/>
                                  <span className="score">8.2</span>
                                </div>
                              }
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            }
          </div>
          }
          {/*基础数据*/}
          <div className="tab-content" style={{ "display": isShow2 }}>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_sjzl} alt=""/>
                数据总览
              </p>
              <div className="area-content">
                <table className="table table-bordered text-center">
                  <tbody>
                  {this._totalData(ipTypeNumber)}
                  <tr>
                    <td>{ipTotalData.dataScreening1ValueStr}{this._totalDataClass(ipTotalData.dataScreening1Status)}</td>
                    <td>{ipTotalData.dataScreening2ValueStr}{this._totalDataClass(ipTotalData.dataScreening2Status)}</td>
                    <td>{ipTotalData.dataScreening3ValueStr}{this._totalDataClass(ipTotalData.dataScreening3Status)}</td>
                    <td>{ipTotalData.dataScreening4ValueStr}{this._totalDataClass(ipTotalData.dataScreening4Status)}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {
              ipTypeNumber === 6 &&
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_yxpf} alt=""/>
                  院线票房趋势
                </p>
                <div className="area-content hot-content" style={{ padding: '0.3rem 0.2rem' }}>
                  <div className="date-select">
                    {
                      dayStatus.boxOffice && dayStatus.boxOffice.map((item, k) => {
                        return (
                          <span className={boxOfficeDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                onClick={async () => {
                                  await this._boxOfficeDay(item);
                                }}
                          >{item.name}</span>
                        );
                      })
                    }
                  </div>
                  <div className="clearFix"/>
                  {
                    (!_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 &&
                      boxOfficeDayNumber === 30) || boxOfficeDayNumber === 10 ?
                      <EchartDataZoomBoxOffice container="" data={boxOfficeData} date={boxOfficeDate} subtext=""/>
                      : <Certification/>
                  }
                </div>
              </div>
            }
            {
              (ipTypeNumber === 6 || ipTypeNumber === 5 || ipTypeNumber === 7) &&
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_ptqs} alt=""/>
                  {ipTypeNumber === 6 ? '在线平台趋势' : '播放趋势'}
                </p>
                <div className="area-content hot-content">
                  <ul>
                    {
                      platform && platform.map((item, k) => {
                        return (
                          <li className={platformCurrent === item.typeId ? "active" : ""} key={k}
                              onClick={async () => {
                                await this._platformLi(item);
                              }}
                          >{item.name}</li>
                        );
                      })
                    }
                  </ul>
                  <div className="date-select">
                    {
                      dayStatus.platform && dayStatus.platform.map((item, k) => {
                        return (
                          <span className={platformDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                onClick={async () => {
                                  await this._platformDay(item);
                                }}
                          >{item.name}</span>
                        );
                      })
                    }
                  </div>
                  <div className="clearFix"/>
                  <div style={{ "display": platformCurrent === 1 ? "block" : "none" }}>
                    {
                      (!_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 &&
                        platformDayNumber === 30) || platformDayNumber === 10 ?
                        <EchartDataZoomTwo container="echart-bar" data={broadcastTrendData}
                                           date={broadcastTrendDate} subtext=""/>
                        : <Certification/>
                    }
                  </div>
                  <div style={{ "display": platformCurrent === 2 ? "block" : "none" }}>
                    {
                      (!_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 &&
                        platformDayNumber === 30) || platformDayNumber === 10 ?
                        <EchartDataZoom container="echart-bar" data={broadcastTrendData}
                                        date={broadcastTrendDate} subtext=""/>
                        : <Certification/>
                    }
                  </div>
                </div>
              </div>

            }
            {
              (ipTypeNumber === 5 || ipTypeNumber === 7) && !_isEmpty(toJS(broadcastPlatformData)) &&
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_ptqs} alt=""/>
                  播放平台分布
                </p>
                <div className="area-content hot-content">
                  <EchartPieHollow data={toJS(broadcastPlatformData)}/>
                  <div className="right-broadcast">
                    {
                      toJS(broadcastPlatformData2) && toJS(broadcastPlatformData2).map((item, index) => {
                        return (
                          <div className="single" key={index}>
                            <span>{item.typeName}</span>
                            <span>累计播放量：<i>{item.dataNumber / 10000}万</i></span>
                            <span>占播放量的<i>{item.ratio}</i></span>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            }
            {
              !_isEmpty(publicPraiseData) && (ipTypeNumber === 5 || ipTypeNumber === 6 || ipTypeNumber === 7) &&
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_kbxx} alt=""/>
                  口碑信息
                </p>
                <div className="area-content movie-content hot-content">
                  {
                    publicPraiseData && publicPraiseData.map((item, index) => {
                      let name = typeKV[Number(item.typeId)];
                      let icon = this.icon(item.typeName);
                      return (
                        <div className="cups flex justify-content-between" key={index}>
                          <img src={icon} alt=""/>
                          <div className=" score flex justify-content-between flex-column">
                            <span>{item.typeName}</span>
                            <span>{item.dataNumber}</span>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            }
            <div className="module-box">
              <p className="area-title">
                <img src={ic_search} alt=""/>
                搜索基础数据
              </p>
              <div className="area-content hot-content">
                <ul>
                  {
                    hot && hot.map((li, k) => {
                      return (
                        <li key={k} className={hotCurrent === li.typeId ? "active" : ""}
                            onClick={async () => {
                              await this._selectLi(li);
                            }}
                        >{li.name}</li>
                      );
                    })
                  }
                </ul>
                <div className="date-select">
                  {
                    dayStatus.hot && dayStatus.hot.map((item, k) => {
                      return (
                        <span className={hotDayNumber === item.dayNumber ? "checked" : ""} key={k}
                              onClick={async () => {
                                await this._selectDay(item);
                              }}
                        >{item.name}</span>
                      );
                    })
                  }
                </div>
                <div className="clearFix"/>
                {
                  !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 && hotDayNumber === 30 || hotDayNumber === 10 ?
                    <EchartBar container="echart-bar" xHot={xHot} yHot={yHot} subtext=""/>
                    :
                    <Certification/>
                }

              </div>
            </div>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_hudong} alt=""/>
                互动基础数据
              </p>
              <div className="area-content blog-content">
                <ul>
                  {
                    blog && blog.map((item, k) => {
                      return (
                        <li className={blogCurrent === item.typeId ? "active" : ""} key={k}
                            onClick={async () => {
                              await this._selectLi(item);
                            }}
                        >{item.name}</li>
                      );
                    })
                  }
                </ul>
                <div className="date-select">
                  {
                    dayStatus.blog && dayStatus.blog.map((item, k) => {
                      return (
                        <span className={blogDayNumber === item.dayNumber ? "checked" : ""} key={k}
                              onClick={async () => {
                                await this._selectDay(item);
                              }}
                        >{item.name}</span>
                      );
                    })
                  }
                </div>
                <div className="clearFix"/>
                {
                  !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 && blogDayNumber === 30 || blogDayNumber === 10 ?
                    <EchartLine container="echart-line2" xHot={xBlog} yHot={yBlog} subtext=""/>
                    : <Certification/>
                }
              </div>
            </div>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_media} alt=""/>
                媒体关注基础数据
              </p>
              <div className="area-content media-content">
                <ul>
                  {
                    media && media.map((item, k) => {
                      return (
                        <li className={mediaCurrent === item.typeId ? "active" : ""} key={k}
                            onClick={async () => {
                              await this._selectLi(item);
                            }}
                        >{item.name}</li>
                      );
                    })
                  }
                </ul>
                <div className="date-select">
                  {
                    dayStatus.media && dayStatus.media.map((item, k) => {
                      return (
                        <span className={mediaDayNumber === item.dayNumber ? "checked" : ""} key={k}
                              onClick={async () => {
                                await this._selectDay(item);
                              }}
                        >{item.name}</span>
                      );
                    })
                  }
                </div>
                <div className="clearFix"/>
                {
                  !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 && mediaDayNumber === 30 || mediaDayNumber === 10 ?
                    <EchartLine container="echart-line" xHot={xMedia} yHot={yMedia} subtext=""/>
                    : <Certification/>
                }
              </div>
            </div>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_follower} alt=""/>
                粉丝趋势
              </p>
              <div className="area-content media-content">
                <ul>
                  {
                    fans && fans.map((item, k) => {
                      return (
                        <li className={fansCurrent === item.typeId ? "active" : ""} key={k}
                            onClick={async () => {
                              await this._selectLi(item);
                            }}
                        >{item.name}</li>
                      );
                    })
                  }
                </ul>
                <div className="date-select">
                  {
                    dayStatus.fans && dayStatus.fans.map((item, k) => {
                      return (
                        <span className={fansDayNumber === item.dayNumber ? "checked" : ""} key={k}
                              onClick={async () => {
                                await this._selectDay(item);
                              }}
                        >{item.name}</span>
                      );
                    })
                  }
                </div>
                <div className="clearFix"/>
                {
                  !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 && fansDayNumber === 30 || fansDayNumber === 10 ?
                    <EchartLine container="echart-line" xHot={xfan} yHot={yfan} subtext=""/>
                    : <Certification/>
                }
              </div>
            </div>
          </div>
          <div className="tab-content" style={{ "display": isShow3 }}>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_follower} alt=""/>受众画像
              </p>
              {
                !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 ?
                  <div className="area-content fans-content ">
                    <EchartPie data={toJS(ipSexData)}/>
                    <div className="middleLine"/>
                    <EchartBarSpecial container="echart-bar-special2" subtext="年龄比例" xData={ageData}
                                      yPercent={agePercent}/>
                  </div>
                  : <div className="area-content fans-content">
                    <Vip/>
                  </div>
              }

            </div>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_area} alt=""/>
                地区分布
              </p>
              <div className="area-content city-content">
                <ul>
                  <li className={this.state.cityAreaNum === 1 ? "active" : ""}
                      onClick={() => {
                        this.setcityAreaNum(1);
                      }}>按省份
                  </li>
                  <li className={this.state.cityAreaNum === 2 ? "active" : ""}
                      onClick={() => {
                        this.setcityAreaNum(2);
                      }}>按区域
                  </li>
                </ul>
                {
                  !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 ?
                    <div>
                      <div className="city-tab-content"
                           style={{ "display": cityAreaNum === 1 ? "block" : "none" }}>
                        <EchartMap data={ipProvinceData}/>
                        <div className="middleLine"/>
                        <EchartBarSpecial2 container="echart-bar-special" subtext="" xData={xProvince}
                                           yPercent={yProvince}/>
                      </div>
                      <div className="city-tab-content"
                           style={{ "display": cityAreaNum === 2 ? "block" : "none" }}>
                        <EchartMap data={ipProvinceData}/>
                        <div className="middleLine"/>
                        <EchartBarSpecial2 container="echart-bar-special1" subtext="" xData={xArea}
                                           yPercent={yArea}/>
                      </div>
                    </div>
                    : <Vip/>
                }
              </div>
            </div>
            {
              (ipTypeNumber < 3 || ipTypeNumber === 8) &&
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_value} alt=""/>
                  商业价值评估模型
                </p>
                <div className="area-content city-content">
                  {
                    !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 ?
                      <EchartsRadarBalance data={businessData} container=""/> : <Vip/>
                  }
                </div>
              </div>
            }
            {!_isEmpty(ipWordCloudData) &&
            <div className="module-box flex-row justify-content-between">
              <p className="area-title">
                <img src={ic_wordcloud} alt=""/>
                关键词云
              </p>
              {
                !_isEmpty(userData) && !_isEmpty(userData.userGuid) && userData.realStatus === 1 ?
                  <div className="area-content cloud-world-content">
                    <EchartWordcloud container="echart-worldCloud" ipWordCloudData={ipWordCloudData}/>
                  </div> :
                  <div className="area-content cloud-world-content">
                    <Vip/>
                  </div>
              }
            </div>
            }
          </div>
          <div className="tab-content" style={{ "display": isShow4 }}>
            <div className="no-result">
              <img src={ic_default_page} alt=""/>
              <p>此模块正披星戴月开发中， 敬请期待！</p>
            </div>
          </div>
        </div>
        {show &&
        <Alert message={message}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 // console.log(this);
                 //  this.props.history.push('/login');
               }}
        />
        }
      </div>
    )
      ;
  }
}
