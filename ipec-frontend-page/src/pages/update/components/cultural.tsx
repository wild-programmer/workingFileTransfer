import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import moment from 'moment';
import { inject } from 'mobx-react'; 
import { toJS } from 'mobx';
import { upload, getAuthorize, listCompany } from '@utils/api'; 
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import default_img from "@assets/images/default_img_item.png";
import ic_upload from "@assets/images/update/ic_upload.svg";
import shouqi from "@assets/images/update/shouqi.svg";
import xiala from "@assets/images/update/xiala.svg";
import { Select, DatePicker } from 'antd';
import _find from "lodash/find";
import { bool } from "prop-types";

const Option = Select.Option;
const children = [];

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

interface IAvatarProps extends IComponentProps {
  callback: Function;
}

interface IAvatarState {
  ipIsShow: number;
  isOn: boolean;
  isCaseOn: boolean;
  detail: string; 
  listAuthorize_1: Array<object>;
  listAuthorize_2: Array<object>;
  listAuthorize_3: Array<object>;
  prodect: Array<object>;
  cooperationCase: Array<object>;
}

@inject('update')
export default class Avatar extends React.Component<IAvatarProps, IAvatarState> { 

  constructor(props) {
    super(props); 
    this.state = {
      ipIsShow: 1,
      isOn: false,
      isCaseOn: false,
      detail: "", 
      listAuthorize_1: null,
      listAuthorize_2: null,
      listAuthorize_3: null, 
      prodect: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
      cooperationCase: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
    };
  }

  private timeCallback = (o: any) => {
    const { date = "" } = o;  
    this.callback({ showDate:date });
  };

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  async componentDidMount() { 
    await this.getAuthorize(1);
    await this.getAuthorize(2);
    await this.getAuthorize(3);
    this.callback({ ipIsShow: this.state.ipIsShow });
    const { update, id } = this.props;  
    const { updateList, } = update;
    const { prodect, cooperationCase, detail } = this.state;
    

  }

  async getAuthorize(typeCategory: Number) {
    let { errorCode, result }: any = await getAuthorize(typeCategory)
    if (errorCode == 200) {
      switch (typeCategory) {
        case 1:
          this.setState({
            listAuthorize_1: result
          })
          break;
        case 2:
          this.setState({
            listAuthorize_2: result
          })
          break;
        case 3:
          this.setState({
            listAuthorize_3: result
          })
          break;
        default:
          return
      }

    }

  }
  //日期选择
  datechange = (date, dateString) => {
    this.callback({ authorizedAllottedTime: dateString });
  }

  replaceStr = (oldStr, childStr) => {
    var re = new RegExp(childStr, "g");//通过RegExp使用变量
    return oldStr.replace(re, '');
  }

  // 个人信息-选择下拉中的公司名
  authorizedTypeChange = (value: any, obj: any) => { 
    debugger
    // const { update: { updateList } } = this.props;
    // if(!!_find(updateList.authorizedType.split(','),val=>val == value))return;  
    this.callback({ authorizedType: value });
  }; 
  authorizedLocationChange = (value: any, obj: any) => {
    this.callback({ authorizedLocation: value });
  };
  intentAuthorizationChange = (value: any, obj: any) => {
    this.callback({ intentAuthorization: value });
  };
  grantedTypeChange = (value: any, obj: any) => {
    this.callback({ grantedType: value });
  };
  handleChange = (value: any, obj: any) => {
    const { update: { updateList } } = this.props;
  };
  // 获取授权品类
  async getCompanyList() {
    // let isSuccess = await this.state.user.getCompanyList();
    // if (isSuccess) {
    //   isSuccess.forEach((element: any) => {
    //     children.push(<Option key={element.companyGuid}  value={element.companyGuid+`:index${element.id}`}>{element.companyName}</Option>);
    //   });
    // } else {
    //   this.setState({ message: '获取公司列表失败', show: true });
    //   this.props.history.push("/user");
    //   // this.onSubmitResult(code, userLogin);
    // }
  } 
  timestampToTime = (timestamp)=> {
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D;
  }
 
