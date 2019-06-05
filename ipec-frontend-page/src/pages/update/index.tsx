import * as React from "react";
import "@assets/scss/update.scss";
import "@assets/scss/model.scss";
import Header from "@components/header";
import Footer from "@components/footer";
import { upload, getAuthorize } from '@utils/api';
import default_img from "@assets/images/default_img_item.png";
import ic_upload from "@assets/images/update/ic_upload.svg";
import shouqi from "@assets/images/update/shouqi.svg";
import xiala from "@assets/images/update/xiala.svg";
import _find from "lodash/find";
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
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
  Common,
  Fiction,
  Wangeditor,
  Upload,
  Rule,
} from "@pages/update/components";
import { inject, observer } from "mobx-react";
import { createIp, EditIp, savePic, EditIpCheckStatus } from "@utils/api";
import Alert from '@components/alert';
import UploadFileModel from "@components/upload_file_model";
import _isObject from "lodash/isObject";
import _isArray from "lodash/isArray";
import moment from 'moment';
import { toJS } from "mobx";
import { number, any } from 'prop-types';

interface IUpdateState {
  pub: {
    ipName: string,
    ipTypeSuperiorNumber: string,
    ipTypeNumber: any[],
    ipLocation: string,
    countryNames: string,
    countryTypes: string,
    ipDesc: string,
    ipFormNumber: string,
    ipPicGuid: string,
    typeslect: string
  };
  isReading: Boolean;
  ipMaterialGuidList: Array<any>; //商务资料
  copyrightAgent: object,//代理协议文件
  copyrightCertificateGuid: object,//版权证明文件
  ownershipGuid: object,//IP所有权证明文件 //经济合同 
  sub: {};
  show: boolean;
  message: string;
  uploadShow: boolean;

  pic_img: string;
  result: string;
  ipid: number;
  addIpState: boolean;
  remark: Array<any>;
  showDate: object;
  isOn: boolean;
  isCaseOn: boolean;
  fileType: object;

