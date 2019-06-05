import { action, observable, toJS } from "mobx";
import {
  editUserInformation,
  onCodeReg,
  resetPassword,
  listCompany,
  RealNameAuthentication,
  setUserInformation,
  getMyUpdate, myRelease, deleteMyRelease,
  getUserInfo, companyCerfication, listCountry,
  getCompanyInfo,

} from "@utils/api";

interface IPersonDataState {
  userRealName: string;
  papersPic: string;
  cardPic: string;
  papersPositivePic: string;
}

interface ICompanyState {
  companyData: {
    ipPicGuid: string;
    companyName: string;
    companyType: any[];
    companySelected: any[];
    companyCountries: string;
    businessLicenseGuid: string;
    companyTelephone: string;
    companyMailbox: string;
    companyAddress: string;
    companyDesc: string;
    logoPic: string;
    businessLicense: string;
  }
}

class UserStore {
  @observable myUpdateList: object[];
  @observable myReleaseList: object[];
  @observable realStatus: number = 0;
  @observable personInfo: object = {};
  @observable companyInfo: object = {};

  @observable countryData: object[];

  @observable personData: IPersonDataState = {
    userRealName: '',
    papersPic: '',
    cardPic: '',
    papersPositivePic: '',
  };

  @observable companyData: ICompanyState = {
    companyData: {  // 公司认证字段
      ipPicGuid: '',
      companyName: '',
      companyType: [],
      companySelected: [
        { name: "版权方", id: 7, },
        { name: "代理方", id: 3, },
        { name: "品牌方", id: 8, },
        { name: "授权方", id: 9, },
        { name: "零售商", id: 10, },
        { name: "服务商", id: 11, },
      ],
      companyCountries: '',
      businessLicenseGuid: '',
      companyTelephone: '',
      companyMailbox: '',
      companyAddress: '',
      companyDesc: '',
      logoPic: '',
      businessLicense: '',
    }
  };

  @action
  async userInformation({ code, email, mobile, receiverType, userGuid }: { code: string, email: string, mobile: string, receiverType: number, userGuid: string }) {
    const { errorCode, result = {} }: any = await editUserInformation({ code, email, mobile, receiverType, userGuid });
    if (errorCode === "200" && result.errorCode === 200) {
      return { result, request: true };
    } else {
      return { result, request: false };
    }
  }

  @action
  async getEditCode({ userLogin, receiverType, sendType }) {
    const { errorCode, result = {} }: any = await onCodeReg({ userLogin, receiverType, sendType });
    if (errorCode === "200" && result.errorCode === 200) {
      return { message: result.errorMsg, request: true };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  @action
  async updataPassword({ oldUserPass, userGuid, userPass }) {
    const { errorCode, result = {} }: any = await resetPassword({ oldUserPass, userGuid, userPass });
    if (errorCode === "200" && result.errorCode === 200) {
      return { request: true };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  @action
  async getCompanyList() {
    const { errorCode, result = {} }: any = await listCompany();
    if (errorCode === "200") {
      return result;
    } else if (result.errorCode < 0) {
      return false;
    }
  }

  /**
   * 实名认证
   * @param papersPicGuid
   * @param papersPositivePicGuid
   * @param picGuid
   * @param userGuid
   * @param userRealName
   * @constructor
   */
  @action
  async RealAuthentication(
    { papersPicGuid, papersPositivePicGuid, picGuid, userGuid, userRealName }:
      { papersPicGuid: string, papersPositivePicGuid: string, picGuid: string, userGuid: string, userRealName: string }
  ) {
    const { errorCode, result = {} }: any = await RealNameAuthentication({
      papersPicGuid, papersPositivePicGuid,
      picGuid,
      userGuid,
      userRealName
    });
    if (errorCode === "200" && result.errorCode === -1) {
      return { result: result.errorMsg, request: true };
    } else {
      return { result: result.errorMsg, request: false };
    }
  }

  @action
  async setInformation({ companyGuid, companyName, companyType, desc, job, picGuid, userGuid, userNickname, userRealName }) {
    const { errorCode, result = {} }: any = await setUserInformation({
      companyGuid,
      companyName,
      companyType,
      desc,
      job,
      picGuid,
      userGuid,
      userNickname,
      userRealName
    });
    if (errorCode === "200" && result.errorCode === 200) {
      return { result, request: true };
    } else if (result.errorCode < 0) {
      return { result, request: false };
    }
  }

  @action
  async getUpdate(params) {
    const { errorCode, result }: any = await getMyUpdate(params);
    if (errorCode === '200') {
      this.myUpdateList = result;
    }
  }

  @action
  async myRelease(params) {
    const { errorCode, result }: any = await myRelease(params);
    if (errorCode === '200') {
      this.myReleaseList = result;
    }
  }

  @action
  async deleteMyRelease(params) {
    const { errorCode, result }: any = await deleteMyRelease(params);
    if (errorCode === '200' && result.errorCode === 200) {
      return {
        msg: result.errorMsg
      };
    }
  }

  /**
   * 获取个人信息
   * @param userGuid
   */
  @action
  async getUserInfo(userGuid: string) {
    const { errorCode, result }: any = await getUserInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      this.personInfo = result.data;
      // return { message: result.data, request: true };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  /**
   * 获取公司信息
   * @param userGuid
   */
  @action
  async getCompanyInfo(userGuid: string) {
    const { errorCode, result }: any = await getCompanyInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      this.companyInfo = result.data;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  @action
  async setStatus(params: ICompanyState) {
    // const { companyData: { params } } = this.companyData;
    this.companyData['companyType'] = { ...params };
    console.log(toJS(this.companyData));
  }

  /**
   * 企业认证
   * @param params
   */
  @action
  async companyCerfiticate(params) {
    const { errorCode, result }: any = await companyCerfication(params);
    if (errorCode === "200" && result.errorCode === 200) {
      return { message: result.errorMsg, request: true };
    } else {
      return { message: result.errorMsg, request: false };
    }
  }

  /**
   * 国别
   */
  @action
  async listCountry() {
    const { errorCode, result }: any = await listCountry();
    if (errorCode === "200") {
      this.countryData = result;
    }
  }

}

export default new UserStore();
