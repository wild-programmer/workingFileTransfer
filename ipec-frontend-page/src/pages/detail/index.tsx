import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";

import "@assets/scss/detail.scss";
import { inject, observer } from "mobx-react";
import { IpArt } from "@pages/detail/components";
import UploadFileModel from '@components/upload_file_model';
import Model from '@components/model';
import ScrollTop from "@components/scrollTop";
import {
  getContact, setContact, deletContact
} from "@utils/util";
import { toJS } from "mobx";
// {
  //   name:'喵呜',
  //   guid:'111',
  //   ipids:'575',
  // }
// const component_k_v = {
//   "art": IpArt,
// };
const numberKV = {
  'IP形象': 1,
  '文创艺术': 2,
  '图书': 3,
  '网文': 4,
  '电视剧': 5,
  '电影': 6,
  '综艺': 7,
  '明星艺人': 8,
  '动画': 9,
  '漫画': 10,
};

interface IDetailState {
  data: string[];
  show: boolean;

  contastList:object;
  uploadShow: Boolean;
  modelState: Boolean;
}

@inject("detail")
@inject("nav_store")
@inject("update")
@observer
export default class Detail extends React.Component<IProps, IDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      show: false,
      contastList: JSON.parse(localStorage.getItem('contastList')),
      uploadShow: false,
      modelState: false,
    };
  }

  async componentDidMount() {
    document.title = "版圈儿-详情";
    const { detail, nav_store, update } = this.props;
    await nav_store.navList();
    this.setState({
      show: true
    });
    // 获取路由参数值this.props.match.params.参数名
    const { match: { params } } = this.props;
    let ipTypeNumber = Number(params['ipTypeNumber']);
    let ipid = Number(params['id']);
    let user = sessionStorage.getItem("user");
    await detail.getIpPeople({ ipTypeNumber, ipid });
    if (params.hasOwnProperty('id') && ipid > 0) {
      if (user !== null) {
        const { userGuid } = JSON.parse(user);
        const params = { userGuid, ipTypeSuperiorNumber: ipTypeNumber, ipid };
        await detail.ipDetail(params);
      } else {
        const params = { ipTypeSuperiorNumber: ipTypeNumber, ipid };
        await detail.ipDetail(params);
      }
      await detail.getRelatedCase({ ipid });
      await detail.ipArtLike({ ipTypeSuperiorNumber: ipTypeNumber });
      const params = { ipTypeSuperiorNumber: ipTypeNumber, ipid };
      await detail.getDetailTotal(params);
      if (ipTypeNumber === 2) {

      } else if (ipTypeNumber === 8) {

        const { starList: { ipName } } = detail;
        await detail.getProdctionData({ isUpcoming: 0, ipid, ipName: encodeURI(ipName), currentPage: 1, pageSize: 4 });
        await detail.getProdctionData({ isUpcoming: 1, ipid, ipName: encodeURI(ipName), currentPage: 1, pageSize: 2 });

      } else if (ipTypeNumber === 1) {

      }

    }

    /**
     * 下载资料
     */
    await update.getDownload({ id: ipid });
  }

  private callback = (params: boolean) => {
    this.setState({ uploadShow: params });
  };
  private callbackModel = (params: boolean) => {
    this.setState({ modelState: params });
  };
  private deletContast = (ipids) => {
    deletContact(ipids)
    this.setState({ contastList: JSON.parse(localStorage.getItem('contastList')) });
  };

  private callbackcontastList = (contastList) => { 
    this.setState({ contastList: contastList}); 
  };

  render() {
    const { nav_store, update } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { businessList } = update;
    // const Component = component_k_v[component];
    const { match: { params } } = this.props;
    const ipTypeNumber = parseInt(params['ipTypeNumber']);
    const id = params['id'];
    const { uploadShow, modelState,contastList } = this.state;
    return (
      <div>
        <Header data={headerNav} history={this.props.history}/>
        {
          modelState && <Model data={businessList} title="下载资料" onClose={() => {
            this.setState({
              modelState: false
            });
          }}/>
        }
        <div className="detail-container flex-row">{
          // ipTypeNumber === 1 || ipTypeNumber === 2 || ipTypeNumber === 8 &&
          <IpArt id={id} ipTypeNumber={ipTypeNumber} 
          contastList={contastList} 
          callbackcontastList = {this.callbackcontastList}
                 history={this.props.history}
                 callbackParent={this.callback}
                 callback={this.callbackModel}/>

        }
          {/*{*/}
          {/*ipTypeNumber === 6 && <IpTv id={6} ipTypeNumber={ipTypeNumber}*/}
          {/*history={this.props.history}*/}
          {/*callbackParent={this.callback}*/}
          {/*callback={this.callbackModel}/>*/}
          {/*} {*/}
          {/*ipTypeNumber === 5 && <IpTv id={5} ipTypeNumber={ipTypeNumber}*/}
          {/*history={this.props.history}*/}
          {/*callbackParent={this.callback}*/}
          {/*callback={this.callbackModel}/>*/}
          {/*} {*/}
          {/*ipTypeNumber === 7 && <IpTv id={7} ipTypeNumber={ipTypeNumber}*/}
          {/*history={this.props.history}*/}
          {/*callbackParent={this.callback}*/}
          {/*callback={this.callbackModel}/>*/}
          {/*}*/}
          {/*{Component && <Component data={data}/>}*/}
        </div>
        <Footer data={footerNav}/>
        {uploadShow &&
        <UploadFileModel 
        setipMaterial={()=>{}}
        callback={()=>{}}
        title="上传商务合作资料" ipid={id} 
        onClose={() => {
          this.setState({
            uploadShow: false
          });
        }}/>
        }
        <ScrollTop contrast={true} data={this.state.contastList} deletContast={this.deletContast} /> 
      </div>
    );
  }
}
