import * as React from "react";
import { Link } from "react-router-dom";
import default_img from "@assets/images/default_img_item.png";
import default_img_ip from "@assets/images/default_img_ip.png";
import renzheng from "@assets/images/renzheng.png";

const number_k_v = {
  "IP形象": 1,
  "文创艺术": 2,
  "图书": 3,
  "网文": 4,
  "电视剧": 5,
  "电影": 6,
  "综艺": 7,
  "明星艺人": 8,
  "动画": 9,
  "漫画": 10,
};

interface IpListItemProps {
  data: any,
  ip_list: any,
  selected: any
}

export default class IpListItem extends React.Component<IpListItemProps> {
  render() {
    const { data: item, ip_list } = this.props;

    return (
      <div
        className="content-container flex-column "> 
        <div className="ip-s flex-row justify-content-between flex-wrap">
          <div className="ip-item-type">
            <img src={item.ipTypePicUrl || default_img_ip} alt=""/>
            <span className="ip-item-type-text">{item.ipType}</span>
            <a onClick={async () => {
              let ipTypeSuperiorNumber = number_k_v[item.ipType];
              await ip_list.changeStatus({ selected: item.ipType, ipTypeSuperiorNumber });
              console.log(item.ipType);
            }}>查看全部</a>
          </div>
          {
            item.sublist && item.sublist.map((val: any) => {
              // const { ipTags }: { ipTags: string } = val;
              const { ipTypeName }: { ipTypeName: string } = val;
              let sub_type = ipTypeName && ipTypeName.split(",");
              return (
                <Link to={`/detail/${number_k_v[val.ipType]}/${val.ipid}`} key={val.id} className="ip-item flex-column align-items-center ip-item-relative">
                  <img className="ip-item-img" src={val.ipPic || default_img_ip} alt=""/> 
                  {val.ipIsAuthenticated === 3 &&  <img src={renzheng} className="ip-item-certification" alt=""/>} 
                  <span>{`${val.ipName}`}</span>
                  <div className="ip-item-sub-type justify-content-around align-items-center flex-wrap">
                    {sub_type && sub_type.map((sub: string, idx: number) =>
                      <span className="ip-item-sub-type-span" key={idx}>{`${sub}`}</span>)}
                  </div>
                </Link>
              );
            })
          }
        </div>
      </div>
    );
  }
}
