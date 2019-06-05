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
      <div className="hover-type-name">首播时间:{item.showDate}</div>
      <div className="hover-type-name">网络平台：
        {
          item.tvIpPlatformInfoGuidWlNames && item.tvIpPlatformInfoGuidWlNames.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            );
          })
        }
      </div>
      <div className="hover-type-name">主演：{item.tvProtagonist.replace(/,/g, "/")}</div>
      <div className="hover-type-name">集数：{item.tvNumberEpisode}</div>
    </div>
  ),
  // 电影
  '6': item => {
    return (
      <div>
        <div className="hover-type-name">上映时间:{item.showDate}</div>
        <div className="hover-type-name">导演:{item.director}</div>
        <div className="hover-type-name">主演：{item.protagonist && item.protagonist.replace(/,/g, "/")}</div>
        <div className="hover-type-name">累计票房:{item.boxOffice}</div>
      </div>
    );
  },
  // 综艺
  '7': item => (
    <div>
      <div className="hover-type-name">网络平台：
        {
          item.varietyIpPlatformInfoGuidWlNames
          && item.varietyIpPlatformInfoGuidWlNames.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            );
          })
        }
      </div>
      <div className="hover-type-name">主持人:{item.compere}</div>
      <div className="hover-type-name">期数:{item.periods}</div>
    </div>
  ),
  // 名人
  '8': item => (
    <div>
      <div className="hover-type-name">生日：{item.brithDate}</div>
      <div className="hover-type-name">身高：{item.height}</div>
      <div className="hover-type-name">职业:{item.profession}</div>
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
