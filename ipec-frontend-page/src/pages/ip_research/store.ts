import { action, observable, toJS } from "mobx";
import { industryOrder, firstOrder, industryCase, hotWords } from "@utils/api";

interface IIndustryStatus {
  ipTypeSuperiorNumber?: string,
  portalCategoryGuid?: string,
  hotWords?: string,
  userGuid?: string,
  currentPage: number,
  pageSize: number,
}

class IndustryStore {
  @observable industryList: object[];
  @observable firstOrderList: object[];
  @observable industryCaseList: object[] = [];
  @observable industryTotalPage: number;
  @observable industryParams: IIndustryStatus = {
    ipTypeSuperiorNumber: "",
    portalCategoryGuid: "",
    userGuid: "",
    hotWords: "",
    currentPage: 1,
    pageSize: 15,
  };
  @observable hotWords: object[];

  /**
   * 更新
   * @param params
   */
  @action
  async setStatus(params: IIndustryStatus) {
    this.industryParams = { ...this.industryParams, ...params };
  }

  /**
   * 一级分类
   */
  @action
  async firstOrders() {
    let { errorCode, result }: any = await firstOrder();
    if (errorCode === '200') {
      this.firstOrderList = result;
    }
  }

  /**
   * 行业分类
   */
  @action
  async industry() {
    const { errorCode, result }: any = await industryOrder();
    if (errorCode === '200') {
      this.industryList = result;
    }
  }

  /**
   * 行业案例列表
   * @param params
   */
  @action
  async industryCase() {
    const {
      ipTypeSuperiorNumber,
      portalCategoryGuid,
      hotWords,
      userGuid,
      currentPage,
      pageSize
    } = this.industryParams;

    const { errorCode, result: { data, totalCount, totalPage } }: any = await industryCase({
      ipTypeSuperiorNumber,
      portalCategoryGuid,
      hotWords,
      userGuid,
      currentPage,
      pageSize
    });
    if (errorCode === "200" && data !== null) {
      this.industryCaseList = this.industryCaseList.concat(data);
      if (currentPage === 1) {
        this.industryCaseList = data;
      }
      this.industryTotalPage = totalPage;
    }

  }

  @action
  async getHotWords(params) {
    const { errorCode, result }: any = await hotWords(params);
    if (errorCode === '200') {
      this.hotWords = result;
    }
  }

  @action
  async logout() {

  }

}

export default new IndustryStore();
