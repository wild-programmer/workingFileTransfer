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
