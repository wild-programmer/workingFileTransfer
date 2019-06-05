import * as React from 'react';

export default {
  // 文创艺术
  '2': item => {
  },
  // 图书
  '3': item => {
  },
  // 网文
  '4': item => {
  },
  // 电视剧
  '5': item => (
    <div>
      <div className="hover-type-name">所属国别:{item.countryNames}</div>
      <div className="hover-type-name">备案国别:{item.recordCountry}</div>
      <div className="hover-type-name">首播时间:{item.showDate}</div>
      <div className="hover-type-name">集数:{item.numberEpisodeTv}</div>
      <div className="hover-type-name">主演：{item.protagonistTv.replace(/,/g, "/")}</div> 
      <div className="hover-type-name">导演:{item.directorTv}</div>
      <div className="hover-type-name">编剧:{item.scriptwriterTv}</div>
      <div className="hover-type-name">出品公司:{item.companyGuidCpTv}</div>
      {/* <div className="hover-type-name">网络平台：
        {
          item.tvIpPlatformInfoGuidWlNames && item.tvIpPlatformInfoGuidWlNames.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            );
          })
        }
      </div> */}  
    </div>
  ),
  // 电影
  '6': item => {
    return (
      <div>
        <div className="hover-type-name">所属国别:{item.countryNames}</div>
        <div className="hover-type-name">备案国别:{item.recordCountry}</div>
        <div className="hover-type-name">上映时间:{item.showDate}</div>
        <div className="hover-type-name">片长:{item.filmLength}</div>
        <div className="hover-type-name">主演:{item.protagonistMovie}</div>
        <div className="hover-type-name">导演:{item.directorMovie}</div>
        <div className="hover-type-name">编剧{item.scriptwriterMovie && item.scriptwriterMovie.replace(/,/g, "/")}</div>
        <div className="hover-type-name">出品公司:{item.companyGuidCpMovie}</div>
      </div>
    );
  },
  // 综艺
  '7': item => (
    <div>
      <div className="hover-type-name">所属国别:{item.countryNames}</div>
      <div className="hover-type-name">备案国别:{item.recordCountry}</div>
      <div className="hover-type-name">首播时间:{item.showDate}</div>
      <div className="hover-type-name">期数:{item.periods}</div>
      <div className="hover-type-name">主持人:{item.compere}</div>
      <div className="hover-type-name">主要嘉宾:{item.residentGuest}</div>
      <div className="hover-type-name">导演:{item.directorVariety}</div>
      <div className="hover-type-name">制片人:{item.productionManager}</div>
      {/* <div className="hover-type-name">网络平台：
        {
          item.varietyIpPlatformInfoGuidWlNames
          && item.varietyIpPlatformInfoGuidWlNames.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            );
          })
        }
      </div> */}
      {/* <div className="hover-type-name">主持人:{item.compere}</div>
      <div className="hover-type-name">期数:{item.periods}</div> */}
    </div>
  ),
  // 名人
  '8': item => (
    <div>
      <div className="hover-type-name">国籍：{item.nationality}</div>
      <div className="hover-type-name">职业：{item.profession}</div>
      <div className="hover-type-name">出生日期：{item.brithDate}</div>
      <div className="hover-type-name">经济公司:{item.brokerageFirmGuid}</div>
    </div>
  ),
  // 动画
  '9': item => (
    <div>
      <div className="hover-type-name">网络平台：
        {
          item.ipPlatformInfoGuidWlNames
          && item.ipPlatformInfoGuidWlNames.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            );
          })
        }
      </div>
      <div className="hover-type-name">集数：{item.tvNumberEpisode}</div>
    </div>
  ),
  // 漫画
  '10': item => (
    <div>
      <div className="hover-type-name">状态：{item.ipComicStatusName}</div>
    </div>
  ),
};
