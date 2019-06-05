import { action, observable } from 'mobx';
import { getCompany, getCompanyIp } from '@utils/api';

class CompanyStore {
  // @observable companyData: object[];
  @observable companyIpData: object[];
  @observable companyData: {};

  @action
  async getCompany({ companyGuid }: { companyGuid: string }) {
    const { result: { errorCode, data, errorMsg } }: any = await getCompany({ companyGuid });
    if (!!errorCode && errorCode === 200) {
      // let arr = [];
      // arr.push(data);
      // this.companyData = arr;
      this.companyData = data;
    } else {
      return { message: errorMsg };
    }
  }

  @action
  async getCompanyIp({ companyGuid }: { companyGuid: string }) {
    const { result: { errorCode, data, errorMsg } }: any = await getCompanyIp({ companyGuid });
    if (!!errorCode && errorCode === 200) {
      this.companyIpData = data;
    } else {
      return { message: errorMsg };
    }
  }
}

export default new CompanyStore();
