import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/authentication.scss";
import ipec_logo from "@assets/images/logoimg.svg";
import mobile_register from "@assets/images/user/ic_iphone_pre.svg";
import email_register from "@assets/images/user/ic_mail_pre.svg";
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import { Link } from "react-router-dom";

interface IBackState {
  btnNum: Number;
  sendNum: Number;
  user_code: string;
  user_pass: string;
  user_rpass: string;
  user_name: string;
  count: number;
  countEmail: number;
  liked: boolean;
  likedEmail: boolean;
  userLogin: string;
  message: string;
  show: boolean;
}

@inject("authentication")
@observer
export default class Register extends React.Component<IProps, IBackState> {
  constructor(props: any) {
    super(props);
    this.state = {
      btnNum: 1,
      sendNum: 2, // 1.注册 2.修改密码 3.实名认证
      user_name: "",
      user_code: "",
      user_pass: "",
      user_rpass: "",
      count: 30, // 验证码秒数为30秒
      countEmail: 30, // 验证码秒数为30秒
      liked: true,
      likedEmail: true,
      userLogin: "",
      message: "",
      show: false,
    };
  }

  onSubmitResult(code: any, userLogin: any) {
    sessionStorage.setItem("code", JSON.stringify(code)); // 验证码
    sessionStorage.setItem("userLogin", JSON.stringify(userLogin)); // 保存用户名
  }

  setMenuNum = (num: number) => {
    this.setState({
      btnNum: num
    });
  };

  private filterParams() {
    return true;
  }

  // 获取验证码倒计时-手机
  handleClick = () => {
    if (!this.state.liked) {
      return;
    }
    if (this.state.user_name) {
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
      }} duration={2} message="请输入正确手机号"/>;
    }

  };

  // 获取验证码倒计时-邮箱
  handleClickEmail = () => {
    if (!this.state.likedEmail) {
      return;
    }
    if (this.state.user_name) {
      let countEmail = this.state.countEmail;
      console.log(countEmail);
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
      this.setState({ message: "请输入正确邮箱", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入正确邮箱"/>;
    }
  };

  render() {
    const { authentication: { onForgetPassWordNext, onCodeReg } }: any = this.props;
    return (
      <div className="container-all">
        <div className="container-authentication">
          <div className="authentication_img">
          </div>

          <div className="authentication-content">
            <img src={ipec_logo} alt=""/>
            <ul className="authentication-title-area">
              <li className={this.state.btnNum === 1 ? "authentication-title" : "input-mobile-display"}
                  onClick={() => this.setMenuNum(1)}>
                <img src={mobile_register} className="mobile_img"/>
                <span className="authentication-p-text">手机注册</span>
              </li>
              <li className={this.state.btnNum === 2 ? "authentication-title-email" : "input-mobile-display"}
                  onClick={() => this.setMenuNum(2)}>
                <img src={email_register} className="mobile_img"/>
                <span className="authentication-p-text">邮箱注册</span>
              </li>
            </ul>
            <div className={this.state.btnNum === 1 ? "mobile-auth" : "auth-display"}>
              <div className="form-group input-area isPhone">
                <span>+86</span>
                <input
                  type="text"
                  className="form-control register-phone"
                  name="user_name"
                  placeholder="请输入您注册的手机号"
                  onChange={e => {
                    this.setState({ user_name: e.currentTarget.value });
                  }}/>
              </div>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control code-input"
                  name="user_code"
                  placeholder="输入4位短信验证码"
                  onChange={e => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />
                <button
                  className="btn btn-primary"
                  id="getMessage"
                  onClick={
                    async () => {
                      let isValidate = this.filterParams();
                      if (isValidate) {
                        this.handleClick();
                        const { user_name: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                        let isSuccess = await onCodeReg({ userLogin, receiverType, sendType });
                        if (_isObject(isSuccess)) {
                          this.setState({ message: isSuccess.message, show: true });
                        }
                      }
                    }
                  }
                >
                  {this.state.liked ? `${this.state.count}秒后重新发送` : "获取验证码"}
                </button>
              </div>
              <button
                className="form-group next-btn-area btn-primary"
                onClick={async () => {
                  let isValidate = this.filterParams();
                  if (isValidate) {
                    const { user_name: userLogin, user_code: code }: Readonly<any> = this.state;
                    let isSuccess = await onForgetPassWordNext({ userLogin, code });
                    if (_isObject(isSuccess)) {
                      this.setState({ message: isSuccess.message, show: true });
                    } else if (typeof isSuccess === "boolean") {
                      this.props.history.push("/update-password");
                      this.onSubmitResult(code, userLogin);
                    }
                  }
                }}
              >
                <span>下一步</span>
              </button>
              <div className="back-login">
                <Link to="login">返回登录</Link>
              </div>
            </div>
            <div className={this.state.btnNum === 2 ? "email-auth" : "auth-display"}>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="请输入您注册的邮箱号"
                  onChange={e => {
                    this.setState({ user_name: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control code-input"
                  name="code"
                  placeholder="输入邮箱中收到的验证码"
                  onChange={e => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />
                <button
                  className="btn btn-primary"
                  id="getMessage"
                  onClick={
                    async () => {
                      let isValidate = this.filterParams();
                      if (isValidate) {
                        this.handleClickEmail();
                        const { user_name: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                        let isSuccess = await onCodeReg({ userLogin, receiverType, sendType });
                        if (_isObject(isSuccess)) {
                          this.setState({ message: isSuccess.message, show: true });
                        }
                      }
                    }
                  }
                >
                  {this.state.likedEmail ? `${this.state.countEmail}秒后重新发送` : "获取验证码"}
                </button>
              </div>
              <button
                className="form-group next-btn-area btn-primary"
                onClick={async () => {
                  let isValidate = this.filterParams();
                  if (isValidate) {
                    const { user_name: userLogin, user_code: code }: Readonly<any> = this.state;
                    let isSuccess = await onForgetPassWordNext({ userLogin, code });
                    if (_isObject(isSuccess)) {
                      this.setState({ message: isSuccess.message, show: true });
                    } else if (typeof isSuccess === "boolean") {
                      this.props.history.push("/update-password");
                      this.onSubmitResult(code, userLogin);
                    }
                  }
                }}
              >
                <span>下一步</span>
              </button>
              <div className="back-login">
                <Link to="login">返回登录</Link>
              </div>
            </div>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2018 www.indexip.cn</span>
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
