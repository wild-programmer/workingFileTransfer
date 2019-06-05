import * as React from 'react';
import { Link } from 'react-router-dom';
import 'assets/scss/download.scss';
import Header from '@components/header';
import { inject, observer } from 'mobx-react';
import Footer from '@components/footer';

// interface IDownloadProps extends IComponentProps {
//
// }
//
// interface IDownloadState {
//
// }
// <IDownloadProps, IDownloadState>
@inject("nav_store")
@observer
export default class extends React.Component<IProps, IStatus> {

  async componentDidMount() {
    const { nav_store } = this.props;
    await nav_store.navList();
  }

  render() {
    const { nav_store } = this.props;
    const { headerNav, footerNav } = nav_store;

    return (
      <div>
        <Header data={headerNav} history={this.props.history}/>
        <div className="download-content">
          <div className="download-controls-wrap flex justify-content-between ">
            <h4>批量下载队列（<span>0</span>）</h4>
            <div className="pull-right">
              <Link to="" className="go-back">返回</Link>
              <div className="download"><a href="javascript:void(0)">下载Excel表格</a></div>
            </div>
          </div>
          <div className="download-lists">
            <div className="download-list-wrap">
              <div className="download-list-top flex justify-content-between">
                <div className="pull-left">
                  <i className="checkbox iconfont iconfuxuankuangweixuanzhong"/>电影
                </div>
                <a href="javascript:void(0)" className="clear"><i
                  className=" iconfont iconlajitong "/>清空记录</a>
              </div>
            </div>
          </div>
        </div>
        <Footer data={footerNav}/>
      </div>

    );
  }
}
