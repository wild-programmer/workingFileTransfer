import * as React from "react";

import ic_authorized from "@assets/images/ic_authorized.svg";
import ic_ip_inquiry from "@assets/images/ic_ip_inquiry.svg";
import ic_marketing from "@assets/images/ic_marketing.svg";
import ic_hyal from "@assets/images/ic_hyal.svg";
import ic_ipk from "@assets/images/ic_ipk.svg";
import ic_kfpt from "@assets/images/ic_kfpt.svg";

interface ICoreProductProps {
  data: any;
}

export default class CoreProduct extends React.Component<ICoreProductProps> {
  render() {
    const { data } = this.props;
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        <span className="span-title">{data.moduleName || ""}</span>
        <ul className="product-case flex-row justify-content-around flex-wrap">
          {
            data.sublist.map((item: any) => {
              let { dataName: name } = item;
              let img = this.icon(name) || ic_authorized;
              return <li key={name} className="flex-column align-items-center justify-content-center">
                <img src={img} alt=""/>
                <span>{name}</span>
                <span>{item.dataDesc}</span>
              </li>;
            })
          }
        </ul>
      </div>
    );
  }

  private icon(name: string): string {
    let iconObj = {
      "授权合作": ic_authorized,
      "IP查询": ic_ip_inquiry,
      "营销方案": ic_marketing,
      "开放平台": ic_kfpt,
      "IP库": ic_ipk,
      "IP行业案例": ic_hyal
    };
    return iconObj[name];
  }
}
