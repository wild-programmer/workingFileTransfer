import { action, observable, toJS } from "mobx";
import {
  getDetail,
  getArtLike,
  getDownload,
  getPortalpost,
  getWordCloub,
  getProduction,
  getTotalData,
  getEchartsData,
  getNewsData,
  getFansArea,
  getFollow,
  getBusniess,
  getIpPeople,
  getBoxOfficeData,
  getBroadcastTrend,
  getPublicPraise, getBroadcastPlaform

} from "@utils/api";

interface IObj {
  value: string | number;
  name: string | number;
}

interface IEchartStatus {
  userGuid: string,
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
    userGuid: "",
    dayNumber: 10,
    ipid: 0,
    typeId: 0,
    type: ""
  };
  @observable ipDetailData: object = {};
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
    ipPeopleList: [],
  };
  @observable ipTotalData: object = {};
  @observable businessData = [];

  @observable boxOfficeData = [];
  @observable boxOfficeDate = [];

  @observable broadcastTrendData = {
    '51': [], // 爱奇艺
    '62': [], // 优酷
    '49': [], //  芒果TV
    '46': [], // 腾讯视频
    '65': [], // 搜狐,
    '53': [], // 乐视
  };
  @observable broadcastTrendDate = [];
  @observable publicPraiseData = [];
  @observable broadcastPlatformData = [];
  @observable broadcastPlatformData2 = [];

  randomData() {
    return Math.round(Math.random() * 200);
  }

  /**
   * 详情页-IP相关介绍
   */
  @action
  async ipDetail(params) {
    const { userGuid, ipTypeSuperiorNumber, ipid }: { userGuid?: string, ipTypeSuperiorNumber: string, ipid: string } = params;
    const { errorCode, result }: any = await getDetail({
      userGuid,
      ipTypeSuperiorNumber,
      ipid
    });
    if (errorCode === "200") {
      this.ipDetailData = result;
      this.detailList['followStatus'] = result.isFollowed;
      this.starList['ipName'] = result.ipName;
      if (Number(ipTypeSuperiorNumber) === 8) {
        this.starList['coBrands'] = result.cooperativeBrand;
      }
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
   * 详情页--搜索基础数据，互动基础数据，媒体关注基础数据，粉丝趋势;
   */
  async getEcharts() {
    const { userGuid, dayNumber, ipid, typeId, type } = this.status;
    const { errorCode, result }: any = await getEchartsData({
      userGuid, dayNumber, ipid, typeId
    });
    let xHot: string[] = [];
    let yHot: string[] = [];
    let xBlog: string[] = [];
    let yBlog: string[] = [];
    let yMedia: string[] = [];
    let xMedia: string[] = [];
    let xfan: string[] = [];
    let yfan: string[] = [];
    if (errorCode === "200" && result.errorCode === 200) {
      result.data.forEach((item) => {
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
        } else if (type === "fans") {
          yfan.push(item.dataNumber);
          xfan.push(item.dataRiiq);
          this.detailList['xfan'] = xfan;
          this.detailList['yfan'] = yfan;
        }
      });
    }
  }

  /**
   * 详情页-基础信息-电影-院线票房趋势;
   */
  @action
  async getBoxOffice(params) {
    const { dayNumber, ipid }: { dayNumber: number, ipid: number } = params;
    const { errorCode, result: data }: any = await getBoxOfficeData({
      dayNumber, ipid
    });
    if (errorCode === '200') {
      data.forEach((item: any) => {
        this.boxOfficeData = [...this.boxOfficeData, item.dataNumber];
        this.boxOfficeDate = [...this.boxOfficeDate, item.dataRiiq];
      });
    } else {
      // return errorMsg;
    }
  }

  /**
   * 电视剧/综艺播放趋势、电影在线平台趋势
   * @param params
   */
  @action
  async getBroadcastTrend(params) {
    const { type, dayNumber, ipid }: { type: number, dayNumber: number, ipid: number } = params;
    const { errorCode, result: data }: any = await getBroadcastTrend({
      type, dayNumber, ipid
    });
    if (errorCode === '200') {
      data.forEach((i: any) => {
        if (i.list !== null) {
          i.list.forEach((item: any) => {
            this.broadcastTrendData[i.typeId] = [...this.broadcastTrendData[i.typeId], item.dataNumber];
            this.broadcastTrendDate = [...this.broadcastTrendDate, item.dataRiiq];
          });
          console.log(toJS(this.broadcastTrendData));
        }
      });
    } else {
      // return errorMsg;
    }
  }

  /**
   * 口碑信息 getPublicPraise
   */
  async getPublicPraise({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getPublicPraise({ ipid });
    if (errorCode === '200') {
      this.publicPraiseData = result;
    }
  }

  /**
   * 基详情页-础信息-播放平台分布
   */
  async getBroadcastPlatform({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getBroadcastPlaform({ ipid });
    if (errorCode === '200') {
      this.broadcastPlatformData2 = result;
      result.forEach((it) => {
        let obj: IObj = {
          name: it.typeName,
          value: it.dataNumber,
        };
        this.broadcastPlatformData.push(obj);
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
   *  影人相关播放量
   */
  @action
  async getIpPeople(params) {
    const { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: string, ipid: number } = params;
    const { errorCode, result }: any = await getIpPeople({
      ipTypeSuperiorNumber, ipid
    });
    if (errorCode === "200") {
      this.detailList['ipPeopleList'] = result;
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
  async getWordData({ userGuid, ipid }: { userGuid: string, ipid: number }) {
    const { errorCode, result: { data, errorCode: ecode } }: any = await getWordCloub({
      userGuid,
      ipid
    });
    let wordCloudData: object[] = [];
    if (errorCode === "200" && ecode === 200) {
      data.forEach((it) => {
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
    const { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: number, ipid: number } = params;
    const { errorCode, result }: any = await getTotalData({
      ipTypeSuperiorNumber,
      ipid,
    });
    if (errorCode === "200") {
      this.ipTotalData = result;
    }
  }

  /**
   * 详情页-评估数据--受众画像（1 年龄,2 性别），地区分布（3 省份 ，4 区域）；
   */
  async getFansAreaData(params) {
    const { userGuid, ipid, typeId }: { userGuid: string, ipid: number, typeId: number } = params;
    const { errorCode, result: { errorMsg, data, errorCode: ecode } }: any = await getFansArea({
      userGuid, ipid, typeId
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

    if (errorCode === "200" && ecode > 0) {
      // 1年龄，2性别，3地区，4区域
      if (typeId === 1 && data) {
        data.forEach((it) => {
          ageData.push(it.dataNumber);
          agePercent.push(it.dataType);
        });
        this.detailList['ageData'] = ageData.reverse();
        this.detailList['agePercent'] = agePercent.reverse();
      } else if (typeId === 2 && data) {
        data.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType,
          };
          ipSexData.push(obj);
        });
        this.detailList['ipSexData'] = ipSexData;
      } else if (typeId === 3 && data) {
        data.forEach((it) => {
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
        data.forEach((it) => {
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
    } else {
      return errorMsg;
    }
  }

  /**
   * 详情页-评估数据- 商业价值评估模型
   */
  async getBusinessData(params, type) {
    const { userGuid, ipid, ipTypeSuperiorNumber }: { userGuid: string, ipid: number, ipTypeSuperiorNumber: number } = params;
    const { errorCode, result: { data, errorCode: ecode, errorMsg } }: any = await getBusniess({
      userGuid, ipid, ipTypeSuperiorNumber
    });

    if (errorCode === "200" && ecode > 0) {
      if (type === 'people') {

        this.businessData = [
          ...this.businessData,
          data.arithmaticHotspotPrice,
          data.mediaAnalysis,
          data.reputationNumber,
          data.precisionNumber,
          data.endorsementNumber,
          data.potential,
        ];

      } else {
        this.businessData = [
          ...this.businessData,
          data.arithmaticHotspotPrice,
          data.mediaAnalysis,
          data.potential,
        ];

      }

    } else {
      return { errorMsg };
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
      } else {
        this.starList['ipNewDataAbout'] = result;
      }
    }
  }

}

export default new DetailStore();
