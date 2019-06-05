import { action, observable } from "mobx";
import { reqNavList, mediaType } from "@utils/api";

class HeaderStore {
  @observable headerNav: any[] = [];
  @observable footerNav: any[] = [];

  @action
  async navList() {
    let data: any = await reqNavList();
    let _data: any = await mediaType();
    const { errorCode, result }: { errorCode: string, result: Array<any> } = data;
    if (errorCode === "200") {
      let headNav: any[] = [];
      let footNav: any[] = [];
      result.forEach(item => {
        let type = item.navAdd;
        let specail = item.navName;
        if (type === "1") {
          headNav.push(item);
        } else if (type === "2" && specail !== "联系我们") {
          footNav.push(item);
        }
      });
      headNav.forEach(item => {
        if (item.navName === 'IP库') {
          item.sublist = _data && _data.result;
        }
      });
      this.headerNav = headNav;
      this.footerNav = footNav;
    }
  }

}

export default new HeaderStore();
