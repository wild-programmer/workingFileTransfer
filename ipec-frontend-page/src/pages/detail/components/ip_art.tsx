import * as React from "react";
import { Link } from "react-router-dom";
import EchartBar from "@components/echart_bar";
import EchartLine from "@components/echart_line";
import EchartPie from "@components/echart_pie";
import EchartBarRadius from "@components/echart_barRadius";
import EchartMap from "@components/echart_map";
import EchartBarSpecial from "@components/echart_bar_special";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import EchartWordcloud from "@components/echart_wordcloud";
import ic_ip_type from "@assets/images/ip_detail/ic_ip_type.svg";
import ic_case from "@assets/images/ip_detail/ic_case.svg";
import ic_web from "@assets/images/ip_detail/ic_webo.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import ic_rdzs from "@assets/images/ip_detail/ic_rdzs.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_like from "@assets/images/ip_detail/ic_like.svg";
import ic_new from "@assets/images/ip_detail/ic_new.svg";
import ic_area from "@assets/images/ip_detail/ic_area.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_wordcloud from "@assets/images/ip_detail/ic_wordcloud.svg";
import ic_content_validity from "@assets/images/ip_detail/ic_content_validity.svg";
import ic_cooperate from "@assets/images/ip_detail/ic_cooperate.svg";
import ic_Picture_details from "@assets/images/ip_detail/ic_Picture_details.svg";
import ic_show from "@assets/images/ip_detail/ic_show.svg";
import ic_search from "@assets/images/ip_detail/ic_search.svg";
import ic_hudong from "@assets/images/ip_detail/ic_hudong.svg";
import "@assets/fonts2.0/iconfont.css";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import Alert from '@components/alert';
import default_img from '@assets/images/default_img_product.png';
import _isFunc from 'lodash/isFunction';
import { toJS } from 'mobx';

const icon_k_v = {
  up: "ic_rise icon-ic_rise up",
  blance: "ic_ unbiased icon-ic_unbiased blance",
  down: "ic_decline icon-ic_decline down",
};
const hot = [
  { name: "百度搜索指数", typeId: 5, type: "hot" },
  { name: "搜狗搜索指数", typeId: 6, type: "hot" },
  { name: "微博热度指数", typeId: 11, type: "hot" },
  { name: "微信热度指数", typeId: 15, type: "hot" },
];
const hot1 = [
  { name: "百度搜索指数", typeId: 5, type: "hot" },
  { name: "搜狗搜索指数", typeId: 6, type: "hot" },
];
const blog = [
  { name: "超话讨论数", typeId: 10, type: "blog" },
  { name: "超话阅读数", typeId: 9, type: "blog" },
  { name: "官网粉丝数", typeId: 14, type: "blog" },
  { name: "官微微博数", typeId: 16, type: "blog" },
  { name: "官微互动量", typeId: 12, type: "blog" },
];

const blog1 = [
  { name: "微博超话帖子数", typeId: 41, type: "blog" },
  { name: "微博超话阅读数", typeId: 40, type: "blog" },
  { name: "微博话题阅读数", typeId: 9, type: "blog" },
];
const media = [
  { name: "百度资讯指数", typeId: 13, type: "media" },
  { name: "微信公众号文章数", typeId: 8, type: "media" },
];
const media1 = [
  { name: "百度资讯指数", typeId: 13, type: "media" },
  { name: "微信公众号文章数", typeId: 8, type: "media" },
  { name: "微信热度指数", typeId: 15, type: "media" },
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
  ]

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
}

@inject('detail')
@observer
export default class IpArt extends React.Component<IpArtProps, IpArtState> {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 1,
      tabs: [
        { tabName: "数据展示", id: 1 },
        { tabName: "IP相关介绍", id: 2 },
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
    if (item.id === 1) {
      return (
        <i className="iconfont ic_data icon-ic_data"/>
      );
    } else {
      return (
        <i className="iconfont ic_ip_introduce icon-ic_ip_introduce"/>
      );
    }
  }

  _tab(item: any) {
    this.setState({
      currentIndex: item.id
    });
  }

