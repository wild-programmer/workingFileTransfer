import { action, observable, toJS } from "mobx";
import {
  reqIpTypeList,
  upload,
  getIpDetail,
  getDownload,
  getDownloadMaterial,
  delMaterial,
  uploadBusinessData, listCompany,listMainType,listCountry
} from "@utils/api";
import { async } from "q";

interface IupdateStatus {
  pub: object,
  sub: object,
  showDate: object,
}

interface IUpdateState {
  ipName: string, //IP名称
  ipTypeSuperiorNumber: string, //IP分类 IP形象等一级类型guid
  ipDesc: string, //IP 简介
  detail:string,//图文详情
  ipLocation: string, //废弃
  countryNames:string, //国家名字
  countryTypes:string,//国家编号
  ipTypeNumber: string,//IP类型 ip二级类型guid， 
  owner:string,// IP版权方
  copyrightAgent:string, //ip版权代理方
  recordCountry:string,//ip备案国
  grantedType: string,//已授权品类
  authorizedType: string,//可授权品类
  intentAuthorization: string,//意向授权品类
  authorizedLocation: string,//可授权区域
  authorizedAllottedTime: string,//可授权期限日期
  isTransferable : Number,//是否可以转授权
  ipMaterialGuidList:string,//商务资料
  ipFormNumber: string,
  ipPicGuid: string,
  sex?: string,
  height?: number, 
  
  prodect: Array<object>;
  cooperationCase: Array<object>,
}


