import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";
import "@assets/scss/user.scss";
import { inject, observer } from "mobx-react";
import { Select } from 'antd';
import 'antd/dist/antd.css';
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import moment from 'moment';
import { savePic } from '@utils/api';
import Alert from '@components/alert';
import { number } from "prop-types";
import { Link } from 'react-router-dom';

const Option = Select.Option;
const children = [];

//
interface IUesrState {
  nextNum: Number;
  childNum: Number;
  btnNum: Number;
  emailNumber: any;
  emailCode: any;
  phoneNuber: any;
  phoneCode: any;
  user: any;
  userinfo: any;
  Verification: {
    type: string,
    number: number,
  };
  UpdataPassword: { oldUserPass: string, userPass: string, userGuid: string, userPassAgain: string };
  RealName: {
    userpic: string,
    nikeName: string,
    userRealName: string,
    realname: string,
    companyname: string,
    companytype: string,
    dsc: string,
    positions: string,
    email: string,
    code: string,
    file: string,
    cardFile: string,
    selected: Object
  };
  iconShow: boolean;
  iconShowNext: boolean;
  show: boolean;
  message: string;
  checkStatus: string;
  papersPicGuid: string;
  pickGuid: string;
  picGuid: string;
  companyGuid: string;
}

const numberKV2 = {
  1: 'IP形象',
  2: '文创艺术',
  3: '图书',
  4: '网文',
  5: '电视剧',
  6: '电影',
  7: '综艺',
  8: '明星艺人',
  9: '动画',
  10: '漫画',
};
@inject("nav_store")
@inject("user")
@inject("update")
@observer
export default class User extends React.Component<IProps, IUesrState> {
  constructor(props: any) {
    super(props);
    this.state = {
      iconShow: false,
      iconShowNext: false,
      Verification: {
        type: '',
        number: 0,
      },
      user: this.props.user,
      btnNum: 1, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      childNum: 0, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      nextNum: 1, // 1.我的发布 2.个人信息 3.账号安全
      phoneNuber: '', // 修改的手机号
      phoneCode: '', // 修改的手机号验证码
      emailNumber: '',
      emailCode: '', // 修改的邮箱验证码
      userinfo: JSON.parse(sessionStorage.getItem("user")),//从sessionStorage 后被userinfo接口的返回值替换
      message: "",
      show: false,
      UpdataPassword: { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' }, // 更新密码
      RealName: {
        userpic:'',
        nikeName: '',
        userRealName: '',
        realname: '',
        companyname: '',
        companytype: '',
        dsc: '',
        positions: '',
        email: '',
        code: '',
        file: '',
        cardFile: '',
        selected: {
          enter: true,
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
        }
      },
      companyGuid:'',
      papersPicGuid: '',
      picGuid: '',
      pickGuid: '',
      checkStatus: '',
    };
  }

  async componentDidMount() {
    document.title = "IPEC";
    const { nav_store, user } = this.props;
    await nav_store.navList();
    await this.getCompanyList();
    await this.getMyRelease('');
    await this.getuserinfo();
  }

  /**
   * 或者个人信息
   */
  async getuserinfo() {
    let isSuccess = await this.state.user.getUserInfo(this.state.userinfo.userGuid);
    let realname_ = this.state.RealName;
    let result = isSuccess.message;
    realname_.userpic = result.picUrl;
    realname_.dsc = result.desc;
    realname_.positions = result.job;
    realname_.nikeName = result.userNickname;
    realname_.userRealName = result.userRealName;
    realname_.companyname = result.companyName?result.companyName:'';
    realname_.selected = {
      enter: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    };
    //为个人信息赋值
    if(result.companyType && result.companyType !== '' ){
      let key:any,
        slect = result.companyType.split(',');
      realname_.selected['enter'] = true;
      for (key in slect){
        realname_.selected[slect[key]] = true;
      }
    }
    if (isSuccess.request) {
      this.setState({
        userinfo: result,
        pickGuid:result.picGuid,
        companyGuid:result.companyGuid,
        RealName:realname_
      });
      sessionStorage.setItem("user", JSON.stringify(result));
    } else {
      this.setState({ message: isSuccess.message, show: true });
    }
  }

  /**
   * 筛选 我更新的信息/我上传的资料（审核状态）
   *  btnNum:     (3)/（2）
   *  type：       1/2
   *  checkStatus""全部，1审核中、2审核通过，3审核不通过，
   */
  async filterGetUpdate(checkStatus) {
    let type;

    if (this.state.btnNum === 2) {
      type = 2;
      await this.getUpdate(checkStatus, type);
    } else if (this.state.btnNum === 3) {
      type = 1;
      await this.getUpdate(checkStatus, type);
    }
    this.setState({
      checkStatus
    });
  }

  /**
   * 我更新的信息/我上传的资料
   * checkStatus:审核状态：""全部，1审核中、2审核通过，3审核不通过，
   * type：1 内容  2 资料
   */
  async getUpdate(checkStatus, type) {
    const { user } = this.props;
    const { userinfo: { userGuid } } = this.state;
    let params = {
      userGuid,
      checkStatus,
      type
    };
    await user.getUpdate(params);

  }

  async getMyRelease(ipCheckStatus) {
    const { user } = this.props;
    const { userinfo: { userGuid } } = this.state;
    let params = {
      userGuid,
      ipCheckStatus,
    };
    this.setState({
      checkStatus: ipCheckStatus
    });
    await user.myRelease(params);
  }

  /**
   * 切换左侧导航栏，调用不同的接口
   *  1 => 我发布的ip
   * 3=》 我更新的信息
   * 2=> 我上传的资料
   * @param num
   */
  async setMenuNum(num: number) {
    this.setState({
      btnNum: num
    });
    if (num === 1) {
      await this.getMyRelease('');
    } else if (num === 2) {
      await this.getUpdate('', 2);
    } else if (num === 3) {
      await this.getUpdate('', 1);
    }
  };

  /**
   * 上传图片
   * @param e
   * @param field
   * @param picType 1首页幻灯片，2ip海报图，3个人头像，4名片，5证件照，6ppt页面
   */
  async uploadImg(e, field, picType, el) {
    let file = e.target.files[0],
      reader = new FileReader(),
      _RealName = this.state.RealName;
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, picType };
      const { errorCode, result = {} }: any = await savePic(params);
      if (errorCode === '200' && result.errorCode === 200) {
        _RealName[el] = e.target['result'];
        this.setState({
          RealName: _RealName
        });
        // 动态设置setState 的值
        const data = {};
        data[field] = result.data;
        this.setState(data);
        return true;
      } else {
        _RealName[el] = '';
        this.setState({
          RealName: _RealName
        });
        return false;
      }
    };
  }

  // 获取公司列表
  async getCompanyList() {
    let isSuccess = await this.state.user.getCompanyList();
    if (isSuccess) {
      isSuccess.forEach((element: any) => {
        children.push(<Option key={element.companyGuid}  value={element.companyGuid+`:index${element.id}`}>{element.companyName}</Option>);
      });
    } else {
      this.setState({ message: '获取公司列表失败', show: true });
      this.props.history.push("/user");
      // this.onSubmitResult(code, userLogin);
    }
  }

  // 获取验证码
  async EditCode({ type }) {
    /**
     * 获取验证码
     * @param userLogin 登陆名
     * @param receiverType  1手机 2邮箱
     * @param sendType    1注册 2修改密码 3实名认证 4修改绑定
     */
    let param = {
        userLogin: "",
        receiverType: 0,
        sendType: 0
      },
      validation = null,
      _this = this;
    if (type == 'editPhone') {
      validation = _this.state.phoneNuber;
    } else if (type == 'editEmail') {
      validation = _this.state.emailNumber;
    }
    switch (type) {
      case 'editPhone':
        param.receiverType = 1;
        param.sendType = 4;
      case 'editEmail':
        param.receiverType = 2;
        param.sendType = 4;
      case 'editinformation':
        param.receiverType = 2;
        param.sendType = 3;
      default:
    }
    if (this.reglPhoneEamil(type, validation)) return false;
    let isSuccess = await this.state.user.getEditCode({
      userLogin: param.userLogin,
      receiverType: param.receiverType,
      sendType: param.sendType
    });
    //如果成功 开始倒计时
    if (isSuccess.request) {
      let _Verification = {
        type,
        number: 30,
      };
      this.setState({
        Verification: _Verification
      });
      var interval = setInterval(() => {
        if (this.state.Verification.number == 0) {
          clearInterval(interval);
          this.setState({
            Verification: {
              type: '',
              number: 0,
            }
          });
        } else {
          let Verification_ = this.state.Verification;
          Verification_.number--;
          this.setState({
            Verification: Verification_
          });
        }
      }, 1000);
    }
    this.setState({ message: isSuccess.message, show: true });
  }

  //  接口消息提示
  interfaceTip = (isSuccess: any, callback: Function) => {
  };

  // 保存个人信息 确认发送
  async saveUserInformation({ }) {
    let information = this.state.RealName;
    let param = {
      picGuid: this.state.pickGuid,
      userNickname: information.nikeName,
      userRealName: information.userRealName,
      companyName: information.companyname,
      job: information.positions,
      desc: information.dsc,
      userGuid: this.state.userinfo.userGuid,
      companyGuid:this.state.companyGuid,
      companyType: null,
    };
    //判断是否是用户手动输入
    if (information.selected['enter']) {
      for (var key in information['selected']) {
        if (key !== 'enter') {
          if (param.companyType == null) {
            if (information['selected'][key]) param.companyType = key;
          } else {
            if (information['selected'][key]) param.companyType += (',' + key);
          }
        }
      }
    }
    //检测param 是否符合提交条件
    for (key in param) {
      if (param[key] == "" ) {
        switch (key){
          case 'picGuid':
            this.setState({ message: '请完善头像', show: true });
            return false
            case 'userNickname':
            this.setState({ message: '请填写昵称', show: true });
            case 'userRealName':
            this.setState({ message: '请填写真实姓名', show: true });
            return false
            case 'companyName':
            this.setState({ message: '请填写公司名称', show: true });
            return false
            case 'desc':
            this.setState({ message: '请填写个人简介', show: true });
            return false
            case 'job':
            this.setState({ message: '请填担任职务', show: true });
            return false
        }
        this.setState({ message: '请填写完整表单信息', show: true });
        return false;
      }
      if (key == 'companyType' && information.selected['enter'] && param[key] == null) {
        this.setState({ message: '请选择公司性质', show: true });
        return false;
      }
    }
    let isSuccess = await this.state.user.setInformation(param);
    this.setState({ message: isSuccess.result.errorMsg, show: true });
    //清空输入框内容
    if (isSuccess.request) {
      information.userpic = '';
      information.dsc = '';
      information.positions = '';
      information.nikeName = '';
      information.userRealName = '';
      information.companyname = '';
      information.selected = {
        enter: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
      this.setState({
        pickGuid:'',
        RealName: information
      });
      this.getuserinfo()
    }
  }

  // 实名认证 确认发送
  async editinformation({ }) {
    let param = {
      papersPicGuid: this.state.papersPicGuid,
      picGuid: this.state.picGuid,
      userGuid: this.state.userinfo.userGuid,
      userRealName: this.state.RealName['realname']
    };
    if (param.userRealName == '') {
      this.setState({ message: '请输入真实姓名', show: true });
      return false;
    }
    if (param.papersPicGuid == '') {
      this.setState({ message: '请上传证件照', show: true });
      return false;
    }
    if (param.userGuid == '') {
      this.setState({ message: '请上传名片', show: true });
      return false;
    }
    let isSuccess = await this.state.user.RealAuthentication(param);
    this.setState({ message: isSuccess.result, show: true });
    if (isSuccess.request) {
      var Reaname_ = this.state.RealName;
      Reaname_.realname = '';
      this.setState({ nextNum: 3, RealName: Reaname_ });
    }
  }

  // 修改手机号邮箱 确认发送
  async editPhoneNumber({ type }) {
    let receiverType = 0,
      code = null,
      number = null;
    if (type == 'editPhone') {
      receiverType = 1;
      number = this.state.phoneNuber;
      code = this.state.phoneCode;
    } else if (type == 'editEmail') {
      receiverType = 2;
      number = this.state.emailNumber;
      code = this.state.emailCode;
    }
    if (this.reglPhoneEamil(type, number)) return false;
    if (code.length !== 6 || code == '') {
      this.setState({ message: "请输入正确的验证码", show: true });
      return false;
    }
    let isSuccess = await this.state.user.userInformation({
      email: this.state.emailNumber,
      code: code,
      mobile: this.state.phoneNuber,
      receiverType: receiverType,
      userGuid: this.state.userinfo.userGuid
    });
    if (isSuccess.request) {
      this.props.history.push("/user");
      this.setState({ message: '修改成功', show: true, phoneNuber: '', emailCode: '', emailNumber: '', phoneCode: '' });
    } else {
      this.setState({ message: isSuccess.result.errorMsg, show: true });
    }
  };

  // 修改密码 确认提交接口
  async UpdataPassword() {
    let _updataPassword = this.state.UpdataPassword;
    _updataPassword.userGuid = this.state.userinfo.userGuid;
    if (_updataPassword['userPass'] == '' || _updataPassword['userPassAgain'] == '') {
      this.setState({ message: '请把密码输入完整', show: true });
      return false;
    }
    if (_updataPassword['userPass'] !== _updataPassword['userPassAgain']) {
      this.setState({ message: '两次输入密码不一致', show: true });
      return false;
    }
    let isSuccess = await this.state.user.updataPassword(_updataPassword);
    if (isSuccess.request) {
      _updataPassword = { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' };
      this.setState({ message: '修改成功', show: true, UpdataPassword: _updataPassword });
      this.props.history.push("/login");
    } else {
      this.setState({ message: isSuccess.message, show: true });
    }
  }

  //验证密码长度
  invalidatapass = (e: any) => {
    if (e.target.value.length < 8) this.setState({ message: '密码长度不能少于8', show: true });
  };
  //手机号邮箱号验证
  reglPhoneEamil = (type: string, value: any) => {
    if (type == 'editPhone') {
      if (value == '') {
        this.setState({ message: "请填写手机号", show: true });
        return true;
      }
      if (!(/^1[34578]\d{9}$/.test(value))) {
        this.setState({ message: "请输入正确手机号", show: true });
        return true;
      }
    } else if (type == 'editEmail') {
      if (value == '') {
        this.setState({ message: "请填写邮箱号", show: true });
        return true;
      }
      if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value))) {
        this.setState({ message: "请输入正确邮箱", show: true });
        return true;
      }
    }
    return false;
  };
  // 个人信息-选择下拉中的公司名
  handleChange = (value: any, obj: any) => {
    let RealName = this.state.RealName;
    RealName.companyname = obj.props.children;
    this.setState({
      companyGuid:obj.key,
      RealName: RealName
    });
  };
  // 多选按钮
  multiSelect = (el: string) => {
    let realname_ = this.state.RealName;
    realname_['selected'][el] = this.state.RealName['selected'][el] ? false : true;
    if (el == 'enter') {
      if (!this.state.RealName['selected'][el]) {
        realname_['selected'] = {
          enter: false,
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
        };
        // realname_['companyname'] = '';
      }
    }
    this.setState({
      RealName: realname_
    });
    // this.state.RealName['selected'][el]?this.state.RealName['selected'][el] = false:this.state.RealName['selected'][el]=true;
  };

  //切换左侧菜单
  nextMenuNum = (num: number, nextNum: any) => {
    if (nextNum == 30 && num == 3 && this.state.nextNum == 30) return false;

    let _RealName = this.state.RealName;
    _RealName.cardFile = '';
    _RealName.file = '';
    _RealName.realname = '';
    let _state = {
      RealName:_RealName,
      iconShow: false,
      iconShowNext: false,
      Verification: {
        type: '',
        number: 0,
      },
      user: this.props.user,
      btnNum: this.state.btnNum, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      childNum: this.state.childNum, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      nextNum: num, // 1.我的发布 2.个人信息 3.账号安全
      phoneNuber: '', // 修改的手机号
      phoneCode: '', // 修改的手机号验证码
      emailNumber: '',
      emailCode: '', // 修改的邮箱验证码
      userinfo: this.state.userinfo,
      message: "",
      show: false,
      UpdataPassword: { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' }, // 更新密码
      papersPicGuid: '',
      pickGuid: '',
    };
    if (num == 3) {
      this.setState(_state);
    } else {
      this.setState({
        nextNum: num
      });
    }
  };
  //  账号安全-选择模块按钮
  setchildNum = (num: number) => {
    this.setState({
      childNum: num,
      nextNum: 30,
    });
  };

  render() {
    const { nav_store, user, update } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { myUpdateList, myReleaseList } = user;
    const { checkStatus, RealName, UpdataPassword, nextNum, iconShowNext, iconShow, userinfo } = this.state;
    return (
      <div className="bg-color userhtml">
        <Header data={headerNav} history={this.props.history} />
        <div className="my-release">
          <div className="row">
            <div className="row-left">
              <div className="user-head">
                <div className="img-circle">
                  <img className="headimg" src={this.state.userinfo.picUrl} style={{display:this.state.userinfo.picUrl?'block':'none'}}></img>
                </div>
              </div>
              <ul className="list-bottom">
                <li className="active" onClick={() => this.nextMenuNum(1, null)}>
                  <div className={nextNum === 1 ? "left-border" : "left-display"}>
                  </div>
                  <a>我的发布</a>
                </li>
                <li onClick={() => this.nextMenuNum(2, null)}>
                  <div className={nextNum === 2 ? "left-border-two" : "left-display"}>
                  </div>
                  <a>个人信息</a>
                </li>
                <li onClick={() => this.nextMenuNum(3, null)}>
                  <div
                    className={nextNum === 3 || nextNum === 30 ? "left-border-three" : "left-display"}>
                  </div>
                  <a>账号安全</a>
                </li>
              </ul>
            </div>
            <div className={nextNum === 1 ? "row-right-my" : "row-display"}>
              <div className="top-right">
                <ul className="top-ul">
                  <li className={this.state.btnNum === 1 ? "bordr" : "bordr-display"}
                    onClick={async () => await this.setMenuNum(1)}><a>我发布的IP</a></li>
                  <li className={this.state.btnNum === 2 ? "bordr-two" : "bordr-display"}
                    onClick={async () => await this.setMenuNum(2)}><a>我上传的资料</a></li>
                  <li className={this.state.btnNum === 3 ? "bordr-three" : "bordr-display"}
                    onClick={async () => await this.setMenuNum(3)}><a>我更新的信息</a></li>
                  <li className={this.state.btnNum === 4 ? "bordr-four" : "bordr-display"}
                    onClick={async () => await this.setMenuNum(4)}><a>我参与的活动</a></li>
                </ul>
              </div>
              <div className="top-change">
                {
                  this.state.btnNum !== 1 &&
                  <ul>
                    <li>筛选:</li>
                    <li>
                      <a className={checkStatus === '' ? 'active' : ''}
                        onClick={async () => {
                          await this.filterGetUpdate('');
                        }}>全部</a>
                    </li>
                    <li>
                      <a className={checkStatus === '2' ? 'active' : ''}
                        onClick={async () => {
                          await this.filterGetUpdate('2');
                        }}>已发布</a>
                    </li>
                    <li>
                      <a className={checkStatus === '1' ? 'active' : ''}
                        onClick={async () => {
                          await this.filterGetUpdate('1');
                        }}>审核中</a>
                    </li>
                    <li>
                      <a className={checkStatus === '3' ? 'active' : ''}
                        onClick={async () => {
                          await this.filterGetUpdate('3');
                        }}>未通过审核</a>
                    </li>
                  </ul>
                }
                {
                  this.state.btnNum === 1 &&
                  <ul>
                    <li>筛选:</li>
                    <li>
                      <a className={checkStatus === '' ? 'active' : ''}
                        onClick={async () => {
                          await this.getMyRelease('');
                        }}>全部</a>
                    </li>
                    <li>
                      <a className={checkStatus === '1' ? 'active' : ''}
                        onClick={async () => {
                          await this.getMyRelease(1);
                        }}>已发布</a>
                    </li>
                    <li>
                      <a className={checkStatus === '3' ? 'active' : ''}
                        onClick={async () => {
                          await this.getMyRelease('3');
                        }}>审核中</a>
                    </li>
                    <li>
                      <a className={checkStatus === '2' ? 'active' : ''}
                        onClick={async () => {
                          await this.getMyRelease('2');
                        }}>未通过审核</a>
                    </li>
                  </ul>
                }
              </div>
              <div className={this.state.btnNum === 1 ? "table-btnNum" : "table-display"}>
                {
                  myReleaseList && myReleaseList.map((item, index) => {
                    return (
                      <div className="right-table" key={index}>
                        <div className="table-title">{numberKV2[item.ipTypeSuperiorNumber]}</div>
                        <div className="table-list">
                          <table className="table table-striped table-bordered table-hover publish-table">
                            <thead>
                              <tr>
                                <th>序号</th>
                                <th>IP名称</th>
                                <th>IP类型</th>
                                <th>状态</th>
                                <th>添加日期</th>
                                <th>发布日期</th>
                                <th>备注</th>
                                <th>操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                item.list && item.list.map((i, k) => {
                                  return (
                                    <tr key={k}>
                                      <td>{k + 1}</td>
                                      <td>
                                        <div className="publish-table-td with-width-100">
                                          {i.ipName}
                                        </div>
                                      </td>
                                      <td>{numberKV2[item.ipTypeSuperiorNumber]}</td>
                                      <td>
                                        {
                                          i.ipCheckStatus === 1 && <div className="publish-table-td">审核通过</div>
                                        }
                                        {
                                          i.ipCheckStatus === 2 && <div className="publish-table-td">审核不通过</div>
                                        }
                                        {
                                          i.ipCheckStatus === 3 && <div className="publish-table-td">审核中</div>
                                        }
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {moment(i.createDate).format('YYYY-MM-DD')}
                                        </div>
                                      </td>
                                      <td>
                                        {
                                          i.checkTimedate &&
                                          <div className="publish-table-td">
                                            {moment(i.checkTimedate).format('YYYY-MM-DD')}
                                          </div>
                                        }
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {i.checkResult}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {
                                            i.ipCheckStatus === 3 ?
                                              <Link
                                                to={`/update/${item.ipTypeSuperiorNumber}/${i.ipid}/${i.ipCheckStatus}`}
                                                className="re-upload-a-btn">编辑</Link>
                                              :
                                              <Link
                                                to={`/update/${item.ipTypeSuperiorNumber}/${i.ipid}`}
                                                className="re-upload-a-btn">编辑</Link>
                                          }

                                          <a className="delete-a-btn"
                                            onClick={async () => {
                                              let ipid = i.ipid;
                                              const params = {
                                                userGuid: this.state.userinfo.userGuid,
                                                ipid
                                              };
                                              const isSuccess = await user.deleteMyRelease(params);
                                              if (_isObject(isSuccess)) {
                                                this.setState({ message: isSuccess['msg'], show: true });
                                                await this.getMyRelease({ checkStatus });
                                              }
                                            }}
                                          >删除</a>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })

                }
              </div>
              <div className={this.state.btnNum === 2 ? "table-btnNum" : "table-display"}>
                {
                  myUpdateList && myUpdateList.map((item, index) => {
                    return (
                      <div className="right-table" key={index}>
                        <div className="table-title">{numberKV2[item.ipTypeSuperiorNumber]}</div>
                        <div className="table-list">
                          <table className="table table-striped table-bordered table-hover publish-table">
                            <thead>
                              <tr>
                                <th>序号</th>
                                <th>IP名称</th>
                                <th>状态</th>
                                <th>资料名称</th>
                                <th>添加日期</th>
                                <th>发布日期</th>
                                <th>备注</th>
                                <th>操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                item.list && item.list.map((i, k) => {
                                  return (
                                    <tr key={k}>
                                      <td>{k + 1}</td>
                                      <td>
                                        <div className="publish-table-td with-width-100">
                                          {i.ipName}
                                        </div>
                                      </td>
                                      <td>
                                        {
                                          i.checkStatus === 1 && <div className="publish-table-td">审核中</div>
                                        }
                                        {
                                          i.checkStatus === 2 && <div className="publish-table-td">审核通过</div>
                                        }
                                        {
                                          i.checkStatus === 3 && <div className="publish-table-td">审核不通过</div>
                                        }
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {
                                            i.remark.replace(/\^/g, ',')
                                          }
                                        </div>
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {moment(i.createDate).format('YYYY-MM-DD')}
                                        </div>
                                      </td>
                                      <td>
                                        {
                                          i.checkTimedate &&
                                          <div className="publish-table-td">
                                            {moment(i.checkTimedate).format('YYYY-MM-DD')}
                                          </div>
                                        }
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {i.checkResult}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="publish-table-td">
                                          {
                                            i.fileAddress && <a href={i.fileAddress} download>下载</a>
                                          }
                                          <a className="re-upload-a-btn">重新上传</a>
                                          <a className="delete-a-btn"
                                            onClick={async () => {
                                              let approvalGuid = i.approvalGuid;
                                              const params = {
                                                userGuid: this.state.userinfo.userGuid,
                                                materialGuid: approvalGuid
                                              };
                                              const isSuccess = await update.deleteMaterial(params);
                                              // if (_isObject(isSuccess)) {
                                              //   this._setState(true, isSuccess.message);
                                              // }
                                            }}
                                          >删除</a>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })

                }
              </div>
              <div className={this.state.btnNum === 3 ? "table-btnNum" : "table-display"}>
                {
                  myUpdateList && myUpdateList.map((item, index) => {
                    return (
                      <div className="right-table" key={index}>
                        <div className="table-title">
                          {numberKV2[item.ipTypeSuperiorNumber]}
                        </div>
                        <div className="table-list">
                          <table className="table table-bordered table-striped table-hover publish-table">
                            <thead>
                            <tr>
                              <th>序号</th>
                              <th>IP名</th>
                              <th>状态</th>
                              <th>更新字段</th>
                              <th>提交日期</th>
                              <th>发布日期</th>
                              <th>备注</th>
                            </tr>
                            </thead>
                            <tbody>
                            {item.list && item.list.map((i, k) => {
                              return (
                                <tr key={k}>
                                  <td>{k + 1}</td>
                                  <td>
                                    <div className="publish-table-td with-width-100">
                                      {i.ipName}
                                    </div>
                                  </td>
                                  <td>
                                    {
                                      i.checkStatus === 1 && <div className="publish-table-td">审核中</div>
                                    }
                                    {
                                      i.checkStatus === 2 && <div className="publish-table-td">审核通过</div>
                                    }
                                    {
                                      i.checkStatus === 3 && <div className="publish-table-td">审核不通过</div>
                                    }
                                  </td>
                                  <td>
                                    <div className="publish-table-td">
                                      {i.remark.replace(/\^/g, ',')}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="publish-table-td">
                                      {moment(i.createDate).format('YYYY-MM-DD')}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="publish-table-td">
                                      {
                                        i.checkTimedate &&
                                        <div className="publish-table-td">
                                          {moment(i.checkTimedate).format('YYYY-MM-DD')}
                                        </div>
                                      }
                                    </div>
                                  </td>
                                  <td>
                                    <div className="publish-table-td">
                                      {i.checkResult}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                }

              </div>
              <div className={this.state.btnNum === 4 ? "table-btnNum" : "table-display"}>
                <div className="right-table">
                  <div className="table-title">博士伦</div>
                  <div className="table-list">
                    <table className="table table-striped">

                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className={nextNum === 2 ? "row-right-info" : "row-display"}>
              <div className="top-right">
                <ul className="top-ul">
                  <li className={nextNum === 2 ? "bordr" : "bordr-display"}
                    onClick={() => this.nextMenuNum(2, null)}><a>个人信息</a></li>
                  <li className={nextNum === 3 ? "bordr-two" : "bordr-display"}
                    onClick={() => this.nextMenuNum(3, 30)}><a>账号安全</a></li>
                </ul>
              </div>
              <div className="right-head realname-detail">
                <div className="img-circle img-nickPick">
                  <div className="nick_img " style={{ display: this.state.RealName.userpic ? 'block' : 'none' }}>
                    <img className="fpimgs" src={this.state.RealName.userpic}></img>
                  </div>
                  <input type="file" className="btn_nickpic" name="image_file"  accept=".jpg,.jpeg,.png"
                    style={{ width: "100%", height: "100%", opacity: 0 }} onChange={async (e) => {
                      await this.uploadImg(e, 'pickGuid', 4, 'userpic');
                    }} />
                </div>
                <p className="right-p">
                  <label>昵称<span className="span_imp">*</span></label>
                  <input className="form-control nickName" value={RealName.nikeName} onChange={(e) => {
                    RealName.nikeName = e.target.value;
                    this.setState({
                      RealName: RealName
                    });
                  }}>
                  </input>
                </p>

                <div className="form-group">
                  <label>真实姓名<span className="span_imp">*</span></label>
                  <input type="text" className="form-control" placeholder="填写您的姓名" value={RealName.userRealName}
                         onChange={(e) => {
                           RealName.userRealName = e.target.value;
                           this.setState({
                             RealName: RealName
                           });
                         }}/>
                </div>
                <div className="form-group">
                  <label>公司名称<span className="span_imp">*</span></label>
                  <div className="antdSlect" id="user_certification_company">
                    <Select
                      size={"large"}
                      showSearch={true}
                      style={{ width: '100%', display: this.state.RealName['selected']['enter'] ? 'none' : null }}
                      placeholder="填写公司名称"
                      defaultValue={[]}
                      onChange={this.handleChange}
                      dropdownClassName=""
                      allowClear={true}
                      value={RealName.companyname}
                    >
                      {children}
                    </Select>
                    <input type="text" className="form-control"
                      style={{ display: this.state.RealName['selected']['enter'] ? null : 'none' }}
                      value={RealName.companyname}
                      placeholder="填写公司名称" onChange={(e) => {
                        RealName.companyname = e.target.value;
                        this.setState({
                          RealName: RealName
                        });
                      }} />
                    <div
                      className={`checkimg  yc_checked_img1 dis_input ${this.state.RealName['selected']['enter'] ? "checkedimg" : null}`}
                      onClick={() => {
                        this.multiSelect('enter');
                      }} />
                    <div className="checktxt linght40">手动输入</div>
                  </div>
                </div>
                <div className="certification-checking"
                  style={{ display: this.state.RealName['selected']['enter'] ? null : 'none' }}>
                  <label>公司性质（可多选）<span className="span_imp">*</span></label>
                  <div className="check">
                    <ul>
                      <li>
                        <div className={`check-img ${this.state.RealName['selected']['1'] ? 'checkedimg' : null}`}
                          onClick={() => {
                            this.multiSelect('1');
                          }}>
                        </div>
                        <div className="checktxt">出品公司</div>
                      </li>
                      <li>
                        <div className={`check-img ${this.state.RealName['selected']['2'] ? 'checkedimg' : null}`}
                          onClick={() => {
                            this.multiSelect('2');
                          }}>
                        </div>
                        <div className="checktxt">发行公司</div>
                      </li>
                      <li>
                        <div className={`check-img ${this.state.RealName['selected']['3'] ? 'checkedimg' : null}`}
                          onClick={() => {
                            this.multiSelect('3');
                          }}>
                        </div>
                        <div className="checktxt">代理公司</div>
                      </li>
                      <li>
                        <div className={`check-img ${this.state.RealName['selected']['4'] ? 'checkedimg' : null}`}
                          onClick={() => {
                            this.multiSelect('4');
                          }}>
                        </div>
                        <div className="checktxt">出版社</div>
                      </li>
                      <li>
                        <div className={`check-img ${this.state.RealName['selected']['5'] ? 'checkedimg' : null}`}
                          onClick={() => {
                            this.multiSelect('5');
                          }}>
                        </div>
                        <div className="checktxt">投资公司</div>
                      </li>
                      <li>
                        <div className={`check-img ${this.state.RealName['selected']['6'] ? 'checkedimg' : null}`}
                          onClick={() => {
                            this.multiSelect('6');
                          }}>
                        </div>
                        <div className="checktxt">宣发公司</div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="form-group">
                  <label>担任职务<span className="span_imp">*</span></label>
                  <input type="text" className="form-control " placeholder="填写您所担任的职务" value={RealName.positions}
                    onChange={(e) => {
                      RealName.positions = e.target.value;
                      this.setState({
                        RealName: RealName
                      });
                    }} />
                </div>

                <div className="form-group">
                  <label>个人简介</label>
                  <textarea className="form-control textarea" value={RealName.dsc} onChange={(e) => {
                    RealName['dsc'] = e.target.value;
                    this.setState({
                      RealName: RealName
                    });
                  }}>
                  </textarea>
                </div>
                <div className="form-group">
                  <div className="user_btn_primary">
                    <button className="btn btn-primary" onClick={() => {
                      this.saveUserInformation({});
                    }}>保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={nextNum === 3 ? "row-right-admin" : "row-display"}>
              <div className="top-right">
                {/* <ul className="top-ul">
                  <li className={this.state.btnNum === 1 ? "bordr" : "bordr-display"}
                      onClick={() => this.setMenuNum(1)}><a>个人信息</a></li>
                  <li className={this.state.btnNum === 2 ? "bordr-two" : "bordr-display"}
                      onClick={() => this.setMenuNum(2)}><a>账号安全</a></li>
                </ul> */}

                <ul className="top-ul">
                  <li className={nextNum === 2 ? "bordr" : "bordr-display"}
                      onClick={() => this.nextMenuNum(2, null)}><a>个人信息</a></li>
                  <li className={nextNum === 3 ? "bordr-two" : "bordr-display"}
                      onClick={() => this.nextMenuNum(3, 30)}><a>账号安全</a></li>
                </ul>
              </div>
              <div className="box-style">

                {userinfo.email ? (
                  <div className="email-val">
                    <div className="first-style">
                      邮箱账号
                    </div>
                    <div className="last-style">
                      已验证邮箱 <span> {userinfo.email}</span>
                    </div>
                    <div className="user-btn">
                      <button className="btn btn-primary" onClick={() => this.setchildNum(3)}>更改</button>
                    </div>
                  </div>
                ) : (
                    <div className="email-val">
                      <div className="first-style">
                        邮箱账号
                    </div>
                      <div className="last-style">
                        未绑定邮箱
                    </div>
                      <div className="user-btn">
                        <button className="btn btn-primary" onClick={() => this.setchildNum(3)}>绑定</button>
                      </div>
                    </div>
                  )}

                {userinfo.mobile ? (
                  <div className="phone-num">
                    <div className="first-style">
                      手机账号
                    </div>
                    <div className="last-style">
                      已绑定的手机号 <span> {userinfo.mobile}</span>
                    </div>
                    <div className="user-btn">
                      <button className="btn btn-primary" onClick={() => this.setchildNum(2)}>更改</button>
                    </div>
                  </div>
                ) : (
                    <div className="phone-num">
                      <div className="first-style">
                        手机账号
                    </div>
                      <div className="last-style">
                        未绑定手机号
                    </div>
                      <div className="user-btn">
                        <button className="btn btn-primary" onClick={() => this.setchildNum(2)}>绑定</button>
                      </div>
                    </div>
                  )}
                <div className="email-val mt58">
                  <div className="first-style">
                    登录密码
                  </div>
                  <div className="last-style">
                    密码要求至少8位
                  </div>
                  <div className="user-btn">
                    <button className="btn btn-primary" onClick={() => this.setchildNum(1)}>更改</button>
                  </div>
                </div>
                <div className="phone-num mt58">
                  <div className="first-style">
                    实名认证
                  </div>
                  <div className="last-style">
                    完成实名认证，享受更多会员福利
                  </div>
                  <div className="user-btn">
                    <button className="btn btn-primary" onClick={() => this.setchildNum(4)}>去认证</button>
                  </div>
                </div>
                {/* <div className="pass-num"> */}
              </div>
            </div>
            <div className={this.state.nextNum === 30 ? "row-right-admin" : "row-display"}>
              <div className="top-right">
                {/* <ul className="top-ul">
                  <li className={this.state.btnNum === 1 ? "bordr" : "bordr-display"}
                      onClick={() => this.setMenuNum(1)}><a>个人信息</a></li>
                  <li className={this.state.btnNum === 2 ? "bordr-two" : "bordr-display"}
                      onClick={() => this.setMenuNum(2)}><a>账号安全</a></li>
                </ul> */}
                <ul className="top-ul">
                  <li className={nextNum === 2 ? "bordr" : "bordr-display"}
                      onClick={() => this.nextMenuNum(2, null)}><a>个人信息</a></li>
                  <li className={nextNum === 30 ? "bordr-two" : "bordr-display"}
                      onClick={() => this.nextMenuNum(3, 30)}><a>账号安全</a></li>
                </ul>
              </div>
              <div className="box-style">
                <div className={this.state.childNum === 1 ? "password-detail" : "row-display"}>
                  <div className="col-sm-8 box_center_style" id="moidify_password">
                    <p className="text-left margin-top46">修改密码</p>
                    <div className="form-group yc_relative">
                      <i className={iconShow ? "icon iconfont  icon-ic_block" : "icon iconfont  icon-ic_hidden"}
                         onClick={() => {
                           this.setState({ iconShow: !iconShow });
                         }}></i>
                      <input type={iconShow ? 'text' : 'password'} className="form-control " id="password"
                             placeholder="输入原先密码"
                             value={this.state.UpdataPassword.oldUserPass}
                             onBlur={(e) => {
                               this.invalidatapass(e);
                             }}
                             onChange={(e) => {
                               UpdataPassword.oldUserPass = e.target.value;
                               this.setState({
                                 UpdataPassword: UpdataPassword
                               });
                             }}/>
                    </div>
                    <div className="form-group yc_relative">
                      <i className={iconShowNext ? "icon iconfont  icon-ic_block" : "icon iconfont  icon-ic_hidden"}
                         onClick={() => {
                           this.setState({ iconShowNext: !iconShowNext });
                         }}></i>
                      <input type={iconShowNext ? 'text' : 'password'} className="form-control " id="pwd_first"
                             placeholder="输入至少8位的新密码"
                             value={this.state.UpdataPassword.userPass}
                             onBlur={(e) => {
                               this.invalidatapass(e);
                             }}
                             onChange={(e) => {
                               UpdataPassword.userPass = e.target.value;
                               this.setState({
                                 UpdataPassword: UpdataPassword
                               });
                             }}/>
                    </div>
                    <div className="form-group">
                      <input type="password" className="form-control " id="pwd_second" placeholder="重复一次新密码"
                             value={this.state.UpdataPassword.userPassAgain}
                             onBlur={(e) => {
                               this.invalidatapass(e);
                             }}
                             onChange={(e) => {
                               UpdataPassword.userPassAgain = e.target.value;
                               this.setState({
                                 UpdataPassword: UpdataPassword
                               });
                             }}/>
                    </div>
                    <div className="form-group margin-top56">
                      <div className="user_btn_primary inline_block_btn">
                        <button className="btn btn-primary" onClick={() => {
                          this.UpdataPassword();
                        }}>确定
                        </button>
                      </div>
                      <div className="user_btn_primary inline_block_btn left">
                        <button className="btn btn-default" onClick={() => {
                          this.nextMenuNum(3, null);
                        }}>返回
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={this.state.childNum === 2 ? "phone-detail" : "row-display"}>
                  <div className="col-sm-8 box_center_style" id="moidify_phone">
                    {userinfo.email ? (
                      <p className="text-left margin-top46">修改手机号码</p>
                    ) : (
                      <p className="text-left margin-top46">绑定手机号码</p>
                    )}
                    {userinfo.email ? (
                      <div className="form-group">
                        <input type="text" className="form-control disabled old_phone" disabled placeholder=""
                               value={userinfo.mobile}
                        />
                      </div>
                    ) : ('')}
                    <div className="form-group">
                      <input type="text" className="form-control input-hid" placeholder="新手机号"
                             value={this.state.phoneNuber}
                             onChange={(e) => {
                               this.setState({ phoneNuber: e.target.value });
                             }}/>
                    </div>
                    <div className="form-group">
                      {this.state.Verification.type == 'editPhone' ? (
                        <div className="input-group-addon disabled" id="btn_phone_code">
                          {this.state.Verification.number}s后重新发送
                        </div>) : (
                        <div className="input-group-addon" id="btn_phone_code" onClick={() => {
                          this.EditCode({ type: 'editPhone' });
                        }}>
                          获取验证码
                        </div>)}

                      <input type="text" className="form-control input-hid right_box"
                             value={this.state.phoneCode}
                             onChange={(e) => {
                               this.setState({ phoneCode: e.target.value });
                             }}
                             placeholder="填写手机收到的6位验证码"/>
                    </div>
                    <div className="form-group margin-top56">
                      <div className="user_btn_primary inline_block_btn">
                        <button className="btn btn-primary" onClick={() => {
                          this.editPhoneNumber({ type: 'editPhone' });
                        }}>确定
                        </button>
                      </div>
                      <div className="user_btn_primary inline_block_btn left">
                        <button className="btn btn-default " onClick={() => {
                          this.nextMenuNum(3, null);
                        }}>返回
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={this.state.childNum === 3 ? "email-detail" : "row-display"}>
                  <div className="col-sm-8 box_center_style" id="moidify_phone">
                    {userinfo.email ? (
                      <p className="text-left margin-top46">修改邮箱账号</p>
                    ) : (
                      <p className="text-left margin-top46">绑定邮箱账号</p>
                    )}
                    {userinfo.email ? (
                      <div className="form-group">
                        <input type="text" className="form-control disabled old_phone" disabled placeholder=""
                               value={userinfo.email}
                        />
                      </div>
                    ) : ('')}
                    <div className="form-group">
                      <input type="text" className="form-control input-hid" placeholder="新邮箱账号"
                             value={this.state.emailNumber}
                             onChange={(e) => {
                               this.setState({ emailNumber: e.target.value });
                             }}/>
                    </div>
                    <div className="form-group">

                      {this.state.Verification.type == 'editEmail' ? (
                        <div className="input-group-addon disabled" id="btn_phone_code">
                          {this.state.Verification.number}s后重新发送
                        </div>) : (
                        <div className="input-group-addon" id="btn_phone_code" onClick={() => {
                          this.EditCode({ type: 'editEmail' });
                        }}>
                          获取验证码
                        </div>
                      )}

                      <input type="text" className="form-control input-hid right_box"
                             value={this.state.emailCode}
                             onChange={(e) => {
                               this.setState({ emailCode: e.target.value });
                             }}
                             placeholder="填写邮箱收到的6位验证码"/>
                    </div>
                    <div className="form-group margin-top56">
                      <div className="user_btn_primary inline_block_btn">
                        <button className="btn btn-primary" onClick={() => {
                          this.editPhoneNumber({ type: 'editEmail' });
                        }}>确定
                        </button>
                      </div>
                      <div className="user_btn_primary inline_block_btn left">
                        <button className="btn btn-default " onClick={() => {
                          this.nextMenuNum(3, null);
                        }}>返回
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={this.state.childNum === 4 ? "realname-detail" : "row-display"}>
                  <div className="col-sm-8 " id="certification">
                    {/* <div className="form-group">
                      <label>联系邮箱</label>
                      <input type="text" className="form-control"   placeholder="填写您的联系邮箱" onChange={(e) => { this.state.RealName['email'] = e.target.value }}  />
                    </div>
                    <div className="form-group">
                    <div className="input-group-addon" id="user_certification_emailbtn_get_code" onClick={()=>{this.EditCode({type:'editinformation'})}}>
                            获取验证码
                    </div>
                      <input type="text" className="form-control right_box" id="user_certification_email_code" onChange={(e) => { this.state.RealName['code'] = e.target.value }}
                        placeholder="填写邮件收到的6位验证码" />
                    </div> */}
                    <div className="form-group">
                      <label>真实姓名<span className="span_imp">*</span></label>
                      <input type="text" className="form-control " id="user_certification_name" placeholder="填写您的姓名"
                             value={this.state.RealName.realname}
                             onChange={(e) => {
                               RealName.realname = e.target.value;
                               this.setState({
                                 RealName: RealName
                               });
                             }}/>
                    </div>
                    <div className="form-group">
                      <label>名片上传</label>
                      <div className="upload">
                        <form key="formonly">
                          <div className="load" id="upload">
                            <div className="card_img" style={{ display: this.state.RealName.file ? 'block' : 'none' }}>
                              <img className="fpimgs" src={this.state.RealName.file}></img></div>
                            <input type="text" defaultValue="pc" name="device_type" style={{ display: 'none' }}/>
                            <input type="text" defaultValue="300,300" name="thumbwh" style={{ display: 'none' }}/>
                            <input type="text" defaultValue="" name="token" style={{ display: 'none' }}/>
                            <input type="text" defaultValue="company_card" name="upload_type"
                                   style={{ display: 'none' }}/>
                            <input type="text" defaultValue="1" name="nothumb" style={{ display: 'none' }}/>
                            <input type="file" className="btn_file" name="image_file"
                                   style={{ width: "100%", height: "100%", opacity: 0 }} onChange={async (e) => {
                              await this.uploadImg(e, 'picGuid', 4, 'file');
                            }}/>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>证件照上传</label>
                      <div className="upload">
                        <form key="formonly">
                          <div className="load" id="upload">
                            {/* <div className="card_img"><img className="fpimgs" src=""> </img></div> */}
                            <div className="card_img"
                              style={{ display: this.state.RealName.cardFile ? 'block' : 'none' }}><img
                                className="fpimgs" src={this.state.RealName.cardFile}></img></div>
                            <input type="text" defaultValue="pc" name="device_type" style={{ display: 'none' }} />
                            <input type="text" defaultValue="300,300" name="thumbwh" style={{ display: 'none' }} />
                            <input type="text" defaultValue="" name="token" style={{ display: 'none' }} />
                            <input type="text" defaultValue="company_card" name="upload_type"
                              style={{ display: 'none' }} />
                            <input type="text" defaultValue="1" name="nothumb" style={{ display: 'none' }} />
                            <input type="file" id="btn_file" name="image_file" accept=".jpg,.jpeg,.png"
                              style={{ width: "100%", height: "100%", opacity: 0 }}
                              onChange={async (e) => {
                                await this.uploadImg(e, 'papersPicGuid', 5, 'cardFile');
                              }} />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="user_btn_primary ">
                        <button className="btn btn-primary" onClick={() => {
                          this.editinformation({});
                        }}>确定
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* {this.state.show && <Alert message={this.state.message}
                                   onClose={() => {
                                     this.setState({ show: false });
                                   }}
                                   onSubmit={() => {
                                     // console.log(this);
                                     // this.props.history.push('/login');
                                   }}
        />
        } */}
        <Footer data={footerNav} />
      </div>
    );
  }
}
