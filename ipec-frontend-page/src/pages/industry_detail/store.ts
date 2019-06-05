import { action, observable } from "mobx";
import {
  getPortalPostDetail,
  setPortalPostLike
} from "@utils/api";
import { string } from "prop-types";


class DetailStore{
  @action
  async getDetail({portalPostGuid,userGuid}) {
    const { errorCode, result = {} }: any = await getPortalPostDetail({ portalPostGuid ,userGuid});
    if (errorCode === "200") {
      return {result:result,request:true};
    } else   {
      return { result: result.errorMsg ,request:false};
    }
  }
  @action
  async setLike({portalPostGuid,userGuid,isLike}) {
    const { errorCode, result = {} }: any = await setPortalPostLike({ portalPostGuid ,userGuid,isLike});
    if (errorCode === "200" && result.errorCode>0) {
      return {result:result,request:true};
    } else   {
      return { result: result.errorMsg ,request:false};
    }
  }
}

export default new DetailStore();
