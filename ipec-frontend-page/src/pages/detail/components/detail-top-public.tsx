import * as React from 'react';

export default {
  // ip 形象
  '1': item => {
    return (
      <div className="basic-msg">
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
        <div className="base-line flex-row">
          <span>已授权品类:&nbsp;</span>
          <span></span>
        </div>
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTime}</span>
        </div>
      </div>
    );
  },
  // 文创艺术
  '2': item => {
    return (
      <div className="basic-msg">
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
        <div className="base-line flex-row">
          <span>已授权品类:&nbsp;</span>
          <span></span>
        </div>
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTime}</span>
        </div>
      </div>
    );
  },
  // 图书
  '3': item => {
  },
  // 网文
  '4': item => {
  },
  // 电视剧
  '5': item => (
    <div className="basic-msg">
      <div className="base-line flex-row">
        <span>所属国别:&nbsp;</span>
        <span>{item.countryNames}</span>
      </div>
      <div className="base-line flex-row">
        <span>备案国别:&nbsp;</span>
        <span>{item.recordCountry}</span>
      </div>
      <div className="base-line flex-row">
        <span>首播时间:&nbsp;</span>
        <span>{item.showDate}</span>
      </div>
      <div className="base-line flex-row">
        <span>集  数:&nbsp;</span>
        <span>{item.filmLength}</span>
      </div>
      <div className="base-line flex-row">
        <span>主  演:&nbsp;</span>
        <span>{item.ipIsAuthenticated}</span>
      </div>
      <div className="base-line flex-row">
        <span>导  演:&nbsp;</span>
        <span>{item.director}</span>
      </div>
      <div className="base-line flex-row">
        <span>编  剧:&nbsp;</span>
        <span>{item.scriptwriter}</span>
      </div>
      <div className="base-line flex-row">
        <span>出品公司:&nbsp;</span>
        <span>{item.companyGuidCpNames}</span>
      </div>
      <div className="base-line flex-row">
        <span>发行公司:&nbsp;</span>
        <span></span>
      </div>
      <div className="base-line flex-row">
        <span>在线播放平台:&nbsp;</span>
        <span>就萨克洛夫的骄傲</span>
      </div>
      <div className="base-line flex-row">
        <span>首播电视平台:&nbsp;</span>
        <span></span>
      </div>
      <div className="base-line flex-row">
        <span>可授权区域:&nbsp;</span>
        <span>{item.authorizedLocation}</span>
      </div>
      <div className="base-line flex-row">
        <span>可授权品类:&nbsp;</span>
        <span>{item.authorizedTypeNames}</span>
      </div>
      <div className="base-line flex-row">
        <span>已授权品类:&nbsp;</span>
        <span></span>
      </div>
      <div className="base-line flex-row">
        <span>可授权期限:&nbsp;</span>
        <span>{item.authorizedAllottedTime}</span>
      </div>
    </div>
  ),
  // 电影
  '6': item => {
    return (
      <div className="basic-msg">
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
        <div className="base-line flex-row">
          <span>备案国别:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
        <div className="base-line flex-row">
          <span>上映时间:&nbsp;</span>
          <span>{item.showDate}</span>
        </div>
        <div className="base-line flex-row">
          <span>片    长:&nbsp;</span>
          <span>{item.filmLength}</span>
        </div>
        <div className="base-line flex-row">
          <span>主    演:&nbsp;</span>
          <span>{item.protagonist}</span>
        </div>
        <div className="base-line flex-row">
          <span>导    演:&nbsp;</span>
          <span>{item.director}</span>
        </div>
        <div className="base-line flex-row">
          <span>编    剧:&nbsp;</span>
          <span>{item.scriptwriter}</span>
        </div>
        <div className="base-line flex-row">
          <span>出品公司:&nbsp;</span>
          <span></span>
        </div>
      </div>
    );
  },
  // 综艺
  '7': item => (
    <div className="basic-msg">
      <div className="base-line flex-row"><span>所属国别:&nbsp;</span><span>{item.countryNames}</span></div>
      <div className="base-line flex-row"><span>备案国别:&nbsp;</span><span>{item.recordCountry}</span></div>
      <div className="base-line flex-row"><span>首播时间:&nbsp;</span><span>{item.showDate}</span></div>
      <div className="base-line flex-row"><span>期&nbsp;&nbsp;&nbsp;&nbsp;数:&nbsp;</span><span>{item.periods}</span></div>
      <div className="base-line flex-row"><span>主  持  人:&nbsp;</span><span>{item.compere}</span></div>
      <div className="base-line flex-row"><span>主要嘉宾:&nbsp;</span><span>{item.residentGuest}</span></div>
      <div className="base-line flex-row"><span>导    演:&nbsp;</span><span>{item.director}</span></div>
      <div className="base-line flex-row"><span>制片  人:&nbsp;</span><span>{item.productionManager}</span></div>
    </div>
  ),
  // 名人
  '8': item => (
    <div className="basic-msg">
      <div className="base-line flex-row">
        <span>国籍:&nbsp;</span>
        <span>{item.nationality}</span>
      </div>
      <div className="base-line flex-row">
        <span>职业:&nbsp;</span>
        <span>{item.profession}</span>
      </div>
      <div className="base-line flex-row">
        <span>出生日期:&nbsp;</span>
        <span>{item.brithDate}</span>
      </div>
      <div className="base-line flex-row">
        <span>经济公司：&nbsp;</span>
        <span>{item.brokerageFirmGuid}</span>
      </div>
    </div>
  ),
  // 动画
  '9': item => (
    <div>
    </div>
  ),
  // 漫画
  '10': item => (
    <div>
    </div>
  ),
};
