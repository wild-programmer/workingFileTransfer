import { action, observable } from "mobx";
import {
  getlistIp,
  getScreening,
  getAcquire,
  getPortrait,
  getbusiness,
  getBoxOffice,
  getWbWord,
  getPlayTrends,
  getPraise,
  getFansArea
} from "@utils/api";

interface IUpdateState {
  listIp:object,
  message:string,
  Acquire:object,
 
  dataScreening:object,
  interate:object,
  media:object,
  fans:object,
  business:object,
  landResults:object,
  isMoveData:object,
  dataPraise:object,
  isTvData:object,
  ipProvinceData:any,
  Portrait:{
    gender:object,
    age:object,
  },  
}
interface IObj {
  value: string | number;
  name: string | number;
}

class UserStore {
  @observable myUpdateList: object[];
  @observable myReleaseList: object[];


  @observable updateList:IUpdateState = {
    listIp:null, 
    message:'', 
    dataScreening:null, 
    Acquire:null, 
    interate:null, 
    media:null, 
    business:null, 
    fans:null, 
    isMoveData:null, 
    isTvData:null, 
    landResults:null, 
    dataPraise:null, 
    ipProvinceData:null, 
    Portrait:{
      gender:null,
      age:null,
    },  

  };
  @action
  async login() {

  }

  @action
  async logout() {

  }
  
  async creactData(params){
    await this.getlistIp(params);
    await this.getScreening(params); 
    await this.getbusiness(params); 
    console.log("this.updateList@");
    console.log(this.updateList);
  }

  @action
  async getlistIp(params) {
    const {ipids} = params; 
    const { errorCode, result }: any = await getlistIp({ipids});
    if (errorCode === "200" ) {
      this.updateList.listIp = result;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    } 
  }
  //获取互动 搜索指数
  
  async getAcquire(params) {
    const {userGuid, typeId, ipids,dayNumber} = params; 
    const { errorCode, result }: any = await getAcquire({userGuid, typeId, ipids,dayNumber});
    if (errorCode === "200" ) {
      if(typeId == 5) this.updateList.Acquire = result.data;
      if(typeId == 41 || typeId == 40 || typeId == 9 || typeId == 10) this.updateList.interate = result.data;
      if(typeId == 13 || typeId == 8 || typeId == 15 ) this.updateList.media = result.data;
      if(typeId == 14 || typeId == 33 ) this.updateList.fans = result.data;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    } 
  }
  //获取地区
  // async getFansArea(params) { 
  //   const {userGuid, typeId, ipid} = params;  
  //   const { errorCode, result }: any = await getFansArea({userGuid, typeId, ipid});
  //   if (errorCode == "200" ) {
  //     if(typeId == 3) this.updateList.landResults = result.data; 
  //   } else if (result.errorCode < 0) {
  //     return { message: result.errorMsg, request: false };
  //   } 
  // }


