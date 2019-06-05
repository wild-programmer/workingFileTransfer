import * as React from "react";
import { Link } from "react-router-dom";
import default_img_product from "@assets/images/default_img_product.png";

interface IndustryCaseProps {
  data: any;
}

export default class IndustryCase extends React.Component<IndustryCaseProps> {
  render() {
    const { data } = this.props;
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        <span className="span-title">行业案例</span>
        <div className="industry-case flex-row justify-content-around flex-wrap">
          {
            data.sublist && data.sublist.map((item: any, index: number) => {
              return (
                <div key={index} className="case-area flex-column align-items-center">
                  <img className="case-img" src={item.dataPicUrl || default_img_product} alt=""/>
                  <div className="case-text flex-column">
                    <div className="flex-row justify-content-between align-items-center case-first-line">
                      <span className="first-line-span">{`${item.dataName}`}</span>
                      <Link to="/ip-list">{`${item.dataType}`}</Link>
                    </div>
                    <span className="copyright-text">{`${item.dataDesc}`}</span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
