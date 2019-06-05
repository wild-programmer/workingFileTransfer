import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import moment from 'moment';
import { inject } from 'mobx-react';
import { createRef } from 'react';
import { toJS } from 'mobx';
import { upload } from '@utils/api';
import E from "wangeditor";
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import default_img from "@assets/images/default_img_item.png";
import { Select } from 'antd';

const Option = Select.Option;
const children = [];

interface IAvatarProps extends IComponentProps {
  callback: Function;
}

interface IAvatarState {
  isShow: number;
  isOn: boolean;
  isCaseOn: boolean;
  detail: string;
  prodect: Array<object>;
  cooperationCase: Array<object>;
}

@inject('update')
export default class Avatar extends React.Component<IAvatarProps, IAvatarState> {
  editorEle: any;

  constructor(props) {
    super(props);
    this.editorEle = createRef();
    this.state = {
      isShow: 1,
      isOn: false,
      isCaseOn: false,
      detail: "",
      prodect: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
      cooperationCase: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
    };
  }

  private timeCallback = (o: any) => {
    const { date = "" } = o;
    this.callback({ date });
  };

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  async componentDidMount() {
    this.initEditor();
    this.callback({ isShow: this.state.isShow });
    const { update, id } = this.props;
    const { updateList, } = update;
    const { prodect, cooperationCase, detail } = this.state;
    if (id) {
      if (updateList.hasOwnProperty('cooperationCase')) {
        const { cooperationCase, prodect } = updateList;
        if (_isString(cooperationCase) && !_isEmpty(cooperationCase)) {
          updateList.cooperationCase = JSON.parse(cooperationCase);
        } else if (_isEmpty(cooperationCase)) {
          await update.setStatus({ cooperationCase: this.state.cooperationCase });
        }
        if (_isString(prodect) && !_isEmpty(prodect)) {
          updateList.prodect = JSON.parse(prodect);
        } else if (_isEmpty(prodect)) {
          await update.setStatus({ prodect: this.state.prodect });
        }
      }
    } else {
      await update.setStatus({ prodect, cooperationCase, detail });
    }
    await this.getCompanyData();
  }

  async getCompanyData() {
    const { update } = this.props;
    const result = await update.companyList();
    if (result) {
      result.forEach((item: any) => {
        children.push(<Option key={item.companyName + item.id}>{item.companyName}</Option>);
      });
    }
  }

