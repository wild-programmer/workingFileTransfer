import * as React from "react";
import ip_icon_dou from "@assets/images/ip_icon_dou.png";
import default_img_ip from "@assets/images/default_img_ip.png";
import add_ip from "@assets/images/add.svg";
import add_cart from "@assets/images/add_cart.svg";
import renzheng from "@assets/images/renzheng.png";
import { Link } from "react-router-dom";
import Pagination from "@components/pagination";
import ScrollTop from "@components/scrollTop";

import _ from 'lodash';
import test from '../ip_type_list_render';

interface IpTypeListProps {
  data: any,
  totalCount: number,
  pageSize: number,
  history?: any,
}

interface IpTypeListState {
  current: any,
  special: boolean,
}

export default class IpTypeList extends React.Component<IpTypeListProps, IpTypeListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: "",
      special: false
    };
  }

  _start(item: any) {
    const doRender = test[item.ipTypeSuperiorNumber];
    return _.isFunction(doRender) && doRender(item);
  }

  render() {
    const { data, totalCount } = this.props;
    return (
      <div>
        <div className="content-container flex-column justify-content-center ">
          <div className="top-div justify-content-between ">
            <div className="search-result">查询结果: <p>搜索到<i>{totalCount}</i>条内容</p></div>
            {/*<div className="button-group flex ">*/}
              {/*<div className="add-ip-button  "><img src={add_ip} alt=""/>添加新的ip</div>*/}
              {/*<div className="queue_download " onClick={() => {*/}
                {/*this.props.history.push("/download");*/}
              {/*}}>*/}
                {/*<img src={add_cart} alt=""/>批量下载队列*/}
                {/*<div className="queue_download_list">+0</div>*/}
              {/*</div>*/}
            {/*</div>*/}
          </div>
          <div className="ip-t flex-row  flex-wrap   align-items-center">
            {
              data && data.map((item, index) => {
                return (
                  <div key={index} className="ip-type-list-parent">
                    <Link to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipGuid}`}>
                      <div
                        className={`ip-type-list  ${this.state.current === index ? 'hover-class' : ''}  ${this.state.special ? 'hover-class-special' : ''}`}
                        onMouseEnter={
                          (e) => {
                            this.setState({
                              current: index
                            });
                            let clientWidth = document.documentElement.clientWidth;

                            if (clientWidth - e.screenX < 450) {
                              this.setState({
                                special: true
                              });
                            }
                          }
                        }
                        onMouseLeave={
                          () => {
                            this.setState({
                              current: "",
                              special: false
                            });
                          }
                        }>
                        <div className="ip-type-item">
                          <img src={item.ipPicUrl} alt="" className="ip-type-img"/>
                        </div>
                        {item.ipIsAuthenticated === 3 && <img className="certification" src={renzheng}></img>}
                        <div className="ip-type-item-text justify-content-around">
                          <div className="item-name">{item.ipName}</div>
                          <div className="item-dou text-right ">
                            {/* <img src={ip_icon_dou || default_img_ip} alt=""/> */}
                            {/*<span></span>*/}
                          </div>
                        </div>
                        <div className="hover-show ">
                        {item.ipIsAuthenticated === 3 && <img className="hover-certification" src={renzheng}></img>}
                          <div className="hover-content">
                            <div className="left-content">
                              <div className="hover-type-name name">{item.ipName}</div>
                              {this._start(item)}
                              {/* <div className="hover-type">
                                {
                                  item.ipTypeNumberNames && item.ipTypeNumberNames.map((i, k) => {
                                    return (
                                      <span key={k}>{i}</span>
                                    );
                                  })
                                }
                              </div> */}
                            </div>
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
          (<Pagination/>)
        }
        
      </div>
    )
      ;
  }
}