class CreateStore {
  @observable
  previousData: any = {};
  //记录新添加类别的状态
  @observable typeListCase: object = {
    selected: '', 
    clearditor:false,
  };
  @observable typeList: object[];
  @observable typeListTop: object[];
  @observable subTypeList: object[];
  @observable locationList: object[];
  @observable modalityList: object[] = [];
  // @observable updateList: {};
  @observable updateList: IUpdateState = {
    ipName: "",
    ipTypeSuperiorNumber: '',
    ipLocation: '1',
    ipTypeNumber: '',
    ipDesc: "",
    detail:'',
    ipFormNumber: '',
    ipPicGuid: '',
    countryNames:'',
    countryTypes:'',
    owner:'',// IP版权方
    copyrightAgent:'',
    recordCountry:'',
    grantedType: undefined,//已授权品类
    authorizedType: undefined,//可授权品类
    intentAuthorization: undefined,//意向授权品类
    authorizedLocation: undefined,//可授权区域
    authorizedAllottedTime: '',//可授权期限日期
    isTransferable : 0,//是否可以转授权  
    ipMaterialGuidList:'',//商务资料
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
  @observable businessList: [];
  @observable companyData: [];

  @observable status: IupdateStatus = {
    pub: {
      ipName: '',
      ipTypeSuperiorNumber: '',
      ipLocation: '',
      ipTypeNumber: [],
      ipDesc: '',
      ipFormNumber: [],
      ipPicGuid: ''
    },
    sub: {},
    showDate: {},
  };

//切换IP分类时 仅限新增IP 清空参数值
clearSub(){
  let _updateList = null;
  _updateList =  JSON.stringify(this.updateList); 
  //  JSON.
  _updateList = JSON.parse(_updateList); 
   delete _updateList.ipName;
   delete _updateList.ipTypeSuperiorNumber;
   delete _updateList.ipDesc;  
  for( let val in _updateList){
    if(val == 'authorizedLocation' || val == 'authorizedType' || val == 'grantedType' || val == 'intentAuthorization'){
      _updateList[val] = undefined
    }else if(val == 'prodect'||val == 'cooperationCase'){
      _updateList[val] =  [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ] 
    } else{
      _updateList[val] = '' 
    }    
  } 
  this.updateList = { ...this.updateList, ..._updateList };
  console.log(this.updateList)
 }

//获取最新 IP 分类
@action
async getlistMainType() { 
  await this.getLocation(); 
  const { errorCode, result }: any = await listMainType();
  if (errorCode === "200") {
    let typeList: object[] = [];
    let _typeListTop: object[] = [];
    result.forEach(element => { 
      let { childTypeList, mainTypeGuid, picUrl, typeName } = element;  
      childTypeList && childTypeList.forEach(val => {
        val['mainTypeGuid'] = mainTypeGuid;
        val['type'] = val.ipType;
        typeList.push(val);
      }); 
      _typeListTop.push({ mainTypeGuid, picUrl, typeName })
    });
    this.typeList = typeList;
    this.typeListTop = _typeListTop;
    console.log("typeList@------")
    console.log(typeList)
  }
}
//修改之前的 IP分类 (二级分类菜单)
  @action
  async ipTypeList() {
    let { errorCode, result }: any = await reqIpTypeList();
    if (errorCode === "200") { 
      let subTypeList: object[] = [];
      let modalityList: object[] = [];

      result.forEach((item: any) => {
        let { ipType: type, ipTypeNumber, sublist } = item; 
        sublist.forEach((val: any) => {
          let { ipType, sublist: sub } = val;
          
          if (ipType === "类型") {
            let subtype = { [ipTypeNumber]: sub };
            subTypeList.push(subtype);
          }
          if (ipType === "形式") {
            let modality = { [ipTypeNumber]: sub };
            modalityList.push(modality);
          }
        });
      }); 
      this.subTypeList = subTypeList;
      this.modalityList = modalityList; 
    }
  }

@action
async getLocation (){
  let { errorCode, result }:any = await listCountry();
  let _locationList: object[] = [];   
  if(errorCode === "200"){ 
    result.forEach((item:any)=>{
      _locationList.push(item);
    })  
    this.locationList = _locationList;
    return _locationList
  } 
}

  @action
  async upload(params) {
    let { errorCode, result }: any = await upload(params);
    if (errorCode === 200) {
      console.log(result);
    }
  }

  @action
  async doRest() {
    this.updateList = { 
      ipName: "",
      ipTypeSuperiorNumber: '',
      ipLocation: '1',
      ipTypeNumber: '',
      ipDesc: "",
      detail:'',
      ipFormNumber: '',
      ipPicGuid: '',
      countryNames:'',
      countryTypes:'',
      owner:'',// IP版权方
      copyrightAgent:'',
      recordCountry:'',
      grantedType: undefined,//已授权品类
      authorizedType: undefined,//可授权品类
      intentAuthorization: undefined,//意向授权品类
      authorizedLocation: undefined,//可授权区域
      authorizedAllottedTime: '',//可授权期限日期
      isTransferable : 0,//是否可以转授权
      ipMaterialGuidList:'',//商务资料
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

  @action
  async getBasic(params: IupdateStatus, param) {
    await this.setStatus(params);
    await this.getUpdateDetail(param);
  }

  // 获取编辑页的基本信息
  @action
  async getUpdateDetail(params) {
    const { ipid, ipTypeNumber,userGuid }: { ipid: number, ipTypeNumber: number ,userGuid:any} = params;
    let { errorCode, result }: any = await getIpDetail({
      ipid, ipTypeNumber,userGuid
    });
    if (errorCode === '200') {
      for( let val in result.data){
        if(val == 'authorizedLocation' || val == 'authorizedType' || val == 'grantedType' || val == 'intentAuthorization'){
          if(result.data[val] == '' || result.data[val] === undefined) result.data[val] = undefined;
        }
      }
      this.updateList = result.data;
    }
  }

  @action
  async setStatus(params) {

    this.updateList = { ...this.updateList, ...params };  
    console.log("this.updateList@") 
  }
  async setStatus2(params) {
    this.updateList = { ...this.updateList, ...params };  
  }

  // 招商资料列表
  @action
  async getDownload({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getDownload(ipid);
    if (errorCode === "200") {
      this.businessList = result;
    }
  }

  /**
   * 上传商务资料
   * @param params
   */
  @action
  async getBusiness(params) {
    const { errorCode, result }: any = await uploadBusinessData(params);
    if (errorCode === '200' && result.errorCode === 200) {

    } else if (result.errorCode < 0) {
      return { message: result.message };
    }
  }

  // 下载招商资料
  // async downloadMaterial(params) {
  //   const { errorCode, result }: any = await getDownloadMaterial(params);
  //   if (errorCode === '200' && result.errorCode === 200) {
  //   } else if (result.errorCode < 0) {
  //     return { message: result.errorMsg };
  //   }
  // }

  /**
   *  删除
   * @param dataURI userGuid materialGuid
   * 刷新页面
   */
  @action
  async deleteMaterial(params) {
    const { errorCode, result }: any = await delMaterial(params);
    if (errorCode === '200' && result.errorCode === 200) {

    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

  /**
   * 经济公司
   * @param dataURI
   */
  @action
  async companyList({companyName,currentPage,pageSize}) {
    const { errorCode, result }: any = await listCompany({companyName,currentPage,pageSize});
    if (errorCode === '200') {
      this.companyData = result;
      return result
    }
  }

  // base64 转二进制文件
  @action
  async dataURItoBlob(dataURI: any) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

}

export default new CreateStore();
