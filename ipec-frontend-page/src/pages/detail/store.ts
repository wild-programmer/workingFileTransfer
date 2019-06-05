import { action, observable } from "mobx";
import {
  getArtDetail, getArtLike, getDownload,
  getStarDetail,
  getPortalpost, getWordCloub, getProduction, getTotalData,
  getEchartsData, getNewsData, getFansArea, getFollow

} from "@utils/api";

interface IObj {
  value: string | number;
  name: string | number;
}

interface IEchartStatus {
  dayNumber: number,
  ipid: number,
  typeId: number,
  type: string,
}

interface IscrollStatus {
  ipid: number,
  typeId: number,
  currentPage?: number,
  pageSize?: number
}

class DetailStore {
  @observable data: object;
  @observable component: string;
  @observable status: IEchartStatus = {
    dayNumber: 10,
    ipid: 0,
    typeId: 0,
    type: ""
  };
  @observable ipStarList: object[];
  @observable starList: object = {
    repProductionList: [],
    ipProvinceData: [],
    upcomingProductionList: [],
    ipTotalData: [],
    coBrands: "",
    ipName: "",
    ipNewDataAbout: [], // 相关动态
    followStatus: Boolean,
  };

  @observable detailList: object = {
    ipArtLikeData: [],
    ipCaseData: [],
    ipWordCloudData: [],
    ipNewData: [],
    ipSexData: [],
    ipAreaData: [],
    xArea: [],
    yArea: [],
    ipProvinceData: [],
    xProvince: [],
    yProvince: [],
    ageData: [],
    agePercent: [],
    // coBrands: "",
    xHot: [],
    yHot: [],
    yBlog: [],
    xBlog: [],
    yMedia: [],
    xMedia: [],
    xfan: [],
    yfan: [],
    xfansBlog: [],
    yfansBlog: [],
    followStatus: Boolean,
  };
  @observable ipTotalData: object = {
    baiduIndex: {},
    baiduInformation: {},
    blogFans: {},
    cooperativeBrands: {}
  };

  @action
  async requestDetail() {
    this.component = "art";
    this.data = {};
  }

  randomData() {
    return Math.round(Math.random() * 200);
  }

  /**
   *  文创详情页面
   */
  @action
  async ipArtDetail(type, params) {
    const { userGuid, ipid }: { userGuid?: string, ipid: number } = params;
    const { errorCode, result }: any = await getArtDetail(type, {
      userGuid, ipid
    });
    if (errorCode === "200") {
      const ipArtDetail: object[] = [];
      let ipArtObj: object;
      ipArtObj = result;
      ipArtDetail.push(ipArtObj);
      this.detailList['ipArtDetailList'] = ipArtDetail;
      ipArtDetail.forEach((item: any) => {
        this.detailList['followStatus'] = item.isFollowed;
      });

    }
  }

  @action
  async echartChangeStatus(params: IEchartStatus) {
    await this.echartsSetStatus(params);
    await this.getEcharts();
  }

  @action
  async echartsSetStatus(params: IEchartStatus) {
    this.status = { ...this.status, ...params };
  }

  /**
   * 详情页-微博趋势、媒体指数、热度指数接口
   * @param type
   */
  async getEcharts() {
    const { dayNumber, ipid, typeId, type } = this.status;
    const { errorCode, result }: any = await getEchartsData({
      dayNumber, ipid, typeId
    });
    let xHot: string[] = [];
    let yHot: string[] = [];
    let xBlog: string[] = [];
    let yBlog: string[] = [];
    let yMedia: string[] = [];
    let xMedia: string[] = [];
    let xfan: string[] = [];
    let yfan: string[] = [];
    if (errorCode === "200") {
      // 热度指数 (typeId)- 5/6/11/15;
      // 微博趋势 - 10/9/14/16/12
      // 媒体指数 - 13/8
      result.forEach((item) => {
          if (type === "hot") {
          yHot.push(item.dataNumber);
          xHot.push(item.dataRiiq);
          this.detailList['xHot'] = xHot;
          this.detailList['yHot'] = yHot;
          } else if (type === "blog") {
          yBlog.push(item.dataNumber);
          xBlog.push(item.dataRiiq);
          this.detailList['xBlog'] = xBlog;
          this.detailList['yBlog'] = yBlog;
          } else if (type === "media") {
          yMedia.push(item.dataNumber);
          xMedia.push(item.dataRiiq);
          this.detailList['xMedia'] = xMedia;
          this.detailList['yMedia'] = yMedia;
          } else if (type === "fan") {
          yfan.push(item.dataNumber);
          xfan.push(item.dataRiiq);
          this.detailList['xfan'] = xfan;
          this.detailList['yfan'] = yfan;
        }
      });
    }
  }

  /**
   * 文创猜你喜欢
   */
  @action
  async ipArtLike(params) {
    const { ipTypeSuperiorNumber }: { ipTypeSuperiorNumber: string } = params;
    const { errorCode, result }: any = await getArtLike({
      ipTypeSuperiorNumber,
    });
    if (errorCode === "200") {
      this.detailList['ipArtLikeData'] = result;
    }
  }

