import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/ip_list.scss";
import Header from "@components/header";
import Footer from "@components/footer";
import { IpListItem, IpTypeList } from "@pages/ip_list/components";
import TimeRange from "components/time_range";
import TimeRange1 from "components/time_range_1";
import { toJS } from 'mobx';
import ScrollTop from "@components/scrollTop";
import {
  getContact, setContact, deletContact
} from "@utils/util";

import moment from "moment";

const type_k_v = {
  "地区": "ipLocation",
  "类型": "ipTypeNumber",
  "性别": "ipSex",
  "状态": "ipStatus",
  "形式": "ipFormNumber",
};

const time_k_v = {
  
  "全部": () => ({}),
  "当年": () => {
    let now = moment();
    let format = "YYYY-MM-DD";
    return {
      benginShowDate: now.startOf("year").format(format),
      endShowDate: now.endOf("year").format(format),
    };
  },
  "当月": () => {
    let now = moment();
    let format = "YYYY-MM-DD";
    return {
      benginShowDate: now.startOf("month").format(format),
      endShowDate: now.endOf("month").format(format),
    };
  },
};

interface IListState {
  selectedObj: object;
  theAllId: "";
  contastList:object;
  clear: boolean;
  all: Boolean;
}

@inject("ip_list")
@inject("nav_store")

@observer
export default class IpList extends React.Component<IProps, IListState> {

  constructor(props: any) {
    super(props);

    this.state = {
      clear: false,
      contastList: JSON.parse(localStorage.getItem('contastList')),
      selectedObj: {
        "地区": "",
        "类型": {},
        "时间": "",
        "状态": "",
        "形式": "",
        "性别": "",
      },
      theAllId: "",
      all: false,
    };
  }

  private timeCallback = async (o?: any) => {
    if (o) {
      const { date = "" } = o;
      const benginShowDate = moment(date).startOf("month").format("YYYY-MM-DD");
      await this.props.ip_list.changeStatus({ benginShowDate });
    }
  };

  private timeCallbackT = async (o?: any) => {
    if (o) {
      const { date = "" } = o;
      const endShowDate = moment(date).endOf("month").format("YYYY-MM-DD");
      await this.props.ip_list.changeStatus({ endShowDate });
    }
  };
  async setselected(item) {
    const { ip_list } = this.props;
    let { selectedchild } = ip_list;
    for (let key in item) {
      item[key] == selectedchild[key] ? item[key] = '' : '';
    }
    await ip_list.setSelectedchild(item);
  }
  async _chekedType(item) {
    const { ip_list } = this.props;
    const { customStatus, selectedchild } = ip_list;
    const { nav_number } = selectedchild;
    for (let key in item) {
      item[key] == customStatus[key] ? item[key] = null : '';
      if (key == 'ipTypeSuperiorNumbers' && item[key] == null) {
        item[key] = nav_number;
      }
    }
    await ip_list.changeStatus(item);
  }
  async _selectSubType(sub, item) {
    const { ip_list } = this.props;
    let { selectedObj, theAllId } = this.state;
    let params = {};
    if (typeof selectedObj[item.ipType] === "object") {
      let choose = !(selectedObj[item.ipType][sub.ipTypeGuid]);
      if (sub.ipType === "全部") {
        selectedObj = {
          ...selectedObj,
          [item.ipType]: { [sub.ipTypeGuid]: choose, }
        };
        theAllId = sub.ipTypeGuid;
      } else {
        selectedObj = {
          ...selectedObj,
          [item.ipType]: {
            ...selectedObj[item.ipType],
            [theAllId]: false,
            [sub.ipTypeGuid]: choose,
          },
        };
      }
      if (!!sub.ipTypeNumber) {
        if (choose) {
          let type = !!ip_list.customStatus.ipTypeNumber ?
            `${ip_list.customStatus.ipTypeNumber},${sub.ipTypeNumber}` :
            `,${sub.ipTypeNumber}`;
          params = { [type_k_v[item.ipType]]: type, currentPage: 1 };
        } else {
          let type = ip_list.customStatus.ipTypeNumber.replace(`,${sub.ipTypeNumber}`, "");
          params = { [type_k_v[item.ipType]]: type, currentPage: 1 };
        }
      } else {
        params = { [type_k_v[item.ipType]]: "", currentPage: 1 };
      }
    } else {
      if (item.ipType === "时间") {
        let current = time_k_v[sub.ipType]();
        params = { ...current, currentPage: 1 };
        if (sub.ipType === "全部" || sub.ipType === "当年" || sub.ipType === "当月") {
          await this.timeCallbackT();
          await this.timeCallback();
          this.setState({ clear: !this.state.clear });
        }
      } else {
        params = { [type_k_v[item.ipType]]: (!!sub.ipTypeNumber ? sub.ipTypeNumber : ""), currentPage: 1 };
      }
      selectedObj = {
        ...selectedObj, [item.ipType]: sub.ipTypeGuid
      };
    }
    this.setState({ selectedObj, theAllId });
    await ip_list.changeStatus(params);
  }

