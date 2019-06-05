import * as React from "react";
import { Swipe } from "@pages/home/components";
import _chunk from "lodash/chunk";
import _isArray from "lodash/isArray";

interface ICooperatePartnerProps {
  data: any;
}

export default class CooperatePartner extends React.Component<ICooperatePartnerProps> {
  render() {
    const { data: { sublist: tmp } } = this.props;
    let options: object = { effect: "slide", pagination: null, loop: false, };
    let sublist: any[] = [];
    if (_isArray(tmp)) {
      sublist = _chunk(tmp, 6);
      if (sublist.length > 1) {
        options = { effect: "slide", loop: true };
      }
    }
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        <span className="span-title">合作伙伴</span>
        <Swipe name="swipe-banner" options={{ ...options }}>
          {
            sublist && sublist.map((arr: any, index: number) => (
              <div key={index} className="swiper-slide flex-row justify-content-around swipe-slide-area">
                {arr && arr.map((item: any, idx: number) => (
                  <div key={idx} className="swipe-slide-custom flex-column ">
                    <img className="swipe-item-img" src={item.dataPicUrl} alt=""/>
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
