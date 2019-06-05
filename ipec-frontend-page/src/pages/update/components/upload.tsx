import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import moment from 'moment';
import { inject } from 'mobx-react'; 
import { toJS } from 'mobx';
import { upload, getAuthorize } from '@utils/api'; 
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
    this.callback({ date });
  };

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);


  async componentDidMount() {  
    this.callback({ ipIsShow: this.state.ipIsShow });
    const { update, id } = this.props;  
    const { updateList, } = update;
    const { prodect, cooperationCase, detail } = this.state; 
   if (id) {
      if (updateList.hasOwnProperty('cooperationCase')) {
        const { cooperationCase, prodect } = updateList;
        if (_isString(cooperationCase) && !_isEmpty(cooperationCase)) {
          updateList.cooperationCase = JSON.parse(cooperationCase);
        } else if (_isEmpty(cooperationCase)) {
          await update.setStatus({ cooperationCase: this.state.cooperationCase });
        }
        if (_isString(prodect) && !_isEmpty(prodect)) {
          updateList.prodect = JSON.parse(prodect);
        } else if (_isEmpty(prodect)) {
          await update.setStatus({ prodect: this.state.prodect });
        }
      }
    } else { 
      await update.setStatus({ prodect, cooperationCase, detail });
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
    const { isOn, isCaseOn } = this.state;
    let { updateList, subTypeList, companyData, locationList } = update;
    subTypeList = toJS(subTypeList);
    subTypeList = this.process(subTypeList);
    locationList = toJS(locationList);
    console.log("@this.locationList:")
    
    console.log(locationList)  
    if (updateList.hasOwnProperty('cooperationCase')) {
      const { cooperationCase, prodect } = updateList;
      if (_isString(cooperationCase) && !_isEmpty(cooperationCase)) {
        updateList.cooperationCase = JSON.parse(cooperationCase);
      }
    }
    if (updateList.hasOwnProperty('prodect')) {
      const { prodect } = updateList;
      if (_isString(prodect) && !_isEmpty(prodect)) {
        updateList.prodect = JSON.parse(prodect);
      }
    }
    console.log("updateList@--------------------")
    console.log(updateList)


    return (
      <div className=" flex-column">
       
        <div className="flex-column  create-right-container ">
          <div className=" special-from-group">
            <p className="cultural-p justify-content-between">
              <label>IP素材图库</label>
              {
                isOn && <label className="gray" onClick={() => {
                  this.setState({ isOn: false });
                }}>展开 <img src={xiala} /></label>
              }
              {
                !isOn && <label className="gray" onClick={() => {
                  this.setState({ isOn: true });
                }}>收起 <img src={shouqi} /></label>
              }
            </p>
            {
              !isOn && <div className="product-container">
                <p className="notice">注：建议图片尺寸：230*180px</p>
                <div className="product-list justify-content-between">
                  {
                    !!updateList.prodect && updateList.prodect.map((item, index) => {
                      return (
                        <div key={index} className="product-box">
                          <div className="upload-box">                            
                            {
                              item.pic ? <span className="update-product">更改产品</span>:<span className="update-product">添加产品</span>
                            }
                            <img className="icon" src={ic_upload} />
                            {item.pic === "" && <span className=" add-product">添加产品</span>} 
                            <input type="file" className="product-upload" onChange={async (e) => {
                              await this.uploadImg(e, item, index, 'prodect');
                            }} />
                            {item.pic === "" && <img src={item.pic} alt="" />}
                            {item.pic !== "" && <img src={item.pic || default_img} alt="" />}
                          </div>
                          <input type="text" className="product-input"
                            value={item.title}
                            onChange={async (e) => {
                              await this._changeValue(e, item, 'prodect');
                            }}
                            placeholder="输入产品描述最多12字"
                            maxLength={12} />
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            }
          </div>
        </div>
        <div className="flex-column create-right-container">
          <div className="special-from-group">
            <p className="cultural-p justify-content-between">
              <label>衍生品/合作案例</label>
              {isCaseOn && <label className="gray" onClick={() => {
                this.setState({ isCaseOn: false });
              }}>展开 <img src={xiala} /></label>}
              {!isCaseOn && <label className="gray" onClick={() => {
                this.setState({ isCaseOn: true });
              }}>收起 <img src={shouqi} /></label>}
            </p>
            {
              !isCaseOn &&
              <div className="product-container">
                <p className="notice">注：建议图片尺寸：230*180px</p>
                <div className="product-list justify-content-between">
                  {
                    !!updateList.cooperationCase && updateList.cooperationCase.map((item, index) => {
                      return (
                        <div key={index} className="product-box">
                          <div className="upload-box">
                            {
                              item.pic ? <span className="update-product">更改产品</span>:<span className="update-product">添加产品</span>
                            }
                           
                            <img className="icon" src={ic_upload} />
                            {item.pic === "" && <span className=" add-product">添加产品</span>}
                            <input type="file" className="product-upload" onChange={async (e) => {
                              await this.uploadImg(e, item, index, 'cooperationCase');
                            }} /> 
                            {item.pic !== "" && <img src={item.pic || default_img} alt="" />}
                          </div>
                          <input type="text" className="product-input"
                            value={item.title}
                            onChange={async (e) => {
                              await this._changeValue(e, item, 'cooperationCase');
                            }}
                            placeholder="输入产品描述最多12字"
                            maxLength={12} />
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            }
          </div>
        </div> 
     
      </div>
    );
  }
}
