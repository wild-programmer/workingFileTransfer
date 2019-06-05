import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/company.scss";
import Header from "@components/header";
import { toJS } from "mobx";
import Footer from '@components/footer';
import default_img from "@assets/images/default_img_ip.png";
import _isEmpty from "lodash/isEmpty";
import { Link } from 'react-router-dom';

interface ICompanyState {
  user: any
}

const companySizeKV = {
  // 1,1-20人；2,21-50人；3,51-100人；4,101-500人 ；5,500人以上 ,
};
const companyTypeKV = {
  1: "出品公司",
  2: "发行公司",
  3: "代理方",
  4: "出版社",
  5: "投资公司",
  6: "宣发公司",
  7: "版权方",
  8: "品牌方",
  9: "授权方",
  10: "零售商",
  11: "服务商"
};
@inject("nav_store")
@inject("company")
@observer
export default class Company extends React.Component<IProps, ICompanyState> {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(sessionStorage.getItem('user')),
    };
  }

  async componentDidMount() {
    const { nav_store, company } = this.props;
    await nav_store.navList();
    const { companyGuid } = this.state.user;
    // let companyGuid = "55d453f3-579a-48a6-906f-f1ab21d21a30";

    if (!!companyGuid) {
      await company.getCompany({ companyGuid });
      await company.getCompanyIp({ companyGuid });

    }
  }

  render() {
    let { nav_store, company } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { companyData: item, companyIpData } = toJS(company);
    return (
      <div className="body contact-container">
        <Header data={toJS(headerNav)} style={{ backgroundColor: "#fff" }} history={this.props.history}/>
        <div className="company-container">
          <div className="company-content">
            {!!item && <div>
              <div className="company-basic">
                <img src={item.picUrl || default_img} alt="" className="company-img"/>
                <div className="company-msg">
                  <p className="company-title">{item.companyName}</p>
                  <p>公司性质：{companyTypeKV[Number(item.companyType)]}</p>
                  <p>联系电话：{item.companyTelephone}</p>
                  <p>公司邮箱：{item.companyMailbox}</p>
                  <p>公司地址：{item.companyAddress}</p>
                </div>
              </div>
              < div className="company-introduce">
                <h6>公司介绍</h6>
                <div className="p-container">
                  <p className="line">成立时间：{item.companyDate}</p>
                  <p className="line">所属行业：{item.companyIndustry}</p>
                  {/*<p className="line">企业规模：{item.companySize}</p>*/}
                  <p className="line">总部地址：{item.companyAddress}</p>
                  <p className="company-detail">{item.companyDesc}</p>
                </div>
              </div>
            </div>
            }
            <div className="company-ip">
              <div className="tab-title">
                <ul className="list-style">
                  <li className="active">拥有IP</li>
                  <li>授权IP产品</li>
                  <li>被授权IP产品</li>
                  <li>案例</li>
                </ul>
              </div>
              <div className="tab-content">
                <div className="child-content">
                  {
                    companyIpData && companyIpData.map((item, index) => {
                      return (
                        <div className="ip-list" key={index}>
                          <p className="list-title">{item.ipTypeSuperiorNumberName}_ {item.count} 部</p>
                          {item.list && item.list.map((i, k) => {
                            return (
                              <div className="ip-box" key={k}>
                                <Link to={`/{i.ipTypeSuperiorNumber}/{i.ipid}`}>
                                  <img src={i.picUrl || default_img} alt=""/>
                                  <span className="word-ellipsis">{item.ipName}</span>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer data={toJS(footerNav)}/>
      </div>
    );
  }
}
