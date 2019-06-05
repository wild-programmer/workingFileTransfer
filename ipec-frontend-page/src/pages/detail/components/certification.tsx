import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Certification extends React.Component {
  render() {
    return (
      <div className="no-auth">
        <p>近30天数据仅为实名认证用户可见，如需查看请先注册认证</p>
        <Link to="/register" className="button"><div>立即注册</div></Link>
      </div>
    );
  }
}