  ruleShow:Boolean;
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
      pub: { //所有类别公共的数据
        ipName: "",
        ipTypeSuperiorNumber: '',
        ipLocation: '',
        countryNames: '',
        countryTypes: '',
        ipTypeNumber: [],
        ipDesc: "",
        ipFormNumber: '',
        ipPicGuid: '',
        typeslect: ''
      },
      ipMaterialGuidList: [
      ],
      copyrightAgent: {
        guid: '',
        name: '',
      },//代理协议文件
      copyrightCertificateGuid: {
        guid: '',
        name: '',
      },//版权证明文件
      ownershipGuid: {
        guid: '',
        name: '',
      },//IP所有权证明文件 //经济合同 
      fileType: {
        type: null,
        text: '',
      },
      isReading: false,
      isOn: false,
      isCaseOn: false,
      sub: {},//专属于大类别的数据 
      show: false,
      message: "",
      uploadShow: false,
      ruleShow: false,
      pic_img: "",
      result: "",
      ipid: 0,
      addIpState: false,
      remark: [],
      showDate: {},
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
    const { updateList, } = update;
    const { userGuid } = JSON.parse(sessionStorage.getItem("user"));
    await nav_store.navList();
    await update.ipTypeList();
    await update.getlistMainType();
    let { id, ipTypeNumber }: any = this.props.match.params;
    const params = { ipid: parseInt(id), ipTypeNumber: parseInt(ipTypeNumber),userGuid:userGuid };
    console.log(ipTypeNumber);
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
      //想要的效果 找到 1对应后台类型 是不是电影 如果是
      typeList.forEach((item: any) => {
        // console.log("item.ipTypeNumber"+item.ipTypeNumber) //后台对应的类别
        // console.log("item.type"+item.type) //后台对应类别 的汉字名称
        // console.log(types) 
        tmp[item.ipTypeNumber] = this.isNullObj(types) ? item.type : types[item.type];
      });
    }
    return tmp;
  }
  isNullObj(obj: object) {
    var arr = Object.keys(obj);
    return arr.length == 0
  }
  async getdown (){

  }
  private callback = (params: any) => {
    if(params.businessList){
      let { id }: any = this.props.match.params;
      this.props.update.getDownload({ ipid: id }); 
    }else{
       const { updateList } = this.props.update;
        this.setState({ sub: { ...this.state.sub, ...params } });
        this.props.update.setStatus({ ...params })
    }
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

  async clearstore() {
    await this.props.update.doRest();
    let { pub, pub: { ipTypeSuperiorNumber } } = this.state;
    if (ipTypeSuperiorNumber) pub['clear'] = true;
    this.setState({
      pub: {
        ...pub,
      },
      ipMaterialGuidList: [],
      copyrightAgent: { guid: '', name: '', },
      copyrightCertificateGuid: { guid: '', name: '', },
      ownershipGuid: { guid: '', name: '', },
    })
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
    let _params = params; 
    if (params.ipName === "") {
      this._setState(true, "填写IP公认的名称不能为空");
      return
    } else if (params.ipTypeSuperiorNumber === "") {
      this._setState(true, "IP分类不能为空");
      // 类型下的具体的分类 还需判断
      return
    }
    switch (apiType) {
      case 'avatar':
          if(this.screening(params) ) {
            if (params.owner == '') {
              this._setState(true, "版权方不能为空");
              return
            } 
            this.joinparam(_params,apiType)
          }else{
            return
          } 
        break;
      case 'cultural':           
          if(this.screening(params) ) {
            if (params.owner == '') {
              this._setState(true, "版权方不能为空");
              return
            } 
            this.joinparam(_params,apiType)
          }else{
            return
          } 
        break;
      case 'tvserial':
          if(this.screening(params) ) {
            this.joinparam(_params,apiType)
          }else{
            return
          } 
        break;
      case 'movie':
          if(this.screening(params) ) {
            this.joinparam(_params,apiType)
          }else{
            return
          } 
        break;
      case 'Variety':
          if(this.screening(params) ) {
            this.joinparam(_params,apiType)
          }else{
            return
          } 
        break;
      case 'people':
        if (params.ipTypeNumber == '') {
          this._setState(true, "IP类型不能为空");
          return
        } else if (params.nationality == '') {
          this._setState(true, "国籍不能为空");
          return
        }  else if (params.profession == undefined || params.profession  == '') {
          this._setState(true, "职业不能为空");
          return
        } else if (params.nationality==undefined || params.nationality  == '') {
          this._setState(true, "国籍不能为空");
          return
        }  else {
          this.joinparam(_params,apiType)
        }
        break;
      default:
        return
    } 
    const { errorCode, result }: any = await createIp(apiType, params);
    if (errorCode === '200' && result === true) {
      this.setState({
        addIpState: true,
        message: '添加成功'
      });
    }
  }
  //提交时筛选参数
  screening = (params)=>{
    if (params.ipTypeNumber == '') {
      this._setState(true, "IP类型不能为空");
      return false
    } else if (params.countryTypes === '' || params.countryNames === '') {
      this._setState(true, "国家地区不能为空");
      return false
    } else{
      return true
    }
  }
  //提交时格式化参数
  joinparam = (_params,apiType) =>{
    const {copyrightAgent ,copyrightCertificateGuid,ownershipGuid,ipMaterialGuidList} = this.state;
    if(_params.authorizedLocation){
       _params.authorizedLocation = _params.authorizedLocation.join('/');
    }
   if(_params.authorizedType){
      _params.authorizedType = _params.authorizedType.join('/');
   }
   if(_params.grantedType){
     _params.grantedType = _params.grantedType.join('/');
   }
    if(_params.intentAuthorization){
      _params.intentAuthorization = _params.intentAuthorization.join('/'); 
    }
    
    if(apiType == 'people'){
       _params.ownershipGuid = ownershipGuid['guid'];
    }else{
      _params.ownershipGuid = ownershipGuid['guid'];
      _params.copyrightAgent = copyrightAgent['guid'];
      _params.copyrightCertificateGuid = copyrightCertificateGuid['guid'];
    }
    let guidlist = ipMaterialGuidList.map(val=>{
      return val.guid;
    })
    if(guidlist) _params.ipMaterialGuidList = guidlist.join(',') 

    let user = sessionStorage.getItem('user');
    _params.userGuid = JSON.parse(user).userGuid; 
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

  setPub = (obj) => {
    this.setState({ pub: { ...obj } });
  }
  setipMaterial = (obj) => {
    let { ipMaterialGuidList } = this.state;
    ipMaterialGuidList.push(obj);
    this.setState({ ipMaterialGuidList: ipMaterialGuidList }); 
  }
  setotherInput = (obj) => {
    this.setState(obj);
  }

  _processSubType = (type: string) => {
    if (!_isEmpty(type)) {
      return type.split(',')
        .filter(str => !_isEmpty(str));
    }
  };
  
  componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IUpdateState>, nextContext: any):void{
   
  }
  render() {
    let { nav_store, update } = this.props;
    let { headerNav, footerNav } = nav_store;
    let { typeList, typeListTop, subTypeList, locationList, modalityList, updateList, businessList } = update;
    subTypeList = toJS(subTypeList);
    subTypeList = this.process(subTypeList);
    locationList = this.process(locationList);
    locationList = toJS(locationList);
    modalityList = this.process(modalityList);
    modalityList = toJS(modalityList);
    let types = this.processKV(typeList, componentKeyValues); //返回每个类别对应的组建
    let apiNames = this.processKV(typeList, nameKeyValues);//返回每个类别对应的接口
    let ipNames = this.processKV(typeList, {});//返回后台id对应的中文名称  
    let type = this.state.pub.ipTypeSuperiorNumber; //获取当前的类别
    const Component = types[type]; //当前组建    
    const apiType = apiNames[type];//当前接口
    const { show, message, pic_img, addIpState, uploadShow, ruleShow,ipMaterialGuidList, fileType } = this.state;
    let { id }: any = this.props.match.params;
    let user = sessionStorage.getItem('user');
    let userGuid = JSON.parse(user).userGuid;  
    const { pub, pub: { ipName, ipTypeSuperiorNumber, ipTypeNumber, ipLocation, ipDesc, ipFormNumber }, isOn, isCaseOn } = this.state;
    let { iCheckStatus }: any = this.props.match.params;
    console.log("pub@")
    console.log(pub)
   
    // debugger
    return (
      <div className="update-container">
        <Header data={headerNav} history={this.props.history} />
        {uploadShow &&
          <UploadFileModel
            ipid={id}
            fileType={this.state.fileType}
            setipMaterial={this.setipMaterial}
            setotherInput={this.setotherInput}
            callback={this.callback}
            onClose={() => {
              this.setState({
                uploadShow: false
              });
            }
            } />
        }
        <Rule
          ruleShow={ruleShow}
           onClose={() => {
            this.setState({
              ruleShow: false
            });
          }} /> 
        {show &&
          <Alert
            message={message}
            onClose={() => {
              this.setState({ show: false });
            }}
            onSubmit={() => {
              this.setState({ show: false });
            }} />
        }
        
        }
        {
          updateList &&
          <div className="content-container flex-row">
            <div className="create-left-container">
              <div className="poster-area justify-content-center align-items-center">
                {
                  id &&
                  <div className="poster-img-container" style={{ border: 'none' }}>
                    <img className="poster-img" src={updateList.picUrl || default_img} alt="" />
                  </div>
                }
                {
                  !id &&
                  <div className="poster-img-container">
                    <img className="poster-img" src={this.state.result} alt="" />
                    <input type="file" onChange={async (e) => {
                      await this.uploadImg(e, 'pic_img');
                    }
                    } />
                    {
                      !pic_img && <span>上传封面</span>
                    }
                  </div>
                }
              </div>
            </div>
            {/* 公共部分  */}
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
                    className="form-control short-width backgroundWite" placeholder="填写IP公认的名称" />
                </div>

                <div className="form-group flex-column">
                  {/* IP类型 */}
                  <label className="input-label">IP分类<span className="label-dot">*</span></label>
                  <div className="radio-group flex-row flex-wrap">
                    {
                      !id && typeListTop && typeListTop.map((item: any) => {
                        let { pub } = this.state;
                        let { typeslect } = pub; //用来标记 当前选择的是哪个
                        let radioClicked = typeslect === item.mainTypeGuid ? "radio-selected" : "";
                        return (
                          <div
                            key={item.mainTypeGuid}
                            className={`ip-radio flex-row align-items-center ${radioClicked}`}
                            onClick={async () => {
                              let _typeslect = '';
                              if (item.mainTypeGuid !== typeslect) {
                                _typeslect = item.mainTypeGuid
                              }
                              this.setState({
                                pub: {
                                  ...pub,
                                  typeslect: _typeslect
                                }
                              });
                            }}>
                            <div className="limit-custom-radio" />
                            <span className="radio-text">{item.typeName || ""}</span>
                          </div>
                        );
                      })
                    } {
                      id && typeListTop && typeListTop.map((item: any) => {
                        let { pub } = this.state;
                        let { typeslect } = pub; //用来标记 当前选择的是哪个
                        typeslect = updateList.mainTypeGuid ;
                        let radioClicked = typeslect === item.mainTypeGuid ? "radio-selected" : ""; 
                       
                        return (
                          <div
                            key={item.mainTypeGuid}
                            className={`ip-radio flex-row align-items-center ${radioClicked}`}>
                            <div className="limit-custom-radio" />
                            <span className="radio-text">{item.typeName || ""}</span>
                          </div>
                        );
                      })
                    }
                  </div>
                  {
                    this.state.pub.typeslect && <div className="radio-group flex-row flex-wrap typeBlock">
                      {
                        typeList && typeList.map((item: any) => { 
                          let radioClicked = updateList.ipTypeSuperiorNumber == item.ipTypeNumber ? "radio-selected" : "";
                          let hide = '';
                          if(updateList.mainTypeGuid ){ 
                           hide = updateList.mainTypeGuid  === item.mainTypeGuid ? "" : "hide";
                          }else{ 
                             hide = this.state.pub.typeslect === item.mainTypeGuid ? "" : "hide";
                          }
                          
                          return (
                            <div
                              key={item.ipTypeNumber}
                              className={`ip-radio flex-row align-items-center ${hide} ${radioClicked}`}
                              onClick={async () => {
                                let { pub } = this.state;
                                let { ipTypeNumber, ipTypeSuperiorNumber } = pub;
                                if (ipTypeSuperiorNumber !== item.ipTypeNumber) {
                                  ipTypeNumber = [];
                                }
                                //切换IP分类时 清空子类参数值 
                                update.clearSub()
                                if (ipTypeSuperiorNumber) pub['clear'] = true;
                                this.setState({
                                  pub: {
                                    ...pub,
                                    ipTypeNumber,
                                    ipTypeSuperiorNumber: item.ipTypeNumber
                                  }
                                });
                                await update.setStatus({ ipTypeSuperiorNumber: item.ipTypeNumber });
                              }}>
                              <div className="limit-custom-radio" />
                              <span className="radio-text">{item.type || ""}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  }
                  {
                   id && updateList.mainTypeGuid && <div className="radio-group flex-row flex-wrap typeBlock">
                      {
                        typeList && typeList.map((item: any) => { 
                          let radioClicked = updateList.ipTypeSuperiorNumber == item.ipTypeNumber ? "radio-selected" : "";
                          let hide = updateList.mainTypeGuid  === item.mainTypeGuid ? "" : "hide";                           
                          return (
                            <div
                              key={item.ipTypeNumber}
                              className={`ip-radio flex-row align-items-center ${hide} ${radioClicked}`} >
                              <div className="limit-custom-radio" />
                              <span className="radio-text">{item.type || ""}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  }
                </div>
                {/* {
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
                                <div className="limit-custom-checkbox" />
                                <div className="checkbox-text">{item.ipType}</div>
                              </div>
                            );
                          }
                        })
                      }
                    </div>
                  </div>
                } */}

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
                                <div className="limit-custom-checkbox" />
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

              {Component && <Component callback={this.callback} id={id} pub={pub} setPub={this.setPub} />}
              {Component && updateList.ipTypeSuperiorNumber != 8 && <Upload callback={this.callback} id={id} pub={pub} setPub={this.setPub} ></Upload>}
              {Component && <Wangeditor callback={this.callback} id={id} pub={pub} setPub={this.setPub}></Wangeditor>}

              {
                id && Component && <div className="create-right-container flex-column">
                  <div className="business-header">
                    <div className="business-title">招商资料</div>
                    <button className="btn btn-primary limit-custom-btn" onClick={() => {
                        this.setState({
                          uploadShow: true,
                          fileType: {
                            type: 1,
                            text: '上传商务合作资料',
                            tip: '温馨提示：只支持PPT、PDF、Excel格式，单个文件大小在50M以内'
                          }
                        });
                    }}>上传资料
                    </button>
                  </div>
                  <label className="commonTip">注：文件格式支持PPT、Excel、PDF，单个文件大小限制在50M内</label>
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
                                      const result = await update.deleteMaterial(params); 
                                      this.callback({
                                          businessList:true
                                      }) 
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
              {
                !id && Component && <div className="create-right-container flex-column">
                  <div className="business-header">
                    <div className="business-title">招商资料</div>
                    <button className="btn btn-primary limit-custom-btn" onClick={() => {
                      this.setState({
                        uploadShow: true,
                        fileType: {
                          type: 1,
                          text: '上传商务合作资料',
                          tip: '温馨提示：只支持PPT、PDF、Excel格式，单个文件大小在50M以内'
                        }
                      });
                    }}>上传资料
                    </button>
                  </div>
                  <label className="commonTip">注：文件格式支持PPT、Excel、PDF，单个文件大小限制在50M内</label>
                  <div className="business-table">
                    <table className="table table-bordered table-striped table-hover business-info">
                      <thead>
                        <tr>
                          <th>资料名称</th>
                          <th>上传时间</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          ipMaterialGuidList && ipMaterialGuidList.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.title}</td>
                                <td>{moment(item.time).format('YYYY-MM-DD hh:mm:ss')}</td>
                                <td>

                                  {
                                    item.guid && <a onClick={async () => {
                                      ipMaterialGuidList.splice(index, 1)
                                      this.setState({ ipMaterialGuidList: ipMaterialGuidList });
                                      this._setState(true, '已删除');
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
              {
                Component && updateList.ipTypeSuperiorNumber != 8 && <div className="create-right-container  padding-bootom0 flex-column">
                  <p className="rules_Tip">
                    请将相关资质文件整理压缩成.zip格式且文件大小不超过10M后上传
                  </p>
                  <div className="rules_pull">
                    <div className="clearfix">
                      <div className="ruleText">代理商请提供与版权方签署的代理协议</div>                      
                      {
                        updateList.agencyAgreement && <a href={updateList.agencyAgreement} className="download" download="">下载</a>
                      }
                      <button className="file btn btn-primary limit-custom-btn" onClick={() => {
                        this.setState({
                          uploadShow: true,
                          fileType: {
                            type: 2,
                            text: '代理协议',
                            tip: '请将相关资质文件整理压缩成.zip格式且文件大小不超过10M后上传'
                          }
                        });
                      }}>上传资料
                    </button>
                    </div>
                    {
                      this.state.copyrightAgent['name'] && <p>{this.state.copyrightAgent['name']}</p>
                    }

                  </div>
                  <div className="rules_pull">
                    <div className="clearfix">
                      <div className="ruleText">版权方请提供国家版权登记证或境外版权证明文件</div>  
                      {
                        updateList.copyrightCertificate && <a href={updateList.copyrightCertificate} className="download" download="">下载</a>
                      }
                      <button className="file btn btn-primary limit-custom-btn" onClick={() => {
                        this.setState({
                          uploadShow: true,
                          fileType: {
                            type: 3,
                            text: '版权证明文件',
                            tip: '请将相关资质文件整理压缩成.zip格式且文件大小不超过10M后上传'
                          }
                        });
                      }}>上传资料
                    </button>
                    </div>
                    {
                      this.state.copyrightCertificateGuid['name'] && <p>{this.state.copyrightCertificateGuid['name']}</p>
                    }
                  </div>
                  <div className="rules_pull">
                    <div className="clearfix">
                      <div className="ruleText">能够证明IP所有权的相关文件</div>
                      {
                        updateList.ownership && <a href={updateList.ownership} className="download" download="">下载</a>
                      }
                      <button className="file btn btn-primary limit-custom-btn" onClick={() => {
                        this.setState({
                          uploadShow: true,
                          fileType: {
                            type: 4,
                            text: '所有权相关文件',
                            tip: '请将相关资质文件整理压缩成.zip格式且文件大小不超过10M后上传'
                          }
                        });
                      }}>上传资料
                    </button>
                    </div>
                    {
                      this.state.ownershipGuid['name'] && <p>{this.state.ownershipGuid['name']}</p>
                    }
                  </div>

                </div>
              }
              {
                Component && updateList.ipTypeSuperiorNumber == 8 && <div className="create-right-container  padding-bootom0 flex-column">
                  <p className="rules_Tip">
                    请将相关资质文件整理压缩成.zip格式且文件大小不超过10M后上传
                </p>
                  <div className="rules_pull">
                    <div className="clearfix">
                      <div className="ruleText">经纪公司请提供与艺人签署的经纪合同</div>
                      <button className="file btn btn-primary limit-custom-btn" onClick={() => {
                        this.setState({
                          uploadShow: true,
                          fileType: {
                            type: 4,
                            text: '所有权相关文件',
                            tip: '请将相关资质文件整理压缩成.zip格式且文件大小不超过10M后上传'
                          }
                        });
                      }}>上传资料
                    </button>
                    </div>
                    {
                      this.state.ownershipGuid['name'] && <p>{this.state.ownershipGuid['name']}</p>
                    }
                  </div>
                </div>
              }
              {
                Component && <div className="create-right-container flex-column foot-rule">
                  <div className="cheked_rules">
                    {
                      this.state.isReading ? <div className="cheked limit-custom-checkbox"
                        onClick={() => {
                          this.setState({
                            isReading: false
                          })
                        }}></div> : <div className="cheked"
                          onClick={() => {
                            this.setState({
                              isReading: true
                            })
                          }}></div>
                    }
                    <p className="">  我已阅读并同意 <a onClick={()=>{
                        this.setState({ ruleShow: true });
                        }}>《版圈儿平台用户管理规定及信息处理协议》</a>，并为本单位所上传IP信息和数据的合法性、真实性负责。
                  </p>
                  </div>
                </div>
              }

            </div>


          </div>
        }

        <div className="create-area">
          {
            // 新增IP
            !id &&  <div className="form-group flex-row justify-content-center align-items-center">
                {this.state.isReading ? <button
                  className="btn btn-primary publish-btn"
                  onClick={async () => {
                    await this.addIp(apiType);
                  }}>
                  提交
                </button> : <button className="btn btn-primary publish-btn nocheck">提交</button>}

                <button className="btn btn-default reset-btn"
                  onClick={async () => {
                    await this.clearstore();
                  }}>重置
                </button>
              </div> 
          }
          {
            id && this.state.isReading && <div className="form-group flex-row justify-content-center align-items-center">{ 
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
          {
           id && !this.state.isReading && <div className="form-group flex-row justify-content-center align-items-center">
                <button className="btn btn-primary nocheck publish-btn">更新
                </button>
          </div>
          }
        </div>
        
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
                    this.props.history.push('/user/1')
                  }}>
                  查看结果
                </button>
              </div>
            </div>
          </div>
        }
        <Footer data={footerNav} />
      </div>
    );
  }
}
