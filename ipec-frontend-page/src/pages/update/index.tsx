import * as React from "react";
import "@assets/scss/update.scss";
import "@assets/scss/model.scss";
import Header from "@components/header";
import Footer from "@components/footer";
import default_img from "@assets/images/default_img_item.png";
import _find from "lodash/find";
import _isEmpty from 'lodash/isEmpty';
import {
  Cultural,
  Movie,
  TVSeries,
  Variety,
  Cartoon,
  Comic,
  Avatar,
  Book,
  People,
  Fiction
} from "@pages/update/components";
import { inject, observer } from "mobx-react";
import { createIp, EditIp, savePic, EditIpCheckStatus } from "@utils/api";
import Alert from '@components/alert';
import UploadFileModel from "@components/upload_file_model";
import _isObject from "lodash/isObject";
import _isArray from "lodash/isArray";
import moment from 'moment';
import { toJS } from "mobx";
import { number } from 'prop-types';

interface IUpdateState {
  pub: {
    ipName: string,
    ipTypeSuperiorNumber: string,
    ipTypeNumber: any[],
    ipLocation: string,
    ipDesc: string,
    ipFormNumber: string,
    ipPicGuid: string,
  };
  sub: {};
  show: boolean;
  message: string;
  uploadShow: boolean;
  pic_img: string;
  result: string;
  ipid: number;
  addIpState: boolean;
  remark: Array<any>;
  data: object;

}

// 组件名
const componentKeyValues = {
  "电影": Movie,
  "电视剧": TVSeries,
  "综艺": Variety,
  "动画": Cartoon,
  "漫画": Comic,
  "IP形象": Avatar,
  "文创艺术": Cultural,
  "图书": Book,
  "明星艺人": People,
  "网文": Fiction,
};
// 接口名
const nameKeyValues = {
  "电影": "movie",
  "电视剧": "tvserial",
  "综艺": "variety",
  "动画": "cartoon",
  "漫画": "comic",
  "IP形象": "avatar",
  "文创艺术": "cultural",
  "图书": "book",
  "明星艺人": "people",
  "网文": "fiction",
};
const remark_k_v = {
  "ipName": "IP名称",
  "ipTypeNumber": "IP二级类型",
  "ipLocation": "国家地区",
  "ipDesc": "IP简介",
  "ipFormNumber": "形式",
  "ipPicGuid": "封面海报",
  "owner": "版权方",
  "prodect": "产品展示",
  "cooperationCase": "案列展示",
  "sex": "性别",
  "height": "身高",
  "brokerageFirmGuid": "经纪公司",
  "graduateSchool": "毕业院校",
  "achievement": "主要成就",
  "detail": "图文详情",
};

@inject("nav_store")
@inject("update")
@observer
export default class Update extends React.Component<IProps, IUpdateState> {

  constructor(props) {
    super(props);
    this.state = {
      pub: {
        ipName: "",
        ipTypeSuperiorNumber: '',
        ipLocation: '',
        ipTypeNumber: [],
        ipDesc: "",
        ipFormNumber: '',
        ipPicGuid: ''
      },
      sub: {},
      show: false,
      message: "",
      uploadShow: false,
      pic_img: "",
      result: "",
      ipid: 0,
      addIpState: false,
      remark: [],
      data: {},
    };

  }

  //
  // componentWillMount(): void {
  //   let { ipTypeNumber }: any = this.props.match.params;
  //   const { pub } = this.state;
  //   this.setState({
  //     pub: {
  //       ...pub,
  //       ipTypeSuperiorNumber: ipTypeNumber
  //     }
  //   });
  // }

  async componentDidMount() {
    const { update, nav_store } = this.props;
    await nav_store.navList();
    await update.ipTypeList();
    let { id, ipTypeNumber }: any = this.props.match.params;
    const params = { ipid: parseInt(id), ipTypeNumber: parseInt(ipTypeNumber) };

    if (id) {
      /**
       * 基本信息获取 getUpdateDetail
       */
      await update.getUpdateDetail(params);
      await update.getDownload({ ipid: id });
      const tmp = toJS(update.updateList);
      if (!_isEmpty(tmp)) {
        const type_array = this._processSubType(tmp.ipTypeNumber);
        const location = tmp.ipLocation;
        let ipFormNumber;
        if (tmp.ipFormNumber !== "") {
          ipFormNumber = tmp.ipFormNumber;
        }
        // const ipLocation = location_array.join(',');
        let pub = {
          ...this.state.pub,
          ipTypeNumber: type_array,
          ipLocation: location,
          ipFormNumber,
          ipTypeSuperiorNumber: ipTypeNumber
        };
        let sub = {
          ...this.state.sub
        };
        this.setState({ pub, sub });
      }
    } else {
      const { userGuid } = JSON.parse(sessionStorage.getItem("user"));
      await update.setStatus({ userGuid });
    }
  }

