import { action, observable } from 'mobx';
import { reqIpSearch } from '@utils/api';

class SearchList {
  @observable searchResult = {
    ipData: [],
    caseData: [],
    totalCount: 0,
    ipCount: 0,
    caseCount: 0,
  };

  @action
  async IpSearch(param) {
    const { keyword }: { keyword: string } = param;
    const { errorCode, result }: any = await reqIpSearch(keyword);
    if (errorCode === "200") {
      // const { ipData, caseData, totalCount, ipCount, caseCount } = this.searchResult;
      this.searchResult.ipData = result.ipRoomDataVOs;
      this.searchResult['ipCount'] = result.ipCount;
      this.searchResult['caseCount'] = result.portalPostCount;
      this.searchResult.caseData = result.portalPostVOs;
      this.searchResult.totalCount = result.ipCount + result.portalPostCount;
    }
  }
}

export default new SearchList();
