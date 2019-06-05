import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import { inject } from 'mobx-react';

interface ITvSeriesProps extends IComponentProps{
  callback: Function;
}

interface ITvSeriesState {
  isShow: number;
}

@inject('update')
export default class TvSeries extends React.Component<ITvSeriesProps, ITvSeriesState> {

  constructor(props: any) {
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
          <label className="input-label">是否上映<span className="label-dot">*</span></label>
          <div className="radio-group">
            <div
              onClick={() => {
                const o = { isShow: 1 };
                this.setState(o);
                this.callback(o);
              }}
              className={`ip-radio flex-row align-items-center ${this.state.isShow === 1 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">未上映</span>
            </div>
            <div
              onClick={() => {
                const o = { isShow: 2 };
                this.setState(o);
                this.callback(o);
              }}
              className={`ip-radio flex-row align-items-center ${this.state.isShow === 2 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">已上映</span>
            </div>
          </div>
          {this.state.isShow > 0 && <TimeInput
            callback={this.timeCallback}
            margin_left={this.state.isShow === 1 ? 3 : 9}
            placeholder="请选择上映时间"
            defaultValue=""/>
          }
        </div>

        <div className="form-group flex-column">
          <label className="input-label">集数</label>
          <div className="input-control-group flex-row">
            <div className="input-with-unit">
              <input
                onChange={e => this.callback({ numberEpisode: e.target.value })}
                defaultValue={updateList.numberEpisode}
                type="number" className="form-control" placeholder="请填写集数"/>
              <span className="unit">集</span>
            </div>

            <div className="middle-symbol flex-row justify-content-center align-items-center">&</div>
            <div className="input-with-unit">
              <input
                onChange={e => this.callback({ filmLength: e.target.value })}
                defaultValue={updateList.filmLength}
                type="number" className="form-control" placeholder="请填写每集片长"/>
              <span className="unit">分钟</span>
            </div>
          </div>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">主演阵容</label>
          <input
            onChange={e => this.callback({ protagonist: e.target.value })}
            defaultValue={updateList.protagonist}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">导演</label>
          <input
            onChange={e => this.callback({ director: e.target.value })}
            defaultValue={updateList.director}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">编剧</label>
          <input
            onChange={e => this.callback({ scriptwriter: e.target.value })}
            defaultValue={updateList.scriptwriter}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>
        <div className="form-group flex-column">
          <label className="input-label">出品公司</label>
          <input
            onChange={e => this.callback({ companyGuidCp: e.target.value })}
            defaultValue={updateList.companyGuidCp}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>
        <div className="form-group flex-column">
          <label className="input-label">网络平台</label>
          <input
            onChange={e => this.callback({ ipPlatformInfoGuidWl: e.target.value })}
            defaultValue={updateList.ipPlatformInfoGuidWl}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>
        <div className="form-group flex-column">
          <label className="input-label">电视平台</label>
          <input
            onChange={e => this.callback({ ipPlatformInfoGuidDs: e.target.value })}
            defaultValue={updateList.ipPlatformInfoGuidDs}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>

      </div>
    );
  }
}
