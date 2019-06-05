import * as React from "react";
import { Link } from "react-router-dom";
import EchartBar from "@components/echart_bar";
import EchartLine from "@components/echart_line";
import EchartPie from "@components/echart_pie";
import EchartMap from "@components/echart_map";
import EchartBarSpecial from "@components/echart_bar_special";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import EchartWordcloud from "@components/echart_wordcloud";
import ic_ip_type from "@assets/images/ip_detail/ic_ip_type.svg";
import ic_case from "@assets/images/ip_detail/ic_case.svg";
import ic_value from "@assets/images/ip_detail/ic_value.svg";
import ic_web from "@assets/images/ip_detail/ic_webo.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import ic_rdzs from "@assets/images/ip_detail/ic_rdzs.svg";
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
import certification from '@pages/detail/components/certification';
import EchartsRadarBalance from '@components/echart_radar_balance';
import ic_product from "@assets/images/ip_detail/ic_representative_works.svg";
import ic_brand from "@assets/images/ip_detail/ic_co_branding.svg";
import ic_upcomingg from "@assets/images/ip_detail/ic_upcoming.svg";
import Swipers from "@pages/detail/components/swiper";
import icon_dou from "@assets/images/ip_icon_dou.png";
import ic_yxpf from "@assets/images/ip_detail/ic_yxpf.svg";
import ic_ptqs from "@assets/images/ip_detail/ic_ptqs.svg";
import ic_kbxx from "@assets/images/ip_detail/ic_kbxx.svg";
import _isArray from 'lodash/isArray';
import _chunk from 'lodash/chunk';
import EchartDataZoom from '@components/echart_dataZoom';
import EchartDataZoomTwo from '@components/echart_dataZoom_two';

const icon_k_v = {
  up: "ic_rise icon-ic_rise up",
  blance: "ic_ unbiased icon-ic_unbiased blance",
  down: "ic_decline icon-ic_decline down",
};
const hot = [
  { name: "百度搜索指数", typeId: 5, type: "hot" },
  { name: "搜狗搜索指数", typeId: 6, type: "hot" },
];

const blog = [
  { name: "微博超话帖子数", typeId: 41, type: "blog" },
  { name: "微博超话阅读数", typeId: 40, type: "blog" },
  { name: "微博话题阅读数", typeId: 9, type: "blog" },
];

const media = [
  { name: "百度资讯指数", typeId: 13, type: "media" },
  { name: "微信公众号文章数", typeId: 8, type: "media" },
  { name: "微信热度指数", typeId: 15, type: "media" },
];
const fans = [
  { name: "微博粉丝数", typeId: 13, type: "media" },
  { name: "贴吧粉丝数", typeId: 8, type: "media" },
  { name: "微信热度指数", typeId: 15, type: "media" },
];
const platform = [
  { name: "平台播放量趋势", typeId: 0, type: "platform" },
  { name: "平台热度趋势", typeId: 0, type: "platform" },
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
    { dayNumber: 10, name: "近10天", type: "media" },
    { dayNumber: 30, name: "近30天", type: "media" }
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
  hotDayNumber: number,
  blogDayNumber: number,
  mediaDayNumber: number,
  flag: any,
  show: boolean,
  message: string,
  certification: boolean,
  compareFlag: boolean,
}

