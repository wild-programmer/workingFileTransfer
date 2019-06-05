import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import { inject } from 'mobx-react';
import moment from 'moment';
import { Select, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import { toJS } from 'mobx';
import _find from "lodash/find";
import { async } from "q";
import { clearInterval, clearTimeout } from "timers";

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
  result: Array<any>,
  timeout:any,
  current:any,
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
      result: [],
      timeout:null,
      current:0,
    };
  }


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
    

  }

  timestampToTime = (timestamp)=> {
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D;
  }

  private process(list: any[]) {
    let { pub: { ipTypeSuperiorNumber } } = this.props;
    if (list && ipTypeSuperiorNumber) {
      let tmp = _find(list, o => !!o[ipTypeSuperiorNumber]);
      return tmp && tmp[ipTypeSuperiorNumber];
    }
  }
  async getCompanyData(params) {
    const { update } = this.props;
    const result = await update.companyList(params);
    this.setState({
      result:result
    }) 
  }  
   searchList = value=>{
     let  {timeout,current} = this.state;  
    current=current+1
    timeout = setTimeout(() => {
      let  {current} = this.state;  
      if(current == 1){ 
        this.setState({ 
          current:0,
        })       
        this.getCompanyData({ companyName:value, currentPage: 1, pageSize: 30 })
      }else{
        current = current-1; 
        this.setState({ 
          current:current,
        })      
      }
    }, 1000);
    this.setState({
      timeout:timeout,
      current:current,
    }) 
  }

  //日期选择
  datechange = (date, dateString) => {
    this.callback({ brithDate: dateString });
  }

  private birthdayTime = (o: any) => {
    const { date = "" } = o;
    this.callback({ brithDate: date });
  };
  render() {
    const { update, id } = this.props;
    const { result } = this.state;
    let { updateList, subTypeList, companyData, locationList } = update;
    subTypeList = toJS(subTypeList);
    subTypeList = this.process(subTypeList);
    locationList = toJS(locationList);
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
          {subTypeList && subTypeList.length > 0 && <label className="input-label">IP类型<span className="label-dot">*</span></label>
          }
          {subTypeList && subTypeList.length > 0 && <div className="sub-type-area ip-Type-list">
            <div className="sub-type-list flex-fill flex-row flex-wrap">
              {subTypeList.map((item: any) => {
                if (item.ipTypeNumber !== 0) {
                  let { pub: { ipTypeNumber: tmp }, setPub } = this.props;
                  let checkboxClicked = !!_find(tmp, val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                  // const { updateList: { ipTypeNumber: tmp } } = update;
                  // console.log(!!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)));
                  // let checkboxClicked = !!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                  return (
                    <div
                      key={item.ipTypeGuid}
                      onClick={async () => {
                        let { pub } = this.props;
                        let { ipTypeNumber } = pub;
                        let count =false;
                        let index_ =0;
                        // let ipTypeNumber = tmp.split(',');
                        console.log(ipTypeNumber)
                        ipTypeNumber.forEach((val,indx )=> {
                          if(val == item.ipTypeNumber){
                            index_ = indx;
                            count = true
                          }
                        }); 
                        if (count) {                           
                          ipTypeNumber.splice(index_,1) ;  
                        } else {  
                          ipTypeNumber.push(item.ipTypeNumber); 
                        }
                        setPub({ ...pub, ipTypeNumber })
                        let _ipTypeNumber = ipTypeNumber.join(',');
                        var reg = /,{1+}/g; 
                        _ipTypeNumber.replace(reg, ","); 
                        await update.setStatus({ ipTypeNumber:_ipTypeNumber}); 
                      }}
                      className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                      <div className="limit-custom-checkbox" />
                      <div className="checkbox-text">{item.ipType}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>}
          
        </div>

        {
          false && <div className="form-group flex-column">
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
                <div className="limit-custom-radio" />
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
                <div className="limit-custom-radio" />
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
                <div className="limit-custom-radio" />
                <span className="radio-text">组合</span>
              </div>
            </div>
          </div>
        }
        {
          false && <div className="form-group  form-540   flex-column">
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
        }

        <div className="form-group form-540 flex-column">
          <label className="input-label">国籍  <span className="label-dot">*</span>  </label>
          <div className="radio-group flex-row flex-wrap">
            {
              locationList && locationList.map((item: any) => {

                let checkboxClicked = updateList.countryTypes === item.resourceKey ? "radio-selected" : "";
                return (
                  <div
                    key={item.resourceKey}
                    onClick={async () => {
                      //判断是否已经被选中    
                      updateList.countryTypes = item.resourceKey;
                      if (item.resourceKey === '5' || item.resourceKey === '6') {
                        updateList.nationality = '';
                      } else {
                        updateList.nationality = item.resourceValue;
                      }
                      await update.setStatus(updateList);
                    }}
                    className={`ip-radio flex-row align-items-center   ${checkboxClicked}`}>
                    <div className="limit-custom-radio" />
                    <div className="radio-text">{item.resourceValue}</div>
                  </div>
                );
              }
              )
            }
            {
              (updateList.countryTypes === '5' || updateList.countryTypes === '6') && <div className="location-container form-540">
                <input
                  type="text"
                  className="form-control bankgroundGray"
                  placeholder="请输入具体国家名称"
                  onChange={async e => {
                    this.callback({ nationality: e.currentTarget.value });
                    updateList.nationality = e.target.value;
                    await update.setStatus(updateList);
                  }}
                  value={updateList.nationality}
                />
              </div>
            }

          </div>
        </div>


        <div className="form-group form-540  flex-column">
          <label className="input-label">职业<span className="label-dot">*</span></label>
          <input
            type="text"
            className="form-control backgroundWite"
            placeholder="请填写院校名称"
            onChange={async e => {
              this.callback({ profession: e.currentTarget.value });
              updateList.profession = e.target.value;
              await update.setStatus(updateList);
            }}
            value={updateList.profession}
          />
        </div>

        <div className="form-group form-540 flex-column ant_dateSelect">
          <label className="input-label">出生日期</label>
          <DatePicker
            placeholder="请选择出生日期"
            onChange={this.datechange}
            defaultValue={moment(this.timestampToTime(updateList.brithDate), 'YYYY-MM-DD')}  
          />
        </div>


        <div className="form-group  form-540 flex-column">
          <label className="input-label">经纪公司<span className="label-dot">*</span></label>
          {
            id && updateList.brokerageFirmGuid !== undefined && < Select
              mode="multiple"
              className="from-control backgroundWite"
              style={{ width: '100%', backgroundColor: '#f8f9fa', minHeight: '0.48rem' }}
              placeholder="请填写公司全称" 
              onSearch={this.searchList}
              value={[updateList.brokerageFirmGuid]}
              onFocus={()=>{
                this.getCompanyData({ companyName:'', currentPage: 1, pageSize: 30 })
              }}
              onChange={async (value) => {
                const result = value;
                // @ts-ignore
                this.callback({ brokerageFirmGuid: result.join(',') });
                await update.setStatus({ brokerageFirmGuid: result.join(',') });
              }}
            >
              {
                result.map((item: any) => (<Option key={item.companyGuid}
                  value={item.companyGuid + `,${item.id}`}>{item.companyName}</Option>)
                )
              }
            </Select>
          }
          {
            !id && <Select
              mode="multiple"
              className="from-control backgroundWite"
              style={{ width: '100%', backgroundColor: '#f8f9fa', minHeight: '0.48rem' }}
              placeholder="请填写公司全称" 
              filterOption={false}
              onSearch={this.searchList}
              onFocus={()=>{
                this.getCompanyData({ companyName:'', currentPage: 1, pageSize: 30 })
              }}
              onChange={async (value, key) => {
                const result = value;
                // @ts-ignore:
                this.callback({ brokerageFirmGuid: result.join(',') });
                // @ts-ignore
                await update.setStatus({ brokerageFirmGuid: result.join(',') });
              }}
            >
              {
                result.map((item: any) => (<Option key={item.companyGuid}
                  value={item.companyGuid + `,${item.id}`}>{item.companyName}</Option>)
                )
              }
            </Select>
          }

        </div>

        {
          false && <div className="form-group flex-column">
            <label className="input-label">毕业院校</label>
            <input
              type="text"
              className="form-control backgroundWite"
              placeholder="请填写院校名称"
              onChange={async e => {
                this.callback({ graduateSchool: e.currentTarget.value });
                updateList.graduateSchool = e.target.value;
                await update.setStatus(updateList);
              }}
              value={updateList.graduateSchool}
            />
          </div>
        }
        {
          false && <div className="form-group flex-column">
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
        }


      </div>
    );
  }
}
