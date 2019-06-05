import { action, observable, toJS } from "mobx";
import { reqIpTypeList, reqIpList, reqIpTypeListTab,listMainType ,listCountry} from "@utils/api";
import { object } from 'prop-types';

class IpListStore {
  @observable head_list: object = {
    subTypeList: {},
    typeSecond: [],
  };
  @observable head_list_top: object = {
    subTypeList_top: {},
    typeSecond_top: [],
  };
  //新增的导航属性 用来记录选中的状态 类别 国别
  @observable selectedchild: object = {
    nav: '',  //..标记当前选中哪个类别
    show:false, //记录类别是否显示
    nav_number:'',//标记当前选中的是哪个类别的ipNunmber 传递给接口
    case_: '', //记录当前选中的是哪个（公共的状态）
    slectTime:'', //记录选中的时间
    country:'',//记录选中的国家
  };;
  @observable ipItemList: string[];
  @observable listCountry: string[];
  @observable ipTypeListData: string[];
  @observable typeResult: string[];
  @observable page: object = {
    numbers: [],
    lastPage: 0,
    totalCount: 0,
  };

  @observable customStatus: IStatus = {
    selected: "",
    ipTypeSuperiorNumbers: "",
    ipIsAuthenticated:null,
    ipLocation: "",
    ipTypeNumber: "",
    countryType:"",
    ipFormNumber: "",
    benginShowDate: "",
    endShowDate: "",
    ipStatus: "",
    ipSex: "",
    currentPage: 1,
    pageSize: 24,
  };

  @action
  async changeStatus(params: IStatus) {
    await this.setStatus(params);
    await this.ipTypeListTab();
  }

  async clearIpTypeListData(obj){
    this.ipTypeListData = [];
    this.page = {...obj}
  }

  async setSelectedchild(params:object){
    this.selectedchild = { ...this.selectedchild, ...params };
  }

  @action
  async setStatus(params: IStatus) {
    // 清空数据
    this.customStatus = { ...this.customStatus, ...params };
  }
  async getCountryList() {
    const {errorCode, result }:any = await listCountry();
    if(errorCode == "200"){
      this.listCountry = result;
      console.log(result)
    }
  }

  async getlistMainType(){
    await this.getCountryList()
    const {errorCode, result }:any = await listMainType();
    console.log(result)
    if (errorCode === "200") {
    const subTypeList_top: object = {};
      const typeSecond_top: object[] = [];
      let ipTypeGuidObj: object = [];
      result.forEach((item: any,index:any) => {
        const type = item.typeName;
        subTypeList_top[type] = item.childTypeList;
        const typeGuid = item.mainTypeGuid;
        ipTypeGuidObj = { ipTypeNumber: typeGuid, ipType: type };
        typeSecond_top.push(ipTypeGuidObj);
        console.log("subTypeList_top@")
        console.log(subTypeList_top)
      });
      this.head_list_top = { subTypeList_top, typeSecond_top };
    }
  }

  @action
  async ipTypeList() {
    const { errorCode, result }: any = await reqIpTypeList();
    // console.log(result)
    if (errorCode === "200") {
      const subTypeList: object = {};
      const typeSecond: object[] = [];
      let ipTypeGuidObj: object = [];
      result.forEach((item: any) => {
        const type = item.ipType;
        subTypeList[type] = item.sublist;
        const typeGuid = item.ipTypeNumber;
        ipTypeGuidObj = { ipTypeNumber: typeGuid, ipType: type };
        typeSecond.push(ipTypeGuidObj);
      });
      this.head_list = { subTypeList, typeSecond };
      // let arr: object[] = [];
      // arr.push(subTypeList);
      // arr.forEach((item: any) => {
      //   console.log(item)
      // });
    }
  }

  @action
  async ipList() {
    const { errorCode, result }: any = await reqIpList();
    errorCode === "200" && (this.ipItemList = result);
  }

  @action
  async ipTypeListTab() {
    const {
      ipTypeSuperiorNumbers, ipLocation, ipTypeNumber,countryType,
      ipFormNumber, benginShowDate, endShowDate,ipIsAuthenticated,
      ipStatus, ipSex, currentPage, pageSize,
    } = this.customStatus;
    let { errorCode, result: { ipQueryInfoVOs, totalCount } }: any = await reqIpTypeListTab({
      ipTypeSuperiorNumbers, ipLocation, ipTypeNumber,ipIsAuthenticated,countryType,
      ipFormNumber, benginShowDate, endShowDate,
      ipStatus, ipSex, currentPage, pageSize,
    });
    if (errorCode === "200") {
      await this.pages(totalCount);
      this.ipTypeListData = ipQueryInfoVOs;
    }
  }

  @action
  async pages(totalCount) {
    const { currentPage, pageSize } = this.customStatus;
    if (Number(totalCount) > 20) {
      const end = (totalCount % pageSize) > 0 ? 1 : 0;
      const lastPage = parseInt((totalCount / pageSize) + "") + end;
      let numbers = [];
      if (lastPage > 13) {
        let tmp = ["1", "2", "..."];
        if (currentPage > 6 && currentPage < lastPage - 6) {
          const last = ["...", `${lastPage - 1}`, `${lastPage}`];
          const new_arr: string[] = [
            `${currentPage - 3}`,
            `${currentPage - 2}`,
            `${currentPage - 1}`,
            "" + currentPage,
            `${currentPage + 1}`,
            `${currentPage + 2}`,
            `${currentPage + 3}`
          ];
          numbers = tmp.concat(new_arr);
          numbers.push(...last);
        } else if (currentPage > 6 && currentPage >= lastPage - 6) {
          numbers = Array.from({ length: 9 }, (v, i) => lastPage - i);
          numbers.reverse();
          numbers = tmp.concat(numbers);
        } else if (currentPage <= 6) {
          tmp = ["...", `${lastPage - 1}`, "" + lastPage];
          numbers = Array.from({ length: 9 }, (v, i) => `${i + 1}`);
          numbers.push(...tmp);
        }
      } else {
        numbers = Array.from({ length: lastPage }, (v, i) => `${i + 1}`);
      }
      this.page = {
        numbers,
        lastPage,
        totalCount,
      };
    } else {
      this.page = {
        totalCount,
      };
    }
  }

}

export default new IpListStore();
