import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/ip_list.scss";
import Header from "@components/header";
import Footer from "@components/footer";
import { IpListItem, IpTypeList } from "@pages/ip_list/components";
import TimeRange from "components/time_range";
import TimeRange1 from "components/time_range_1";

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
  }

  private renderDate = (item) => {
    if (item.ipType === "时间") {
      if (this.state.clear) {
        return (
          <div className="time-picker-area">
            <TimeRange callback={this.timeCallback} callbackT={this.timeCallbackT}/>
          </div>
        );
      } else {
        return (
          <div className="time-picker-area">
            <TimeRange1 callbackT={this.timeCallbackT} callback={this.timeCallback}/>
          </div>
        );
      }
    }
  };

  render() {
    const { ip_list, nav_store } = this.props;
    const { headerNav, footerNav } = nav_store;
    let { customStatus, head_list, ipItemList, ipTypeListData, page: { totalCount } } = ip_list;
    const { subTypeList, typeSecond } = head_list;
    const { selected } = customStatus;
    const subType = subTypeList && subTypeList[selected];
    const { params } = this.props;
    return (
      <div className="ip-list-container flex-column">
        <Header data={headerNav} history={this.props.history} selected={selected} />
        <div className="select-bar-area flex-row align-items-center justify-content-start">
          <div className="select-bar">
            <div className="select-bar-head flex-row">
              {typeSecond && typeSecond.map((item) => {
                return (
                  <span
                    key={item.ipTypeNumber}
                    className={selected === `${item.ipType}` ? "span-active" : ""}
                    onClick={async () => {
                      this.setState({
                        selectedObj: {
                          "地区": "", "类型": {}, "时间": "",
                          "状态": "", "形式": "", "性别": "",
                        }, theAllId: "",
                      });
                      // console.log(this.state.selectedObj)
                      await ip_list.changeStatus({
                        selected: item.ipType, ipTypeSuperiorNumber: item.ipTypeNumber,
                        ipLocation: "",
                        ipTypeNumber: "",
                        ipFormNumber: "",
                        benginShowDate: "",
                        endShowDate: "",
                        ipStatus: "",
                        ipSex: "",
                        currentPage: 1,
                        pageSize: 24,
                      });
                    }}>{item.ipType}</span>);
              })}
            </div>
            {
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
            }
          </div>
        </div>
        <div className="ip-content-list">
          {
            selected === "" && ipItemList && ipItemList.map((item: any) =>
              <IpListItem key={item.ipType} data={item} ip_list={ip_list} selected={selected}/>)}
          {
            (selected !== "" && Number(totalCount) > 0) && (
              <div className="operation-group flex-row">
                <IpTypeList data={ipTypeListData} totalCount={totalCount} pageSize={24} history={this.props.history} />
              </div>
            )
          }
        </div>
        <Footer data={footerNav}/>
      </div>
    );
  }
}