  // 上传图片
  async uploadImg(e, item, index, dataName) {
    // 利用fileReader对象获取file
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("isImage", '1');
      formData.append("isFullPath", '1');
      await upload(formData);
      const { errorCode, result = {} }: any = await upload(formData);
      if (errorCode === '200' && result.errorCode === 200) {
        const { update } = this.props;
        item.pic = result.data;
        if (dataName === 'prodect') {
          const { prodect } = update.updateList;
          this.callback({ prodect });
        } else {
          const { cooperationCase } = update.updateList;
          this.callback({ cooperationCase });

        }
      } else {
        // this._setState(true, result.errorMsg);
      }
    };
  }

  async _changeValue(e, item, dataName) {
    item.title = e.target.value;
    const { update } = this.props;
    if (dataName === 'prodect') {
      const { prodect } = update.updateList;
      this.callback({ prodect: toJS(prodect) });
    } else {
      const { cooperationCase } = update.updateList;
      this.callback({ cooperationCase: toJS(cooperationCase) });
    }
  }

  private process(list: any[]) {
    let { pub: { ipTypeSuperiorNumber } } = this.props;
    if (list && ipTypeSuperiorNumber) {
      let tmp = _find(list, o => !!o[ipTypeSuperiorNumber]);
      return tmp && tmp[ipTypeSuperiorNumber];
    }
  }
  render() {
    const { update, id } = this.props;
    const { isOn, isCaseOn, listAuthorize_1, listAuthorize_2, listAuthorize_3 } = this.state;
    let { updateList, subTypeList, companyData, locationList } = update;
    subTypeList = toJS(subTypeList);
    subTypeList = this.process(subTypeList);
    locationList = toJS(locationList);
    console.log("@this.locationList:") 

    return (
      <div className="create-right-container flex-column">
         <div className="form-group flex-column">
          {subTypeList && subTypeList.length > 0 && <label className="input-label">IP类型<span className="label-dot">*</span></label>
          }
          {subTypeList && subTypeList.length > 0 && <div className="sub-type-area ip-Type-list">
            <div className="sub-type-list flex-fill flex-row flex-wrap">
              {subTypeList.map((item: any) => {
                if (item.ipTypeNumber !== 0) {
                  let { pub: { ipTypeNumber: tmp }, setPub } = this.props; 
                  let _ipTypeNumber = updateList.ipTypeNumber.split(",")
                  let checkboxClicked = !!_find(_ipTypeNumber, val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                  // const { updateList: { ipTypeNumber: tmp } } = update;
                  // console.log(!!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)));
                  // let checkboxClicked = !!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                  return (
                    <div
                      key={item.ipTypeGuid}
                      onClick={async () => {
                        let { pub } = this.props;
                        let { ipTypeNumber } = pub; 
                        let count =false;
                        let index_ =0;
                        
                        // let ipTypeNumber = tmp.split(',');
                        console.log(ipTypeNumber)
                        ipTypeNumber.forEach((val,indx )=> {
                          if(val == item.ipTypeNumber){
                            index_ = indx;
                            count = true
                          }
                        }); 
                        if (count) {                           
                          ipTypeNumber.splice(index_,1) ;  
                        } else {  
                          ipTypeNumber.push(item.ipTypeNumber); 
                        }
                        setPub({ ...pub, ipTypeNumber })
                        let _ipTypeNumber = ipTypeNumber.join(',');
                        var reg = /,{1+}/g; 
                        _ipTypeNumber.replace(reg, ","); 
                        await update.setStatus({ ipTypeNumber:_ipTypeNumber}); 
                      }}
                      className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                      <div className="limit-custom-checkbox" />
                      <div className="checkbox-text">{item.ipType}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>}
          
        </div>
       
        <div className="form-group form-540 flex-column"> 
          <label className="input-label">IP版权方<span className="label-dot">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="填写版权方"
            onChange={async e => {
              this.callback({ owner: e.currentTarget.value });
            }}
            value={updateList.owner}
          />
        </div>
        <div className="form-group form-540 flex-column">
          <label className="input-label">IP版权代理方</label>
          <input
            type="text"
            className="form-control"
            placeholder="填写版权代理方"
            onChange={async e => {
              this.callback({ copyrightAgent: e.currentTarget.value });
            }}
            value={updateList.copyrightAgent}
          />
        </div>
        <div className="form-group form-540 flex-column">
          <label className="input-label">国家地区
                      <span className="label-dot">*</span>
            <span className="isCheked">(可多选)</span>
          </label>
          <div className="location-container">
            {
              locationList && locationList.map((item: any) => {
                if (item.ipTypeNumber !== 0) {
                  let {  pub ,setPub} = this.props;
                  let countryTypes = updateList.countryTypes;
                  let countryNames = updateList.countryNames;
                  let checkboxClicked = !!_find(countryTypes.split(','), val => item.resourceKey === val) ? "sub-item-selected" : "";
                  return (
                    <div
                      key={item.resourceKey}
                      onClick={async () => {
                        //判断是否已经被选中
                        let boole = !!_find(countryTypes.split(','), val => item.resourceKey === val);
                        if (boole) {
                          countryTypes = this.replaceStr(countryTypes, item.resourceKey)
                          countryNames = this.replaceStr(countryNames, item.resourceValue)
                        } else {
                          countryTypes = countryTypes + ',' + item.resourceKey;
                          countryNames = countryNames + '/' + item.resourceValue;
                        }
                        setPub({ ...pub, countryTypes, countryNames })
                        await update.setStatus({ countryTypes, countryNames });

                      }}
                      className={`sub-item flex-row justify-content-center align-items-center  ${checkboxClicked}`}>
                      <div className="limit-custom-checkbox" />
                      <div className="checkbox-text">{item.resourceValue}</div>
                    </div>
                  );
                }
              })
            }
          </div>
        </div>

        <div className="form-group form-540 flex-column">
          <label className="input-label">IP备案国家</label>
          <input
            type="text"
            className="form-control"
            placeholder="填输入IP备案国家"
            onChange={async e => {
              this.callback({ recordCountry: e.currentTarget.value });
            }}
            value={updateList.recordCountry}
          />
        </div>

        <div className="form-group form-540 flex-column">
          <label className="input-label">可授权品类</label>
          <div className="antdSlect" id="user_certification_company">
            <Select
              size={"large"}
              style={{ width: '100%', display: false ? 'none' : null }}
              placeholder="填写可授权品类"
              onChange={this.authorizedTypeChange}
              value={updateList.authorizedType} 
              mode="tags"
            >
              {
                listAuthorize_1 && listAuthorize_1.map((item: any) => {
                  if (item.ipTypeNumber !== 0) {
                    return (
                      <Option key={item.id} value={item.typeName}>{item.typeName}</Option>
                    );
                  }
                })
              }
            </Select>

          </div>
        </div>
        <div className="form-group form-540 flex-column">
          <label className="input-label">已授权品类</label>
          <div className="antdSlect" id="user_certification_company">
            <Select
              size={"large"}
              style={{ width: '100%', display: false ? 'none' : null }}
              placeholder="填写已授权品类"
              onChange={this.grantedTypeChange}
              value={updateList.grantedType}
              mode="tags"
            >

              {
                listAuthorize_2 && listAuthorize_2.map((item: any) => {
                  if (item.ipTypeNumber !== 0) {
                    return (
                      <Option key={item.id} value={item.typeName}>{item.typeName}</Option>
                    );
                  }
                })
              }
            </Select>

          </div>
        </div>
        <div className="form-group form-540 flex-column">
          <label className="input-label">意向授权品类</label>
          <div className="antdSlect" id="user_certification_company">
            <Select
              size={"large"}
              style={{ width: '100%', display: false ? 'none' : null }}
              placeholder="填写意向授权品类"
              onChange={this.intentAuthorizationChange}
              value={updateList.intentAuthorization}
              mode="tags"
            >

              {
                listAuthorize_3 && listAuthorize_3.map((item: any) => {
                  if (item.ipTypeNumber !== 0) {
                    return (
                      <Option key={item.id} value={item.typeName}>{item.typeName}</Option>
                    );
                  }
                })
              }
            </Select>

          </div>
        </div>
        <div className="form-group form-540 flex-column">
          <label className="input-label">是否可以转授权</label>

          <div className="radio-group flex-row flex-wrap">
            {
              (() => {
                let radioClicked = updateList && updateList.isTransferable ? 'radio-selected' : '';
                return (
                  <div
                    className={`ip-radio flex-row align-items-center ${radioClicked}`}>
                    <div className="limit-custom-radio"
                      onClick={async () => { 
                        this.callback({ isTransferable: 1 });
                      }}
                    />
                    <span className="radio-text">是</span>
                  </div>
                )
              })()
            }
            {
              (() => {
                let radioClicked = updateList && updateList.isTransferable ? '' : 'radio-selected';
                return (
                  <div
                    className={`ip-radio flex-row align-items-center ${radioClicked}`}>
                    <div className="limit-custom-radio"
                      onClick={async () => { 
                        this.callback({ isTransferable: 0 });
                      }}
                    />
                    <span className="radio-text">否</span>
                  </div>
                )
              })()
            }
          </div>
        </div>
        
        <div className="form-group form-540 flex-column">
          <label className="input-label">可授权区域</label>
          <div className="antdSlect" id="user_certification_company">
            <Select
              size={"large"}
              style={{ width: '100%', display: false ? 'none' : null }}
              placeholder="填写可授权区域"
              onChange={this.authorizedLocationChange}
              value={updateList.authorizedLocation}
              mode="tags"
            >
              {
                locationList && locationList.map((item: any) => {
                  if (item.ipTypeNumber !== 0) {
                    return (
                      <Option key={item.resourceKey} value={item.resourceValue}>{item.resourceValue}</Option>
                    );
                  }
                })
              }
            </Select>

          </div>
        </div>
        <div className="form-group form-540 flex-column ant_dateSelect">
          <label className="input-label">可授权期限</label>
          <DatePicker
            placeholder="选择可授权期限"
            onChange={this.datechange}
            defaultValue={moment(this.timestampToTime(updateList.authorizedAllottedTime), 'YYYY-MM-DD')}  
          />
        </div>

       {/* <div className=" flex-column">
          <label>图文详情</label>
          <div ref={this.editorEle} />
        </div> */}
     
      </div>
    );
  }
}
