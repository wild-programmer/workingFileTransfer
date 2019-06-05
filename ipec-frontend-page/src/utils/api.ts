/**
 * 登录
 * @param userLogin 用户名
 * @param userPass 密码
 */
import { async } from 'q';

export async function reqLogin(
  { userLogin, userPass }: { userLogin: string, userPass: string }
) {
  return await $ajax.post("/frontend-user/login", {
    userLogin,
    userPass,
  });
}

/**
 * 注册
 * @param userLogin 登陆名
 * @param userPass  登陆密码
 * @param code 验证码
 */
export async function onRegister(
  { userLogin, userPass, code }: { userLogin: string, userPass: string, code: string }
) {
  return await $ajax.post("/frontend-user/register", {
    userLogin,
    userPass,
    code
  });
}

/**
 * 获取验证码
 * @param userLogin 登陆名
 * @param receiverType  1手机 2邮箱
 * @param sendType    1注册 2修改密码 3实名认证 4修改绑定
 */
export async function onCodeReg(
  { userLogin, receiverType, sendType }: { userLogin: string, receiverType: Number, sendType: Number }
) {
  return await $ajax.post("/frontend-user/send-verification-code", {
    userLogin,
    receiverType,
    sendType
  });
}

/**
 * 修改密码
 * @param userGuid 登陆识别码
 * @param oldUserPass 老密码
 * @param userPass    新密码
 */
export async function resetPassword(
  { oldUserPass, userGuid, userPass }: { oldUserPass: string, userGuid: string, userPass: string }
) {
  return await $ajax.post("/frontend-user/update-password", {
    oldUserPass,
    userGuid,
    userPass
  });
}

/**
 * @param code  验证码
 * @param email   邮箱号码
 * @param mobile  手机号码
 * @param receiverType 1手机 2邮箱
 * @param userGuid  用户凭证
 */
export async function editUserInformation(
  { code, email, mobile, receiverType, userGuid }:
    { code: string, email: string, mobile: string, receiverType: number, userGuid: string }
) {
  return await $ajax.post("/frontend-user/updata-binding", {
    code,
    email,
    mobile,
    receiverType,
    userGuid,
  });
}

/**
 * 忘记密码提交
 * @param userLogin 登陆名
 * @param code  验证码
 * @param userPass  登陆密码
 */
export async function onForgetPassWord(
  { userLogin, code, userPass }: { userLogin: string, code: string, userPass: string }
) {
  return await $ajax.post("/frontend-user/forget-password", {
    code,
    userLogin,
    userPass
  });
}

/**
 * 忘记密码申请下一步
 * @param userLogin 登陆名
 * @param code  验证码
 */
export async function onForgetPassWordNext(
  { userLogin, code }: { userLogin: string, code: string }
) {
  return await $ajax.post("/frontend-user/forget-password-validate", {
    code,
    userLogin,
  });
}

/*
* 请求导航栏
* */
export async function reqNavList() {
  return await $ajax.get("/frontend-index/nav-list");
}

/**
 * 请求 ip 类型列表
 */
export async function reqIpTypeList() {
  return await $ajax.get("/frontend-ip-library/type-list");
}

/**
 * 请求 ip 列表
 */
export async function reqIpList() {
  return await $ajax.get("/frontend-ip-library/list");
}

/**
 * 请求 ip 选中类型 子分类列表
 */
export async function reqIpTypeListTab({
                                         ipTypeSuperiorNumber,
                                         ipLocation = "", ipTypeNumber = "",
                                         ipFormNumber = "", benginShowDate = "", endShowDate = "",
                                         ipStatus = "", ipSex = "",
                                         currentPage, pageSize
                                       }: IStatus) {
  return await $ajax.get("/frontend-ip-library/query-list", {
    params: {
      ipTypeSuperiorNumber,
      ipLocation,
      ipTypeNumber,
      ipFormNumber,
      benginShowDate,
      endShowDate,
      ipStatus,
      ipSex,
      currentPage,
      pageSize
    }
  });
}

/**
 * 请求 IP 搜索页面
 */
export async function reqIpSearch(keyword: string) {
  return await $ajax.get("/frontend-index/search", {
    params: { keyword }
  });
}

/**
 * 请求主页大轮播图
 */
export async function reqBannerList() {
  return await $ajax.get("/frontend-index/banner-list");
}

/**
 * 请求主页模块
 */
export async function reqModuleList() {
  return await $ajax.get("/frontend-index/module-list");
}

/**
 * 获取添加 ip 的国家地区和 ip 类型
 */
export async function reqCreateCategory() {
  return await $ajax.get("");
}

export async function reqEditData(id: string) {
  return await $ajax.get("", {
    data: { id }
  });
}

/**
 * 添加ip
 */
export async function createIp(type: string, params: object) {
  let url = `/frontend-user-publish/${type}/save`;
  return await $ajax.post(url, params);
}

/**
 * 编辑ip
 */
