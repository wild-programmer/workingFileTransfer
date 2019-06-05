import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import { inject } from "mobx-react";

interface IVarietyProps extends IComponentProps{
  callback: Function;
}

interface IVarietyState {
  isShow: number;
}

@inject('update')
export default class Variety extends React.Component<IVarietyProps, IVarietyState> {

  constructor(props: any) {
    super(props);
    this.state = { isShow: 1 };
  }

  private timeCallback = (o: any) => {
    const { date = "" } = o;
    this.callback({ releaseDate: date });
  };

  componentDidMount(): void {
    this.callback({ isShow: this.state.isShow });
  }

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  render() {
    const { update } = this.props;
    const { updateList } = update;
    return (
      <div className="create-right-container flex-column">
        <div className="form-group flex-column">
          <label className="input-label">是否上映<span className="label-dot">*</span></label>
          <div className="radio-group">
            <div
              onClick={() => this.setState({ isShow: 1 })}
              className={`ip-radio flex-row align-items-center ${this.state.isShow === 1 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">未上映</span>
            </div>
            <div
              onClick={() => this.setState({ isShow: 2 })}
              className={`ip-radio flex-row align-items-center ${this.state.isShow === 2 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">已上映</span>
            </div>
          </div>
          <TimeInput callback={this.timeCallback} margin_left={this.state.isShow === 1 ? 3 : 9}
                     placeholder="请选择预计上映时间" defaultValue=""/>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">期数</label>
          <div className="input-control-group">
            <div className="input-with-unit">
              <input
                onChange={e => this.callback({ periods: e.target.value })}
                defaultValue={updateList.periods}
                type="text" className="form-control" placeholder="请填写期数"/>
              <span className="unit">期</span>
            </div>
          </div>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">主持人</label>
          <input
            onChange={e => this.callback({ compere: e.target.value })}
            defaultValue={updateList.compere}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">常驻嘉宾</label>
          <input
            onChange={e => this.callback({ residentGuest: e.target.value })}
            defaultValue={updateList.residentGuest}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>
        <div className="form-group flex-column">
          <label className="input-label">制片人</label>
          <input
            onChange={e => this.callback({ productionManager: e.target.value })}
            defaultValue={updateList.productionManager}
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
