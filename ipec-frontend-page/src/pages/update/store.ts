import { action, observable, toJS } from "mobx";
import {
  reqIpTypeList,
  upload,
  getIpDetail,
  getDownload,
  getDownloadMaterial,
  delMaterial,
  uploadBusinessData, listCompany
} from "@utils/api";

interface IupdateStatus {
  pub: object,
  sub: object,
  data: object,
}

interface IUpdateState {
  ipName: string,
  ipTypeSuperiorNumber: string,
  ipLocation: string,
  ipTypeNumber: string,
  ipDesc: string,
  ipFormNumber: string,
  ipPicGuid: string,
  sex?: string,
  height?: number,
}

class CreateStore {
  @observable
  previousData: any = {};

  @observable typeList: object[];
  @observable subTypeList: object[];
  @observable locationList: object[];
  @observable modalityList: object[] = [];
  // @observable updateList: {};
  @observable updateList: IUpdateState = {
    ipName: "",
    ipTypeSuperiorNumber: '',
    ipLocation: '',
    ipTypeNumber: '',
    ipDesc: "",
    ipFormNumber: '',
    ipPicGuid: '',
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
    data: {},
  };

  @action
  async ipTypeList() {
    let { errorCode, result }: any = await reqIpTypeList();
    if (errorCode === "200") {
      let typeList: object[] = [];
      let subTypeList: object[] = [];
      let locationList: object[] = [];
      let modalityList: object[] = [];

      result.forEach((item: any) => {
        let { ipType: type, ipTypeNumber, sublist } = item;
        typeList.push({ type, ipTypeNumber });
        sublist.forEach((val: any) => {
          let { ipType, sublist: sub } = val;
          if (ipType === "地区") {
            let location = { [ipTypeNumber]: sub };
            locationList.push(location);
          }
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
      this.typeList = typeList;
      this.subTypeList = subTypeList;
      this.locationList = locationList;
      this.modalityList = modalityList;
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
      ipLocation: '',
      ipTypeNumber: '',
      ipDesc: "",
      ipFormNumber: '',
      ipPicGuid: ''
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
    const { ipid, ipTypeNumber }: { ipid: number, ipTypeNumber: number } = params;
    let { errorCode, result }: any = await getIpDetail({
      ipid, ipTypeNumber
    });
    if (errorCode === '200') {
      this.updateList = result;
    }
  }

  @action
  async setStatus(params: IupdateStatus) {
    this.updateList = { ...this.updateList, ...params };
    // console.log(this.updateList);
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
  async companyList() {
    const { errorCode, result }: any = await listCompany();
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
