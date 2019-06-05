import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";
import { inject, observer } from "mobx-react";
import "@assets/scss/ip-research.scss";
import default_img from "@assets/images/default_img_ip.png";
import moment from "moment";
import { Link } from 'react-router-dom';
import { hotWords } from '@utils/api';
import Alert from '@components/alert';
import ic_default_page from "@assets/images/ip_detail/ic_default_page.png";

interface IIndustryState {
  selectedObj: object,
  currentPage: number,
  show: boolean,
  isLogin: boolean,
  message: string,
  current: number,
  tabCurrent: number,
}

@inject("nav_store")
@inject("industry")
@inject("industry_detail")
@observer
export default class Contact extends React.Component<IProps, IIndustryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedObj: {
        ipType: "",
        industrys: "",
        hotWords: "",
      },
      currentPage: 1,
      show: false,
      isLogin: true,
      message: "",
      current: 0,
      tabCurrent: 1,
    };
  };

  async componentDidMount() {
    document.title = "版圈儿-行业观察";
    const { nav_store, industry } = this.props;
    await nav_store.navList();
    await industry.firstOrders();
    await industry.industry();
    const params = { hotWordsType: 2 };
    await industry.getHotWords(params);
    if (sessionStorage.getItem("user") !== null) {
      this.setState({
        isLogin: false,
      });
      const { userGuid } = JSON.parse(sessionStorage.getItem('user'));
      await industry.setStatus({ userGuid });
    } else {
      this.setState({
        isLogin: true
      });
    }
    await industry.industryCase();
  }

  async setLike(item) {
    // this.setState({
    //   current: isLike
    // });
    let param;
    if (sessionStorage.getItem("user") !== null) {
      const { userGuid } = JSON.parse(sessionStorage.getItem('user'));
      param = {
        portalPostGuid: item.portalPostGuid, userGuid,
      };
    } else {
      this.setState({ message: "您还未登陆", show: true });
    }
    let isSuccess = await this.props.industry_detail.setLike(param);
    if (isSuccess.request) {
    } else {
      this.setState({ message: isSuccess.result, show: true });
    }
  }

  tabSet(num) {
    this.setState({ tabCurrent: num });
  }

  render() {
    const { nav_store, industry } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { firstOrderList, industryList, industryTotalPage, industryCaseList, hotWords } = industry;
    let { selectedObj, currentPage, show, message, tabCurrent } = this.state;
    return (
      <div className="bg-color">
        <Header data={headerNav} history={this.props.history}/>
        <div className="ip-research">
          <div className="type-of" style={{ paddingBottom: tabCurrent === 1 ? "0.08rem" : "0" }}>
            < div className="type-tab" style={{ borderBottom: tabCurrent === 1 ? "2px solid #ced4da" : "" }}>
            <span className={tabCurrent === 1 ? "active" : ""} onClick={() => {
              this.tabSet(1);
            }}>行业案例</span>
              <span className={tabCurrent === 2 ? "active" : ""} onClick={() => {
                this.tabSet(2);
              }}>行业动态</span>
              <span className={tabCurrent === 3 ? "active" : ""} onClick={() => {
                this.tabSet(3);
              }}>人物专访</span>
            </div>
          </div>
          {
            tabCurrent === 1 &&
            <div>
              <div className="type-of">
                <div className="type-list">
                  <span className="type-name">IP&nbsp; 类&nbsp;&nbsp; 型:</span>
                  <ul className="type-ul">
                    {
                      firstOrderList && firstOrderList.map((item, index) => {
                        return (
                          <li key={index}
                              className={`${item.ipTypeGuid}` === selectedObj['ipType'] ? "active" : ""}
                              onClick={async () => {
                                const ipTypeSuperiorNumber = item.ipTypeNumber;
                                const currentPage = 1;
                                let ipType = item.ipTypeGuid;
                                this.setState({
                                  selectedObj: { ...selectedObj, ipType },
                                  currentPage: 1,
                                }, () => {
                                  console.log(this.state.selectedObj);
                                });
                                await industry.setStatus({ ipTypeSuperiorNumber, currentPage });
                                await industry.industryCase();
                              }}>{item.ipType}</li>
                        );
                      })
                    }
                  </ul>
                </div>
                <div className="type-list">
                  <span className="type-name">行业分类:</span>
                  <ul className="type-ul">
                    {
                      industryList && industryList.map((item, index) => {
                        return (
                          <li key={index}
                              className={`${item.portalCategoryGuid}` === selectedObj['industrys'] ? "active" : ""}
                              onClick={async () => {
                                const portalCategoryGuid = item.portalCategoryGuid;
                                const currentPage = 1;
                                this.setState({
                                  selectedObj: { ...selectedObj, industrys: portalCategoryGuid }
                                });
                                await industry.setStatus({ portalCategoryGuid, currentPage });
                                await industry.industryCase();
                              }}>{item.portalCategoryName}</li>
                        );
                      })
                    }
                  </ul>
                </div>
                <div className="type-list">
                  <span className="type-name">热&nbsp; 门&nbsp; 词:</span>
                  <ul className="type-ul">
                    {
                      hotWords && hotWords.map((item, index) => {
                        return (
                          <li key={index}
                              className={`${item.hotWords}` === selectedObj['hotWords'] ? "active" : ""}
                              onClick={async () => {
                                let hotWords = item.hotWords;
                                const currentPage = 1;
                                this.setState({
                                  selectedObj: { ...selectedObj, hotWords },
                                  currentPage: 1,
                                });
                                await industry.setStatus({ hotWords, currentPage });
                                await industry.industryCase();
                              }}>{item.hotWords}</li>
                        );
                      })
                    }
                  </ul>
                </div>
              </div>
              <div className="case-list-container">
                <div className="case-list">
                  {
                    industryCaseList && industryCaseList.map((item, index) => {
                      return (
                        <div className="case-introduce" key={index}>
                          <Link className="case-top" to={`/industry_detail/${item.portalPostGuid}`}>
                            <img src={item.picUrl || default_img} alt=""/>
                          </Link>
                          <div className="case-bottom">
                            <div className="case-img">
                              <img src={item.ipidPicUrl || default_img} alt=""/>
                            </div>
                            <div className="case-word">
                              <div className="title">{item.postTitle}</div>
                              <div className="bottom-title">
                            <span
                              className={`count attention_num icon iconfont iconic_praise ${item.isGiveLike === 1 ? 'active' : ''}`}
                              onClick={async () => {
                                await this.setLike(item);
                                await industry.industryCase();
                              }}
                            >{item.portalPostLikeCount}</span>
                                <span className="span-one">{item.postSource}</span>
                                {item.createData &&
                                <span className="span-two">{moment(item.createDate).format("YYYY-MM-DD")}</span>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
                {
                  currentPage < Number(industryTotalPage) &&
                  <div className="loading-more"
                       onClick={async () => {
                         this.setState({
                           currentPage: currentPage + 1,
                         });
                         await industry.setStatus({ currentPage: currentPage + 1 });
                         await industry.industryCase();
                       }}>点击加载更多
                  </div>
                }
              </div>
            </div>
          }
          {
            tabCurrent === 2 &&
            <div className="no-result">
              <img src={ic_default_page} alt=""/>
              <p>此模块正披星戴月开发中， 敬请期待！</p>
            </div>
          }
          {
            tabCurrent === 3 &&
            <div className="no-result">
              <img src={ic_default_page} alt=""/>
              <p>此模块正披星戴月开发中， 敬请期待！</p>
            </div>
          }
        </div>
        <Footer data={footerNav}/>
        {show && this.state.isLogin === true && <Alert message={message}
                                                       onClose={() => {
                                                         this.setState({ show: false });
                                                       }}
                                                       onSubmit={() => {
                                                         this.props.history.push('/login');
                                                       }}
        />
        }
        {show && this.state.isLogin === false && <Alert message={message}
                                                        onClose={() => {
                                                          this.setState({ show: false });
                                                        }}
                                                        onSubmit={() => {
                                                          this.setState({ show: false });
                                                        }}
        />
        }
      </div>
    );
  }
}
