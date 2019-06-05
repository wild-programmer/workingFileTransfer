import { action } from "mobx";
import { onCodeReg, onRegister } from "@utils/api";

class RegisterStore {
  @action
  async onRegister(params) {
    const { userLogin, code, userPass }: any = params;
    const { errorCode, result = {} }: any = await onRegister({ userLogin, code, userPass });
    if (errorCode === "200" &&  result.errorMsg === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

  @action
  async onCodeReg(params) {
    const { userLogin, receiverType, sendType }: any = params;
    const { errorCode, result = {} }: any = await onCodeReg({ userLogin, receiverType, sendType});
    if (errorCode === "200" &&  result.errorMsg === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }
}

export default new RegisterStore();