  componentWillUpdate(nextProps: Readonly<IAvatarProps>, nextState: Readonly<IAvatarState>, nextContext: any): void {
    const ele = this.editorEle.current;
    const editor = new E(ele);
    // 使用 onblur 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onblur = html => {
      // html 即编辑器中的内容
      this.setState({
        detail: html
      });
      this.callback({ detail: html });
    };
  }

  private initEditor() {
    const ele = this.editorEle.current;
    const editor = new E(ele);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 2;
    editor.customConfig.onblur = html => {
      // html 即编辑器中的内容
      this.setState({
        detail: html
      });
      // console.log("init" + html, this.state.detail);
      this.callback({ detail: html });
    };

    editor.create();
    // 初始化内容
    const { updateList } = this.props.update;
    // console.log(toJS(updateList));
    if (!_isEmpty(toJS(updateList))) {
      editor.txt.html(updateList.detail);
    }
  }

  // 上传图片
  async uploadImg(e, item, index, dataName) {
    // 利用fileReader对象获取file
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("isImage", '1');
      formData.append("isFullPath", '1');
      await upload(formData);
      const { errorCode, result = {} }: any = await upload(formData);
      if (errorCode === '200' && result.errorCode === 200) {
        const { update } = this.props;
        item.pic = result.data;
        if (dataName === 'prodect') {
          const { prodect } = update.updateList;
          await update.setStatus({ prodect: toJS(prodect) });
          this.callback({ prodect });
        } else {
          const { cooperationCase } = update.updateList;
          await update.setStatus({ cooperationCase: toJS(cooperationCase) });
          this.callback({ cooperationCase });

        }
      } else {
        // this._setState(true, result.errorMsg);
      }
    };
  }

  async _changeValue(e, item, dataName) {
    item.title = e.target.value;
    const { update } = this.props;
    if (dataName === 'prodect') {
      const { prodect } = update.updateList;
      await update.setStatus({ prodect });
      this.callback({ prodect: toJS(prodect) });
    } else {
      const { cooperationCase } = update.updateList;
      await update.setStatus({ cooperationCase });
      this.callback({ cooperationCase: toJS(cooperationCase) });
    }
  }

  render() {
    const { update, id } = this.props;
    const { updateList, companyData, } = update;
    const { isOn, isCaseOn } = this.state;
    if (updateList.hasOwnProperty('cooperationCase')) {
      const { cooperationCase, prodect } = updateList;
      if (_isString(cooperationCase) && !_isEmpty(cooperationCase)) {
        updateList.cooperationCase = JSON.parse(cooperationCase);
      }
    }
    if (updateList.hasOwnProperty('prodect')) {
      const { prodect } = updateList;
      if (_isString(prodect) && !_isEmpty(prodect)) {
        updateList.prodect = JSON.parse(prodect);
      }
    }

    return (
      <div className="create-right-container flex-column">
        <div className="form-group flex-column">
          <label className="input-label">来源作品<span className="label-dot">*</span></label>
          <input
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"/>
        </div>

        <div className="form-group flex-column">
          <label className="input-label">生日</label>
          {
            updateList.brithDate ?
              <TimeInput show_triangle={false}
                         callback={this.timeCallback} placeholder="请选择生日日期"
                         defaultValue={moment(updateList.brithDate, 'YYYY-MM-DD').format().substring(0, 10)}/>
              :
              <TimeInput show_triangle={false}
                         callback={this.timeCallback} placeholder="请选择生日日期"
                         defaultValue=""/>
          }
        </div>
        <div className="form-group flex-column">
          <label className="input-label">出品公司</label>
          {/*  <input
            onChange={e => this.callback({ companyGuidCb: e.target.value })}
            type="text" className="form-control" placeholder="如果有多个, 名字之间用英文逗号隔开"
            defaultValue={updateList.companyCpName}
          />*/}
          {
            id && <Select
              mode="multiple"
              className="from-control"
              style={{ width: '100%', backgroundColor: '#f8f9fa', minHeight: '0.48rem' }}
              placeholder="请填写公司全称"
              value={[updateList.companyCpName]}
              onChange={async (value) => {
                const result = value;
                console.log(value);
                // @ts-ignore
                this.callback({ companyCpName: result.join(',') });
                await update.setStatus({ companyCpName: result.join(',') });
              }}
            >
              {
                companyData && companyData.map((item, k) => {
                  return <Option value={item.companyGuid}
                                 key={item.companyName + item.companyGuid}>{item.companyName}</Option>;
                })
              }
            </Select>
          }
          {
            !id && <Select
              mode="multiple"
              className="from-control"
              style={{ width: '100%', backgroundColor: '#f8f9fa', minHeight: '0.48rem' }}
              placeholder="请填写公司全称"
              onChange={(value) => {
                const result = value;
                // @ts-ignore
                this.callback({ companyCpName: result.join(',') });
              }}
            >
              {
                companyData && companyData.map((item, k) => {
                  return <Option value={item.companyGuid} key={k + item.companyGuid}>{item.companyName}</Option>;
                })
              }
            </Select>
          }
        </div>
        <div className="form-group flex-column">
          <label className="input-label">版权方</label>
          <input
            type="text"
            className="form-control"
            placeholder="填写版权方"
            onChange={async e => {
              this.callback({ owner: e.currentTarget.value });
              updateList.owner = e.target.value;
              await update.setStatus(updateList);
            }}
            value={updateList.owner}
          />
        </div>
        <div className="flex-column ">
          <div className="form-group special-from-group">
            <p className="cultural-p justify-content-between">
              <label>产品展示</label>
              {
                isOn && <label onClick={() => {
                  this.setState({ isOn: false });
                }}>展开</label>
              }
              {
                !isOn && <label onClick={() => {
                  this.setState({ isOn: true });
                }}>收起</label>
              }
            </p>
            {
              !isOn && <div className="product-container">
                <p className="notice">注：建议图片尺寸：230*180px</p>
                <div className="product-list justify-content-between">
                  {
                    !!updateList.prodect && updateList.prodect.map((item, index) => {
                      return (
                        <div key={index} className="product-box">
                          <div className="upload-box">
                            <span className="update-product">更改产品</span>
                            <span className=" add-product">添加产品</span>
                            <input type="file" className="product-upload" onChange={async (e) => {
                              await this.uploadImg(e, item, index, 'prodect');
                            }}/>
                            {item.pic === "" && <img src={item.pic} alt=""/>}
                            {item.pic !== "" && <img src={item.pic || default_img} alt=""/>}
                          </div>
                          <input type="text" className="product-input"
                                 value={item.title}
                                 onChange={async (e) => {
                                   await this._changeValue(e, item, 'prodect');
                                 }}
                                 placeholder="输入产品描述最多12字"
                                 maxLength={12}/>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            }
          </div>
        </div>
        <div className="flex-column ">
          <div className="form-group special-from-group">
            <p className="cultural-p justify-content-between">
              <label>案例展示</label>
              {isCaseOn && <label onClick={() => {
                this.setState({ isCaseOn: false });
              }}>展开</label>}
              {!isCaseOn && <label onClick={() => {
                this.setState({ isCaseOn: true });
              }}>收起</label>}
            </p>
            {
              !isCaseOn &&
              <div className="product-container">
                <p className="notice">注：建议图片尺寸：230*180px</p>
                <div className="product-list justify-content-between">
                  {
                    !!updateList.cooperationCase && updateList.cooperationCase.map((item, index) => {
                      return (
                        <div key={index} className="product-box">
                          <div className="upload-box">
                            <span className="update-product">更改产品</span>
                            {item.pic === "" && <span className=" add-product">添加产品</span>}
                            <input type="file" className="product-upload" onChange={async (e) => {
                              await this.uploadImg(e, item, index, 'cooperationCase');
                            }}/>
                            {item.pic === "" && <img src={item.pic} alt=""/>}
                            {item.pic !== "" && <img src={item.pic || default_img} alt=""/>}
                          </div>
                          <input type="text" className="product-input"
                                 value={item.title}
                                 onChange={async (e) => {
                                   await this._changeValue(e, item, 'cooperationCase');
                                 }}
                                 placeholder="输入产品描述最多12字"
                                 maxLength={12}/>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            }
          </div>
        </div>
        <div className=" flex-column">
          <label>图文详情</label>
          <div ref={this.editorEle}/>
        </div>
      </div>
    );
  }
}