@inject('detail')
@observer
export default class IpTv extends React.Component<IpArtProps, IpArtState> {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 1,
      tabs: [
        { tabName: "IP相关介绍电影", id: 1 },
        { tabName: "基础数据", id: 2 },
        { tabName: "版圈儿评估", id: 3 },
        { tabName: "版圈评测", id: 4 },
      ],
      // 热度指数 (typeId)- 5/6/11/15;
      // 微博趋势 - 10/9/14/16/12
      // 媒体指数 - 13/8
      cityAreaNum: 1,
      hotCurrent: 5,
      blogCurrent: 10,
      mediaCurrent: 13,
      hotDayNumber: 10,
      blogDayNumber: 10,
      mediaDayNumber: 10,
      flag: "",
      show: false,
      message: "",
      certification: false,
      compareFlag: false,
    };
  }

  async componentDidMount() {
    const { detail, ipTypeNumber } = this.props;
    const {
      detailList: { followStatus }
    } = detail;
    if (followStatus === true) {
      this.setState({ flag: true });
    } else {
      this.setState({ flag: false });
    }

    if (ipTypeNumber === 2) {
      this.setState({
        blogCurrent: 10,
      });
    } else {
      this.setState({
        blogCurrent: 41,
      });
    }
  }

  // 数据总览  ip相关 切换
  _changeTab(item: any) {
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

  _tab(item: any) {
    this.setState({
      currentIndex: item.id
    });
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
    const { hotDayNumber, blogDayNumber, mediaDayNumber } = this.state;
    if (item.type === "hot") {
      this.setState({
        hotCurrent: item.typeId
      });
      dataParam = { typeId: item.typeId, dayNumber: hotDayNumber };
    } else if (item.type === "blog") {
      this.setState({
        blogCurrent: item.typeId
      });
      dataParam = { typeId: item.typeId, dayNumber: blogDayNumber };
      // blogDayNumber === 30 ? this.setState({ certification: true }) : "";
    } else if (item.type === "media") {
      this.setState({
        mediaCurrent: item.typeId
      });
      dataParam = { typeId: item.typeId, dayNumber: mediaDayNumber };

    }
    await detail.echartChangeStatus(dataParam);

  }

  async _selectDay(item) {
    const { detail, } = this.props;
    const { hotCurrent, blogCurrent, mediaCurrent, } = this.state;
    let dataParam = {};
    if (item.type === "hot") {
      this.setState({
        hotDayNumber: item.dayNumber
      });
      dataParam = { dayNumber: item.dayNumber, typeId: hotCurrent };
    } else if (item.type === "blog") {
      this.setState({
        blogDayNumber: item.dayNumber
      });
      dataParam = { dayNumber: item.dayNumber, typeId: blogCurrent };

    } else if (item.type === "media") {
      this.setState({
        mediaDayNumber: item.dayNumber
      });
      dataParam = { dayNumber: item.dayNumber, typeId: mediaCurrent };
    }
    await detail.echartChangeStatus(dataParam);
  }

  _state(message) {
    this.setState({
      show: true,
      message, // "您还未登陆或者实名认证!",
    });
  }

  _userGuid(id, realStatus) {
    const { detail, ipTypeNumber } = this.props;
    let message = "您还未登陆或者实名认证";
    if (sessionStorage.getItem("user") === null && realStatus === null && Number(realStatus) !== 1) {
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

  render() {
    const {
      tabs, currentIndex, cityAreaNum, hotCurrent, blogCurrent, mediaCurrent,
      hotDayNumber, blogDayNumber, mediaDayNumber, show, message, flag, compareFlag,
    } = this.state;
    const { detail, id, ipTypeNumber } = this.props;
    const {
      detailList: {
        // ipArtDetailList,
        // ipArtLikeData,
        ipCaseData,
        ipWordCloudData,
        ipSexData, ageData, agePercent,
        ipProvinceData, xProvince, yProvince, xArea, yArea,
        xBlog, yBlog, xMedia, yMedia,
        xHot, yHot,
      },
      ipTotalData: {
        baiduIndex,
        baiduInformation,
        blogFans,
      },
      starList: {
        repProductionList,
        coBrands,
        upcomingProductionList,
      }
    } = detail;
    let isShow1 = currentIndex === 1 ? "block" : "none";
    let isShow2 = currentIndex === 2 ? "block" : "none";
    let isShow3 = currentIndex === 3 ? "block" : "none";
    let isShow4 = currentIndex === 4 ? "block" : "none";
    let dataParam = {};

    let ipArtDetailList = [{
      arithmaticHotspotPrice: 79.17,
      "arithmaticHotspotPrice0": 79.16999816894531,
      "arithmaticHotspotPriceStr": "79.17",
      "brithDate": "1974年8月26日",
      "brokerageFirmGuid": "",
      "brokerageFirmList": null,
      "coBrands": {
        "dataNumber": "奥克斯空调,大鼓米线,咚咚食品,快手,人人车,新东方烹饪学校,正新鸡排",
        "dataRiiq": "2019-04-29",
        "dataType": "合作品牌",
        "platformName": "智库星途"
      },
      "hotspotCompareStatus": 3,
      "ipDesc": "黄渤，1974年8月26日出生于山东青岛，中国内地男演员，毕业于北京电影学院表演系配音专业。黄渤早年曾有过驻唱歌手、舞蹈教练、影视配音等多种工作经历。2000年，黄渤出演管虎执导的电视电影《上车，走吧》，这是他的第一部影视作品。2006年凭借宁浩执导的电影《疯狂的石头》而成名。2009年，凭借《斗牛》获得第46届台湾电影金马奖“最佳男主角奖”。2010年，主演宁浩的喜剧电影《疯狂的赛车》。2012年，主演悬疑喜剧电影《杀生》，夺得第20届北京大学生电影节最佳男演员奖和第4届中国电影导演协会年度男演员奖。主演的电影《泰囧》在中国内地票房为12.66亿。2013年主演的电影《西游·降魔篇》，该片以12.46亿元成为2013年度中国内地电影年度票房冠军。2014年，与宁浩、徐峥合作的《心花路放》票房11亿。2015年，与陈坤主演的电影《寻龙诀》上映，票房破16亿。2017年主演电影《冰之下》，凭借该片获得第20届上海国际电影节最佳男演员奖。2015年6月，加盟东方卫视励志综艺真人秀《极限挑战》节目。2016年5月，以歌手身份加盟索尼音乐，6月27日发布加入索尼音乐后首支单曲《这就是命》。",
      "ipName": "黄渤",
      "ipid": 18,
      "ipTypeNumberName": "热血,青春",
      "isFollowed": false,
      "isOneself": false,
      "mediaAnalysis": 77.31,
      "mediaAnalysisStatus": 3,
      "mediaAnalysisStr": "77.31",
      "picPrefix": "http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/",
      picUrl: "http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/5ac621b553c1f.jpg",
      "profession": "演员,歌手",
      "realStatus": null,
      "sex": "男",
      "prodect": "[{\"pic\":\"20181225_5c21c8ed50c1f.jpg\",\"title\":\"\\u4f20\\u7edf\\u7eb9\\u6837\"},{\"pic\":\"20181225_5c21c8fe7eeea.jpg\",\"title\":\"\\u9890\\u548c\\u516d\\u666f\"},{\"pic\":\"20181225_5c21c912b7e2e.jpg\",\"title\":\"\\u4f5b\\u9999\\u9694\\u817e\\u9f99\"},{\"pic\":\"20181225_5c21c955609cd.jpg\",\"title\":\"\\u767e\\u9e1f\\u671d\\u51e4\"}]",
      "cooperationCase": "[{\"pic\":\"20181225_5c21c8ed50c1f.jpg\",\"title\":\"\\u4f20\\u7edf\\u7eb9\\u6837\"},{\"pic\":\"20181225_5c21c8fe7eeea.jpg\",\"title\":\"\\u9890\\u548c\\u516d\\u666f\"},{\"pic\":\"20181225_5c21c912b7e2e.jpg\",\"title\":\"\\u4f5b\\u9999\\u9694\\u817e\\u9f99\"},{\"pic\":\"20181225_5c21c955609cd.jpg\",\"title\":\"\\u767e\\u9e1f\\u671d\\u51e4\"}]",

    }];
    let ipArtLikeData = [
      {
        "ipName": "猪迪克",
        "ipid": 12720,
        "picUrl": "http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/20180821_5b7b97802e9e9.jpg",
        "userGuid": ""
      },
      {
        "ipName": "Larva爆笑虫子",
        "ipid": 12721,
        "picUrl": "http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/20180821_5b7b99001db0e.jpg",
        "userGuid": ""
      },
      {
        "ipName": "次奇兔 CIQI RABBIT",
        "ipid": 12723,
        "picUrl": "http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/20180821_5b7bafe5990e1.jpg",
        "userGuid": ""
      },
      {
        "ipName": "招财童子",
        "ipid": 12733,
        "picUrl": "http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/20180821_5b7ba2341ae32.jpg",
        "userGuid": ""
      }
    ];

    return (
      <div className="art-container special-container">
        {/*顶部主体内容*/}
        {ipArtDetailList && ipArtDetailList.map((item, index) => {
          return (
            <div className="detail-top-container" key={index}>
              <div className="detail-base-area">
                <div className="ip-img">
                  <img src={item.picUrl} alt=""/>
                  <span className="tag">{numberKV[ipTypeNumber]}</span>
                </div>
                <div className="detail-base-text-area flex-column justify-content-between">
                  <div>
                    <div className="first-line flex-row align-items-end ">
                      <span className="ip-title word-ellipsis">{item.ipName}</span>
                      {
                        compareFlag &&
                        <span className="ip-care-status ip-compare-status active" onClick={async () => {
                          await this._getCompare(detail, id, 0);
                        }}>
                            <i className="iconfont vs iconvs_pr"/>已对比</span>
                      }
                      {!compareFlag && <span className="ip-care-status ip-compare-status "
                                             onClick={async () => {
                                               await this._getCompare(detail, id, 1);
                                             }}>
                          <i className="iconfont vs iconvs_pr"/>
                          加入对比
                        </span>}
                      {flag && <span className="ip-care-status active " onClick={async () => {
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
                      {!flag && <span className="ip-care-status " onClick={async () => {
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

                    }
                    {this._userGuid(id, item.realStatus)}
                  </div>
                </div>
              </div>
              <div className="widget-tags">
                <h5 className="area-title"><img src={ic_ip_type} alt=""/>IP类型</h5>
                <ul className="ip-type flex-wrap flex-row">
                  {
                    item.ipTypeNumberName && item.ipTypeNumberName.split(",").map((i, k) => {
                      return (
                        <li key={k}><Link to="">{i}</Link></li>
                      );
                    })
                  }
                </ul>
                {
                  ipCaseData && <h5 className="area-title"><img src={ic_case} alt=""/>IP相关案例</h5>
                }
                {
                  ipCaseData && ipCaseData.map((i, index) => {
                    return (
                      <div className="ip-type ip-case flex-wrap flex-row justify-content-between" key={index}>
                        <div className="type-img"><img src={i.picUrl} alt=""/></div>
                        <div className="type-detail flex-column justify-content-between">
                          <p className="word-ellipsis">{i.postTitle}</p>
                          <p className="attention  flex-row justify-content-between">
                            <span
                              className="attention_num iconfont ic_praise iconic_praise">{i.portalPostLikeCount}</span>
                            <span
                              className="date ">{i.postSource}&nbsp;|&nbsp;{moment(i.createDate).format('YYYY/MM/DD')}</span>
                          </p>
                        </div>
                      </div>

                    );
                  })
                }
              </div>
            </div>
          );
        })}
        <div className="tab-container">
          <div className="tab-title justify-content-around">
            <div className="tab-title-content">
              {
                tabs && tabs.map((item, index) => {
                  return (
                    <span key={index} className={`${currentIndex === item.id ? "active" : ""}`}
                          onClick={() => this._tab(item)}>
                      {this._changeTab(item)}
                      {item.tabName}
                    </span>

                  );
                })
              }
            </div>
          </div>
          {ipArtDetailList && ipArtDetailList.map((item, index) => {
            return (
              <div className="tab-content " style={{ "display": isShow1 }} key={index}>
                {
                  item.ipDesc && <div className="module-box ">
                    <p className="area-title"><img src={ic_content_validity} alt=""/>IP简介</p>
                    <div className="area-content">
                      <div className="area-words">
                        {item.ipDesc}
                      </div>
                    </div>
                  </div>
                }
                {
                  ipTypeNumber !== 8 && item.prodect !== "" && JSON.parse(item.prodect).length > 0 &&
                  <div className="module-box">
                    <p className="area-title"><img src={ic_show} alt=""/>IP素材图库</p>
                    <div className="area-content ">
                      <div className="area-box flex-row justify-content-around">
                        {JSON.parse(item.prodect).map((v, k) => {
                          return (
                            <div className="box" key={k}>
                              <img src={`${item.picPrefix}${v.pic}`} alt=""/>
                              <p className="word-ellipsis">{v.title} </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                }
                {
                  ipTypeNumber !== 8 && item.cooperationCase !== "" && JSON.parse(item.cooperationCase).length > 0 &&
                  <div className="module-box">
                    <p className="area-title"><img src={ic_cooperate} alt=""/>衍生品/合作案例</p>
                    <div className="area-content">
                      <div className="area-box flex-row justify-content-around">
                        {JSON.parse(item.cooperationCase).map((v, k) => {
                          return (
                            <div className="box" key={k}>
                              <img src={`${item.picPrefix}${v.pic}`} alt=""/>
                              <p className="word-ellipsis">{v.title} </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                }
                <div className="module-box">
                  <p className='area-title'>
                    <img src={ic_Picture_details} alt=""/>
                    {ipTypeNumber === 8 ? "经济公司介绍" : "IP所属公司介绍"}
                  </p>
                  <div className="area-content book-area-content flex justify-content-between">
                    {ipTypeNumber !== 8 && <div className="img">
                      <img src={default_img} alt=""/>
                    </div>}
                    <div className="img-detail">
                      <div className="title flex justify-content-between ">
                        <h4>南京博物馆</h4>
                        <div className="button-group flex justify-content-between">
                          {/*<button>联系他</button>*/}
                          <button><i className="iconfont iconai44"/>查看企业主页</button>
                        </div>
                      </div>
                      <p>南京博物院位于南京市玄武区中山东路321号，简称南院或南博，是中国三大博物馆之一，
                        其前身是1933年蔡元培等倡建的国立中央博物院，是中国创建最早的博物馆、中国第一座由国家投资兴建的大型综合
                        类博物馆。南京博物院是大型综合性的国家级博物馆、国家综合性历史艺术博物馆，现为国家一级博物馆、首批中央
                        地方共建国家级博物馆、国家AAAA级旅游景区和全国重点文物保护单位。</p>
                      <div className="contact-detail flex-row justify-content-around">
                        <span>电话：1583244****</span>
                        <span>邮箱：*******@shibamanto.com</span>
                        <span>网址：<a>http://www.njmuseum.com </a></span>
                        <span>地址：南京市中山东路321号</span>
                      </div>
                    </div>

                  </div>
                </div>
                {ipTypeNumber !== 8 && ipArtLikeData &&
                <div className="module-box">
                  <p className="area-title"><img src={ic_cnxh} alt=""/>影人相关播放量</p>
                  <div className="area-content like-content">
                    <div className="area-box flex-row justify-content-around">
                      {
                        ipArtLikeData && ipArtLikeData.map((item, index) => {
                          return (
                            <div className="box" key={index}>
                              <div className="child-box">
                                <img src={item.picUrl} alt=""/>
                                <div className="hover-bg">
                                  <span>近三年播放量: 100.53亿</span>
                                  <span>微博粉丝数量: 888万</span>
                                  <span>贴吧关注数量: 125,678</span>
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
                {ipTypeNumber !== 8 && ipArtLikeData &&
                <div className="module-box">
                  <p className="area-title"><img src={ic_cnxh} alt=""/>猜你喜欢</p>
                  <div className="area-content like-content">
                    <div className="area-box flex-row justify-content-around">
                      {
                        ipArtLikeData && ipArtLikeData.map((item, index) => {
                          return (
                            <div className="box" key={index}>
                              <img src={item.picUrl} alt=""/>
                              {
                                ipTypeNumber === 6 ? < div className="box-name justify-content-between">
                                    <p className="name word-ellipsis">{item.ipName}</p>
                                    <div className="item-dou  justify-content-between align-items-center">
                                      <img src={icon_dou} alt=""/>
                                      <span className="score">8.2</span>
                                    </div>
                                  </div>
                                  :
                                  <p>{item.ipName}</p>
                              }
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
                }
              </div>
            );
          })
          }
          <div className="tab-content" style={{ "display": isShow2 }}>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_sjzl} alt=""/>
                数据总览
              </p>
              <div className="area-content">
                <table className="table table-bordered text-center">
                  {
                    ipTypeNumber === 6 &&
                    <tbody>
                    <tr>
                      <td>上映天数</td>
                      <td>票房累计</td>
                      <td>首映日票房</td>
                      <td>首周票房</td>
                    </tr>
                    {
                      ipArtDetailList && ipArtDetailList.map((i, k) => {
                        return (
                          <tr key={k}>
                            <td>{i.arithmaticHotspotPriceStr}{this._totalDataClass(i.hotspotCompareStatus)}</td>
                            <td>{i.mediaAnalysisStr}{this._totalDataClass(i.mediaAnalysisStatus)}</td>
                            <td>{this._totalDataClass(baiduIndex.dataStatus)}</td>
                            <td>{blogFans.dataStr}{this._totalDataClass(blogFans.dataStatus)}</td>
                          </tr>
                        );
                      })
                    }
                    </tbody>
                  } {
                  ipTypeNumber === 5 &&
                  <tbody>
                  <tr>
                    <td>上线天数</td>
                    <td>累计播放量</td>
                    <td>昨日播放量</td>
                    <td>今日播放量</td>
                  </tr>
                  {
                    ipArtDetailList && ipArtDetailList.map((i, k) => {
                      return (
                        <tr key={k}>
                          <td>{i.arithmaticHotspotPriceStr}{this._totalDataClass(i.hotspotCompareStatus)}</td>
                          <td>{i.mediaAnalysisStr}{this._totalDataClass(i.mediaAnalysisStatus)}</td>
                          <td>{this._totalDataClass(baiduIndex.dataStatus)}</td>
                          <td>{blogFans.dataStr}{this._totalDataClass(blogFans.dataStatus)}</td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                }
                </table>
              </div>
            </div>
            {
              ipTypeNumber === 7 &&
              <div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_ptqs} alt=""/>
                    播放趋势
                  </p>
                  <div className="area-content hot-content">
                    <ul>
                      {
                        platform && platform.map((item, k) => {
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
                    <EchartDataZoomTwo container="echart-bar" data="" date="" subtext=""/>
                  </div>
                </div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_ptqs} alt=""/>
                    播放平台分布
                  </p>
                  <div className="area-content hot-content">
                  </div>
                </div>
              </div>
            }
            {
              ipTypeNumber === 6 &&
              <div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_yxpf} alt=""/>
                    院线票房趋势
                  </p>
                  <div className="area-content hot-content">
                    <EchartDataZoom container="" data="" date="" subtext=""/>
                  </div>
                </div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_ptqs} alt=""/>
                    在线平台趋势
                  </p>
                  <div className="area-content hot-content">
                    <ul>
                      {
                        platform && platform.map((item, k) => {
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
                    <EchartDataZoomTwo container="echart-bar" data="" date="" subtext=""/>
                  </div>
                </div>
              </div>
            }
            <div className="module-box">
              <p className="area-title">
                <img src={ic_kbxx} alt=""/>
                口碑信息
              </p>
              <div className="area-content movie-content hot-content">
                <div className="cups flex justify-content-between">
                  <img src={icon_dou} alt=""/>
                  <div className=" score flex justify-content-between flex-column">
                    <span>豆瓣评分</span>
                    <span>8.2</span>
                  </div>

                </div>
              </div>
            </div>
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
                <EchartBar container="echart-bar" xHot={xHot} yHot={yHot} subtext=""/>
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
                <EchartLine container="echart-line2" xHot={xBlog} yHot={yBlog} subtext=""/>
                {/*  {
                     <Certification/>
                  }*/}
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
                <EchartLine container="echart-line" xHot={xMedia} yHot={yMedia} subtext=""/>
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
                    dayStatus.fans && dayStatus.fans.map((item, k) => {
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
                <EchartLine container="echart-line" xHot={xMedia} yHot={yMedia} subtext=""/>
              </div>
            </div>
          </div>
          <div className="tab-content" style={{ "display": isShow3 }}>
            <div className="module-box">
              <p className="area-title">
                <img src={ic_follower} alt=""/>受众画像
              </p>
              <div className="area-content fans-content ">
                <EchartPie data={ipSexData}/>
                <div className="middleLine"/>
                <EchartBarSpecial container="echart-bar-special2" subtext="年龄比例" xData={ageData}
                                  yPercent={agePercent}/>
              </div>
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
                <div className="city-tab-content" style={{ "display": cityAreaNum === 1 ? "block" : "none" }}>
                  <EchartMap data={ipProvinceData}/>
                  <div className="middleLine"/>
                  <EchartBarSpecial2 container="echart-bar-special" subtext="" xData={xProvince}
                                     yPercent={yProvince}/>
                </div>
                <div className="city-tab-content" style={{ "display": cityAreaNum === 2 ? "block" : "none" }}>
                  <EchartMap data={ipProvinceData}/>
                  <div className="middleLine"/>
                  <EchartBarSpecial2 container="echart-bar-special1" subtext="" xData={xArea} yPercent={yArea}/>
                </div>
              </div>
            </div>
            {
              ipTypeNumber !== 6 &&
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_value} alt=""/>
                  商业价值评估模型
                </p>
                <div className="area-content city-content">
                  <EchartsRadarBalance data={[]} container=""/>
                </div>
              </div>
            }

            <div className="module-box flex-row justify-content-between">
              <p className="area-title">
                <img src={ic_wordcloud} alt=""/>
                关键词云
              </p>
              <div className="area-content cloud-world-content">
                {
                  ipWordCloudData &&
                  <EchartWordcloud container="echart-worldCloud" ipWordCloudData={ipWordCloudData}/>
                }
              </div>
            </div>
          </div>
          <div className="tab-content" style={{ "display": isShow4 }}>
            <div className="no-result">
              <img src={ic_default_page} alt=""/>
              <p>此模块正披星戴月开发中， 敬请期待！</p>
            </div>
          </div>
        </div>
        {show && <Alert message={message}
                        onClose={() => {
                          this.setState({ show: false });
                        }}
                        onSubmit={() => {
                          // console.log(this);
                          this.props.history.push('/login');
                        }}
        />
        }
      </div>
    )
      ;
  }
}
