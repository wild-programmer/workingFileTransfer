import * as React from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import "@assets/scss/industry_detail.scss";
// import "http://res.wx.qq.com/open/js/jweixin-1.2.0.js";
import iconKefu2 from "@assets/images/icon-kefu2.png";
import ScrollTop from "@components/scrollTop";
import Header from "@components/header";
import Footer from "@components/footer";
import Alert from '@components/alert';



interface IDetailState {
  data: string[],
  show: boolean,
  uploadShow: Boolean,
  modelState: Boolean,
  result: any,
  message: string,
  userinfo: object,
}

@inject("nav_store")
@inject("industry_detail")
@observer
export default class Detail extends React.Component<IProps, IDetailState> {
  async componentDidMount() {
    document.title = "详情页";
    const { industry_detail, nav_store } = this.props;
    await nav_store.navList();
    await this.getdetail();
    // await this.getdetail({ ipid: '4fb4bd1f-8503-4907-8b90-e9485225b730' });
  }

  async getdetail() {
    let param = {
      portalPostGuid: this.props.match.params['ipid'],
      userGuid: this.state.userinfo && this.state.userinfo['userGuid'] ? this.state.userinfo['userGuid'] : this.props.history.push('/login'),
    };
    let result = await this.props.industry_detail.getDetail(param);
    if (result.request) {
      this.setState({ result: result.result });
    } else {
      this.setState({
        message: result.result.errorMsg,
        show: result.request,
      });
    }
  }

  /**
   * POST setLike 设置点赞
   * isLike 1表示点赞 0表示取消点赞
   * portalPostGuid url参数
   */
  async setLike(islike) {
    let param = {
      portalPostGuid: this.props.match.params['ipid'], userGuid: this.state.userinfo['userGuid'], isLike: islike
    };
    let isSuccess = await this.props.industry_detail.setLike(param);
    if (isSuccess.request) {
      // 重新获取详情数据'
      await this.getdetail();
    } else {
      this.setState({ message: isSuccess.result, show: true });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      show: false,
      uploadShow: false,
      modelState: false,
      result: '',
      message: '',
      userinfo: JSON.parse(sessionStorage.getItem("user")), // 从sessionStorage 后被userinfo接口的返回值替换
    };
  }

  sharetip() {
    let url = window.location.href,
      title = 'titleEdit';
    let sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url;
    window.open(sharesinastring, 'newwindow', 'height=500,width=500,top=100,left=100');
  }

  qqShare() {
    let p = {
      url: window.location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
      desc: '发送信息给好友',
      title: this.state.result.postTitle, /*分享标题(可选)*/
      summary: '', /*分享摘要(可选)*/
      pics: '', /*分享图片(可选)*/
      flash: '', /*视频地址(可选)*/
      site: window.location.href, /*分享来源(可选) 如：QQ分享*/
      style: '203',
      width: 16,
      height: 16
    };
    let s = [];
    for (let i in p) {
      s.push(i + '=' + encodeURIComponent(p[i] || ''));
    }
    let qhref = "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
    window.open(qhref, 'newwindow', 'height=500,width=500,top=100,left=100');
  };

  render() {
    let { nav_store } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { show, message, result } = this.state;
    return (
      <div className="industry_body body ">
        <Header data={toJS(headerNav)} style={{ backgroundColor: "#2e3943" }} history={this.props.history} />
        <div className="industry_detail clearfix">
          <div className="industry_detail_one">
            <h4>{result.postTitle}</h4>
            <div className="industry_detail_user">
              <div className="industry_detail_user_one">
                <div className="media">
                  <div className="media-left">
                    <a href="#">
                      <img className="media-object" src="http://www.indexip.cn/image/user.svg" alt="..." />
                    </a>
                  </div>
                  <div className="media-body">
                    <p>{result.portalPostGuid}</p>
                    <span>{result.createDate}</span><span className="jubo">{/* 举报 */}</span>
                  </div>
                </div>
              </div>
              <div className="industry_detail_user_two">
                {result.isGiveLike ? (
                  <i className="icon iconfont iconic_praise active" onClick={() => {
                    this.setLike(0);
                  }} />
                ) : (
                    <i className="icon iconfont iconic_praise" onClick={() => {
                      this.setLike(1);
                    }} />
                  )}
                <span className="span1">{result.portalPostLikeCount}</span>
                <div className="divimg">
                  <div className="bdsharebuttonbox bdshare-button-style0-32" data-bd-bind="1556087003897">
                    {/* <a href="javascript:;" className="bds_tsina" data-cmd="tsina" title="分享到新浪微博" onClick={() => {
                      this.sharetip();
                    }}/> */}
                    {/* <a href="javascript:;" className="bds_weixin" data-cmd="weixin" title="分享到微信"/>
                    <a href="javascript:;" className="bds_sqq" data-cmd="sqq" title="分享到QQ好友" onClick={() => {
                      this.qqShare();
                    }}/> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="detail_img" dangerouslySetInnerHTML={{ __html: result.postContent }}>
            </div>
          </div>
          <div className="industry_detail_two">
            {result.ipName || result.ipPicUrl ? (
              <div className="head_user">
                <p className="p1">关联IP</p>
                {result.ipName ? (<p className="p2"><i className="icon iconfont icon-ic_url" /> <span
                  className="span_name">{result.ipName}</span></p>) : (null)}
                {result.ipid && result.iptype ? (
                  <a href={`#/detail/${result.ipid}/${result.iptype}`} style={{ overflow: "hidden" }}>
                    <div className="people_img">
                      <img src={result.ipPicUrl} alt="" />
                    </div>
                  </a>
                ) : (
                    <a href="javascript:;" style={{ overflow: "hidden" }}>
                      <div className="people_img">
                        <img src={result.ipPicUrl} alt="" />
                      </div>
                    </a>
                  )}

              </div>
            ) : (
                ''
              )}

            {result.portalPostGuidRelate || result.pcPicUrl || result.postTitleRelate ? (
              <div className="list_user">
                <div>
                  {result.portalPostGuidRelate ? (<p className="p3"><i className="icon iconfont icon-ic_url" />
                    <span>{result.portalPostGuidRelate}</span></p>) : (null)}
                  <div className="list_user_img">
                    {result.portalPostGuidRelate ? (
                      <a href={`#/industry_detail/${result.portalPostGuidRelate}`}>
                        <div className="people_img">
                          <img src={result.pcPicUrl} alt="" />
                        </div>
                      </a>
                    ) : (
                        <a href="javascript:;">
                          <div className="people_img">
                            <img src={result.pcPicUrl} alt="" />
                          </div>
                        </a>
                      )}

                    <p className="p_hover">{result.postTitleRelate}</p>
                  </div>
                </div>
              </div>
            ) : (
                ''
              )}

          </div>
        </div>
        <ScrollTop  contrast={false}/> 
        <Footer data={toJS(footerNav)} />
        {show && <Alert message={message}
          onClose={() => {
            this.setState({ show: false });
          }}
          onSubmit={() => {
            // console.log(this); 
          }}
        />
        }

      </div>
    );
  }
}
