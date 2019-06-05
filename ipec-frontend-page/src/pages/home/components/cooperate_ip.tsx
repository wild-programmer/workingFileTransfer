import * as React from "react";

import { Link } from "react-router-dom";
import { Swipe } from "@pages/home/components";
import _chunk from "lodash/chunk";
import _isArray from "lodash/isArray";
import default_img from "@assets/images/default_img_product.png";

interface ICooperateIpProps {
  data: any;
}

export default class CooperateIp extends React.Component<ICooperateIpProps> {
  render() {
    const { data: { sublist: tmp } } = this.props;
    let options: object = { effect: "slide", pagination: null, loop: false, };
    let sublist: any[] = [];
    if (_isArray(tmp)) {
      sublist = _chunk(tmp, 3);
      if (sublist.length > 1) {
        options = { effect: "slide", loop: true, pagination: null };
      }
    }
    return (
      <div className="content-container flex-column justify-content-center align-items-center special-container">
        <span className="span-title">热门IP推荐</span>
        <Swipe options={{ ...options }}>
          {
            sublist && sublist.map((arr: any, index: number) => (
              <div key={index} className="swiper-slide flex-row justify-content-around swipe-slide-area">
                {arr && arr.map((item: any, idx: number) => (
                  <div key={idx} className="swipe-slide-custom flex-column">
                    <img src={item.dataPicUrl || default_img} alt=""/>
                    <div className="cooperate-ip-last-line justify-content-between align-items-center">
                      <span className="cooperate-ip-text">{item.dataName}</span>
                      <Link to="/ip-list">{item.dataType}</Link>
                    </div>
                  </div>
                ))}
              </div>
            ))
          }
        </Swipe>
      </div>
    );
  }
}
