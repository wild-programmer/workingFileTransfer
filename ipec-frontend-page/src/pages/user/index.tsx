import * as React from "react";
import Header from "@components/header";
import Footer from "@components/footer";
import "@assets/scss/user.scss";
import { inject, observer } from "mobx-react";
import 'antd/dist/antd.css';
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import moment from 'moment';
import { listCountry, savePic, setUserInformation } from '@utils/api';
import Alert from '@components/alert';
import { Link } from 'react-router-dom';
import { toJS } from 'mobx';
import { Select } from 'antd';
import ic_user from '@assets/images/user.svg';
import ic_attestation from '@assets/images/user/ic_attestation.svg';
import ic_attestation_pr from '@assets/images/user/ic_attestation_pr.svg';

const { Option } = Select;
const children = [];

const companyTypeKV = {
  7: "版权方",
  3: "代理方",
  8: "品牌方",
  9: "授权方",
  10: "零售商",
  11: "服务商",
};

/**
 * realStatus 实名认证状态  1已实名，2未实名、3审核中 ,
 */

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
    cardFanFile: string,
    userPicUrl: string,
    userFile: string,
  };
  iconShow: boolean;
  iconShowNext: boolean;
  show: boolean;
  alertShow: boolean;
  message: string;
  alertMessage: string;
  checkStatus: string;
  papersPicGuid: string;
  papersPositivePicGuid: string;
  pickGuid: string;
  picGuid: string;
  companyGuid: string;
  realStatus: number;
  companyData: {
    ipPicGuid: string;
    companyName: string;
    companyType: any[];
    companySelected: any[];
    companyCountries: string;
    businessLicenseGuid: string;
    companyTelephone: string;
    companyMailbox: string;
    companyAddress: string;
    companyDesc: string;
    logoPic: string;
    businessLicense: string;
  }

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
      nextNum: 1, // 1.我的发布 2.个人信息 3.账号安全，4.企业信息
      phoneNuber: '', // 修改的手机号
      phoneCode: '', // 修改的手机号验证码
      emailNumber: '',
      emailCode: '', // 修改的邮箱验证码
      userinfo: JSON.parse(sessionStorage.getItem("user")), // 从sessionStorage 后被userinfo接口的返回值替换
      message: "",
      show: false,
      alertMessage: "",
      alertShow: false,
      UpdataPassword: { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' }, // 更新密码
      RealName: {
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
        cardFanFile: '',
        userPicUrl: '',
        userFile: ''
      },
      companyGuid: '',
      papersPicGuid: '',
      papersPositivePicGuid: '',
      picGuid: '',
      pickGuid: '',
      checkStatus: '',
      realStatus: 0,
      companyData: {  // 公司认证字段
        ipPicGuid: '',
        companyName: '',
        companyType: [],
        companySelected: [
          { name: "版权方", id: 7, },
          { name: "代理方", id: 3, },
          { name: "品牌方", id: 8, },
          { name: "授权方", id: 9, },
          { name: "零售商", id: 10, },
          { name: "服务商", id: 11, },
        ],
        companyCountries: '',
        businessLicenseGuid: '',
        companyTelephone: '',
        companyMailbox: '',
        companyAddress: '',
        companyDesc: '',
        logoPic: '',
        businessLicense: '',
      },
    }
    ;
  }

  async componentDidMount() {
    document.title = "版圈儿";
    const { nav_store, match: { params } } = this.props;
    let type = Number(params['type']);
    await nav_store.navList();
    if (type === 1) {
      await this.getMyRelease('');
    } else if (type === 2) {
      await this.getPersonInfo();
    } else if (type === 4) {
      await this.getCompanyInfo();
    }
    await this.getPersonInfo();
    await User.listCountry();
  }

  static async listCountry() {
    const { errorCode, result }: any = await listCountry();
    if (errorCode === "200") {
      for (let item of result) {
        children.push(<Option value={item.resourceValue}
                              key={item.id + item.resourceValue}>{item.resourceValue}</Option>);
      }
    }
  }

  /**
   * 回显个人信息
   */
  async getPersonInfo() {
    const { user } = this.props;
    const { userinfo: { userGuid } } = this.state;
    await user.getUserInfo(userGuid);
    const { RealName } = this.state;
    let personInfo = toJS(user.personInfo);
    RealName.userRealName = personInfo.userRealName;
    RealName.file = personInfo.cardPic;
    RealName.cardFile = personInfo.papersPositivePic;
    RealName.cardFanFile = personInfo.papersPic;
    let papersPicGuid = personInfo.papersPicGuid;
    let papersPositivePicGuid = personInfo.papersPositivePicGuid;
    let picGuid = personInfo.picGuid;
    this.setState({
      RealName,
      papersPicGuid,
      papersPositivePicGuid,
      picGuid
    });
  }

  /**
   * 回显公司信息
   */
  async getCompanyInfo() {
    const { user } = this.props;
    const { userinfo: { userGuid } } = this.state;
    await user.getCompanyInfo(userGuid);
    let companyInfo = toJS(user.companyInfo);
    if (!_isEmpty(companyInfo)) {
      this.setState({
        companyData: {
          ipPicGuid: companyInfo.ipPicGuid,
          companyName: companyInfo.companyName,
          companyType: companyInfo.companyType.split(','),
          companySelected: [
            { name: "版权方", id: 7, },
            { name: "代理方", id: 3, },
            { name: "品牌方", id: 8, },
            { name: "授权方", id: 9, },
            { name: "零售商", id: 10, },
            { name: "服务商", id: 11, },
          ],
          companyCountries: companyInfo.companyCountries,
          businessLicenseGuid: companyInfo.businessLicenseGuid,
          companyTelephone: companyInfo.companyTelephone,
          companyMailbox: companyInfo.companyMailbox,
          companyAddress: companyInfo.companyAddress,
          companyDesc: companyInfo.companyDesc,
          logoPic: companyInfo.logoPic,
          businessLicense: companyInfo.businessLicense,
        },
      });
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
   * @param picType 1首页幻灯片，2ip海报图，3个人头像/企业logo，4名片，5证件照，6ppt页面，7 营业执照
   * @param el
   */
  async uploadImg(e, field, picType, el) {
    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 10;
    let reader = new FileReader(),
      _RealName = this.state.RealName;
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, picType };
      if (file.size > max_size) {
        this.setState({ alertMessage: '图片过大,请重新上传！', alertShow: true });
        return;
      } else {
        const { errorCode, result = {} }: any = await savePic(params);
        if (errorCode === '200' && result.errorCode === 200) {
          if (picType === 7 || field === "ipPicGuid") {
            let companyData = this.state.companyData;
            companyData[el] = e.target['result'];
            companyData[field] = result.data;
            this.setState({
              companyData,
            });
            console.log(this.state.companyData);
          } else {
            _RealName[el] = e.target['result'];
            _RealName[field] = result.data;
            this.setState({
              RealName: _RealName
            });
            // 修改个人信息-头像
            if (field === "userPicUrl") {
              const { userinfo: { userGuid } } = this.state;
              const params = {
                userGuid,
                picGuid: _RealName.userPicUrl,
              };
              const { errorCode, result }: any = await setUserInformation(params);
              if (errorCode === "200" && result.errorCode === 200) {
                _RealName.userPicUrl = result.data;
                this.setState({
                  RealName: _RealName
                });
              } else {
                this.setState({
                  alertMessage: result.data.errorMsg,
                  alertShow: true,
                });
              }
            }
          }
          // 动态设置setState 的值
          const data = {};
          data[field] = result.data;
          this.setState(data);
          return true;
        }
      }

    };
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
    if (type === 'editPhone') {
      validation = _this.state.phoneNuber;
    } else if (type === 'editEmail') {
      validation = _this.state.emailNumber;
    }
    switch (type) {
      case 'editPhone':
        param.receiverType = 1;
        param.sendType = 4;
        break;
      case 'editEmail':
        param.receiverType = 2;
        param.sendType = 4;
        break;
      case 'editinformation':
        param.receiverType = 2;
        param.sendType = 3;
        break;
      default:
    }
    if (this.reglPhoneEamil(type, validation)) return false;
    let isSuccess = await this.state.user.getEditCode({
      userLogin: param.userLogin,
      receiverType: param.receiverType,
      sendType: param.sendType
    });
    // 如果成功 开始倒计时
    if (isSuccess.request) {
      let _Verification = {
        type,
        number: 30,
      };
      this.setState({
        Verification: _Verification
      });
      let interval = setInterval(() => {
        if (this.state.Verification.number === 0) {
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

  /**
   * 公司认证
   */
  async companyCertification() {
    const { user } = this.props;
    const { companyData, userinfo } = this.state;
    let param = {
      companyName: companyData.companyName,
      companyDesc: companyData.companyDesc,
      userGuid: userinfo.userGuid,
      companyType: companyData.companyType.join(','),
      ipPicGuid: companyData.ipPicGuid,
      companyCountries: companyData.companyCountries,
      businessLicenseGuid: companyData.businessLicenseGuid,
      companyTelephone: companyData.companyTelephone,
      companyMailbox: companyData.companyMailbox,
      companyAddress: companyData.companyAddress,
    };
    // 检测param 是否符合提交条件
    for (let key in param) {
      if (param[key] === "") {
        switch (key) {
          case 'ipPicGuid':
            this.setState({ alertMessage: '请上传企业LOGO', alertShow: true });
            return false;
          case 'companyName':
            this.setState({ alertMessage: '请填写公司名称', alertShow: true });
            return;
          case 'companyType':
            this.setState({ alertMessage: '请至少选择一个公司性质', alertShow: true });
            return false;
          case 'companyCountries':
            this.setState({ alertMessage: '请选择公司国别', alertShow: true });
            return false;
          case 'businessLicenseGuid':
            this.setState({ alertMessage: '请上传公司的营业执照', alertShow: true });
            return false;
          case 'companyTelephone':
            this.setState({ alertMessage: '请填写公司的联系电话', alertShow: true });
            return false;
          case 'companyMailbox':
            this.setState({ alertMessage: '请填写公司的联系邮箱', alertShow: true });
            return false;
          case 'companyAddress':
            this.setState({ alertMessage: '请填写公司地址', alertShow: true });
            return false;
          case 'companyDesc':
            this.setState({ alertMessage: '请填写公司简介', alertShow: true });
            return false;
        }
        this.setState({ alertMessage: '请填写完整表单信息', alertShow: true });
        return false;
      }

    }
    let isSuccess = await user.companyCerfiticate(param);

    this.setState({ alertMessage: isSuccess.message, alertShow: true });
  }

  /**
   * 清空公司认证的数据
   */
  async clearCompanyCertification() {
    const { companyData } = this.state;
    companyData.ipPicGuid = "";
    companyData.companyName = "";
    companyData.companyType = [];
    companyData.companyCountries = "";
    companyData.businessLicenseGuid = "";
    companyData.companyTelephone = "";
    companyData.companyMailbox = "";
    companyData.companyAddress = "";
    companyData.companyDesc = "";
    companyData.logoPic = "";
    companyData.businessLicense = "";
    this.setState({
      companyData
    });
  }

  /**
   * 清空实名认证的数据
   */
  async clearCerfitication() {
    const { RealName } = this.state;
    RealName.userRealName = '';
    this.setState({
      papersPicGuid: '',
      papersPositivePicGuid: '',
      picGuid: '',
      RealName,
    });
  }

  /**
   *  个人实名认证 确认发送
   */

  async certification() {
    let param = {
      papersPicGuid: this.state.papersPicGuid,
      papersPositivePicGuid: this.state.papersPositivePicGuid,
      picGuid: this.state.picGuid,
      userGuid: this.state.userinfo.userGuid,
      userRealName: this.state.RealName['userRealName']
    };
    if (param.userRealName === '') {
      this.setState({ message: '请输入真实姓名', show: true });
      return false;
    }
    if (param.papersPicGuid === '') {
      this.setState({ message: '请上传身份证反面', show: true });
      return false;
    }
    if (param.papersPositivePicGuid === '') {
      this.setState({ message: '请上传身份证正面', show: true });
      return false;
    }
    if (param.userGuid === '') {
      this.setState({ message: '请上传名片', show: true });
      return false;
    }
    let isSuccess = await this.state.user.RealAuthentication(param);
    this.setState({ message: isSuccess.result, show: true });
    if (isSuccess.request) {
      let Reaname_ = this.state.RealName;
      Reaname_.realname = '';
      this.setState({ nextNum: 3, RealName: Reaname_ });
    }
  }

  // 修改手机号邮箱 确认发送
  async editPhoneNumber({ type }) {
    let receiverType = 0,
      code = null,
      number = null;
    if (type === 'editPhone') {
      receiverType = 1;
      number = this.state.phoneNuber;
      code = this.state.phoneCode;
    } else if (type === 'editEmail') {
      receiverType = 2;
      number = this.state.emailNumber;
      code = this.state.emailCode;
    }
    if (this.reglPhoneEamil(type, number)) return false;
    if (code.length !== 6 || code === '') {
      this.setState({ message: "请输入正确的验证码", show: true });
      return false;
    }
    let isSuccess = await this.state.user.userInformation({
      email: this.state.emailNumber,
      code,
      mobile: this.state.phoneNuber,
      receiverType,
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
    if (_updataPassword['userPass'] === '' || _updataPassword['userPassAgain'] === '') {
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

  // 验证密码长度
  invalidatapass = (e: any) => {
    if (e.target.value.length < 8) this.setState({ message: '密码长度不能少于8', show: true });
  };
  // 手机号邮箱号验证
  reglPhoneEamil = (type: string, value: any) => {
    if (type === 'editPhone') {
      if (value === '') {
        this.setState({ message: "请填写手机号", show: true });
        return true;
      }
      if (!(/^1[34578]\d{9}$/.test(value))) {
        this.setState({ message: "请输入正确手机号", show: true });
        return true;
      }
    } else if (type === 'editEmail') {
      if (value === '') {
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

  // 切换左侧菜单
  nextMenuNum = (num: number, nextNum: any) => {
    if (nextNum === 30 && num === 3 && this.state.nextNum === 30) return false;

    let _RealName = this.state.RealName;
    _RealName.cardFile = '';
    _RealName.file = '';
    _RealName.realname = '';
    let _state = {
      RealName: _RealName,
      iconShow: false,
      iconShowNext: false,
      Verification: {
        type: '',
        number: 0,
      },
      user: this.props.user,
      btnNum: this.state.btnNum, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      childNum: this.state.childNum, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      nextNum: num, // 1.我的发布 2.个人信息 3.账号安全,4.企业信息
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
    if (num === 3) {
      this.setState(_state);
      this.props.history.push("/user/3");
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
    });
    this.props.history.push("/user/30");
  };

  /**
   * 获取公司认证字段value
   */
  async getInputValue(inputName, e) {
    const { companyData } = this.state;
    companyData[inputName] = e.target.value;
    this.setState({
      companyData
    });
  }

  render() {
    const { nav_store, user, update, match: { params } } = this.props;
    let { headerNav, footerNav } = nav_store;
    const { myUpdateList, myReleaseList, personInfo, companyInfo } = user;
    const { checkStatus, RealName, UpdataPassword, iconShowNext, iconShow, userinfo, companyData } = this.state;
    const { userGuid } = userinfo;
    let type = Number(params['type']);
    const realStatus = personInfo.realStatus;
    return (
      <div className="bg-color">
        <Header data={headerNav} history={this.props.history}/>
        <div className="my-release">
          <div className="row">
            <div className="row-left">
              <div className="user-head">
                <div className="img-circle">
                  <input type="file" alt="" onChange={async (e) => {
                    await this.uploadImg(e, 'userPicUrl', 3, "userFile");
                  }}/>
                  <img className="head-img" src={RealName.userPicUrl || userinfo.picUrl || ic_user} alt=""/>
                  {
                    userinfo.realStatus === 3 || userinfo.realStatus === 2 ?
                      <span>
                        {userinfo.userLogin}
                        <img src={ic_attestation} alt=""/>
                      </span>
                      :
                      < span>
                        {personInfo.userRealName}
                        < img src={ic_attestation_pr} alt=""/>
                      </span>
                  }
                </div>
              </div>
              < ul className="list-bottom">
                < li className="active" onClick={() => this.nextMenuNum(1, null)}>
                  <div className={type === 1 ? "left-border" : "left-display"}/>
                  <Link to="/user/1">我的发布</Link>
                </li>
                <li onClick={async () => {
                  this.nextMenuNum(2, null);
                  await this.getPersonInfo();
                }}>
                  <div className={type === 2 ? "left-border-two" : "left-display"}/>
                  <Link to="/user/2">个人认证</Link>
                </li>
                <li onClick={async () => {
                  this.nextMenuNum(4, null);
                  await this.getCompanyInfo();
                }}>
                  <div className={type === 4 ? "left-border-two" : "left-display"}/>
                  < Link to="/user/4">企业主页</Link>
                </li>
                <li onClick={() => this.nextMenuNum(3, null)}>
                  <div className={type === 3 || type === 30 ? "left-border-three" : "left-display"}/>
                  <Link to="/user/3">账号安全</Link>
                </li>
              </ul>
            </div>
            < div className={type === 1 ? "row-right-my" : "row-display"}>
              <div className="top-right">
                <ul className="top-ul">
                  <li className={this.state.btnNum === 1 ? "borders" : "border-display"}
                      onClick={async () => await this.setMenuNum(1)}><a>我发布的IP</a></li>
                  <li className={this.state.btnNum === 2 ? "borders-two" : "border-display"}
                      onClick={async () => await this.setMenuNum(2)}><a>我上传的资料</a></li>
                  <li className={this.state.btnNum === 3 ? "borders-three" : "border-display"}
                      onClick={async () => await this.setMenuNum(3)}><a>我更新的信息</a></li>
                  <li className={this.state.btnNum === 4 ? "borders-four" : "border-display"}
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
                                             await update.deleteMaterial(params);
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
            {realStatus !== 2 ? <div className={type === 2 ? "row-right-info" : "row-display"}>
                <div className="right-head realname-detail">
                  <div className="form-group form-detail">
                    <label>真实姓名:</label>
                    {personInfo.userRealName}
                  </div>
                  <div className="form-group form-detail">
                    <label>名片上传:</label>
                    <div className="img-gray">
                      <img src={personInfo.cardPic} alt=""/>
                    </div>
                  </div>
                  <div className="form-group form-detail">
                    <label>身份证正反面：</label>
                    <div className="img-gray">
                      <img src={personInfo.papersPositivePic} alt=""/>
                    </div>
                    <div className="img-gray">
                      <img src={personInfo.papersPic} alt=""/>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className={type === 2 ? "row-right-info" : "row-display"}>
                <div className="right-head realname-detail">
                  <div className="form-group">
                    <label>真实姓名<i className="span_imp">*</i></label>
                    <input type="text" autoComplete="off" className="form-control " name="name" placeholder="填写您的姓名"
                           value={RealName.userRealName}
                           onChange={(e) => {
                             RealName.userRealName = e.target.value;
                             this.setState({
                               RealName
                             });
                           }}/>
                  </div>
                  <div className="form-group">
                    <label>名片上传<span>(请上传的名片清晰可见，不超过10m，格式为：bmp,jpg,png)</span></label>
                    <div className="upload">
                      <div className="load">
                        <img src={RealName.file} alt=""/>
                        {this.state.RealName.file === "" ? <span>点击上传</span> : ""}
                        <input type="file" className="btn_file" name="image_file"
                               style={{ width: "100%", height: "100%", opacity: 0 }} onChange={async (e) => {
                          await this.uploadImg(e, 'picGuid', 4, 'file');
                        }}/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>身份证上传<i
                      className="span_imp">*</i><span>(请上传身份证的正反面，图片清晰可见，每张图片不超过10m，格式为：bmp,jpg,png)</span></label>
                    <div className="upload">
                      <div className="load">
                        <img src={this.state.RealName.cardFile} alt=""/>
                        {this.state.RealName.cardFile === "" ? <span>点击上传</span> : ""}
                        <input type="file" className="btn_file" name="image_file" accept=".jpg,.jpeg,.png"
                               style={{ width: "100%", height: "100%", opacity: 0 }}
                               onChange={async (e) => {
                                 await this.uploadImg(e, 'papersPositivePicGuid', 5, 'cardFile');
                               }}/>
                        <p>身份证正面</p>
                      </div>
                      <div className="load">
                        <img src={this.state.RealName.cardFanFile} alt=""/>
                        {this.state.RealName.cardFanFile === "" ? <span>点击上传</span> : ""}
                        <input type="file" className="btn_file" name="image_file" accept=".jpg,.jpeg,.png"
                               style={{ width: "100%", height: "100%", opacity: 0 }}
                               onChange={async (e) => {
                                 await this.uploadImg(e, 'papersPicGuid', 5, 'cardFanFile');
                               }}/>
                        <p>身份证反面</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="user_btn_primary ">
                    <button className="btn btn-primary" onClick={async () => {
                      await this.certification();
                      await user.getUserInfo({ userGuid });
                    }}>提交审核
                    </button>
                    <button className="btn btn-default" onClick={async () => {
                      await this.clearCerfitication();
                    }}>重置
                    </button>
                  </div>
                </div>
              </div>
            }
            {
              companyInfo.realStatus !== 3 &&
              <div className={type === 4 ? "row-right-info" : "row-display"}>
                <div className="right-head realname-detail">
                  <div className="form-group">
                    <label>上传企业LOGO <i className="span_imp">*</i>
                      <span>(请上传的logo清晰可见，不超过10m，格式为：bmp,jpg,png)</span>
                    </label>
                    <div className="upload">
                      <div className="load">
                        <img src={companyData.logoPic} alt=""/>
                        {companyData.logoPic === "" ? <span>点击上传</span> : ""}
                        <input type="file" className="btn_file"
                               style={{ width: "100%", height: "100%", opacity: 0 }}
                               onChange={async (e) => {
                                 await this.uploadImg(e, 'ipPicGuid', 3, 'logoPic');
                               }}/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>公司名称<i className="span_imp">*</i></label>
                    <input type="text" autoComplete="off" className="form-control"
                           value={companyData.companyName}
                           placeholder="填写公司名称"
                           onChange={async (e) => {
                             await this.getInputValue("companyName", e);
                           }}/>
                  </div>
                  <div className="form-group company-type">
                    <label>公司性质(可多选)<i className="span_imp">*</i></label>
                    <div className="check">
                      <ul>
                        {companyData.companySelected && companyData.companySelected.map((item, index) => {
                          const { companyData: { companyType: tmp } } = this.state;
                          let checkboxClicked = !!_find(tmp, val => item.id === Number(val)) ? "checkedimg" : "";
                          return (
                            <li key={index}>
                              <div className={`check-img ${checkboxClicked}`} onClick={async () => {
                                let companyType = companyData.companyType;
                                if (!_find(companyType, val => item.id === Number(val))) {
                                  companyType.push(item.id);
                                } else {
                                  const idx = companyType.findIndex(o => Number(o) === item.id);
                                  delete companyType[idx];
                                }
                                this.setState({
                                  companyData: { ...companyData, companyType }
                                });
                                // await user.setStatus(companyType);
                              }}/>
                              <div className="checktxt">{item.name}</div>
                            </li>
                          );
                        })
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="form-group ">
                    <label>公司国别</label>
                    <div className="antdSlect">
                      {
                        companyData.companyCountries &&
                        <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="请选择公司国别"
                          optionFilterProp="children"
                          defaultValue={companyData.companyCountries}
                          onChange={async (value: string) => {
                            companyData['companyCountries'] = value;
                            this.setState({
                              companyData,
                            });
                          }}
                          filterOption={(input, option) =>
                            typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : ""
                          }
                        >
                          {children}
                        </Select>
                      }
                      {
                        _isEmpty(companyData.companyCountries) && <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="请选择公司国别"
                          optionFilterProp="children"
                          onChange={async (value: string) => {
                            companyData['companyCountries'] = value;
                            this.setState({
                              companyData,
                            });
                          }}
                          filterOption={(input, option) =>
                            typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : ""
                          }
                        >
                          {children}
                        </Select>
                      }
                    </div>
                  </div>
                  <div className="form-group">
                    <label>营业执照<i className="span_imp">*</i>
                      <span>(请上传的logo清晰可见，不超过10m，格式为: bmp,jpg,png)</span>
                    </label>
                    <div className="upload">
                      <div className="load">
                        <img src={companyData.businessLicense} alt=""/>
                        {companyData.businessLicense === "" ? <span>点击上传</span> : ""}
                        <input type="file" className="btn_file"
                               style={{ width: "100%", height: "100%", opacity: 0 }}
                               onChange={async (e) => {
                                 await this.uploadImg(e, 'businessLicenseGuid', 7, 'businessLicense');
                               }}/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>联系电话</label>
                    <input type="text" autoComplete="off" className="form-control"
                           value={companyData.companyTelephone}
                           onChange={async (e) => {
                             await this.getInputValue("companyTelephone", e);
                           }}
                           placeholder="请输入联系电话"/>
                  </div>
                  <div className="form-group">
                    <label>联系邮箱</label>
                    <input type="text" autoComplete="off" className="form-control"
                           value={companyData.companyMailbox}
                           onChange={async (e) => {
                             await this.getInputValue("companyMailbox", e);
                           }}
                           placeholder="请输入联系邮箱"/>
                  </div>
                  <div className="form-group">
                    <label>公司地址</label>
                    <input type="text" autoComplete="off" className="form-control"
                           value={companyData.companyAddress}
                           onChange={async (e) => {
                             await this.getInputValue("companyAddress", e);
                           }}
                           placeholder="请输入公司地址"/>
                  </div>
                  <div className="form-group">
                    <label>公司简介</label>
                    <textarea className="form-control textarea" placeholder="写点什么吧"
                              value={companyData.companyDesc}
                              onChange={async (e) => {
                                await this.getInputValue("companyDesc", e);
                              }}/>
                  </div>
                  {/*<div className="form-group">
                  <label>企业主页编辑权限关联账号</label>
                  <input type="text" placeholder="请输入关联账号，如有多个请以； 进行区分" className="form-control"/>
                </div>*/}

                </div>
                <div className="form-group">
                  <div className="user_btn_primary">
                    <button className="btn btn-primary" onClick={async () => {
                      await this.companyCertification();
                    }}>提交审核
                    </button>
                    <button className="btn btn-default" onClick={async () => {
                      await this.clearCompanyCertification();
                    }}>重置
                    </button>
                  </div>
                </div>
              </div>}
            {companyInfo.realStatus === 3 &&
            <div className={type === 4 ? "row-right-info" : "row-display"}>
              <div className="right-head realname-detail">
                <div className="form-group form-detail">
                  <label>上传企业LOGO:</label>
                  <div className="img-gray">
                    <img src={companyInfo.picUrl} alt=""/>
                  </div>
                </div>
                <div className="form-group form-detail">
                  <label>公司名称:</label>
                  {companyInfo.companyName}
                </div>
                <div className="form-group form-detail">
                  <label>公司性质:</label>
                  {companyInfo.companyType.split(',').map((item, index) => {
                    return (
                      <span key={index}>{companyTypeKV[item]}/</span>
                    );
                  })}
                </div>
                <div className="form-group form-detail">
                  <label>公司国别:</label>
                  {companyInfo.companyCountries}
                </div>
                <div className="form-group form-detail">
                  <label>营业执照:</label>
                  <div className="img-gray">
                    <img src={companyInfo.businessLicense} alt=""/>
                  </div>
                </div>
                <div className="form-group form-detail">
                  <label>联系电话:</label>
                  {companyInfo.companyTelephone}
                </div>
                <div className="form-group form-detail">
                  <label>联系邮箱:</label>
                  {companyInfo.companyMailbox}
                </div>
                <div className="form-group form-detail">
                  <label>公司地址:</label>
                  {companyInfo.companyAddress}
                </div>
                <div className="form-group form-detail">
                  <label>公司简介:</label>
                  {companyInfo.companyDesc}
                </div>
              </div>
            </div>}
            <div className={type === 3 ? "row-right-admin" : "row-display"}>
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
              </div>
            </div>
            <div className={type === 30 ? "row-right-admin" : "row-display"}>
              <div className="box-style">
                <div className={this.state.childNum === 1 ? "password-detail" : "row-display"}>
                  <div className="col-sm-8 box_center_style" id="moidify_password">
                    <p className="text-left margin-top46">修改密码</p>
                    <div className="form-group yc_relative">
                      <i className={iconShow ? "icon iconfont  icon-ic_block" : "icon iconfont  icon-ic_hidden"}
                         onClick={() => {
                           this.setState({ iconShow: !iconShow });
                         }}/>
                      <input type={iconShow ? 'text' : 'password'} className="form-control " id="password"
                             placeholder="输入原先密码"
                             value={this.state.UpdataPassword.oldUserPass}
                             onBlur={(e) => {
                               this.invalidatapass(e);
                             }}
                             onChange={(e) => {
                               UpdataPassword.oldUserPass = e.target.value;
                               this.setState({
                                 UpdataPassword
                               });
                             }}/>
                    </div>
                    <div className="form-group yc_relative">
                      <i
                        className={iconShowNext ? "icon iconfont  icon-ic_block" : "icon iconfont  icon-ic_hidden"}
                        onClick={() => {
                          this.setState({ iconShowNext: !iconShowNext });
                        }}/>
                      <input type={iconShowNext ? 'text' : 'password'} className="form-control " id="pwd_first"
                             placeholder="输入至少8位的新密码"
                             value={this.state.UpdataPassword.userPass}
                             onBlur={(e) => {
                               this.invalidatapass(e);
                             }}
                             onChange={(e) => {
                               UpdataPassword.userPass = e.target.value;
                               this.setState({
                                 UpdataPassword
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
                                 UpdataPassword
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
                      {this.state.Verification.type === 'editPhone' ? (
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

                      {this.state.Verification.type === 'editEmail' ? (
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

        {this.state.alertShow &&
        <Alert message={this.state.alertMessage}
               onClose={() => {
                 this.setState({ alertShow: false });
               }}
               onSubmit={() => {
                 this.setState({ alertShow: false });
                 // console.log(this);
                 // this.props.history.push('/login');
               }}
        />
        }
        <Footer data={footerNav}/>
      </div>
    );
  }
}