  private process(list: any[]) {
    let { pub: { ipTypeSuperiorNumber } } = this.state;
    if (list && ipTypeSuperiorNumber) {
      let tmp = _find(list, o => !!o[ipTypeSuperiorNumber]);
      return tmp && tmp[ipTypeSuperiorNumber];
    }
  }

  private processKV(typeList: any, types: object) {
    let tmp = {};
    if (!!typeList) {
      typeList.forEach((item: any) => {
        tmp[item.ipTypeNumber] = types[item.type];
      });
    }
    return tmp;
  }

  private callback = (params: any) => {
    this.setState({ sub: { ...this.state.sub, ...params } });
  };

  // async callback(params: any) {
  //   const { update } = this.props;
  //   await update.setStatus(...update.updateList, ...params);
  // };

  /**
   * 将大于零的对象值转成数组
   * @param o
   * @return number[]
   */

  private values = (o: object) => Object.keys(o).map(k => {
    if (Number(o[k]) > 0) {
      return o[k];
    }
  });

  /**
   * 添加编辑ip参数
   */
  private parseParams = () => {
    const { pub, sub }: any = this.state;
    const {
      ipTypeNumber: selected,
      ipLocation: ip_location,
      ipFormNumber: ip_form_number,
      ipTypeSuperiorNumber: ip_type_superior_number
    } = pub;
    const ipTypeSuperiorNumber = ip_type_superior_number;
    const ipTypeNumber = (this.values(selected)).join(",");
    const ipLocation = ip_location;
    const ipFormNumber = ip_form_number;

    return { ...pub, ...sub, ...{ ipTypeSuperiorNumber, ipLocation, ipTypeNumber, ipFormNumber } };
  };

  private setData = (name: string, value: any) => {
    const { pub } = this.state;
    this.setState({
      pub: { ...pub, ...{ [name]: value } }
    });
  };

  _setState(show, message) {
    this.setState({
      show,
      message,
    });
  }

