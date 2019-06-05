import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/update_password.scss";
import ipec_logo from "@assets/images/logoimg.svg";
import Toast from "@components/toast";
import _isObject from "lodash/isObject";

interface IupPasswordState {
  user_name: string;
  firstPassword: string;
  lastPassword: string;
  code: string;
  show: boolean;
  message: string;
}

@inject("upPassword")
@observer
export default class Login extends React.Component<IProps, IupPasswordState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user_name: "",
      firstPassword: "",
      lastPassword: "",
      code: "",
      show: false,
      message: "",
    };
  }

  componentDidMount() {
    this.getUserCode();
  }

  private filterParams() {
    return true;
  };

  getUserCode() {
    let code = sessionStorage.getItem("code");
    let user_name = sessionStorage.getItem("userLogin");
    console.log(sessionStorage.getItem("code"), sessionStorage.getItem("userLogin"));
    if (`${code}` !== `${JSON.stringify(this.state.code)}` && `${user_name}` !== `${JSON.stringify(this.state.user_name)}`) {
      if (code && user_name) {
        code = JSON.parse(code);
        user_name = JSON.parse(user_name);
      }
      this.setState({
        code, user_name
      });
    }
  }

  // 两次密码是否一致
  private checkPassword = () => {
    if (this.state.firstPassword !== this.state.lastPassword) {
      this.setState({ message: "请输入相同密码", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入相同密码"/>;
      return;
    }
  };

  render() {
    const { upPassword: { onForgetPassWord } }: any = this.props;
    return (
      <div className="container-all">
        <div className="container-upPass">
          <div className="upPass_img">
          </div>
          <div className="upPass-content">
            <img src={ipec_logo} alt=""/>
            <div className="upPass-title-area">
              <div className="upPass-title">
                <span className="upPass-p-text">修改密码</span>
              </div>
            </div>
            <div className="form-group input-area">
              <input
                type="password"
                className="form-control"
                name="firstPassword"
                placeholder="请输入您的新密码"
                onChange={e => {
                  this.setState({ firstPassword: e.currentTarget.value });
                }}
              />
            </div>
            <div className="form-group input-area">
              <input
                type="password"
                className="form-control"
                name="lastPassword"
                placeholder="请重复一次新密码"
                onChange={e => {
                  this.setState({ lastPassword: e.currentTarget.value });
                }}
              />
            </div>
            <button
              className="form-group upPass-btn-area btn-primary"
              onClick={
                async () => {
                  this.checkPassword();
                  let isValidate = this.filterParams();
                  if (isValidate) {
                    const { user_name: userLogin, firstPassword: userPass, code: code }: Readonly<any> = this.state;
                    let isSuccess = await onForgetPassWord({ userLogin, userPass, code });
                    if (_isObject(isSuccess)) {
                      this.setState({ message: isSuccess.message, show: true });
                    } else if (typeof isSuccess === "boolean" && this.state.firstPassword === this.state.lastPassword) {
                      this.props.history.push("/login");
                    }
                  }
                }}
            >
              <span>完成</span>
            </button>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2018 www.indexip.cn</span>
        {this.state.show &&
        <Toast
          onClose={() => {
            this.setState({ show: false });
          }}
          duration={2}
          message={this.state.message}/>}
      </div>
    );
  }
}
