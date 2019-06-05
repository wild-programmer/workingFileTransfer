import * as React from "react";
import { Link } from "react-router-dom";
import EchartBar from "@components/echart_bar";
import EchartLine from "@components/echart_line";
import EchartPie from "@components/echart_pie";
import EchartMap from "@components/echart_map";
import EchartBarSpecial from "@components/echart_bar_special";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import EchartWordcloud from "@components/echart_wordcloud";
import ic_case from "@assets/images/ip_detail/ic_case.svg";
import ic_web from "@assets/images/ip_detail/ic_webo.svg";
import ic_rdzs from "@assets/images/ip_detail/ic_rdzs.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_area from "@assets/images/ip_detail/ic_area.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_wordcloud from "@assets/images/ip_detail/ic_wordcloud.svg";
import ic_product from "@assets/images/ip_detail/ic_representative_works.svg";
import ic_brand from "@assets/images/ip_detail/ic_co_branding.svg";
import ic_news from "@assets/images/ip_detail/ic_news.svg";
import ic_upcomingg from "@assets/images/ip_detail/ic_upcoming.svg";
import ic_computer from "@assets/images/ip_detail/ic_computer.svg";
import Swipers from "@pages/detail/components/swiper";

import "@assets/fonts2.0/iconfont.css";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import _isArray from 'lodash/isArray';
import _chunk from 'lodash/chunk';
import default_img from '@assets/images/default_img_product.png';
import InfiniteScroll from "react-infinite-scroller";
import ic_sjzl from '@assets/images/ip_detail/ic_sjzl.svg';
import Alert from '@components/alert';
import _isFunc from 'lodash/isFunction';

const icon_k_v = {
  up: "ic_rise icon-ic_rise up",
  blance: "ic_ unbiased icon-ic_unbiased blance",
  down: "ic_decline icon-ic_decline down",
};
const hot = [
  { name: "百度搜索指数", typeId: 5, type: "hot" },
  { name: "搜狗搜索指数", typeId: 6, type: "hot" },
  { name: "微信热度指数", typeId: 15, type: "hot" },
];
const blog = [
  { name: "超话讨论数", typeId: 10, type: "blog" },
  { name: "超话阅读数", typeId: 9, type: "blog" },
  { name: "官微互动量", typeId: 12, type: "blog" },
];
const media = [
  { name: "百度资讯指数", typeId: 13, type: "media" },
  { name: "微信公众号文章数", typeId: 8, type: "media" },
];
const fans = [
  { name: "微博粉丝数", typeId: 14, type: "fans" },
  { name: "贴吧粉丝数", typeId: 33, type: "fans" },
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
    { dayNumber: 30, name: "近30天", type: "fans" },
  ]

};

interface IpStarProps extends IComponentProps {
  id: number,
  ipTypeNumber: number,
}

interface IpStarState {
  cityAreaNum: number,
  hotCurrent: number,
  blogCurrent: number,
  mediaCurrent: number,
  fansCurrent: number,
  hotDayNumber: number,
  blogDayNumber: number,
  mediaDayNumber: number,
  fansDayNumber: number,

  // loading: boolean,
  hasMore: boolean,
  pageNum: number,
  pageSize: number,
  total: number,
  data: Array<object>,
  show: boolean,
  message: string,
  flag: any,
}

@inject('detail')
@observer
export default class IpStar extends React.Component<IpStarProps, IpStarState> {
  constructor(props) {
    super(props);

    this.state = {
      cityAreaNum: 1,
      hotCurrent: 5,
      blogCurrent: 10,
      mediaCurrent: 13,
      fansCurrent: 14,
      hotDayNumber: 10,
      blogDayNumber: 10,
      mediaDayNumber: 10,
      fansDayNumber: 10,

      // loading: true,
      hasMore: true,
      pageNum: 1,
      pageSize: 20,
      total: 0,
      data: [],
      show: false,
      message: "",
      flag: "",
    };

  }

  async componentDidMount() {
    const { detail } = this.props;
    const {
      starList: { followStatus }
    } = detail;
    if (followStatus === true) {
      this.setState({ flag: true });
    } else {
      this.setState({ flag: false });
    }
  }