export async function EditIp(type: string, params: object) {
  let url = `/frontend-user-publish/edit-ip`;
  return await $ajax.post(url, params);
}

export async function EditIpCheckStatus(type: string, params: object) {
  let url = `/frontend-user-publish/${type}/edit`;
  return await $ajax.post(url, params);
}

/**
 * 上传商务资料
 * file userGuid ipid
 */
export async function uploadBusinessData(params) {
  let url = `/frontend-user-publish/upload-material?userGuid=${params.userGuid}&ipid=${params.ipid}`;
  return await $ajax.post(url, params.file);

}

export async function getArtDetail(type, params) {
  return await $ajax.get(`/frontend-ip-detail/${type}`, {
    params
  });

}

/**
 *  文创详情页面
 */
// export async function getArtDetail(
//   { userGuid, ipid }: { userGuid: string, ipid: number }
// ) {
//   return await $ajax.get("/frontend-ip-detail/get-cultural", {
//     params: {
//       userGuid, // 登陆要传的参数
//       ipid,
//     }
//   });
//
// }

/**
 * 文创艺术详情页-微博趋势、媒体指数、热度指数接口
 */

export async function getArtEchart(
  { dayNumber, ipid, typeId }: { dayNumber: number, ipid: number, typeId: number }
) {
  return await $ajax.get('/frontend-ip-detail/get-cultural-dataacquire', {
    params: {
      dayNumber,
      ipid,
      typeId
    }
  });
}

/**
 * 文创猜你喜欢
 */

export async function getArtLike(
  { ipTypeSuperiorNumber }: { ipTypeSuperiorNumber: string }
) {
  return await $ajax.get('/frontend-ip-detail-common/get-love', {
    params: {
      ipTypeSuperiorNumber,
    }
  });
}

/**
 * GET 下载资料列表GET
 */
export async function getDownload(ipid: number) {
  return await $ajax.get('/frontend-ip-detail-common/get-material', {
    params: {
      ipid,
    }
  });
}

/**
 *  名人详情页面
 */
export async function getStarDetail(
  { userGuid, ipid }: { userGuid: string, ipid: number }
) {
  return await $ajax.get("/frontend-ip-detail/get-people", {
    params: {
      userGuid, // 登陆要传的参数
      ipid,
    }
  });

}

/**
 * GET /frontend-ip-detail-common/get-relevant-portalpost详情页-查询相关案例
 */
export async function getPortalpost(
  { ipid }: { ipid: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-relevant-portalpost", {
    params: {
      ipid,
    }
  });
}

/**
 * GET /frontend-portal-post/portalPost-detail 行业案例详情接口
 */
export async function getPortalPostDetail(
  { portalPostGuid, userGuid }: { portalPostGuid: string, userGuid: string }
) {
  return await $ajax.get("/frontend-portal-post/portalPost-detail", {
    params: {
      portalPostGuid,
      userGuid,
    }
  });
}

/**
 * POST frontend-portal-post/portalPost-give-like" 行业案例详情接口
 * isLike 1表示点赞 0表示取消点赞
 * portalPostGuid url参数
 */
export async function setPortalPostLike(
  { portalPostGuid, userGuid, isLike }: { portalPostGuid: string, userGuid: string, isLike: number }
) {
  return await $ajax.post(`/frontend-portal-post/portalPost-give-like?portalPostGuid=${portalPostGuid}&userGuid=${userGuid}`, {    
    // userGuid,
    // portalPostGuid,
  });
}

/**
 * GET 详情页-关键词云
 */
export async function getWordCloub(
  { ipid }: { ipid: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-wb-word", {
    params: {
      ipid,
    }
  });
}

/**
 * GET 详情页-代表作
 */
export async function getProduction(
  { isUpcoming, ipid, ipName, currentPage, pageSize }: { isUpcoming: number, ipid: number, ipName: string, currentPage?: number, pageSize?: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-ip-production", {
    params: {
      isUpcoming,
      ipid,
      ipName,
      currentPage,
      pageSize,
    }
  });
}

/**
 * GET 详情页-数据总览
 */
export async function getTotalData(
  { typeId, ipid }: { typeId: number, ipid: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-data-screening", {
    params: {
      typeId,
      ipid,
    }
  });
}

/**
 * 详情页-微博趋势、媒体指数、热度指数接口
 */
export async function getEchartsData(
  { dayNumber, ipid, typeId }: { dayNumber: number, ipid: number, typeId: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-data-acquire", {
    params: {
      dayNumber,
      ipid,
      typeId,
    }
  });
}

/**
 * 详情页-新闻舆情 默认4个(相关动态 默认3个)
 */
export async function getNewsData(
  { ipid, typeId = 7, currentPage = 1, pageSize }: { ipid: number, typeId: number, currentPage?: number, pageSize?: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-acquire-page", {
    params: {
      ipid,
      typeId,
      currentPage,
      pageSize,
    }
  });
}

/**
 * 详情页-粉丝画像、地区分布
 */
