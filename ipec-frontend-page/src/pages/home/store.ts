import { action, observable, toJS } from "mobx";
import { ipPublic, mediaType, reqBannerList, reqModuleList } from "@utils/api";

const muduleKV = {
  1: "coreProduct",
  2: "cooperateIp",
  4: "industryCase",
  5: "cooperatePartner",
};

class HomeStore {

  @observable slides: object[];
  // @observable modules: object[];

  @observable modules: object = {
    coreProduct: [],
    cooperateIp: [],
    industryCase: [],
    cooperatePartner: [],

  };
  @observable publicData: object[];
  @observable typeData: object[];

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
      // this.modules = result;
      result.forEach((item) => {
        this.modules[muduleKV[item.moduleId]] = item.sublist;
        // this.modules[muduleKV[item.moduleId]] = item;
      });
    }
  }

  async getPublicIP(param) {
    let { errorCode, result }: any = await ipPublic(param);
    if (errorCode === "200") {
      this.publicData = result;
    }
  }

  async mediaType() {
    let { errorCode, result }: any = await mediaType( );
    if (errorCode === "200") {
      this.typeData = result;
    }
  }
}

export default new HomeStore();
