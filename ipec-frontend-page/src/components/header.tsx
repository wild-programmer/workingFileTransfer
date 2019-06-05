import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '@assets/scss/header.scss';
import Add from '@assets/images/add.svg';
import Ring from '@assets/images/ring.svg';
import '@assets/fonts/iconfont.css';
import ipec_logo from '@assets/images/logo2.0.png';
import animation from '@assets/images/IPsvg/animation.svg';
import design from '@assets/images/IPsvg/design.svg';
import art from '@assets/images/IPsvg/art.svg';
import book from '@assets/images/IPsvg/book.svg';
import brand from '@assets/images/IPsvg/brand.svg';
import entertainment from '@assets/images/IPsvg/entertainment.svg';
import life from '@assets/images/IPsvg/life.svg';
import sport from '@assets/images/IPsvg/sport.svg';
import play from '@assets/images/IPsvg/play.svg';
import star from '@assets/images/IPsvg/star.svg';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import _isEmpty from 'lodash/isEmpty';
import ic_attestation from '@assets/images/user/ic_attestation.svg';
import ic_attestation_pr from '@assets/images/user/ic_attestation_pr.svg';
import ic_user from '@assets/images/user.svg';

const subTypeObj = {
  '卡通动漫': animation,
  '文化艺术': art,
  '生活方式': life,
  '影视娱乐': entertainment,
  '企业品牌': brand,
  '体育运动': sport,
  '名人明星': star,
  '非营利机构': design,
  '网络游戏': play,
  '网文图书': book,
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
@inject('user')
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

  async componentDidMount() {
    await this.getUserInfo();
  }

  async getUserInfo() {
    let userLogin = sessionStorage.getItem('user');
    if (`${userLogin}` !== `${JSON.stringify(this.state.userLogin)}`) {
      if (userLogin) {
        userLogin = JSON.parse(userLogin);
      }
      this.setState({
        userLogin,
      });
    }
    if (!_isEmpty(userLogin)) {
      const { user } = this.props;
      // @ts-ignore
      const { userGuid } = userLogin;
      await user.getUserInfo(userGuid);
      const { personInfo } = user;
      userLogin['realStatus'] = personInfo.realStatus;
      sessionStorage.setItem("user", JSON.stringify(userLogin));
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
    const { style = {}, data: tmp, ip_list, industry } = this.props;
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
                        const { typeName: name, childTypeList } = val;
                        let _ipTypeNumber = '';
                        childTypeList && childTypeList.forEach(element => {
                          _ipTypeNumber += `${element.ipTypeNumber},`;
                        });
                        return (
                          <div key={name} className="hover-sub-item flex-row justify-content-start align-items-center">
                            {/* <i className={`icon-span icon iconfont ${subTypeObj[name]}`}/> */}
                            <img src={subTypeObj[name]} className="iconimg" alt=""/>
                            <Link className="sub-type-a" to="/ip-list"
                                  onClick={async () => {
                                    await ip_list.changeStatus({
                                      selected: val.typeName,
                                      ipTypeSuperiorNumbers: _ipTypeNumber
                                    });
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
            <input type="text" autoComplete="off" className="search-input" placeholder="搜索影片、剧集、IP名称…"
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
                  {userdata.picUrl ? (<img src={userdata.picUrl || ic_user} alt="icon"/>) : (
                    <img src={ic_user} alt="icon"/>)}
                </div>
                <div className="login-hover" style={{ display: mouseIsOpen }}>
                  <ul>
                    {userdata.userNickname ?
                      (<li className="li-special">
                        <div className="flex  justify-content-between align-items-center ">
                          <img className="head-img" src={userdata.picUrl || ic_user} alt=""/>
                          <div>
                            <span>{userdata.userNickname}</span>
                            {
                              userdata.realStatus === 2 || userdata.realStatus === 3 ?
                                <span className="certification">
                                <img src={ic_attestation} alt=""/>
                                未认证
                              </span>
                                :
                                <span className="certification active">
                                <img src={ic_attestation_pr} alt=""/>
                                已认证
                              </span>
                            }
                          </div>
                        </div>
                      </li>) : (<li>我的昵称</li>)}
                    <li className="hovli"><Link to="/user/1" className="hover-li">我的发布</Link></li>
                    <li className="hovli"><Link to="/user/2" className="hover-li">个人认证</Link></li>
                    <li className="hovli"><Link to="/user/4" className="hover-li">企业主页</Link></li>
                    <li className="hovli"><Link to="/user/3" className="hover-li">账号安全</Link></li>
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
