import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";
import "@assets/scss/contrast.scss";
import { inject, observer } from "mobx-react"; 
import 'antd/dist/antd.css';
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import EchartBar from "@components/echart_bar_darren"
import moment from 'moment';
import { savePic } from '@utils/api';
import Alert from '@components/alert';
import { number } from "prop-types";
import { Link } from 'react-router-dom';


import img1 from "@assets/images/contrast/1.png";
import img2 from "@assets/images/contrast/2.png";
import img3 from "@assets/images/contrast/3.png";
interface Options {
  show: any,
  message: string
}

//
@inject("nav_store")
@inject("contract")
@inject("update")
@observer
export default class User extends React.Component<IProps, Options> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      message: '',
    }
  }

  async componentDidMount() {
    document.title = "IPEC";
    const { nav_store, user } = this.props;
  }

  render() {
    const { nav_store, user, update } = this.props;
    let { headerNav, footerNav } = nav_store;
    return (
      <div className="bg-color userhtml">
        <Header data={headerNav} history={this.props.history} />
        <div className="contrast">
          <div className="contrast_product">
            <div>
              <div className="img">
                <img src={img1}></img>
                <div className="product_tool">
                  <span>喵呜琪琪的梦</span>
                  <span className="icon">X</span>
                </div>
              </div>
            </div>
            <div>
              <img src={img2}></img>
              <div className="product_tool">
                <span>柴犬馒头</span>
                <span className="icon">X</span>
              </div>
            </div>
            <div>
              <img src={img3}></img>
              <div className="product_tool">
                <span>疯了，瑰宝</span>
                <span className="icon">X</span>
              </div>
            </div>
          </div>
          
          <div className="class_fication">
            <div className="item active">
              <span className="icon">XX</span>
              <span className="text">基础数据</span> 
            </div>
            <div className="item">
              <span className="icon">XX</span>
              <span className="text">版圈儿评估</span>
            </div>
            <div className="item">
              <span className="icon">XX</span>
              <span className="text">版圈儿预测</span>
            </div>
          </div>
          <div className="Survey_data">
            <p><span className="icon">XX</span> 数据总览</p> 
            <table>
              <thead>
                <tr>
                  <th>全网热度值</th>
                  <th>媒体指数</th>
                  <th>全网搜索量</th>
                  <th>官微粉丝数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>96 <span>X</span> </td>
                  <td>4567亿 --</td>
                  <td>567 <span>X</span> </td>
                  <td>567543 <span>X</span> </td>
                </tr>
              </tbody>
            </table>
            <p><span className="icon">XX</span> 搜索基础数据指数</p>
            <div className="serche">
              <EchartBar container="echart_bar_darren" data="[]"></EchartBar>
            </div>
          </div>
        </div>


        {this.state.show &&
          <Toast
            onClose={() => {
              this.setState({ show: false });
            }}
            duration={2}
            message={this.state.message}
          />}
        <Footer data={footerNav} />
      </div>
    );
  }
}