  // 关注状态
  // 请求
  async _getStatus(detail, id, flag) {
    if (sessionStorage.getItem("user") !== null) {
      let userGuid = JSON.parse(sessionStorage.getItem("user")).userGuid;
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
            // onClick={async () => {
            //   await detail.getDownload({ ipid: id });
            //
            // }}
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
    _isFunc(this.props.callbackParent) && this.props.callbackParent(o);
  };

  private callbackChildModel = (o: any) => {
    _isFunc(this.props.callback) && this.props.callback(o);
  };

  render() {
    const {
      tabs, currentIndex, cityAreaNum, hotCurrent, blogCurrent, mediaCurrent,
      hotDayNumber, blogDayNumber, mediaDayNumber, show, message, flag,
    } = this.state;
    const { detail, id, ipTypeNumber } = this.props;
    const {
      detailList: {
        ipArtDetailList,
        ipArtLikeData,
        ipCaseData,
        ipWordCloudData,
        ipNewData,
        ipSexData, ageData, agePercent,
        ipProvinceData, xProvince, yProvince, xArea, yArea,
        xBlog, yBlog, xMedia, yMedia,
        xHot, yHot, xfansBlog, yfansBlog,
      },
      ipTotalData: {
        baiduIndex,
        baiduInformation,
        blogFans,
      },
    } = detail;
    let isShow1 = currentIndex === 1 ? "block" : "none";
    let isShow2 = currentIndex === 2 ? "block" : "none";
    let dataParam = {};
    // console.log(toJS(yBlog));
    return (
      <div className="art-container special-container">
        {/*顶部主体内容*/}
        {ipArtDetailList && ipArtDetailList.map((item, index) => {
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
                        <span className="ip-title word-ellipsis">{item.ipName}</span>
                        {flag === true &&
                        <span className="ip-care-status active " onClick={async () => {
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
                        {flag === false &&
                        <span className="ip-care-status " onClick={async () => {
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
                    </div>
                    <div className="base-line flex-row">
                      <span>国家地区:&nbsp;</span>
                      <span>{item.ipLocationName}</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>版 权 方:&nbsp;</span>
                      <span>{item.owner}</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>授权种类:&nbsp;</span>
                      <span>{item.authorization}</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>所属类型:&nbsp;</span>
                      <span>{item.ipType}</span>
                    </div>
                  </div>
                  {this._userGuid(id, item.realStatus)}

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
        {/*tab切换*/}
        {
          ipArtLikeData && <div className="tab-container">
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
            <div className="tab-content" style={{ "display": isShow1 }}>
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_sjzl} alt=""/>
                  数据总览
                </p>
                <div className="area-content">
                  <table className="table table-bordered text-center">
                    {
                      ipTypeNumber === 2 ?
                        <tbody>
                        <tr>
                          <td>全网热度值</td>
                          <td>全网搜索量</td>
                          <td>全网资讯值</td>
                          <td>官网粉丝数</td>
                        </tr>
                        {
                          ipArtDetailList && ipArtDetailList.map((i, k) => {
                            return (
                              <tr key={k}>
                                <td>{i.arithmaticHotspotPriceStr}{this._totalDataClass(i.hotspotCompareStatus)}</td>
                                <td>{baiduIndex.dataStr}{this._totalDataClass(baiduIndex.dataStatus)}</td>
                                <td>{baiduInformation.dataStr}{this._totalDataClass(baiduInformation.dataStatus)}</td>
                                <td>{blogFans.dataStr}{this._totalDataClass(blogFans.dataStatus)}</td>
                              </tr>
                            );
                          })
                        }
                        </tbody>
                        :
                        <tbody>
                        <tr>
                          <td>全网热度值</td>
                          <td>媒体指数</td>
                          <td>全网搜索值</td>
                          <td>官微粉丝数</td>
                        </tr>
                        {
                          ipArtDetailList && ipArtDetailList.map((i, k) => {
                            return (
                              <tr key={k}>
                                <td>{i.arithmaticHotspotPriceStr}{this._totalDataClass(i.hotspotCompareStatus)}</td>
                                <td>{i.mediaAnalysisStr}{this._totalDataClass(i.mediaAnalysisStatus)}</td>
                                <td>{baiduIndex.dataStr}{this._totalDataClass(baiduIndex.dataStatus)}</td>
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
              <div className="module-box">
                {
                  ipTypeNumber === 2 ?
                    <p className="area-title">
                      <img src={ic_rdzs} alt=""/>
                      热度指数
                    </p>
                    :
                    <p className="area-title">
                      <img src={ic_search} alt=""/>
                      搜索指数
                    </p>
                }
                <div className="area-content hot-content">
                  {
                    ipTypeNumber === 2 ?
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
                      :
                      <ul>
                        {
                          hot1 && hot1.map((li, k) => {
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
                  }

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
                {ipTypeNumber === 2 ?
                  <p className="area-title">
                    <img src={ic_web} alt=""/>
                    微博趋势
                  </p>
                  :
                  <p className="area-title">
                    <img src={ic_hudong} alt=""/>
                    互动指数
                  </p>
                }

                <div className="area-content blog-content">
                  {ipTypeNumber === 2 ?
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
                    :
                    <ul>
                      {
                        blog1 && blog1.map((item, k) => {
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
                  }
                  <EchartBarRadius container="echart-barRadius" data="[]"/>
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
                </div>
              </div>
              <div className="module-box">
                <p className="area-title">
                  <img src={ic_media} alt=""/>
                  媒体指数
                </p>
                <div className="area-content media-content">
                  {
                    ipTypeNumber === 2 ?
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
                      :
                      <ul>
                        {
                          media1 && media1.map((item, k) => {
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
                  }

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
                  {ipTypeNumber === 2 ? '粉丝画像' : '受众画像'}
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
              <div className="module-box special-module-box flex-row justify-content-between">
                {
                  ipNewData &&
                  <div className="module-child-box">
                    <p className="area-title">
                      <img src={ic_new} alt=""/>
                      新闻舆情
                    </p>
                    <div className="area-content news-area-content">
                      {
                        ipNewData && ipNewData.map((item, k) => {
                          return (
                            <div key={k}>
                              <p className="word-ellipsis">
                                {item.dataNumber}
                              </p>
                              <span>{item.platformName}</span>
                              <span className="middle-line">|</span>
                              <span>{item.dataRiiq}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                }
                <div className="module-child-box">
                  <p className="area-title">
                    <img src={ic_wordcloud} alt=""/>
                    关键词云
                  </p>
                  <div className="area-content">
                    {
                      ipWordCloudData &&
                      <EchartWordcloud container="echart-worldCloud" ipWordCloudData={ipWordCloudData}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            {/*ip相关介绍*/}
            {
              ipArtDetailList && ipArtDetailList.map((item, index) => {
                return (
                  <div className="tab-content flex-column " style={{ "display": isShow2 }} key={index}>
                    {
                      item.ipDesc &&
                      <div className="module-box ">
                        <p className="area-title"><img src={ic_content_validity} alt=""/>内容简介</p>
                        <div className="area-content">
                          <div className="area-words">
                            {item.ipDesc}
                          </div>
                        </div>
                      </div>
                    }
                    {
                      item.prodect !== "" && JSON.parse(item.prodect).length > 0 &&
                      <div className="module-box">
                        <p className="area-title"><img src={ic_show} alt=""/>产品展示</p>
                        <div className="area-content ">
                          <div className="area-box flex-row justify-content-around">
                            {JSON.parse(item.prodect).map((v, k) => {
                              return (
                                <div className="box" key={k}>
                                  {/*<div className="img"
                                       style={{ backgroundImage: `url(${item.picPrefix}${v.pic})` }}
                                  />*/}
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
                      item.cooperationCase !== "" && JSON.parse(item.cooperationCase).length > 0 &&
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
                    {
                      item.detail &&
                      <div className="module-box">
                        <p className="area-title"><img src={ic_Picture_details} alt=""/>图文详情</p>
                        <div className="area-content book-area-content">
                          <div className="area-words" dangerouslySetInnerHTML={{ __html: item.detail }}/>
                        </div>
                      </div>
                    }
                  </div>
                );
              })
            }
          </div>
        }
        {
          ipArtLikeData && <div className="module-box">
            <p className="area-title"><img src={ic_like} alt=""/>猜你喜欢</p>
            <div className="area-content">
              <div className="area-box flex-row justify-content-around">
                {
                  ipArtLikeData && ipArtLikeData.map((item, index) => {
                    return (
                      <div className="box" key={index}>
                        <img src={item.picUrl} alt=""/>
                        <p>{item.ipName}</p>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        }

        {/*{show &&*/}
        {/*<Toast*/}
        {/*onClose={() => {*/}
        {/*this.setState({ show: false });*/}
        {/*}}*/}
        {/*duration={2}*/}
        {/*message={message}/>}*/}
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
    );
  }
}
