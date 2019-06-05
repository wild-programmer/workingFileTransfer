import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import { inject } from 'mobx-react';
import moment from 'moment';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { toJS } from 'mobx';

const Option = Select.Option;
let children = [];

interface IPeopleProps extends IComponentProps {
  callback: Function;
}

interface IPeopleRadio {
  sex: number,
  height: string, // 身高
  brokerageFirmGuid: string, // 经纪公司
  graduateSchool: string, // 毕业院校
  achievement: string, // 主要成就
  optionData: any,
}

@inject('update')
export default class People extends React.Component<IPeopleProps, IPeopleRadio> {
  private timerID: number;

  constructor(props: any) {
    super(props);
    this.state = {
      sex: null,
      height: "",
      brokerageFirmGuid: "",
      graduateSchool: "",
      achievement: "",
      optionData: [],
    };
  }

  private birthdayTime = (o: any) => {
    const { date = "" } = o;
    this.callback({ brithDate: date });
  };

  private callback = (o: any) => _isFunc(this.props.callback) && this.props.callback(o);

  async componentDidMount() {
    const { update, id } = this.props;
    const { updateList } = update;
    if (id) {
      // console.log(updateList);
    } else {
      // const { sex, height, brokerageFirmGuid, graduateSchool, achievement } = this.state;
      // await update.setStatus({ sex, height, brokerageFirmGuid, graduateSchool, achievement });
    }
    await this.getCompanyData();

  }

  async getCompanyData() {
    const { update } = this.props;
    const result = await update.companyList();
    if (result) {
      result.forEach((item: any) => {
        children.push(<Option key={item.companyGuid}
                              value={item.companyGuid + `,${item.id}`}>{item.companyName}</Option>);
      });
    }
  }

  render() {
    const { update, id } = this.props;
    const { updateList, companyData } = update;
    console.log(this.state);
    if (id) {
      if (updateList.hasOwnProperty('achievement')) {
        const { height, achievement } = updateList;
        updateList.height = height.substring(0, 3);
        updateList.achievement = achievement;
      }
      if (updateList.hasOwnProperty('brokerageFirmGuid')) {
        const { brokerageFirmGuid } = update;
        if (brokerageFirmGuid !== '') {
          updateList.brokerageFirmGuid = brokerageFirmGuid;
        }
      }
      // console.log(updateList);
    }
    // const { achievement } = this.state;
    return (
      <div className="create-right-container flex-column">
        <div className="form-group flex-column">
          <label className="input-label">性别<span className="label-dot">*</span></label>
          <div className="radio-group">
            <div
              onClick={async () => {
                let radio = { sex: 240 };
                this.callback(radio);
                this.setState(radio);
                updateList.sex = 240;
                await update.setStatus(updateList);
              }}
              className={`ip-radio flex-row align-items-center ${Number(updateList.sex) === 240 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">男</span>
            </div>
            <div
              onClick={async () => {
                let radio = { sex: 241 };
                this.callback(radio);
                this.setState(radio);
                updateList.sex = 241;
                await update.setStatus(updateList);
              }}
              className={`ip-radio flex-row align-items-center ${Number(updateList.sex) === 241 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">女</span>
            </div>
            <div
              onClick={async () => {
                let radio = { sex: 243 };
                this.callback(radio);
                this.setState(radio);
                updateList.sex = 243;
                await update.setStatus(updateList);
              }}
              className={`ip-radio flex-row align-items-center ${Number(updateList.sex) === 243 ?
                "radio-selected" : ""}`}>
              <div className="limit-custom-radio"/>
              <span className="radio-text">组合</span>
            </div>
          </div>
        </div>

        <div className="form-group  flex-column">
          <label className="input-label">身高</label>
          <div className="input-control-group">
            <div className="input-with-unit">
              <input
                type="number"
                className="form-control"
                placeholder="请填写身高"
                onChange={async e => {
                  this.callback({ height: e.target.value });
                  updateList.height = e.target.value;
                  await update.setStatus(updateList);
                }}
                value={updateList.height}
              />
              <span className="unit">CM</span>
            </div>
          </div>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">出生日期</label>
          {
            updateList.brithDate &&
            <TimeInput
              callback={this.birthdayTime}
              show_triangle={false}
              placeholder="请选择出生日期"
              defaultValue={moment(updateList.brithDate, 'YYYY-MM-DD').format().substring(0, 10)}
            />
          }
          {updateList.brithDate === undefined &&
          <TimeInput
            callback={this.birthdayTime}
            show_triangle={false}
            placeholder="请选择出生日期"
            defaultValue=""
          />
          }
        </div>

        <div className="form-group flex-column">
          <label className="input-label">经纪公司</label>
          {
            id && updateList.brokerageFirmGuid !== undefined && < Select
              mode="multiple"
              className="from-control"
              style={{ width: '100%', backgroundColor: '#f8f9fa', minHeight: '0.48rem' }}
              placeholder="请填写公司全称"
              loading={true}
              value={[updateList.brokerageFirmGuid]}
              onChange={async (value) => {
                const result = value;
                // @ts-ignore
                this.callback({ brokerageFirmGuid: result.join(',') });
                await update.setStatus({ brokerageFirmGuid: result.join(',') });
              }}
            >
              {children}
            </Select>
          }
          {
            !id && <Select
              mode="multiple"
              className="from-control"
              style={{ width: '100%', backgroundColor: '#f8f9fa', minHeight: '0.48rem' }}
              placeholder="请填写公司全称"
              loading={true}
              onChange={async (value, key) => {
                const result = value;
                // @ts-ignore:
                this.callback({ brokerageFirmGuid: result.join(',') });
                // @ts-ignore
                await update.setStatus({ brokerageFirmGuid: result.join(',') });
              }}
            >
              {
                children
                // companyData && companyData.map((item, k) => {
                //   return <Option value={item.companyGuid} key={k + item.companyGuid}>{item.companyName}</Option>;
                // })
              }
            </Select>
          }

        </div>
        <div className="form-group flex-column">
          <label className="input-label">毕业院校</label>
          <input
            type="text"
            className="form-control"
            placeholder="请填写院校名称"
            onChange={async e => {
              this.callback({ graduateSchool: e.currentTarget.value });
              updateList.graduateSchool = e.target.value;
              await update.setStatus(updateList);
            }}
            value={updateList.graduateSchool}
          />
        </div>

        <div className="form-group flex-column">
          <label className="input-group">主要成就</label>
          <textarea
            className="form-control textarea"
            placeholder="如果有多个成就，请一行写一个成就"
            rows={6}
            value={updateList.achievement}
            onChange={async e => {
              this.callback({ achievement: e.currentTarget.value });
              updateList.achievement = e.target.value;
              await update.setStatus(updateList);
            }}
          >
          </textarea>
        </div>
      </div>
    );
  }
}
