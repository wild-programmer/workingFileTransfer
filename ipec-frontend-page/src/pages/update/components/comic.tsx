import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import { inject } from 'mobx-react';

interface IComicProps extends IComponentProps{
  callback: Function;
}

interface IComicState {
  isShow: number;
}
@inject('update')
export default class Comic extends React.Component<IComicProps, IComicState> {
  constructor(props) {
    super(props);
    this.state = { isShow: 1 };
  }

  private timeCallback = (o: any) => {
    const { date = "" } = o;
    this.callback({ releaseDate: date });
  };

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  componentDidMount(): void {
    this.callback({ isShow: this.state.isShow });
  }

  render() {
    const { update } = this.props;
    const { updateList } = update;
    return (
      <div className="create-right-container flex-column">
        <div className="form-group flex-column">
          <label className="input-label">状态<span className="label-dot">*</span></label>
          <div className="radio-group">
            <div
              onClick={() => this.setState({ isShow: 1 })}
              className={`ip-radio flex-row align-items-center ${this.state.isShow === 1 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">连载中</span>
            </div>
            <div
              onClick={() => this.setState({ isShow: 2 })}
              className={`ip-radio flex-row align-items-center ${this.state.isShow === 2 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">已完结</span>
            </div>
          </div>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">首更日期</label>
          <TimeInput callback={this.timeCallback} show_triangle={false} defaultValue=""/>
        </div>
        <div className="form-group flex-column">
          <label className="input-label">作者</label>
          <input
            onChange={e => this.callback({ author: e.target.value })}
            defaultValue={updateList.author}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>
        <div className="form-group flex-column">
          <label className="input-label">出版社</label>
          <input
            onChange={e => this.callback({ companyGuidCp: e.target.value })}
            defaultValue={updateList.companyGuidCp }
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>

      </div>
    );
  }
}