export async function getFansArea(
  { ipid, typeId }: { ipid: number, typeId: number }
) {
  return await $ajax.get("/frontend-ip-detail-common/get-acquire", {
    params: {
      ipid,
      typeId,
    }
  });
}

/**
 * POST  关注/取消关注IP  只有登陆状态下可操作
 */

export async function getFollow(
  { userGuid, isFollow, ipid }: { userGuid: string, isFollow: number, ipid: number }
) {
  return await $ajax.post("/frontend-user-publish/update-userip", {
    userGuid,
    isFollow,
    ipid
  });
}

/**
 * 上传文件  包括图片
 */
export async function upload(params) {
  // let url = `/frontendFileUpload/upload?isImage=${params.isImage}&isFullPath=${params.isFullPath}`;
  let url = `/frontendFileUpload/upload`;
  // return await $ajax.post(url, params.file);
  return await $ajax.post(url, params);
}

/**
 * 根据ipid 获取update 的详情
 */

export async function getIpDetail(
  { ipid, ipTypeNumber }: { ipid: number, ipTypeNumber: number }
) {
  let url = "/frontend-user-publish/get-ip-detail";
  return await $ajax.get(url, {
    params: {
      ipid,
      ipTypeNumber
    }
  });
}

/**
 * 下载商务资料
 */
export async function getDownloadMaterial(params) {
  let url = `/frontend-user-publish/download-material?materialGuid=${params.materialGuid}&userGuid=${params.userGuid}`;
  return await $ajax.post(url, params);
}

/**
 *  删除商务资料接口
 */

export async function delMaterial(params) {
  let url = `/frontend-user-publish/del-material?materialGuid=${params.materialGuid}&userGuid=${params.userGuid}`;
  return await $ajax.post(url, params);
}

/**
 *  上传海报
 */
export async function savePic(params) {
  const url = `/frontendFileUpload/savePic?picType=${params.picType}`;
  return await $ajax.post(url, params.file);
}

/**
 * （经济）公司列表接口
 */
export async function listCompany() {
  const url = '/frontend-user-publish/list-company';
  return await $ajax.get(url);
}

/**
 * GET
 * 获取我的更新
 */
export async function getMyUpdate(params) {
  const url = '/frontend-user-publish/get-my-edit';
  return await $ajax.get(url, {
    params
  });
}

/**
 * 实名认证
 */
export async function RealNameAuthentication(
  { papersPicGuid, picGuid, userGuid, userRealName }: { papersPicGuid: string, picGuid: string, userGuid: string, userRealName: string }
) {
  const url = '/frontend-user/realname-authentication';
  return await $ajax.post(url, {
    papersPicGuid,
    picGuid,
    userGuid,
    userRealName
  });
}

/**
 * POST  修改个人信息
 * companyGuid, 下拉选择公司
 * companyName, 手动输入的公司
 * companyType ,公司类型
 * desc,
 * job, 担任职务
 * picGuid,头像图片
 * userGuid , 登陆后 后台返回值
 * userNickname ,
 * userRealName
 */

export async function setUserInformation(
  { companyGuid, companyName, companyType, desc, job, picGuid, userGuid, userNickname, userRealName }: {
    companyGuid: string,
    companyName: string,
    companyType: string,
    desc: string,
    job: string,
    picGuid: string,
    userGuid: string,
    userNickname: string,
    userRealName: string
  }
) {
  return await $ajax.post("/frontend-user/update-user", {
    companyGuid,
    companyName,
    companyType,
    desc,
    job,
    picGuid,
    userGuid,
    userNickname,
    userRealName
  });
}

/**
 * ip 一级分类
 */
export async function firstOrder() {
  let url = "/frontend-portal-post/one-type-list";
  return await $ajax.get(url);
}

/**
 * 行业分类
 */
export async function industryOrder() {
  let url = "/frontend-portal-post/portalCategory/list";
  return await $ajax.get(url);
}

/**
 * 行业案列列表
 * @param params
 */
export async function industryCase(params) {
  // let url = `frontend-portal-post/list?currentPage=${params.currentPage}&pageSize=${params.pageSize}`;
  let url = `frontend-portal-post/list`;
  return await $ajax.get(url, {
    params
  });
}

/**
 * 我发布的ip
 * @param params
 */
export async function myRelease(params) {
  let url = "frontend-user-publish/list-my-publish";
  return await $ajax.get(url, {
    params
  });
}

/**
 * 删除我发布的ip
 * @param params
 */
export async function deleteMyRelease(params) {
  let url = `frontend-user-publish/del-my-ip?userGuid=${params.userGuid}&ipid=${params.ipid}`;
  return await $ajax.post(url, params);
}

/**
 * 获取个人信息
 * @param params
 */
export async function getUserInfo(
  userGuid: string
) {
  let url = '/frontend-user/get-user-info';
  return await $ajax.get(url, {
    params: {
      userGuid,
    }
  });
}

export async function hotWords(params) {
  let url = 'frontend-portal-post/portalHotWords/list';
  return await $ajax.get(url, { params });
}
