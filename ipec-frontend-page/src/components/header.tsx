import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '@assets/scss/header.scss';
import Add from '@assets/images/add.svg';
import Ring from '@assets/images/ring.svg';
// import UserHeader from '@assets/images/user/ic_head.svg';
import IconHeader from "@assets/images/user/icon_header.svg";
import '@assets/fonts/iconfont.css';
import ipec_logo from '@assets/images/logo.svg';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

const subTypeObj = {
  'IP形象': 'icon-ic_image',
  '文创艺术': 'icon-ic_art',
  '电视剧': 'icon-ic_tv_series',
  '电影': 'icon-ic_film',
  '综艺': 'icon-ic_variety',
  '明星艺人': 'icon-ic_star',
  '动画': 'icon-ic_animation',
  '漫画': 'icon-ic_cartoon',
  '图书': 'icon-ic_book',
  '网文': 'icon-ic_animation',
};
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

interface IHeaderProps extends IComponentProps {
  style?: object;
  data: any;
  history?: any;
  isActive?: any;
}

interface IHeaderState {
  // 用户名
  userLogin: string,
  mouseIsOpen: string,
  searchValue: string,
  pullDown: boolean,
}

@inject('ip_list')
@inject('industry')
@observer
export default class Header extends React.Component<IHeaderProps, IHeaderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userLogin: null,
      mouseIsOpen: 'none',
      searchValue: '',
      pullDown: false,
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    let userLogin = sessionStorage.getItem('user');
    if (`${userLogin}` !== `${JSON.stringify(this.state.userLogin)}`) {
      if (userLogin) {
        userLogin = JSON.parse(userLogin);
      }
      this.setState({
        userLogin,
      });
    }
  }

  logout() {
    sessionStorage.removeItem('user');
    this.setState({ userLogin: null }, () => this.props.history.push('/login'));
  }

  private handleMouseEnter = () => {
    this.setState({
      mouseIsOpen: 'block',
    });
  };

  private handleMouseOut = () => {
    this.setState({
      mouseIsOpen: 'none',
    });
  };

  render() {
    const { style = {}, isActive, data: tmp, ip_list, industry } = this.props;
    const data = toJS(tmp);
    const { mouseIsOpen, searchValue, pullDown } = this.state;
    let { customStatus } = ip_list;
    let { hotWords } = industry;
    const { selected } = customStatus;
    let userdata = JSON.parse(sessionStorage.getItem('user'));
    return (
      <div className={data === '' ? 'aboutRule' : ''}>
        <ul style={{ ...style }} className="header-container nav flex-row justify-content-center align-items-center">
          <li className="nav-item logo">
            <Link to="/">
              <img src={ipec_logo} alt=""/>
            </Link>
          </li>
          {
            data && data.map((item, index) => {
              return (
                <li className="nav-item" key={index}>
                  <NavLink className="nav-link"
                           to={`${item.navUrl || ''}`}>{`${item.navName || ''}`}</NavLink>
                  <div className="main-top-hover">
                    {
                      item.navName === 'IP库' && item.sublist.length > 1 && item.sublist.map((val) => {
                        const { navName: name } = val;
                        return (
                          <div key={name} className="hover-sub-item flex-row justify-content-start align-items-center">
                            <i className={`icon-span icon iconfont ${subTypeObj[name]}`}/>
                            <Link className="sub-type-a" to="/ip-list"
                                  onClick={async () => {
                                    const ipTypeSuperiorNumber = numberKV[val.navName];
                                    await ip_list.changeStatus({ selected: val.navName, ipTypeSuperiorNumber });
                                  }}>{name}</Link>
                          </div>
                        );
                      })
                    }
                    {
                      item.navName !== 'IP库' && item.sublist.length > 1 && item.sublist.map((val) => {
                        const { navName: name } = val;
                        return (
                          <div key={name} className="hover-sub-item flex-row justify-content-start align-items-center">
                            <Link to={item.navUrl} className="sub-type-a" key={name}>{name}</Link>
                          </div>
                        );
                      })
                    }
                  </div>
                </li>
              );
            })
          }
          <li className="nav-item search-input-area">
            <input type="text" className="search-input" placeholder="搜索影片、剧集、IP名称…"
                   onChange={(e) => {
                     this.setState({
                       searchValue: e.currentTarget.value,
                     });
                   }}
                   onKeyDown={(e) => {
                     if (e.keyCode === 13) {
                       this.props.history.push(`/ip-search/${searchValue}`);
                     }
                   }}
                   onClick={async () => {
                     this.setState({
                       pullDown: true,
                     });
                     const params = { hotWordsType: 1 };
                     await industry.getHotWords(params);
                   }}
                   onBlur={(e) => {
                     if (e.target.className !== 'search-input') {
                       this.setState({
                         pullDown: false,
                       });
                     }
                   }}
            />
            {data === '' ? <i className="icon iconfont icon-search"/> :
              <i className="icon iconfont icon-search" onClick={() => {
                this.props.history.push(`/ip-search/${searchValue}`);
              }}/>}
            {pullDown && <div className="search_pulldown">
              <ul>
                <li className="hot-title">热门搜索</li>
                {
                  hotWords && hotWords.map((item, index) => {
                    return (
                      <li key={index}
                          onClick={() => {
                            this.props.history.push(`/ip-search/${item.hotWords}`);
                            this.setState({
                              pullDown: false,
                            });
                          }}>{item.hotWords}</li>
                    );
                  })
                }
              </ul>
            </div>
            }
          </li>
          {!this.state.userLogin ?
            <li className="nav-item user-operation justify-content-center align-items-center">
              <Link to="/register" className="register-btn">注册</Link>
              <span className="separate-symbol">|</span>
              <Link to="/login" className="login-btn">登录</Link>
            </li>
            :
            <li className="login-success">
              <Link to="/update">
                <div className="login-add">
                  <img src={Add} alt=""/>
                  <p className="add-ip">上传IP</p>
                </div>
              </Link>
              <div className="login-ring">
                <img src={Ring} alt=""/>
                <p className="add-ip">消息</p>
              </div>
              <div className="login-user"
                   onMouseLeave={this.handleMouseOut}
                   onMouseEnter={this.handleMouseEnter}>
                <div>
                  {userdata.picUrl ? (<img src={userdata.picUrl} alt="icon"/>) : (<img src={IconHeader} alt="icon"/>)}
                </div>
                <div className="login-hover" style={{ display: mouseIsOpen }}>
                  <ul>
                    {userdata.userNickname ? (<li>{userdata.userNickname}</li>) : (<li>我的昵称</li>)}
                    <li className="hovli"><Link to="/user" className="hover-li">我的发布</Link></li>
                    <li className="hovli"><Link to="/user" className="hover-li">个人信息</Link></li>
                    <li className="hovli"><Link to="/user" className="hover-li">账号安全</Link></li>
                    <li
                      className="hovli"
                      onClick={() => this.logout()}
                    >退出
                    </li>
                  </ul>
                </div>
              </div>

            </li>
          }
        </ul>

      </div>
    );
  }
}
