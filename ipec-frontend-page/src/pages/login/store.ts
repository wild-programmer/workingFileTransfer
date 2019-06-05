import { action } from "mobx";
import { reqLogin } from "@utils/api";

class LoginStore {
  @action
  async doLogin(params) {
    // const { userLogin, userPass, remember }: any = params;
    const { userLogin, userPass }: any = params;
    const { errorCode, result = {} }: any = await reqLogin({ userLogin, userPass });
    if (errorCode === "200" && result.errorCode === 200) { 
      sessionStorage.setItem("user", JSON.stringify(result.data));
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

  @action
  async logout() {

  }

}

export default new LoginStore();
