import { action, observable } from "mobx";
import { reqBannerList, reqModuleList } from "@utils/api";

class HomeStore {

  @observable slides: object[];
  @observable modules: object[];

  @action
  async slideList() {
    let { errorCode, result }: any = await reqBannerList();
    if (errorCode === "200") {
      this.slides = result;
    }
  }

  async moduleList() {
    let { errorCode, result }: any = await reqModuleList();
    if (errorCode === "200") {
      this.modules = result;
    }
  }
}

export default new HomeStore();
