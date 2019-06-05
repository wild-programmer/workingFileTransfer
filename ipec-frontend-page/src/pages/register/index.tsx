import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/register.scss";
import ipec_logo from "@assets/images/logoimg.svg";
import mobile_register from "@assets/images/user/ic_iphone_pre.svg";
import email_register from "@assets/images/user/ic_mail_pre.svg";
import { onCodeReg } from "@utils/api";
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import { Link } from "react-router-dom";

interface IRegisterState {
  user_mobile: string; // 登陆名-手机号
  btnNum: Number; // 登陆名-邮箱
  sendNum: Number; // 1.注册 2.修改密码 3.实名认证
  user_code: string; // 1.手机 2.邮箱
  firstPassword: string; // 登陆密码
  lastPassword: string; // 重复密码
  count: number; // 验证码秒数为30秒
  countEmail: number; // 验证码秒数为30秒
  liked: boolean;
  likedEmail: boolean;
  read: boolean; // 是否阅读-手机
  readEmail: boolean; // 是否阅读-邮箱
  message: string;
  show: boolean;
}

@inject("register")
@observer
export default class Register extends React.Component<IProps, IRegisterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user_mobile: "",
      sendNum: 1,
      btnNum: 1,
      firstPassword: "",
      lastPassword: "",
      user_code: "",
      count: 30,
      countEmail: 30,
      liked: true,
      likedEmail: true,
      read: false,
      readEmail: false,
      message: "",
      show: false,
    };
  }

  private filterParams() {
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
      this.setState({ message: "请输入手机号", show: true });
      return false;
    }
    if (!mPattern.test(this.state.user_mobile)) {
      this.setState({ message: "请输入正确手机号", show: true });
      return false;
    }
    if (this.state.user_code === "" || this.state.user_code === null) {
      this.setState({ message: "请输入验证码", show: true });
      return false;
    }
    if (this.state.firstPassword === "" || this.state.firstPassword === null) {
      this.setState({ message: "请输入密码", show: true });
      return false;
    }
    let mPatternPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!mPatternPass.test(this.state.firstPassword)) {
      this.setState({ message: "请输入正确格式密码，密码长度不小于8位数，且必须包含数字、字母", show: true });
      return false;
    }
    if (this.state.lastPassword === "" || this.state.lastPassword === null) {
      this.setState({ message: "请重复密码", show: true });
      return false;
    }
    if (this.state.firstPassword !== this.state.lastPassword) {
      this.setState({ message: "请输入相同密码", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入相同密码"/>;
      return false;
    }
    if (!this.state.read) {
      this.setState({ message: "请阅读相关协议并勾选", show: true });
      return false;
    }

    return true;
  }

  private filterEmailParams() {
    let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
      this.setState({ message: "请输入邮箱号", show: true });
      return false;
    }
    if (!mPatternEmail.test(this.state.user_mobile)) {
      this.setState({ message: "请输入正确邮箱号", show: true });
      return false;
    }
    if (this.state.user_code === "" || this.state.user_code === null) {
      this.setState({ message: "请输入验证码", show: true });
      return false;
    }
    if (this.state.firstPassword === "" || this.state.firstPassword === null) {
      this.setState({ message: "请输入密码", show: true });
      return false;
    }
    let mPatternPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!mPatternPass.test(this.state.firstPassword)) {
      this.setState({ message: "请输入正确格式密码，密码长度不小于8位数，且必须包含数字、字母", show: true });
      return false;
    }
    if (this.state.lastPassword === "" || this.state.lastPassword === null) {
      this.setState({ message: "请重复密码", show: true });
      return false;
    }
    if (this.state.firstPassword !== this.state.lastPassword) {
      this.setState({ message: "请输入相同密码", show: true });
      return false;
    }
    if (!this.state.readEmail) {
      this.setState({ message: "请阅读相关协议并勾选", show: true });
      return false;
    }
    return true;
  }

  setMenuNum = (num: number) => {
    this.setState({
      btnNum: num
    });
  };

  // 获取验证码倒计时-手机
  handleClick = () => {
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
      this.setState({ message: "请输入手机号", show: true });
      return;
    }
    if (!mPattern.test(this.state.user_mobile)) {
      this.setState({ message: "请输入正确手机号", show: true });
      return;
    }
    if (!this.state.liked) {
      return;
    }
    if (this.state.user_mobile) {
      const counting = !this.state.liked;
      console.log(counting);
      let count = this.state.count;
      console.log(count);
      const timer = setInterval(() => {
        this.setState({
          count: (count--)
        }, () => {
          if (count === -1) {
            clearInterval(timer);
            this.setState({
              liked: true,
              count: 30
            });
          }
        });
      }, 1000);
    } else {
      this.setState({ message: "请输入正确手机号", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入正确号"/>;
    }

  };

  // 获取验证码倒计时-邮箱
  handleClickEmail = () => {
    let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
      this.setState({ message: "请输入邮箱号", show: true });
      return;
    }
    if (!mPatternEmail.test(this.state.user_mobile)) {
      this.setState({ message: "请输入正确邮箱号", show: true });
      return;
    }
    if (!this.state.likedEmail) {
      return;
    }
    if (this.state.user_mobile) {
      let countEmail = this.state.countEmail;
      const timer = setInterval(() => {
        this.setState({
          countEmail: (countEmail--)
        }, () => {
          if (countEmail === -1) {
            clearInterval(timer);
            this.setState({
              liked: true,
              countEmail: 30
            });
          }
        });
      }, 1000);
    } else {
      this.setState({ message: "请输入正确邮箱号", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入正确邮箱号"/>;
    }
  };

  render() {
    const { register: { onRegister } }: any = this.props;
    return (
      <div className="container-all">
        <div className="container-register">
          <div className="register_img">
          </div>
          <div className="register-content">
            <img src={ipec_logo} alt=""/>
            <ul className="login-title-area">
              <li className={this.state.btnNum === 1 ? "login-title" : "input-mobile-display"}
                  onClick={() => this.setMenuNum(1)}>
                <img src={mobile_register} className="mobile_img"/>
                <span className="login-p-text">手机注册</span>
              </li>
              <li className={this.state.btnNum === 2 ? "login-title-email" : "input-mobile-display"}
                  onClick={() => this.setMenuNum(2)}>
                <img src={email_register} className="mobile_img"/>
                <span className="login-p-text">邮箱注册</span>
              </li>
            </ul>
            <div className={this.state.btnNum === 1 ? "input-form-mobile" : "input-display"}>
              <div className="form-group input-area isPhone">
                <span>+86</span>
                <input
                  type="text"
                  className="form-control
                  register-phone"
                  name="user_mobile"
                  placeholder="手机号"
                  onChange={e => {
                    this.setState({ user_mobile: e.currentTarget.value });
                  }}/>
              </div>

              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  name="user_code"
                  placeholder="输入短信验证码"
                  onChange={(e) => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={
                    async () => {
                      this.handleClick();
                      const { user_mobile: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                      const data: any = await onCodeReg({ userLogin, receiverType, sendType });
                      if (data.errorCode === "200") {
                      } else if (data.errorCode === "500") {
                      }
                    }
                  }
                >
                  {this.state.liked ? `${this.state.count}秒后重新发送` : "获取验证码"}
                </button>
              </div>

              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  name="firstPassword"
                  placeholder="请输入不少于8位的密码，包含数字、字母"
                  onChange={(e) => {
                    this.setState({ firstPassword: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  name="lastPassword"
                  placeholder="请重复密码"
                  onChange={e => {
                    this.setState({ lastPassword: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-operation">
                <div className="thirty-checkbox">
                  <input
                    type="checkbox"
                    onChange={e => {
                      let remember = e.currentTarget.checked;
                      if (remember) {
                        this.setState({
                          read: true
                        });
                      } else {
                        this.setState({
                          read: false
                        });
                      }
                    }}
                  />
                  <span>我已阅读并同意</span>
                  <a href="">IP智库服务协议</a>
                  <a href="">法律声明</a>
                  <a href="">隐私权政策</a>
                </div>
              </div>
              <button
                className="form-group login-btn-area"
                onClick={
                  async () => {
                    //this.checkPassword();
                    let isValidate = this.filterParams();
                    if (isValidate && this.state.firstPassword === this.state.lastPassword) {
                      const { user_mobile: userLogin, user_code: code, firstPassword: userPass, btnNum: type }: Readonly<any> = this.state;
                      let isSuccess = await onRegister({ userLogin, code, userPass, type });
                      if (_isObject(isSuccess)) {
                        this.setState({ message: isSuccess.message, show: true });
                      } else if (typeof isSuccess === "boolean" && this.state.firstPassword === this.state.lastPassword) {
                        this.props.history.push("/login");
                      }
                    }
                  }}>
                <span>立即注册</span>
              </button>

              <div className="form-group no-account">
                已经有账号? <Link to="login">立即登录</Link>
              </div>
            </div>
            <div className={this.state.btnNum === 2 ? "input-form-email" : "input-display"}>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  name="user_email"
                  placeholder="邮箱"
                  onChange={e => {
                    this.setState({ user_mobile: e.currentTarget.value });
                  }}
                />
              </div>

              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control code-input"
                  name="user_code"
                  placeholder="输入邮箱中收到的验证码"
                  onChange={(e) => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />
                <button
                  className="btn-primary"
                  id="getMessage"
                  onClick={async () => {
                    this.handleClickEmail();
                    const { user_mobile: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                    const data: any = await onCodeReg({ userLogin, receiverType, sendType });
                    console.log(data);
                  }}
                >
                  {this.state.likedEmail ? `${this.state.countEmail}秒后重新发送` : "获取验证码"}
                </button>
              </div>

              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="请输入不少于8位的密码，包含数字、字母"
                  onChange={(e) => {
                    this.setState({ firstPassword: e.currentTarget.value });
                  }}
                />
              </div>

              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  name="lastPassword"
                  placeholder="请重复密码"
                  onChange={(e) => {
                    this.setState({ lastPassword: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-operation">
                <div className="thirty-checkbox">
                  <input
                    type="checkbox"
                    onChange={e => {
                      let remember = e.currentTarget.checked;
                      if (remember) {
                        this.setState({
                          readEmail: true
                        });
                      } else {
                        this.setState({
                          readEmail: false
                        });
                      }
                    }}
                  />
                  <span>我已阅读并同意</span>
                  <a href="">IP智库服务协议</a>
                  <a href="">法律声明</a>
                  <a href="">隐私权政策</a>
                </div>
              </div>
              <button
                className="form-group login-btn-area"
                onClick={
                  async () => {
                    let isValidate = this.filterEmailParams();
                    if (isValidate && this.state.firstPassword === this.state.lastPassword) {
                      const { user_mobile: userLogin, user_code: code, firstPassword: userPass, btnNum: type }: Readonly<any> = this.state;
                      let isSuccess = await onRegister({ userLogin, code, userPass, type });
                      if (_isObject(isSuccess)) {
                        this.setState({ message: isSuccess.message, show: true });
                      } else if (typeof isSuccess === "boolean" && this.state.firstPassword === this.state.lastPassword) {
                        this.props.history.push("/login");
                      }
                    }
                  }}
              >
                <span>立即注册</span>
              </button>

              <div className="form-group no-account">
                已经有账号? <Link to="login">立即登录</Link>
              </div>
            </div>
          </div>
          <span className="bottom-txt">Copyright &copy; 2018 www.indexip.cn</span>
        </div>
        {this.state.show &&
        <Toast
          onClose={() => {
            this.setState({ show: false });
          }}
          duration={2}
          message={this.state.message}
        />}
      </div>
    );
  }
}