  // 关注状态
  async _getStatus(detail, id, flag) {
    if (sessionStorage.getItem("user") !== null) {
      let userGuid = JSON.parse(sessionStorage.getItem("user")).userGuid;
      // console.log(userGuid, Number(id), typeof ({ userGuid, isFollow: flag, ipid: Number(id) }));
      await detail.getFollowStatus({ userGuid, isFollow: flag, ipid: Number(id) });
    } else {
      let message = "您还未登陆！";
      this._state(message);
    }
  }

  // 数据总览 icon
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
    const { detail, id } = this.props;
    const { hotDayNumber, blogDayNumber, mediaDayNumber, fansDayNumber } = this.state;
    let dataParam = {};
    let dayNumber;
    if (item.type === "hot") {
      this.setState({
        hotCurrent: item.typeId
      });
      dayNumber = hotDayNumber;
    } else if (item.type === "blog") {
      this.setState({
        blogCurrent: item.typeId
      });
      dayNumber = blogDayNumber;
    } else if (item.type === "media") {
      this.setState({
        mediaCurrent: item.typeId
      });
      dayNumber = mediaDayNumber;
    } else if (item.type === "fans") {
      this.setState({
        fansCurrent: item.typeId
      });
      dayNumber = fansDayNumber;

    }
    dataParam = { typeId: item.typeId, ipid: Number(id), dayNumber };
    await detail.echartChangeStatus(dataParam);

  }

  async _selectDay(item) {
    const { detail, } = this.props;
    const { hotCurrent, blogCurrent, mediaCurrent, fansCurrent } = this.state;
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
    } else if (item.type === "fans") {
      this.setState({
        fansDayNumber: item.dayNumber
      });
      dataParam = { dayNumber: item.dayNumber, typeId: fansCurrent };
    }
    await detail.echartChangeStatus(dataParam);
  }

  _state(message) {
    this.setState({
      show: true,
      message,
    });
  }

  _userGuid(id, realStatus) {
    const { detail, ipTypeNumber } = this.props;
    let message = "您还未登陆或者实名认证!";
    if (sessionStorage.getItem("user") === null && realStatus === null && Number(realStatus) !== 1) {
      return (
        <div className="base-line flex-row with-margin-top-32">
          < span onClick={() => {
            this._state(message);
          }} className="btn edit-btn-custom justify-content-center align-items-center">
            <i className="iconfont ic_editor_pr icon-ic_editor_pr"/>
            编辑IP信息
          </span>
          <span
            onClick={() => {
              this._state(message);
            }}
            className="btn btn-gradient btn-custom justify-content-center
                  align-items-center with-margin-left-20 upload-work">
            <i className=" iconfont icon ic_upload icon-ic_upload"/>
            上传商务资料
          </span>
          <span
            onClick={() => {
              this._state(message);
            }}
            className="btn edit-btn-custom justify-content-center
                      align-items-center with-margin-left-20 upload_data">
            <i className="iconfont ic_download icon-ic_download"/>
            下载资料
          </span>
        </div>
      );

    } else {
      return (
        <div className="base-line flex-row with-margin-top-32">
          <Link to={`/update/${ipTypeNumber}/${id}`}
                className="btn edit-btn-custom justify-content-center align-items-center">
            <i className="iconfont ic_editor_pr icon-ic_editor_pr"/>
            编辑IP信息
          </Link>
          <a onClick={() => {
            this.callbackChild(true);
          }}
             className="btn btn-gradient btn-custom justify-content-center
                  align-items-center with-margin-left-20 upload-work">
            <i className=" iconfont icon ic_upload icon-ic_upload"/>
            上传商务资料

          </a>
          <a
            onClick={() => {
              this.callbackChildModel(true);
            }}
            className="btn edit-btn-custom justify-content-center
                      align-items-center with-margin-left-20 upload_data">
            <i className="iconfont ic_download icon-ic_download"/>
            下载资料
          </a>
        </div>
      );

    }
  }

  private callbackChild = (o: any) => {
    _isFunc(this.props.callbackParent(o)) && this.props.callbackParent(o);
  };
  private callbackChildModel = (o: any) => {
    _isFunc(this.props.callback) && this.props.callback(o);
  };

  // loadFunc = () => {
  //   const { detail, id } = this.props;
  //   const { total, data, pageNum } = this.state;
  //   if (total === data.length) {
  //     return;
  //   }
  //   this.setState({
  //     // loading: true,
  //     pageNum: pageNum + 1
  //   }, async () => {
  //     await detail.getNewAbout({ ipid: id, pageSize: 3, currentPage: pageNum });
  //   });
  // };

  render() {
    const { cityAreaNum, hotCurrent, blogCurrent, mediaCurrent, fansCurrent, fansDayNumber, hotDayNumber, blogDayNumber, mediaDayNumber, flag } = this.state;
    const { detail, id } = this.props;
    const {
      ipStarList,
      detailList: {
        ipCaseData, xBlog, yBlog, xMedia, yMedia, xHot, yHot,
        xfan, yfan, ipWordCloudData, ipSexData, xArea, yArea,
        ipProvinceData, xProvince, yProvince, ageData, agePercent,
        xfansBlog, yfansBlog
      },
      starList: {
        repProductionList,
        upcomingProductionList,
        coBrands,
        ipNewDataAbout,
      },
      ipTotalData: {
        blogFans,
        cooperativeBrands
      },
    } = detail;

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
    return (
      <div className="art-container">
        {/*顶部主体内容*/}
        {
          ipStarList && ipStarList.map((item, index) => {
            return (
              <div className="detail-top-container" key={index}>
                <div className="detail-base-area">
                  <div className="ip-img">
                    <img src={item.picUrl} alt=""/>
                  </div>
                  <div className="detail-base-text-area flex-column justify-content-between">
                    <div>
                      <div className="first-line flex-row align-items-end justify-content-between">
                        <div>
                          <span className="ip-title">{item.ipName}</span>
                          {flag === true &&
                          <span className="ip-care-status active " onClick={async () => {
                            if (sessionStorage.getItem("user") !== null) {
                              this.setState({
                                flag: false
                              });
                            }
                            await this._getStatus(detail, id, 0);
                          }}>
                              <i className="iconfont ic_follow icon-ic_follow1"/>已关注
                            </span>
                          }
                          {flag === false &&
                          <span className="ip-care-status " onClick={async () => {
                            if (sessionStorage.getItem("user") !== null) {
                              this.setState({
                                flag: true
                              });
                            }
                            await this._getStatus(detail, id, 1);
                          }}>
                            <i className="iconfont ic_follow icon-ic_follow1"/>加入关注
                          </span>
                          }
                        </div>
                      </div>
                      <div className="base-line flex-row">
                        <span>性别:&nbsp;</span>
                        <span>{item.sex}</span>
                        {/*{item.sex === 240 && <span>男</span>}*/}
                        {/*{item.sex === 241 && <span>女</span>}*/}
                        {/*{item.sex === 241 && <span>组合</span>}*/}
                      </div>
                      <div className="base-line flex-row">
                        <span>职业:&nbsp;</span>
                        <span>{item.profession}</span>
                      </div>
                      <div className="base-line flex-row">
                        <span>出生日期:&nbsp;</span>
                        <span>{item.brithDate}</span>
                      </div>
                      <div className="base-line remove-flex">
                        <span>个人简介：&nbsp;</span>
                        <span>{item.ipDesc}</span>
                      </div>
                    </div>
                    {this._userGuid(id, item.realStatus)}
                  </div>
                </div>
                <div className="widget-tags">
                  {item.brokerageFirmList &&
                  <h5 className="area-title"><img src={ic_computer} alt=""/>经纪公司</h5>
                  }
                  <ul className="ip-type flex-wrap flex-row company">
                    {
                      item.brokerageFirmList && item.brokerageFirmList.map((i, k) => {
                        return (
                          <li key={k}><img src={i.picUrl} alt=""/><span>{i.panyAbbreviation}</span></li>
                        );
                      })
                    }
                  </ul>
                  {
                    ipCaseData && <h5 className="area-title"><img src={ic_case} alt=""/>相关案例</h5>
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
                              className="attention_num iconfont ic_praise icon-ic_praise">{i.portalPostLikeCount}</span>
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
          })
        }
        {
          ipStarList && ipStarList.map((item, index) => {
            return (
              <div className="star-top-more flex-column" key={index}>
                <div className="star-div flex-row ">
                  {arr.length > 0 &&
                  <div className="child-star-div left-star-div  ">
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
                  {
                    coBrands &&
                    <div className="child-star-div right-brand">
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
                  }
                </div>
                <div className="star-div  flex-row ">
                  {
                    ipNewDataAbout.length > 0 &&
                    <div className="child-star-div left-star-div ">
                      <p className="area-title"><img src={ic_news} alt=""/>相关动态</p>
                      <div className="area-content news-area-content">
                        {/*<InfiniteScroll*/}
                        {/*pageStart={0}*/}
                        {/*loadMore={this.loadFunc}*/}
                        {/*hasMore={true}*/}
                        {/*useWindow={false}*/}
                        {/*>*/}
                        {
                          ipNewDataAbout && ipNewDataAbout.map((i, k) => {
                            return (
                              <div key={k}>
                                <p className="word-ellipsis">
                                  {i.dataNumber}
                                </p>
                                <span>{i.platformName}</span>
                                <span>{i.dataRiiq}</span>
                              </div>
                            );
                          })
                        }
                        {/*</InfiniteScroll>*/}
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
            );
          })
        }
        {/*tab切换*/}
        {
          ipStarList &&
          <div className="tab-container">
            <div className="tab-content">
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_sjzl} alt=""/>
                  数据总览
                </p>
                <div className="area-content">
                  <table className="table table-bordered text-center">
                    <tbody>
                    <tr>
                      <td>全网热度值</td>
                      <td>媒体指数</td>
                      <td>合作品牌数</td>
                      {
                        blogFans.typeId === 14 &&
                        <td>微博粉丝数</td>
                      }
                      {
                        blogFans.typeId !== 14 &&
                        <td>超话粉丝数</td>
                      }

                    </tr>
                    {ipStarList && ipStarList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.arithmaticHotspotPriceStr}{this._totalDataClass(item.hotspotCompareStatus)}</td>
                          <td>{item.mediaAnalysis}{this._totalDataClass(item.mediaAnalysisStatus)}</td>
                          <td>{cooperativeBrands.dataStr}{this._totalDataClass(cooperativeBrands.dataStatus)}</td>
                          <td>{blogFans.dataStr}{this._totalDataClass(blogFans.dataStatus)}</td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_rdzs} alt=""/>
                  热度指数
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
                  <img src={ic_media} alt=""/>
                  媒体指数
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
                  <img src={ic_web} alt=""/>
                  热议趋势
                </p>
                <div className="area-content blog-content">
                  <ul>
                    {/*w微博*/}
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
                  <EchartLine container="echart-line-two" xHot={xBlog} yHot={yBlog} subtext=""/>
                </div>
              </div>
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_web} alt=""/>
                  粉丝趋势
                </p>
                <div className="area-content blog-content">
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
                  <EchartLine container="echart-line-three" xHot={xfan} yHot={yfan} subtext=""/>
                </div>
              </div>
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_follower} alt=""/>
                  粉丝画像
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
                ipWordCloudData.length > 0 &&
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_wordcloud} alt=""/>
                    关键词云
                  </p>
                  <div className="area-content book-area-content">
                    {
                      ipWordCloudData &&
                      <EchartWordcloud container="echart-worldCloud" ipWordCloudData={ipWordCloudData}/>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
        {this.state.show && <Alert message={this.state.message}
                                   onClose={() => {
                                     this.setState({ show: false });
                                   }}
                                   onSubmit={() => {
                                     this.props.history.push('/login');
                                   }}
        />
        }
      </div>
    );
  }
}