  /**
   * 下载
   */
  @action
  async getDownload({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getDownload(ipid);
    errorCode === "200" && result;
  }

  @action
  async ipStarDetail(params) {
    const { userGuid, ipid }: { userGuid?: string, ipid: number } = params;
    const { errorCode, result }: any = await getStarDetail({
      userGuid, ipid
    });
    if (errorCode === "200") {
      const ipStarDetail: object[] = [];
      let ipStarObj: object;
      ipStarObj = result;
      ipStarDetail.push(ipStarObj);
      this.ipStarList = ipStarDetail;
      ipStarDetail.forEach((item: any) => {
        this.starList['followStatus'] = item.isFollowed;
        this.starList['ipName'] = item.ipName;
        if (item.coBrands !== null) {
          this.starList['coBrands'] = item.coBrands.dataNumber;
        }
      });

    }
  }

  /**
   * 查询相关案列
   */
  @action
  async getRelatedCase({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getPortalpost({
      ipid
    });
    if (errorCode === "200") {
      this.detailList['ipCaseData'] = result;
    }
  }

  /**
   * 关键词云
   */
  @action
  async getWordData({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getWordCloub({
      ipid
    });
    let wordCloudData: object[] = [];
    if (errorCode === "200") {
      this.detailList['ipWordCloudData'] = result;
      result.forEach((it) => {
        let obj: IObj = {
          name: it.keywordName,
          value: this.randomData(),
        };
        wordCloudData.push(obj);
      });
      this.detailList['ipWordCloudData'] = wordCloudData;
    }
  }

  /**
   * 代表作
   */
  @action
  async getProdctionData(params) {
    const { isUpcoming, ipid, ipName, currentPage, pageSize }: { isUpcoming: number, ipid: number, ipName: string, currentPage?: number, pageSize?: number } = params;
    const { errorCode, result }: any = await getProduction({
      isUpcoming,
      ipid,
      ipName,
      currentPage,
      pageSize,
    });
    if (errorCode === "200") {
      if (isUpcoming === 1) {
        this.starList['upcomingProductionList'] = result;
      } else {
        this.starList['repProductionList'] = result;
      }
    }
  }

  /**
   * 数据总览
   */
  @action
  async getDetailTotal(params) {
    const { typeId, ipid }: { typeId: number, ipid: number } = params;
    const { errorCode, result }: any = await getTotalData({
      typeId,
      ipid,
    });
    if (errorCode === "200") {
      // 全网搜索值5、全网资讯值13、微博粉丝数14、合作品牌数 31
      if (typeId === 5) {
        this.ipTotalData['baiduIndex'] = result;
      } else if (typeId === 13) {
        this.ipTotalData['baiduInformation'] = result;
      } else if (typeId === 14) {
        this.ipTotalData['blogFans'] = result;
      } else if (typeId === 31) {
        this.ipTotalData['cooperativeBrands'] = result;
      }

    }
    this.detailList['ipTotalData'] = result;
  }

  /**
   * 新闻舆情 默认4个(相关动态 默认2个)
   */
  async getNewAbout(params) {
    const { ipid, typeId, currentPage, pageSize }: { ipid: number, typeId: number, currentPage?: number, pageSize?: number } = params;
    const { errorCode, result }: any = await getNewsData({
      ipid, typeId, currentPage, pageSize
    });
    if (errorCode === "200") {
      if (pageSize === 4) {

        this.detailList['ipNewData'] = result;
        console.log(this.detailList['ipNewData']);
      } else {
        this.starList['ipNewDataAbout'] = result;
      }
    }
  }

  /**
   * 详情页-粉丝画像、地区分布
   */
  async getFansAreaData(params) {
    const { ipid, typeId }: { ipid: number, typeId: number } = params;
    const { errorCode, result }: any = await getFansArea({
      ipid, typeId
    });

    let ipSexData: object[] = [];
    let ipProvinceData: object[] = [];
    let ipAreaData: object[] = [];
    let xProvince: string[] = [];
    let yProvince: string[] = [];
    let ageData: string[] = [];
    let agePercent: string[] = [];
    let xArea: string[] = [];
    let yArea: string[] = [];

    if (errorCode === "200" && result) {
      // 1年龄，2性别，3地区，4区域
      if (typeId === 1 && result) {
        result.forEach((it) => {
          ageData.push(it.dataNumber);
          agePercent.push(it.dataType);
        });
        this.detailList['ageData'] = ageData.reverse();
        this.detailList['agePercent'] = agePercent.reverse();
      } else if (typeId === 2 && result) {
        result.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType,
          };
          ipSexData.push(obj);
        });
        this.detailList['ipSexData'] = ipSexData;
      } else if (typeId === 3 && result) {
        result.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType.replace(/\省|\市/g, ''),
          };
          xProvince.push(it.dataNumber);
          yProvince.push(it.dataType);
          if (yProvince.length > 10) {
            yProvince = yProvince.slice(0, 10);
          }
          if (xProvince.length > 10) {
            xProvince = xProvince.slice(0, 10);
          }
          ipProvinceData.push(obj);
        });
        this.detailList['ipProvinceData'] = ipProvinceData;
        this.detailList['xProvince'] = xProvince.reverse();
        this.detailList['yProvince'] = yProvince.reverse();
      } else {
        result.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType,
          };
          xArea.push(it.dataNumber);
          yArea.push(it.dataType);
          ipProvinceData.push(obj);

        });
        this.detailList['ipAreaData'] = ipAreaData;
        this.detailList['xArea'] = xArea.reverse();
        this.detailList['yArea'] = yArea.reverse();
      }
    }
  }

  /**
   * 关注ip
   */
  async getFollowStatus(params) {
    const { userGuid, isFollow, ipid }: { userGuid: string, isFollow: number, ipid: number } = params;
    const { errorCode, result = {} }: any = await getFollow({
      userGuid, isFollow, ipid
    });
    if (errorCode === "200" && result.errorCode === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }
}

export default new DetailStore();
