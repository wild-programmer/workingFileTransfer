import * as React from "react";
import Header from "@components/header";
import { inject, observer } from 'mobx-react';
import Footer from '@components/footer';
import { Link } from 'react-router-dom';
import ip_icon_dou from '@assets/images/ip_icon_dou.png';
import default_img_ip from '@assets/images/default_img_ip.png';
import "assets/scss/ip_search.scss";
import Pagination from '@components/pagination';

// interface IpSearchProps{
//   data: any,
//   totalCount: number,
//   pageSize: number,
// }
interface IpSearchState {
  currentPage: number,
  tabCurrent: number,
}

@inject("nav_store")
@inject("ipSearch")
@observer
export default class IpSearch extends React.Component <IProps, IpSearchState> {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      tabCurrent: 1,
    };
  }

  async componentDidMount() {
    document.title = "IPEC-搜索";
    const { nav_store, ipSearch } = this.props;
    await nav_store.navList();
    const { match: { params } } = this.props;
    const keyword = params['key'];
    await ipSearch.IpSearch({ keyword });
  }

  async componentWillReceiveProps(nextProps) {
    const { ipSearch } = this.props;
    const { match: { params } } = nextProps;
    const keyword = params['key'];
    await ipSearch.IpSearch({ keyword });
  }

  render() {
    const { nav_store, ipSearch } = this.props;
    const { headerNav, footerNav } = nav_store;
    const { searchResult: { ipData, caseData, totalCount, ipCount, caseCount } } = ipSearch;
    const { currentPage, tabCurrent } = this.state;
    return (
      <div>
        <Header history={this.props.history} data={headerNav}/>
        <div className="search-container">
          <p className="total-count">共搜索到 <i>{totalCount}</i> 条相关信息</p>
          <div className="tab-change">
            <ul>
              <li className={`${currentPage === 1 ? "active" : ""}`}
                  onClick={() => {
                    this.setState({ currentPage: 1, tabCurrent: 1 });
                  }}
              >Ip({ipCount})
              </li>
              <li className={`${currentPage === 2 ? "active" : ""}`}
                  onClick={() => {
                    this.setState({ currentPage: 2, tabCurrent: 2 });
                  }}
              >案例({caseCount})
              </li>
            </ul>
          </div>
          <div className="tab-content">
            <div className="tabOne" style={{ display: tabCurrent === 1 ? "inline-block" : "none" }}>
              <div className="content-container flex-column justify-content-center ">
                <div className="ip-t flex-row  flex-wrap   align-items-center">
                  {
                    ipData && ipData.map((item, index) => {
                      return (
                        <div className="ip-type-list-parent" key={index}>
                          <Link to="">
                            <div
                              className="ip-type-list">
                              <div className="ip-type-item">
                                <img src={item.ipPic || default_img_ip} alt="" className="ip-type-img"/>
                              </div>
                              <div className="ip-type-item-text justify-content-around">
                                <div className="item-name">{item.ipName}</div>
                                <div className="item-dou text-right ">
                                  <img src={ip_icon_dou || default_img_ip} alt=""/>
                                  {/*<span></span>*/}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              {
                Number(totalCount) > 20 &&
                (<Pagination data={ipData} pageSize={10} totalCount={totalCount}/>)
              }
            </div>
            <div className="tab-two" style={{ display: tabCurrent === 2 ? "inline-block" : "none" }}>
              <div className="content-container flex-column justify-content-center ">
                <div className="ip-t flex-row  flex-wrap   align-items-center">
                  {
                    caseData && caseData.map((item, index) => {
                      return (
                        <div className="ip-type-list-parent" key={index}>
                          <Link to="">
                            <div
                              className="ip-type-list">
                              <div className="ip-type-item">
                                <img src={item.ipPic || default_img_ip} alt="" className="ip-type-img"/>
                              </div>
                              <div className="ip-type-item-text justify-content-around">
                                <div className="item-name">{item.ipName}</div>
                                <div className="item-dou text-right ">
                                  <img src={ip_icon_dou || default_img_ip} alt=""/>
                                  {/*<span></span>*/}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              {
                Number(totalCount) > 20 &&
                (<Pagination data={ipData} pageSize={10} totalCount={totalCount}/>)
              }
            </div>
          </div>
        </div>
        <Footer data={footerNav}/>
      </div>
    );
  }
}