  /**
   * 上传图片
   * @param e
   * @param field
   * @param picType 1首页幻灯片，2ip海报图，3个人头像，4名片，5证件照，6ppt页面
   */
  async uploadImg(e, field) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      // 动态设置setState 的值
      const data = {};
      data[field] = e.target['result'];
      this.setState(data);
      this.setState({
        result: e.target['result']
      });
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, picType: 2 };
      const { errorCode, result = {} }: any = await savePic(params);
      if (errorCode === '200' && result.errorCode === 200) {
        this.setState({
          pic_img: result.data
        });
        const { pub } = this.state;
        pub.ipPicGuid = result.data;
        let ipPicGuid = result.data;
        this.setState({ pub });
        const { update } = this.props;
        await update.setStatus({ ipPicGuid });
      } else {
        this._setState(true, result.errorMsg);
      }
    };
  }

  /**
   * 添加ip
   */
  async addIp(apiType) {
    const params = toJS(this.props.update.updateList);
    console.log(params);
    if (params.ipName === "") {
      this._setState(true, "填写IP公认的名称不能为空");
    } else if (params.ipTypeSuperiorNumber === "") {
      this._setState(true, "IP类型不能为空");
      // 类型下的具体的分类 还需判断
    } else if (params.ipLocation === "" && params.ipTypeSuperiorNumber !== 3 && params.ipTypeSuperiorNumber !== 4) {
      this._setState(true, "国家地区不能为空");
    } else {
      const { errorCode, result }: any = await createIp(apiType, params);
      if (errorCode === '200' && result === true) {
        this.setState({
          addIpState: true,
          message: '添加成功'
        });
      }
    }
  }

  /**
   * 编辑ip
   * modifyContent json  变化的数据 每一个类型不一样  参数不一样
   * remark 'ip名字,版权方'
   */
  async editIpFun(apiType) {
    let { update } = this.props;
    const params = this.parseParams();
    console.log(params)
    let pam = {};
    Object.keys(params).map((key, item) => {
      if (params[key] && key !== 'ipTypeSuperiorNumber') {
        pam[key] = params[key];
      }
    });
    const { userGuid } = JSON.parse(sessionStorage.getItem("user"));
    let { id }: any = this.props.match.params;
    let ipid: number;
    if (id === undefined) {
      ipid = 0;
    } else {
      ipid = id;
    }
    let remark;
    let obj2 = {};
    Object.keys(pam).map((key, item) => {
      if (_isArray(pam[key])) {
      }
      obj2[remark_k_v[key]] = pam[key];
    });
    // console.log(obj2);
    let str = JSON.stringify(obj2);
    let reg = /^\{|\}$/g;
    str = str.replace(reg, '');
    remark = str.replace(/\",/g, '"^');
    let obj = {
      ipid,
      modifyContent: pam,
      remark,
      userGuid,
    };
    const { errorCode, result }: any = await EditIp(apiType, obj);
    if (errorCode === '200' && result === true) {
      this.setState({
        addIpState: true,
        message: '编辑成功'
      });
    }
  }

  _processSubType = (type: string) => {
    if (!_isEmpty(type)) {
      return type.split(',')
        .filter(str => !_isEmpty(str));
    }
  };

  render() {
    let { nav_store, update } = this.props;
    let { headerNav, footerNav } = nav_store;
    let { typeList, subTypeList, locationList, modalityList, updateList, businessList } = update;
    subTypeList = toJS(subTypeList);
    subTypeList = this.process(subTypeList);
    locationList = this.process(locationList);
    locationList = toJS(locationList);

    modalityList = this.process(modalityList);
    modalityList = toJS(modalityList);

    let types = this.processKV(typeList, componentKeyValues);
    let apiNames = this.processKV(typeList, nameKeyValues);
    let type = this.state.pub.ipTypeSuperiorNumber;
    const Component = types[type];
    const apiType = apiNames[type];
    const { show, message } = this.state;
    let { id }: any = this.props.match.params;
    const { uploadShow, pic_img, addIpState } = this.state;
    let user = sessionStorage.getItem('user');
    let userGuid = JSON.parse(user).userGuid;
    const { pub: { ipName, ipTypeSuperiorNumber, ipTypeNumber, ipLocation, ipDesc, ipFormNumber } } = this.state;
    let { iCheckStatus }: any = this.props.match.params;

    return (
      <div className="update-container">
        <Header data={headerNav} history={this.props.history}/>
        {show &&
        <Alert
          message={message}
          onClose={() => {
            this.setState({ show: false });
          }}
          onSubmit={() => {
            this.setState({ show: false });
          }}/>
        }
        {
          updateList &&
          <div className="content-container flex-row">
            <div className="create-left-container">
              <div className="poster-area justify-content-center align-items-center">
                {
                  id &&
                  <div className="poster-img-container" style={{ border: 'none' }}>
                    <img className="poster-img" src={updateList.picUrl || default_img} alt=""/>
                  </div>
                }
                {
                  !id &&
                  <div className="poster-img-container">
                    <img className="poster-img" src={this.state.result} alt=""/>
                    <input type="file" onChange={async (e) => {
                      await this.uploadImg(e, 'pic_img');
                    }
                    }/>
                    {
                      !pic_img && <span>上传封面</span>
                    }
                  </div>
                }
              </div>
            </div>

            <div className="create-container flex-column">
              <div className="create-right-container flex-column">
                <div className="form-group flex-column">
                  <label className="input-label">IP名称<span className="label-dot">*</span></label>
                  <input type="text"
                         onChange={async e => {
                           const { pub } = this.state;
                           pub.ipName = e.target.value;
                           updateList.ipName = e.target.value;
                           await update.setStatus(updateList);
                           this.setState({ pub });
                         }}
                         value={updateList.ipName || ''}
                         className="form-control short-width" placeholder="填写IP公认的名称"/>
                </div>

                <div className="form-group flex-column">
                  <label className="input-label">IP类型<span className="label-dot">*</span></label>
                  <div className="radio-group flex-row flex-wrap">
                    {
                      !id && typeList && typeList.map((item: any) => {
                        let radioClicked = this.state.pub.ipTypeSuperiorNumber === item.ipTypeNumber ? "radio-selected" : "";
                        return (
                          <div
                            key={item.ipTypeNumber}
                            className={`ip-radio flex-row align-items-center ${radioClicked}`}
                            onClick={async () => {
                              let { pub } = this.state;
                              let { ipTypeNumber, ipTypeSuperiorNumber } = pub;
                              if (ipTypeSuperiorNumber !== item.ipTypeNumber) {
                                ipTypeNumber = [];
                              }
                              this.setState({
                                pub: {
                                  ...pub,
                                  ipTypeNumber,
                                  ipTypeSuperiorNumber: item.ipTypeNumber
                                }
                              });
                              await update.setStatus({ ipTypeSuperiorNumber: item.ipTypeNumber });
                            }}>
                            <div className="limit-custom-radio"/>
                            <span className="radio-text">{item.type || ""}</span>
                          </div>
                        );
                      })
                    }
                    {
                      id && typeList && typeList.map((item: any) => {
                        let radioClicked = parseInt(updateList.ipTypeSuperiorNumber) === item.ipTypeNumber ? "radio-selected" : "";
                        return (
                          <div
                            key={item.ipTypeNumber}
                            className={`ip-radio flex-row align-items-center ${radioClicked}`}>
                            <div className="limit-custom-radio"/>
                            <span className="radio-text">{item.type || ""}</span>
                          </div>
                        );
                      })
                    }
                  </div>
                  {subTypeList && subTypeList.length > 0 && <div className="sub-type-area">
                    <div className="sub-type-list flex-fill flex-row flex-wrap">
                      {subTypeList.map((item: any) => {
                        if (item.ipTypeNumber !== 0) {
                          const { pub: { ipTypeNumber: tmp } } = this.state;
                          let checkboxClicked = !!_find(tmp, val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                          // const { updateList: { ipTypeNumber: tmp } } = update;
                          // console.log(!!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)));
                          // let checkboxClicked = !!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                          return (
                            <div
                              key={item.ipTypeGuid}
                              onClick={async () => {
                                let { pub } = this.state;
                                let { ipTypeNumber } = pub;
                                // let ipTypeNumber = tmp.split(',');
                                if (!_find(ipTypeNumber, val => item.ipTypeNumber === Number(val))) {
                                  ipTypeNumber.push(item.ipTypeNumber);
                                } else {
                                  const idx = ipTypeNumber.findIndex(o => o === item.ipTypeNumber);
                                  delete ipTypeNumber[idx];
                                }
                                this.setState({ pub: { ...pub, ipTypeNumber } });
                                await update.setStatus({ ipTypeNumber: ipTypeNumber.join(',') });
                              }}
                              className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                              <div className="limit-custom-checkbox"/>
                              <div className="checkbox-text">{item.ipType}</div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>}
                </div>
                {
                  modalityList && <div className="form-group flex-column">
                    <label className="input-label">形式
                      <span className="label-dot">*</span>
                    </label>
                    <div className="location-container">
                      {
                        modalityList.map((item: any) => {
                          if (item.ipTypeNumber !== 0) {
                            const { pub: { ipFormNumber: tmp } } = this.state;
                            let val;
                            typeof tmp === 'string' ? val = tmp.replace(/,/g, '') : val = tmp;
                            let checkboxClicked = item.ipTypeNumber === Number(val) ? "sub-item-selected" : "";

                            return (
                              <div
                                key={item.ipTypeGuid}
                                onClick={async () => {
                                  let { pub } = this.state;
                                  const ipFormNumber = item.ipTypeNumber;
                                  this.setState({ pub: { ...pub, ipFormNumber } });
                                  await update.setStatus({ ipFormNumber });
                                }}
                                className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                                <div className="limit-custom-checkbox"/>
                                <div className="checkbox-text">{item.ipType}</div>
                              </div>
                            );
                          }
                        })
                      }
                    </div>
                  </div>
                }

                {
                  locationList && <div className="form-group flex-column">
                    <label className="input-label">国家地区
                      <span className="label-dot">*</span>
                    </label>
                    <div className="location-container">
                      {
                        locationList.map((item: any) => {
                          if (item.ipTypeNumber !== 0) {
                            const { pub: { ipLocation: tmp } } = this.state;
                            let val;
                            typeof tmp === 'string' ? val = tmp.replace(/,/g, '') : val = tmp;
                            let checkboxClicked = item.ipTypeNumber === Number(val) ? "sub-item-selected" : "";
                            return (
                              <div
                                key={item.ipTypeGuid}
                                onClick={async () => {
                                  let { pub } = this.state;
                                  const ipLocation = item.ipTypeNumber;
                                  this.setState({ pub: { ...pub, ipLocation } });
                                  await update.setStatus({ ipLocation });
                                }}
                                className={`sub-item flex-row justify-content-center align-items-center  ${checkboxClicked}`}>
                                <div className="limit-custom-checkbox"/>
                                <div className="checkbox-text">{item.ipType}</div>
                              </div>
                            );
                          }
                        })
                      }
                    </div>
                  </div>
                }
                <div className="form-group flex-column">
                  <label className="input-label">IP简介</label>
                  <textarea
                    onChange={async e => {
                      this.setData("ipDesc", e.target.value);
                      updateList.ipDesc = e.target.value;
                      await update.setStatus(updateList);
                    }}
                    value={updateList.ipDesc}
                    className="form-control textarea"
                    placeholder="请在此处填写IP简介..."
                    rows={6}>

                </textarea>
                </div>
              </div>

              {Component && <Component callback={this.callback} id={id}/>}
              {
                id && <div className="create-right-container flex-column">
                  <div className="business-header">
                    <div className="business-title">招商资料</div>
                    <button className="btn btn-primary limit-custom-btn" onClick={() => {
                      this.setState({
                        uploadShow: true
                      });
                    }}>上传资料
                    </button>
                  </div>

                  <div className="business-table">
                    <table className="table table-bordered table-striped table-hover business-info">
                      <thead>
                      <tr>
                        <th>资料名称</th>
                        <th>上传时间</th>
                        <th>状态</th>
                        <th>操作</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        businessList && businessList.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.ipFile}</td>
                              <td>{moment(item.createDate).format('YYYY-MM-DD hh:mm:ss')}</td>
                              {
                                item.fileStatus === 2 && <td>审核中</td>
                              }
                              {
                                item.fileStatus === 3 && <td>审核通过</td>
                              }
                              {
                                item.fileStatus === 4 && <td>审核拒绝</td>
                              }
                              <td>
                                <a href={item.fileAddress} download>下载</a>
                                {
                                  item.createUserGuid === userGuid &&
                                  <a onClick={async () => {
                                    let materialGuid = item.ipMaterialGuid;
                                    const params = { userGuid, materialGuid };
                                    const isSuccess = await update.deleteMaterial(params);
                                    if (_isObject(isSuccess)) {
                                      this._setState(true, isSuccess.message);
                                    }
                                  }}>删除</a>
                                }

                              </td>
                            </tr>
                          );
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        <div className="create-area">
          {
            !id ?
              <div className="form-group flex-row justify-content-center align-items-center">
                <button
                  className="btn btn-primary publish-btn"
                  onClick={async () => {
                    await this.addIp(apiType);
                  }}>
                  提交
                </button>
                <button className="btn btn-default reset-btn"
                        onClick={async () => {
                          await update.doRest();
                        }}>重置
                </button>
              </div>
              :
              <div className="form-group flex-row justify-content-center align-items-center">
                {
                  Number(iCheckStatus) === 3 ?
                    <button className="btn btn-primary publish-btn"
                            onClick={async () => {
                              let params = this.parseParams();
                              params.userGuid = userGuid;
                              params.ipid = id;
                              let pam = {};
                              Object.keys(params).map((key, item) => {
                                if (params[key] && key !== 'ipTypeSuperiorNumber') {
                                  pam[key] = params[key];
                                }
                              });
                              console.log(params, pam);
                              await EditIpCheckStatus(apiType, pam);
                            }}
                    >更新
                    </button>
                    :
                    <button className="btn btn-primary publish-btn"
                            onClick={async () => {
                              await this.editIpFun(apiType);
                            }}
                    >更新
                    </button>
                }

              </div>
          }
        </div>
        {uploadShow &&
        <UploadFileModel
          title="上传商务合作资料"
          ipid={id}
          onClose={() => {
            this.setState({
              uploadShow: false
            });
          }
          }/>
        }
        {
          /**
           * 添加ip 成功 提示：添加成功！ 返回首页/继续添加
           */
          addIpState &&
          <div className="model model-info"
               style={{ position: "fixed", height: "100%", left: "0", right: "0", top: "0", bottom: "0" }}
               onClick={() => {
                 this.setState({
                   addIpState: false
                 });
               }}>
            <div className="model-container">
              <div className="model-body">
                {message}
              </div>
              <div className="model-footer model-info">
                <button
                  type="button" className="btn btn-submit"
                  onClick={() => {
                    this.props.history.push('/index');
                  }}>
                  跳转到首页
                </button>

                <button type="button" className="btn btn-submit"
                        onClick={() => {
                          window.location.reload();
                        }}>
                  继续添加
                </button>
              </div>
            </div>
          </div>
        }
        <Footer data={footerNav}/>
      </div>
    );
  }
}