  /**
   * 地区分布（3 省份 ，4 区域）；
   */
  async getFansArea(params) {
      const {userGuid, typeId, ipid} = params;   
    const { errorCode, result: { errorMsg, data, errorCode: ecode } }: any = await getFansArea({
      userGuid, ipid, typeId
    });
    let ipSexData: object[] = [];
    let ipProvinceData: object[] = [];
    let ipAreaData: object[] = [];
    let xProvince: string[] = [];
    let yProvince: string[] = [];
    let ageData: string[] = [];
    let agePercent: string[] = [];
    let xArea: string[] = [];
    let yArea: string[] = [];

    if (errorCode === "200" && ecode > 0) {
      // 1年龄，2性别，3地区，4区域
      if (typeId === 1 && data) {
        data.forEach((it) => {
          ageData.push(it.dataNumber);
          agePercent.push(it.dataType);
        });
        this.updateList['ageData'] = ageData.reverse();
        this.updateList['agePercent'] = agePercent.reverse();
      } else if (typeId === 2 && data) {
        data.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType,
          };
          ipSexData.push(obj);
        });
        this.updateList['ipSexData'] = ipSexData;
      } else if (typeId === 3 && data) {
        data.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType.replace(/\省|\市/g, ''),
          };
          xProvince.push(it.dataNumber);
          yProvince.push(it.dataType);
          if (yProvince.length > 10) {
            yProvince = yProvince.slice(0, 10);
          }
          if (xProvince.length > 10) {
            xProvince = xProvince.slice(0, 10);
          }
          ipProvinceData.push(obj);
        });
        this.updateList.ipProvinceData = ipProvinceData;
        this.updateList['xProvince'] = xProvince.reverse();
        this.updateList['yProvince'] = yProvince.reverse();
      } else {
        data.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType,
          };
          xArea.push(it.dataNumber);
          yArea.push(it.dataType);
          ipProvinceData.push(obj);

        });
        this.updateList['ipAreaData'] = ipAreaData;
        this.updateList['xArea'] = xArea.reverse();
        this.updateList['yArea'] = yArea.reverse();
      }
    } else {
      return errorMsg;
    }
  }

  async getPortrait(params) { 
    const {userGuid, typeId, ipids} = params; 
    const { errorCode, result }: any = await getPortrait({userGuid, typeId, ipids});
    if (errorCode === "200" ) {
      if(typeId == 1) this.updateList.Portrait.gender = result.data;
      if(typeId == 2) this.updateList.Portrait.age = result.data; 
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    } 
  }
  //获取口碑信息
  async getPraise(params) {
    const {ipids,userGuid} = params; 
    const { errorCode, result }: any = await getPraise({ipids,userGuid}); 
    if (errorCode === "200" && result.errorCode == '200') {
      this.updateList.dataPraise = result.data;
    } else if (result.errorCode < 0) {  
      this.updateList.message =  result.errorMsg
    } 
  }

  //获取词云
  async getWbWord(params) {
    const {ipids,userGuid} = params; 
    const { errorCode, result }: any = await getWbWord({ipids,userGuid}); 
    if (errorCode === "200" && result.errorCode == '200') {
      this.updateList.dataScreening = result.data;
    } else if (result.errorCode < 0) {  
      this.updateList.message =  result.errorMsg
    } 
  }
  async getScreening(params) {
    const {ipids,ipTypeSuperiorNumber,userGuid} = params; 
    const { errorCode, result }: any = await getScreening({ipids,ipTypeSuperiorNumber,userGuid}); 
    if (errorCode === "200" && result.errorCode == '200') {
      this.updateList.dataScreening = result.data;
    } else if (result.errorCode < 0) {  
      this.updateList.message =  result.errorMsg
    } 
  }

  //平台数据对比
  async getPlayTrends(params) {
    const {ipids,userGuid,type} = params; 
    const { errorCode, result }: any = await getPlayTrends({ipids,userGuid,type});  
    if (errorCode === "200" && result.errorCode == '200') {
      this.updateList.isTvData = result.data;
    } else if (result.errorCode < 0) {  
      this.updateList.message =  result.errorMsg
    } 
  }
  //院线票房对比
  async getBoxOffice(params) {
    const {ipids,userGuid} = params; 
    const { errorCode, result }: any = await getBoxOffice({ipids,userGuid}); 
    if (errorCode === "200" && result.errorCode == '200') {
      this.updateList.isMoveData = result.data;
    } else if (result.errorCode < 0) {  
      this.updateList.message =  result.errorMsg
    } 
  }
  async getbusiness(params) {
    const {ipids,ipTypeSuperiorNumber,userGuid} = params; 
    const { errorCode, result }: any = await getbusiness({ipids,ipTypeSuperiorNumber,userGuid}); 
    if (errorCode === "200" && result.errorCode == '200') {
      this.updateList.business = result.data;
    } else if (result.errorCode < 0) {  
      this.updateList.message =  result.errorMsg
    } 
  }

}

export default new UserStore();