  async componentDidMount() {
    document.title = "IP 列表";
    const { ip_list, nav_store } = this.props;
    await nav_store.navList();
    await ip_list.ipTypeList();
    await ip_list.ipList();
    await ip_list.getlistMainType();
  }

  getFullYear(str: string) {
    var date = new Date;
    return date.getFullYear() + Number(str);
  }


  private deletContast = (ipids) => {
    deletContact(ipids)
    this.setState({ contastList: JSON.parse(localStorage.getItem('contastList')) });
  };

  private renderDate = () => {
    if (this.state.clear) {
      return (
        <div className="time-picker-area">
          <TimeRange callback={this.timeCallback} callbackT={this.timeCallbackT} />
        </div>
      );
    } else {
      return (
        <div className="time-picker-area">
          <TimeRange1 callbackT={this.timeCallbackT} callback={this.timeCallback} />
        </div>
      );
    }
  };

  render() {
    const { ip_list, nav_store } = this.props;
    const { headerNav, footerNav } = nav_store;
    let { customStatus, head_list, head_list_top, selectedchild, listCountry, ipItemList, ipTypeListData, page: { totalCount } } = ip_list;
    const { subTypeList, typeSecond } = head_list;
    const { subTypeList_top, typeSecond_top } = head_list_top;
    const { selected } = customStatus;
    const { nav, country, case_, slectTime } = selectedchild;
    const subType_top = subTypeList_top && subTypeList_top[selected];
    const subType_child = subTypeList && subTypeList[nav];
    console.log("subType_top_____@:")
    console.log(subType_top)
    const { params } = this.props;
    return (
      <div className="ip-list-container flex-column">
        <Header data={headerNav} history={this.props.history} selected={selected} />
        <div className="select-bar-area flex-row align-items-center justify-content-start">
          <div className="select-bar">
            <div className="select-bar-head flex-row">
              {typeSecond_top && typeSecond_top.map((item, index) => {
                return (
                  <span
                    key={item.ipTypeNumber + index}
                    className={selected === `${item.ipType}` ? "span-active" : ""}
                    onClick={async () => {
                      await this.setselected(
                        { nav: '', case_: '', country: '', }
                      )
                     
                      this.setState({
                        selectedObj: {
                          "地区": "", "类型": {}, "时间": "",
                          "状态": "", "形式": "", "性别": "",
                        }, theAllId: "",
                      });
                      let _ipTypeSuperiorNumbers = '',
                        _ipType = '';
                      subTypeList_top && subTypeList_top[item.ipType] && subTypeList_top[item.ipType].map((item: any, index) => {
                        _ipTypeSuperiorNumbers += `${item.ipTypeNumber},` //? 
                        index <= 1 ? _ipType = item.ipType : _ipType = '';
                      })

                      this.setselected({ nav: _ipType, show: _ipType == '' ? true : false })
                      this.setselected({ nav_number: _ipTypeSuperiorNumbers })
                      await ip_list.changeStatus(
                        {
                          selected: item.ipType,
                          ipTypeSuperiorNumbers: _ipTypeSuperiorNumbers,
                          ipTypeNumber: "",
                          ipFormNumber: "", benginShowDate: "", endShowDate: "",
                          ipStatus: "", ipSex: "", countryType: "",
                          ipIsAuthenticated: null,
                          currentPage: 1,
                          pageSize: 24,
                        });
                    }}>
                    {item.ipType}</span>);
              })}
            </div>
            {
              !!selected && (
                <div className="select-bar-operation">
                  <div className="operation-type flex-fill">
                    <div className="classify-type-item">状态:</div>
                    <div className="sub-type-item flex-row flex-wrap align-items-center">

                      <span className={case_ === '' ? "ip-category-item span-selected" : "ip-category-item"} onClick={() => {
                        this.setselected({ case_: '' })
                      }
                      }>全部</span>
                      <span className={case_ === 3 ? "ip-category-item span-selected" : "ip-category-item "} onClick={() => {
                        this.setselected({ case_: 3 })
                        this._chekedType({ ipIsAuthenticated: 3 })
                      }
                      } >已认证</span>
                      <span className={case_ === 1 ? "ip-category-item span-selected" : "ip-category-item "} onClick={() => {
                        this.setselected({ case_: 1 })
                        this._chekedType({ ipIsAuthenticated: 1 })
                      }
                      } >未认证</span>
                    </div>
                  </div>
                  <div className="operation-type flex-fill">
                    {subType_top && selectedchild.show && <div className="classify-type-item">类别:</div>}
                    {selectedchild.show && <div className="sub-type-item flex-row flex-wrap align-items-center">
                      {!!subType_top && subType_top.map((item: any, index) => {
                        let active = item.ipType == selectedchild.nav ? "span-selected" : "";
                        return (
                          <span
                            key={item.ipTypeGuid + index}
                            className={`ip-category-item  ${active}`}
                            onClick={() => {
                              this.setselected({ nav: item.ipType })
                              this._chekedType({ ipTypeSuperiorNumbers: `${item.ipTypeNumber},` })
                            }}>
                            {item.ipType}
                          </span>
                        );
                      })
                      }
                    </div>
                    }

                  </div>
                  {
                    !!selectedchild.nav && (
                      <div>
                        {!!subType_child && subType_child.map((item: any, index) => {
                          const { sublist, ipTypeGuid }: { sublist: any[], ipTypeGuid: string } = item;
                          return (
                            <div key={ipTypeGuid + index} className="operation-type flex-fill">
                              <div className="classify-type-item">{item.ipType}:</div>
                              <div className="sub-type-item flex-row flex-wrap align-items-center">
                                {!!sublist && sublist.map((sub) => {
                                  const tmp = this.state.selectedObj[item.ipType];
                                  var _tmp = Object.keys(tmp);
                                  let active = "";
                                  if (typeof tmp === "string" && !!tmp) {
                                    active = tmp === sub.ipTypeGuid ? "span-selected" : "";
                                  } else if (sub.ipType === "全部" && _tmp.length === 0) {
                                    active = "span-selected";
                                  } else {
                                    active = tmp[sub.ipTypeGuid] ? "span-selected" : "";
                                  }
                                  if (sub.ipType === "全部") {
                                    // active = "span-selected" ;
                                  }
                                  return (
                                    <span
                                      key={sub.ipTypeGuid}
                                      className={`ip-category-item ${active} `}
                                      onClick={async () => await this._selectSubType(sub, item)}>
                                      {sub.ipType}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                        }
                      </div>
                    )
                  }
                  <div className="operation-type flex-fill">
                    {listCountry && listCountry.lenght !== 0 && <div className="classify-type-item">国别:</div>}
                    <div className="sub-type-item flex-row flex-wrap align-items-center">
                      {!!listCountry && listCountry.map((item: any, index) => {
                        let active = country == item.resourceValue ? "span-selected" : "";
                        return (
                          <span
                            key={item.createUserGuid + index}
                            className={`ip-category-item ${active} `}
                            onClick={() => {
                              this.setselected({ country: item.resourceValue })
                              this._chekedType({ countryType: '' + item.resourceKey })
                            }
                            } >
                            {item.resourceValue}
                          </span>
                        );
                      })
                      }
                    </div>
                  </div>
                  {
                    selected && selected == '影视娱乐' && <div className="operation-type flex-fill">
                      <div className="classify-type-item">时间:</div>
                      <div className="sub-type-item flex-row flex-wrap align-items-center">
                        <span className={slectTime === '' ? "ip-category-item span-selected" : "ip-category-item "}
                          onClick={
                            () => {
                              this.setselected({ slectTime: '' })
                              async () => await this._chekedType({ benginShowDate: '', endShowDate: '' })
                            }
                          }>全部 </span>
                        <span className={slectTime === this.getFullYear('+1') ? "ip-category-item span-selected" : "ip-category-item "}
                          onClick={
                            () => {
                              this.setselected({ slectTime: this.getFullYear('+1') })
                              this._chekedType({ benginShowDate: this.getFullYear('+1') + '-01-01', endShowDate: this.getFullYear('+1') + '-12-31' })
                            }
                          }>
                          {this.getFullYear('+1')}</span>

                        <span className={slectTime === this.getFullYear('') ? "ip-category-item span-selected" : "ip-category-item "}
                          onClick={
                            () => {
                              this.setselected({ slectTime: this.getFullYear('') })
                              this._chekedType({ benginShowDate: this.getFullYear('') + '-01-01', endShowDate: this.getFullYear('') + '-12-31' })
                            }
                          }>
                          {this.getFullYear('')}</span>
                        <span className={slectTime === this.getFullYear('-1') ? "ip-category-item span-selected" : "ip-category-item "}
                          onClick={
                            () => {
                              this.setselected({ slectTime: this.getFullYear('-1') })
                              this._chekedType({ benginShowDate: this.getFullYear('-1') + '-01-11', endShowDate: this.getFullYear('-1') + '-12-31' })
                            }

                          }>
                          {this.getFullYear('-1')}</span>
                        {this.renderDate()}
                      </div>
                    </div>
                  }

                </div>
              )
            }

            {/* {
              !!selected && (
                <div className="select-bar-operation">
                  {!!subType && subType.map((item: any) => {
                    const { sublist, ipTypeGuid }: { sublist: any[], ipTypeGuid: string } = item;
                    return (
                      <div key={ipTypeGuid} className="operation-type flex-fill">
                        <div className="classify-type-item">{item.ipType}:</div>
                        <div className="sub-type-item flex-row flex-wrap align-items-center">
                          {!!sublist && sublist.map((sub) => {
                            const tmp = this.state.selectedObj[item.ipType];
                            let active = "";
                            if (typeof tmp === "string" && !!tmp) {
                              active = tmp === sub.ipTypeGuid ? "span-selected" : "";
                            } else {
                              active = tmp[sub.ipTypeGuid] ? "span-selected" : "";
                            }
                            if (sub.ipType === "全部") {

                              // ${sub.ipType === "全部" ? "span-selected" : ""}
                            }
                            return (
                              <span
                                key={sub.ipTypeGuid}
                                className={`ip-category-item ${active} `}
                                onClick={async () => await this._selectSubType(sub, item)}>
                                {sub.ipType}
                              </span>
                            );
                          })}
                          {this.renderDate(item)}
                        </div>
                      </div>
                    );
                  })
                  }
                </div>
              )
            } */}
          </div>
        </div>
        <div className="ip-content-list">
          {
            selected === "" && ipItemList && ipItemList.map((item: any) =>{
              let arr = toJS(item.sublist);
              return arr.length >0 && <IpListItem key={item.ipType} data={item} ip_list={ip_list} selected={selected} />
            })
          }
          {
            (selected !== "" && Number(totalCount) > 0) && (
              <div className="operation-group flex-row">
                <IpTypeList data={ipTypeListData} totalCount={totalCount} pageSize={24} history={this.props.history} />
              </div>
            )
          }
        </div>
        <Footer data={footerNav} />
        <ScrollTop contrast={true} data={this.state.contastList} deletContast={this.deletContast} /> 
      </div>
    );
  }
}
