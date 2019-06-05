import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/login.scss";
import ipec_logo from "@assets/images/logoimg.svg";
import { Link } from "react-router-dom";
import Toast from "@components/toast";
import _isObject from "lodash/isObject";

interface ILoginState {
  user_name: string;
  password: string;
  rememberPassword: boolean;
  show: boolean;
  message: string;
}

@inject("login")
@observer
export default class Login extends React.Component<IProps, ILoginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user_name: "",
      password: "",
      rememberPassword: false,
      show: false,
      message: "",
    };
  }

  private filterParams() {
    // const { user_name, password } = this.state;

    return true;
  }

  render() {
    const { login: { doLogin } }: any = this.props;
    return (
      <div className="container-all">
        <div className="container-login">
          <div className="login_img">
          </div>
          <div className="login-content">
            <img src={ipec_logo} alt=""/>
            <div className="login-title-area">
              <div className="login-title">
                <span className="login-p-text">账号登录</span>
              </div>
            </div>
            <div className="form-group input-area">
              <input
                type="text"
                className="form-control"
                name="user_name"
                placeholder="请输入手机号/邮箱"
                onChange={e => {
                  this.setState({ user_name: e.currentTarget.value });
                }}/>
            </div>
            <div className="form-group input-area">
              <input
                onChange={e => {
                  this.setState({ password: e.currentTarget.value });
                }}
                type="password"
                className="form-control"
                name="password"
                placeholder="请输入不少于8位的密码"/>
            </div>
            <div className="form-group form-operation">
              <div className="thirty-checkbox">
                <input
                  type="checkbox"
                  onChange={e => {
                    let rememberPassword = e.currentTarget.checked;
                    this.setState({ rememberPassword });
                  }}
                />
                <span>30天之内免登录</span>
              </div>
              <Link to="/authentication">忘记密码?</Link>
            </div>
            <button
              onClick={async () => {
                let isValidate = this.filterParams();
                if (isValidate) {
                  const { user_name: userLogin, password: userPass, rememberPassword: remember }: any = this.state;
                  let isSuccess = await doLogin({ userLogin, userPass, remember });
                  if (_isObject(isSuccess)) {
                    this.setState({ message: isSuccess.message, show: true });
                  } else if (typeof isSuccess === "boolean") {
                    this.props.history.push("/index");
                  }
                }
              }}
              className=" login-btn-area btn-primary">
              <span>账号登录</span>
            </button>

            <div className="form-group no-account">
              还没有账号? <Link to="/register">立即注册</Link>
            </div>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2018 www.indexip.cn</span>

        {this.state.show &&
        <Toast
          onClose={() => {
            this.setState({ show: false })
          }}
          duration={2}
          message={this.state.message}/>}
      </div>
    );
  }
}
