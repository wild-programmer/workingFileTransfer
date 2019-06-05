import { action, observable, toJS } from "mobx";
import { reqIpTypeList, reqIpList, reqIpTypeListTab } from "@utils/api";
import { object } from 'prop-types';

class IpListStore {
  @observable head_list: object = {
    subTypeList: {},
    typeSecond: [],
  };
  @observable ipItemList: string[];
  @observable ipTypeListData: string[];
  @observable typeResult: string[];
  @observable page: object = {
    numbers: [],
    lastPage: 0,
    totalCount: 0,
  };

  @observable customStatus: IStatus = {
    selected: "",
    ipTypeSuperiorNumber: "",
    ipLocation: "",
    ipTypeNumber: "",
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

  @action
  async setStatus(params: IStatus) {
    this.customStatus = { ...this.customStatus, ...params };
  }

  @action
  async ipTypeList() {
    const { errorCode, result }: any = await reqIpTypeList();
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
      ipTypeSuperiorNumber, ipLocation, ipTypeNumber,
      ipFormNumber, benginShowDate, endShowDate,
      ipStatus, ipSex, currentPage, pageSize,
    } = this.customStatus;
    let { errorCode, result: { ipQueryInfoVOs, totalCount } }: any = await reqIpTypeListTab({
      ipTypeSuperiorNumber, ipLocation, ipTypeNumber,
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
