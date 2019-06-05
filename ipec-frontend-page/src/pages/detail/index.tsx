import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";

import "@assets/scss/detail.scss";
import { inject, observer } from "mobx-react";
import { IpArt, IpStar, IpAvatar } from "@pages/detail/components";
import UploadFileModel from '@components/upload_file_model';
import Model from '@components/model';
// const component_k_v = {
//   "art": IpArt,
// };
const numberKV = {
  'IP形象': 1,
  '文创艺术': 2,
  '图书': 3,
  '网文': 4,
  '电视剧': 5,
  '电影': 6,
  '综艺': 7,
  '明星艺人': 8,
  '动画': 9,
  '漫画': 10,
};

interface IDetailState {
  data: string[],
  show: boolean;
  uploadShow: Boolean;
  modelState: Boolean;
}

@inject("detail")
@inject("nav_store")
@inject("update")
@observer
export default class Detail extends React.Component<IProps, IDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      show: false,
      uploadShow: false,
      modelState: false,
    };
  }

  async componentDidMount() {
    document.title = "IPEC-详情";
    const { detail, nav_store, update } = this.props;

    await nav_store.navList();
    await detail.requestDetail();

    this.setState({
      show: true
    });
    // 获取路由参数值this.props.match.params.参数名

    const { match: { params } } = this.props;
    let ipTypeNumber = Number(params['ipTypeNumber']);
    let ipid = Number(params['id']);
    let user = sessionStorage.getItem("user");
    let dataParam = {}, dataParam2 = {}, dataParam3 = {}, dataParam4 = {}, dataParam5 = {};
    if (params.hasOwnProperty('id') && ipid > 0) {
      dataParam = { dayNumber: 10, ipid, typeId: 5, type: "hot" };
      dataParam2 = { dayNumber: 10, ipid, typeId: 10, type: "blog" };
      dataParam3 = { dayNumber: 10, ipid, typeId: 13, type: "media" };
      if (ipTypeNumber === 2) {
        let type = "get-cultural";
        if (user !== null) {
          const { userGuid } = JSON.parse(user);
          await detail.ipArtDetail(type, { userGuid, ipid });
        } else {
          await detail.ipArtDetail(type, { ipid });
        }
        await detail.getRelatedCase({ ipid });
        // 全网搜索值5、全网资讯值13、微博粉丝数14、合作品牌数 31
        await detail.getDetailTotal({ typeId: 5, ipid });
        await detail.getDetailTotal({ typeId: 13, ipid });
        await detail.getDetailTotal({ typeId: 14, ipid });
        // await detail.getDetailTotal({ typeId: 14, ipid });
        // await detail.getDetailTotal({ typeId: 31, ipid });
        await detail.echartChangeStatus(dataParam);
        await detail.echartChangeStatus(dataParam2);
        await detail.echartChangeStatus(dataParam3);
        await detail.getWordData({ ipid });
        await detail.getNewAbout({ ipid, pageSize: 4 });
        await detail.getFansAreaData({ ipid, typeId: 1 });
        await detail.getFansAreaData({ ipid, typeId: 2 });
        await detail.getFansAreaData({ ipid, typeId: 3 });
        await detail.getFansAreaData({ ipid, typeId: 4 });
        await detail.ipArtLike({ ipTypeSuperiorNumber: ipTypeNumber });

      } else if (ipTypeNumber === 8) {
        if (user !== null) {
          const { userGuid } = JSON.parse(user);
          await detail.ipStarDetail({ userGuid, ipid });
        } else {
          await detail.ipStarDetail({ ipid });
        }
        dataParam4 = { dayNumber: 10, ipid, typeId: 14, type: "fan" };
        const { starList: { ipName } } = detail;
        await detail.getRelatedCase({ ipid });
        await detail.getProdctionData({ isUpcoming: 0, ipid, ipName: encodeURI(ipName), currentPage: 1, pageSize: 4 });
        await detail.getProdctionData({ isUpcoming: 1, ipid, ipName: encodeURI(ipName), currentPage: 1, pageSize: 2 });
        await detail.getNewAbout({ ipid, pageSize: 3 });
        // 微博粉丝数14、合作品牌数 31
        await detail.getDetailTotal({ typeId: 14, ipid });
        await detail.getDetailTotal({ typeId: 31, ipid });
        await detail.echartChangeStatus(dataParam);
        await detail.echartChangeStatus(dataParam2);
        await detail.echartChangeStatus(dataParam3);
        await detail.echartChangeStatus(dataParam4);
        await detail.getFansAreaData({ ipid, typeId: 1 });
        await detail.getFansAreaData({ ipid, typeId: 2 });
        await detail.getFansAreaData({ ipid, typeId: 3 });
        await detail.getFansAreaData({ ipid, typeId: 4 });
        await detail.getWordData({ ipid });

      } else if (ipTypeNumber === 1) {
        let type = "get-avatar";
        if (user !== null) {
          const { userGuid } = JSON.parse(user);
          await detail.ipArtDetail(type, { userGuid, ipid });
        } else {
          await detail.ipArtDetail(type, { ipid });
        }
        await detail.getRelatedCase({ ipid });

        dataParam5 = { dayNumber: 10, ipid, typeId: 41, type: "blog" };
        // 全网搜索值5、全网资讯值13、微博粉丝数14、合作品牌数 31
        await detail.getDetailTotal({ typeId: 5, ipid });
        await detail.getDetailTotal({ typeId: 14, ipid });
        await detail.echartChangeStatus(dataParam);
        await detail.echartChangeStatus(dataParam5);
        await detail.echartChangeStatus(dataParam3);
        await detail.getWordData({ ipid });
        await detail.getNewAbout({ ipid, pageSize: 4 });
        await detail.getFansAreaData({ ipid, typeId: 1 });
        await detail.getFansAreaData({ ipid, typeId: 2 });
        await detail.getFansAreaData({ ipid, typeId: 3 });
        await detail.getFansAreaData({ ipid, typeId: 4 });
        await detail.ipArtLike({ ipTypeSuperiorNumber: ipTypeNumber });

      }

    }

    /**
     * 下载资料
     */
    await update.getDownload({ id: ipid });
  }

  private callback = (params: boolean) => {
    this.setState({ uploadShow: params });
  };
  private callbackModel = (params: boolean) => {
    this.setState({ modelState: params });
  };

  render() {
    const { nav_store, update } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { businessList } = update;
    // const Component = component_k_v[component];
    const { match: { params } } = this.props;
    const ipTypeNumber = parseInt(params['ipTypeNumber']);
    const id = params['id'];
    const { uploadShow, modelState } = this.state;
    console.log(this.props.match, this.props.history);
    return (
      <div>
        <Header data={headerNav} history={this.props.history}/>
        {
          modelState && <Model data={businessList} title="下载资料" onClose={() => {
            this.setState({
              modelState: false
            });
          }}/>
        }
        <div className="detail-container flex-row">
          {
            ipTypeNumber && ipTypeNumber === 1 &&
            <IpArt id={id} ipTypeNumber={1}
                   history={this.props.history}
                   callbackParent={this.callback}
                   callback={this.callbackModel}/>
          }
          {
            ipTypeNumber && ipTypeNumber === 2 &&
            <IpArt id={id} ipTypeNumber={2}
                   history={this.props.history}
                   callbackParent={this.callback}
                   callback={this.callbackModel}/>
          }
          {
            ipTypeNumber && ipTypeNumber === 8 &&
            <IpStar id={id} ipTypeNumber={8}
                    history={this.props.history}
                    callbackParent={this.callback}
                    callback={this.callbackModel}/>
          }
          {/*{Component && <Component data={data}/>}*/}
          {/*<div className="left-container flex-column">
            <div className="detail-base-area">
              <div className="ip-img">
                <span className="detail-ip-type-span">电视剧</span>
                <img src="http://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/20180524_5b068eff4126a.jpg" alt=""/>
              </div>
              <div className="detail-base-text-area flex-column">
                <div className="first-line flex-row align-items-end justify-content-between">
                  <div>
                    <span className="ip-title">猎毒人</span>
                    <span className="detail-score">8.2</span>
                  </div>
                  <div className="download-icon-btn flex-column">
                    <i className="icon iconfont icon-download"/>
                    <i className="icon iconfont icon-add2"/>
                  </div>
                </div>
                <div className="base-line flex-row">
                  <span>国家地区:&nbsp;</span>
                  <span>中国大陆</span>
                </div>
                <div className="base-line flex-row">
                  <span>首播时间:&nbsp;</span>
                  <span>2018年07月06日</span>
                </div>
                <div className="base-line flex-row">
                  <span>网络平台:&nbsp;</span>
                  <span>爱奇艺 / 疼训视频 / 优酷 / 芒果 / 搜狐</span>
                </div>

                <div className="base-line flex-row">
                  <span>主演阵容:&nbsp;</span>
                  <span>于和伟 / 张丹峰 / 侯梦莎 / 傅程鹏／徐洪浩</span>
                  <span className="get-more">更多…</span>
                </div>
                <div className="base-line flex-row">
                  <span>集　　数:&nbsp;</span>
                  <span>40集</span>
                </div>
                <div className="base-line flex-row">
                  <span>导　　演:&nbsp;</span>
                  <span>天毅</span>
                </div>
                <div className="base-line flex-row">
                  <span>编　　剧:&nbsp;</span>
                  <span>陈亚洲</span>
                </div>

                {this.state.ipType === "book" ?
                  <div>
                    <div className="base-line flex-row">
                      <span>作　　者:&nbsp;</span>
                      <span>漫画作者1</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>出版日期:&nbsp;</span>
                      <span>2019-10-10</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>出版社:&nbsp;</span>
                      <span>漫画出版社1</span>
                    </div>
                  </div>
                  : ""
                }

                {this.state.ipType === "art" ?
                  <div>
                    <div className="base-line flex-row">
                      <span>版权方:&nbsp;</span>
                      <span>中国国家博物馆</span>
                    </div>
                  </div>
                  : ""
                }

                {this.state.ipType === "comic" ?
                  <div>
                    <div className="base-line flex-row">
                      <span>首更日期:&nbsp;</span>
                      <span>2019-1-7</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>平　　台:&nbsp;</span>
                      <span>腾讯动漫(中国大陆)</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>作　　者:&nbsp;</span>
                      <span>尾田荣一郎</span>
                    </div>
                  </div>
                  : ""
                }

                {this.state.ipType === "people" ?
                  <div>
                    <div className="base-line flex-row">
                      <span>性    别:&nbsp;</span>
                      <span>男</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>职　　业:&nbsp;</span>
                      <span>运动员/艺人</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>生　　日:&nbsp;</span>
                      <span>1979年6月20日</span>
                    </div>
                    <div className="base-line flex-row">
                      <span>主要成就:&nbsp;</span>
                      <span>2003年末金靴奖</span>
                    </div>
                  </div>
                  : ""
                }

                <div className="base-line flex-row with-margin-top-32">
                  <Link to="/" className="btn edit-btn-custom justify-content-center align-items-center">
                    编辑IP信息
                  </Link>
                  <Link
                    to="/"
                    className="btn btn-gradient btn-custom justify-content-center align-items-center with-margin-left-20">
                    上传商务资料
                  </Link>
                </div>
              </div>
            </div>
            <div className="detail-profile-area">
              <h5 className="area-title">剧情简介</h5>
              <div className="profile-text">
                《猎毒人》是由捷成世纪文化产业集团、武汉当代明诚文化、北京当代时光传媒、捷成星纪元影视文化传媒有限公司、嘉会文化传媒有限公司、公安部金盾影视文化中心、公安部华盛音像出版社联合出品的刑侦剧，天毅执导，陈亚洲任总编剧，于和伟担纲艺术总监并领衔主演，吴秀波、徐峥、侯勇、王劲松、刘小锋、刘威葳等特别出演，张丹峰、侯梦莎、傅程鹏、徐洪浩、夏侯镔、赵荀等主演。该剧讲述了高智商、高学历的化学工程师吕云鹏，因为亲情触发，秘密潜伏进入金三角势力庞大的毒枭集团，与毒贩斗智斗勇经历九死一生，最终成为一名功勋卧底的故事。
              </div>
            </div>
            {this.state.ipType === "people" ?
              <div className="detail-profile-area">
                <h5 className="area-title">个人简介</h5>
                <div className="profile-text">
                  《航海王》是日本漫画家尾田荣一郎作画的少年漫画作品，在《周刊少年Jump》1997年34号开始连载。改编的电视动画《航海王》于1999年10月20日起在富士电视台首播。2012年5月11日，《航海王》获得第41回日本漫画家协会赏。截至2015年6月15日，《航海王》以日本本土累计发行了3亿2086万6000本，被吉尼斯世界纪录官方认证为“世界上发行量最高的单一作者创作的系列漫画”。2017年7月21日，日本纪念日协会通过认证，将每年的7月22日设立为“ONEPIECE纪念日”。
                </div>
              </div>
              : ""
            }

            {this.state.ipType === "book" ?
              <div className="detail-profile-area">
                <h5 className="area-title">内容简介</h5>
                <div className="profile-text">
                  蒋沁芸，出生于四川，中国内地女演员，毕业于上海市同济大学。2012年，参加全国选角大赛《寻梦好莱坞》并获得总冠军；之后，参加第19届“美在花城”新星大赛并进入16强，最终获得最佳友谊奖。2014年，参演由韩寒执导的喜剧爱情冒险电影《后会无期》而正式进入演艺圈。2015年，主演黑色物语单元网络剧《会痛的17岁》中的《会痛的石头》。2016年，参演青春奇幻影片《早安公主》和青春校园偶像剧《栀子花开2017》。2018年，参演的古装热血剧《夜天子》在腾讯视频播出。
                </div>
              </div>
              : ""
            }

            {this.state.ipType === "art" ?
              <div className="detail-profile-area">
                <h5 className="area-title">IP简介</h5>
                <div className="profile-text">
                  蒋沁芸，出生于四川，中国内地女演员，毕业于上海市同济大学。2012年，参加全国选角大赛《寻梦好莱坞》并获得总冠军；之后，参加第19届“美在花城”新星大赛并进入16强，最终获得最佳友谊奖。2014年，参演由韩寒执导的喜剧爱情冒险电影《后会无期》而正式进入演艺圈。2015年，主演黑色物语单元网络剧《会痛的17岁》中的《会痛的石头》。2016年，参演青春奇幻影片《早安公主》和青春校园偶像剧《栀子花开2017》。2018年，参演的古装热血剧《夜天子》在腾讯视频播出。
                </div>
              </div>
              : ""
            }

            <div className="detail-line-s-area flex-column">
              <h5 className="area-title">
                播放趋势/微博声量
                <span className="update-time">更新于</span>
              </h5>
              <div className="chart-area detail-line-s">
              </div>
            </div>
            <div className="play-platform-area flex-column">
              <h5 className="area-title">
                播放平台分布
                <span className="update-time">更新于</span>
              </h5>
              <div className="chart-area play-platform-pie">

              </div>
            </div>
            <div className="key-word-cloud-area flex-column">
              <h5 className="area-title">
                关键词云
                <span className="update-time">更新于</span>
              </h5>
              <div className="chart-area key-word-cloud">

              </div>
            </div>
            <div className="key-word-cloud-area flex-column">
              <h5 className="area-title">
                相同类型IP
                <span className="update-time">换一批</span>
              </h5>
              <div className="chart-area key-word-cloud">
                <div className="SameType"></div>
                <div className="SameType"></div>
                <div className="SameType"></div>
                <div className="SameType"></div>
              </div>
            </div>
            {this.state.ipType === "book" ?
              <div>
                <div className="detail-line-s-area flex-column">
                  <h5 className="area-title">
                    全网评分排名/评论趋势
                    <span className="update-time">更新于</span>
                  </h5>
                  <div className="chart-area detail-line-s">
                  </div>
                </div>
                <div className="detail-line-s-area flex-column">
                  <h5 className="area-title">
                    口碑信息
                    <span className="update-time">更新于</span>
                  </h5>
                  <div className="chart-area key-word-cloud">
                  </div>
                </div>
              </div>
              : ""}
            {this.state.ipType === "comic" ?
              <div className="key-word-cloud-area flex-column">
                <h5 className="area-title">
                  粉丝画像
                  <span className="update-time">更新于</span>
                </h5>
                <div className="chart-area key-word-cloud">
                </div>
                <div className="chart-area key-word-cloud">
                </div>
              </div>
              : ""}

            {this.state.ipType === "art" ?
              <div>
                <div className="key-word-cloud-area flex-column">
                  <h5 className="area-title">
                    产品展示
                    <span className="update-time">更新于</span>
                  </h5>
                  <div className="chart-area key-word-cloud">
                    <div className="SameType"></div>
                    <div className="SameType"></div>
                    <div className="SameType"></div>
                    <div className="SameType"></div>
                  </div>
                </div>
                <div className="key-word-cloud-area flex-column">
                  <h5 className="area-title">
                    合作案例
                    <span className="update-time">更新于</span>
                  </h5>
                  <div className="chart-area key-word-cloud">
                    <div className="SameType"></div>
                    <div className="SameType"></div>
                    <div className="SameType"></div>
                    <div className="SameType"></div>
                  </div>
                </div>
                <div className="key-word-cloud-area flex-column">
                  <h5 className="area-title">
                    图文详情
                    <span className="update-time">更新于</span>
                  </h5>
                </div>
              </div>
              : ""
            }

          </div>
          <div className="right-container flex-column align-items-center">
            <div className="widget-tags">
              <h5 className="area-title">IP类型</h5>
              <ul className="ip-type flex-wrap flex-row">
                <li><Link to="">爱情</Link></li>
                <li><Link to="">电视剧</Link></li>
                <li><Link to="">古装</Link></li>
                <li><Link to="">古装</Link></li>
                <li><Link to="">古装</Link></li>
                <li><Link to="">古装</Link></li>
              </ul>
            </div>
            <div className="widget-producer">
              <h5 className="area-title">出品方</h5>
              <div className="widget-list-producer">
                <div className="ip-producer flex-row flex-wrap">
                  <div className="ip-producer-img">
                    <article className="product-list-item">
                      <img src={producer_img} alt=""/>
                      <span>新丽传媒</span>
                    </article>
                  </div>
                  <div className="ip-producer-img">
                    <article className="product-list-item">
                      <img src={producer_img} alt=""/>
                      <span>新丽传媒</span>
                    </article>
                  </div>
                  <div className="ip-producer-img">
                    <article className="product-list-item">
                      <img src={producer_img} alt=""/>
                      <span>新丽传媒</span>
                    </article>
                  </div>
                  <div className="ip-producer-img">
                    <article className="product-list-item">
                      <img src={producer_img} alt=""/>
                      <span>新丽传媒</span>
                    </article>
                  </div>
                  <div className="ip-producer-img">
                    <article className="product-list-item">
                      <img src={producer_img} alt=""/>
                      <span>新丽传媒</span>
                    </article>
                  </div>
                </div>
              </div>
            </div>
            <div className="widget-case">
              <h5 className="area-title">推荐案例</h5>
              <div className="widget-list-case">
                <div className="ip-case">
                  <img src={test} alt=""/>
                  <div className="portal-info-container">
                    <Link to="">
                      <img src={producer_img} alt=""/>
                    </Link>
                    <div className="case-info-container">
                      <div className="case-info-title">
                        <h5>共赴《夏至未至》IP青春盛宴，巴拉巴拉kfc巴拉巴拉kfc</h5>
                      </div>
                      <div className="case-sub-info">
                        <div>
                          <span className="case-post-num">111</span>
                        </div>
                        <div>
                          <span className="case-by-some-one">By IPEC</span>
                          <span className="case-create-date">2019/01/02</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>*/}
        </div>
        <Footer data={footerNav}/>
        {uploadShow &&
        <UploadFileModel title="上传商务合作资料" ipid={id} onClose={() => {
          this.setState({
            uploadShow: false
          });
        }}/>
        }
      </div>
    );
  }
}
