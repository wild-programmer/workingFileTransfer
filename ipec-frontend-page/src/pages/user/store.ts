import { action, observable } from "mobx";
import {
  editUserInformation,
  onCodeReg,
  resetPassword,
  listCompany,
  RealNameAuthentication,
  setUserInformation,
  getMyUpdate, myRelease, deleteMyRelease,
  getUserInfo

} from "@utils/api";

class UserStore {
  @observable myUpdateList: object[];
  @observable myReleaseList: object[];

  @action
  async login() {

  }

  @action
  async logout() {

  }

  @action
  async userInformation({ code, email, mobile, receiverType, userGuid }: { code: string, email: string, mobile: string, receiverType: number, userGuid: string }) {
    const { errorCode, result = {} }: any = await editUserInformation({ code, email, mobile, receiverType, userGuid });
    if (errorCode === "200" && result.errorCode === 200) {
      return { result: result, request: true };
    } else {
      return { result: result, request: false };
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
      return {request:true};
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg ,request:false};
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

  @action
  async RealAuthentication({ papersPicGuid, picGuid, userGuid, userRealName }: { papersPicGuid: string, picGuid: string, userGuid: string, userRealName: string }) {
    const { errorCode, result = {} }: any = await RealNameAuthentication({
      papersPicGuid,
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
      return {result:result,request:true};
    } else if (result.errorCode < 0) {
      return {result:result,request:false};
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

  @action
  async getUserInfo(userGuid:string) {
    const { errorCode, result }: any = await getUserInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      return { message:result.data, request: true };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    } 
  }

}

export default new UserStore();
