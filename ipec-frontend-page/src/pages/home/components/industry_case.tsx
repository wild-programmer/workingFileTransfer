import * as React from "react";
import { Link } from "react-router-dom";
import default_img_product from "@assets/images/default_img_product.png";
import moment from 'moment';

interface IndustryCaseProps {
  data: any;
}

export default class IndustryCase extends React.Component<IndustryCaseProps> {
  render() {
    const { data } = this.props;
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        <span className="span-title">行业案例</span>
        <div className="industry-case flex-row justify-content-between flex-wrap">
          {
            data && data.map((item: any, index: number) => {
              return (
                <Link to="/ip-research" key={index}>
                  <div className="case-area flex-column align-items-center">
                    <img className="case-img" src={item.dataPicUrl || default_img_product} alt=""/>
                    <div className="case-text flex-column  ">
                      {/*<div className="case-small-img"><img src={item.dataPic} alt=""/></div>*/}
                      {/*<div className="case-word">*/}
                      {/*<div className="title">{item.dataDesc}</div>*/}
                      {/*<div className="bottom-title flex justify-content-between ">*/}
                      {/*<span className={`count attention_num icon iconfont iconic_praise`}*/}
                      {/*// ${item.isGiveLike === 1 ? 'active' : ''}`}*/}
                      {/*//    onClick={async () => {*/}
                      {/*//    }}*/}
                      {/*>1</span>*/}
                      {/*<span className="span-two">*/}
                      {/*<i>By Normcore</i>*/}
                      {/*{moment(item.createDate).format("YYYY-MM-DD")}</span>*/}
                      {/*</div>*/}
                      {/*</div>*/}
                      <div className="flex-row justify-content-between align-items-center case-first-line">
                        <span className="first-line-span">{`${item.dataName}`}</span>
                        <i>{`${item.dataType}`}</i>
                      </div>
                      <span className="copyright-text">{`${item.dataDesc}`}</span>
                    </div>
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
