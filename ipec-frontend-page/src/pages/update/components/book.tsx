import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import { inject } from 'mobx-react';
import moment from 'moment';

interface IBookState {
  // 作者
  author: string,
  // 译者
  translator: string,
  // 出版社
  press: string,
}

@inject('update')
export default class Book extends React.Component<IProps, IBookState> {
  constructor(props: any) {
    super(props);
    this.state = {
      author: "",
      translator: "",
      press: "",
    };
  }

  private publishTime = (o: any) => {
    const { date = "" } = o;
    this.callback({ publishTime: date });
  };

  private callback = (o: any) => _isFunc(this.props.callback) && this.props.callback(o);

  render() {
    const { update } = this.props;
    const { updateList } = update;
    return (
      <div className="create-right-container flex-column">
        <div className="form-group flex-column">
          <label className="input-label">作者<span className="label-dot">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="如有多个,名字之间用英文逗号隔开"
            onChange={e => {
              this.callback({ author: e.currentTarget.value });
            }}
            defaultValue={updateList.author}
          />
        </div>

        <div className="form-group flex-column">
          <label className="input-label">译者</label>
          <input
            type="text"
            className="form-control"
            placeholder="如有多个,名字之间用英文逗号隔开"
            onChange={e => {
              this.callback({ translator: e.currentTarget.value });
            }}
            defaultValue={updateList.translator}
          />
        </div>

        <div className="form-group flex-column">
          <label className="input-label">出版社</label>
          <input
            type="text"
            className="form-control"
            placeholder="请填写完整的出版社名称"
            onChange={e => {
              this.callback({ press: e.currentTarget.value });
            }}
            defaultValue={updateList.companyGuidCb}
          />
        </div>

        <div className="form-group flex-column">
          <label className="input-label">出版时间</label>
          {
            updateList.publishTime ?
              <TimeInput
                callback={this.publishTime}
                show_triangle={false}
                placeholder="请选择出版时间"
                defaultValue={moment(updateList.publishTime).format('YYYY-MM-DD')}
              />
              :
              <TimeInput
                callback={this.publishTime}
                show_triangle={false}
                placeholder="请选择出版时间"
                defaultValue=""
              />
          }

        </div>
      </div>
    );
  }
}
