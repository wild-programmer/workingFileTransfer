import * as React from "react";
import { Link } from "react-router-dom";
import "@assets/scss/footer.scss";
import { toJS } from "mobx";

interface IFooterProps {
  style?: object;
  data: Array<any>;
  // especialData:Array<any>;
}

export default class Footer extends React.Component<IFooterProps> {

  shouldComponentUpdate(nextProps: Readonly<IFooterProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return this.props !== nextProps;
  }

  render() {
    const { style = {}, data: tmp } = this.props;
    const data = toJS(tmp);
    return (
      <div style={{ ...style }} className="footer-container flex-column flex-fill">
        <div className="operation flex-row flex-fill">
          <div className="flex-fill flex-row justify-content-between column-container">
            {data && data.map((item, index) => {
              return (
                <ul key={index}
                    className={item.navName === "联系我们" ? "operation-column justify-content-end" : "operation-column flex-column"}>
                  <span>{item.navName || ""}</span>
                  {
                    item.sublist && item.sublist.map((sub: any, i: number) => {
                      let idx = i + "sublist";
                      return (
                        <li key={idx}>
                          <Link to={sub.navUrl}>{sub.navName}</Link> 
                        </li>
                      );
                    })
                  }
                </ul>
              );
              // if(item.navName == "联系我们"){
              //   return (
              //       <div className="flex-fill flex-row column-container justify-content-end">
              //         <ul  className="operation-column flex-column">
              //           <span>{item.navName || ""}</span>
              //           {
              //             item.sublist && item.sublist.map((sub: any, i: number) => {
              //               let idx = i + "sublist";
              //               return (
              //                   <li key={idx}>
              //                     <Link to={sub.navUrl}>{sub.navName}</Link>
              //                   </li>
              //               );
              //             })
              //           }
              //         </ul>
              //       </div>
              //   );
              // }else{
              //   return (
              //       <div className="flex-fill flex-row justify-content-between column-container">
              //         <ul key={index} className="operation-column flex-column">
              //           <span>{item.navName || ""}</span>
              //           {
              //             item.sublist && item.sublist.map((sub: any, i: number) => {
              //               let idx = i + "sublist";
              //               return (
              //                   <li key={idx}>
              //                     <Link to={sub.navUrl}>{sub.navName}</Link>
              //                   </li>
              //               );
              //             })
              //           }
              //         </ul>
              //       </div>
              //   );
              // }
            })}
            <ul className="operation-column  flex-column">
              <li className="justify-content-end">
                <ul className="pull-right">
                  <span>联系我们</span>
                  <li>电话：021-5280 9679</li>
                  <li>邮箱：business@cooltour.fun</li>
                  <li>微信号：cooltour_ipec</li>
                </ul>
                <ul className="clearfix"></ul>
              </li>

            </ul>
          </div>
          {/*<div className="flex-fill flex-row column-container justify-content-end">*/}

          {/*</div>*/}
        </div>
        <div className="footer-bottom">
          <div>Copyright &copy; 2018 www.indexip.cn. All rights reserved.(V2.0)
          </div>
        </div>
      </div>
    );
  }
}
