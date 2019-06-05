import * as React from "react";
import { createRef } from "react";
import _isFunc from "lodash/isFunction";
import _isString from "lodash/isString";
import default_img from "@assets/images/default_img_item.png";

import E from 'wangeditor';
import { upload } from '@utils/api';
import { inject } from 'mobx-react';
import _isEmpty from 'lodash/isEmpty';
import { toJS } from 'mobx';

/** 
 * prodect 产品
 * cooperationCase 案例
 * ipMaterialList 合作列表
 * detail 图文详情
 */
interface ICulturalState { 
  prodect: Array<object>,
  cooperationCase: Array<object>,
  detail: string,
  ipMaterialGuidList: any,
  isOn: boolean,
  isCaseOn: boolean,
  result: string,
  prodectObj: object;
}

@inject('update')
export default class Common extends React.Component<any, ICulturalState> {
  editorEle: any;

  constructor(props: any) {
    super(props);
    this.editorEle = createRef();
    this.state = { 
      isOn: false,
      isCaseOn: false,
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
      detail: "",
      ipMaterialGuidList: [],
      result: "",
      prodectObj: {}
    };
  }

  private callback = (o: any) => _isFunc(this.props.callback) && this.props.callback(o);

  async componentDidMount() {
    this.initEditor();
    const { update, id } = this.props;
    const { updateList, } = update; 
    if (id) { 
      if (updateList.hasOwnProperty('cooperationCase')) { 

        const { cooperationCase, prodect } = updateList;  
        if (_isString(cooperationCase)) {
          updateList.cooperationCase = JSON.parse(cooperationCase);
        } else if (_isString(prodect)) {
          updateList.prodect = JSON.parse(prodect);
        }
      }
    } else {
      const { prodect, cooperationCase, detail } = this.state;
      await update.setStatus({ prodect, cooperationCase, detail });
    }

  }

  componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<ICulturalState>, nextContext: any): void {
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
      this.setState({
        result: e.target['result'],
      });
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
    const { isOn, isCaseOn } = this.state;
    const { update } = this.props;
    const { updateList, } = update;
    if (updateList.hasOwnProperty('cooperationCase')) {
      const { cooperationCase, prodect } = updateList;
      if (_isString(cooperationCase)) {
        updateList.cooperationCase = JSON.parse(cooperationCase);
      }
    }
    if (updateList.hasOwnProperty('prodect')) {
      const { prodect } = updateList;
      if (_isString(prodect)) {
        updateList.prodect = JSON.parse(prodect);
      }
    }
    return (
      <div> 
        <div className="create-right-container flex-column ">
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
        <div className="create-right-container flex-column ">
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
                {updateList.cooperationCase}
                1212
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
        <div className="create-right-container flex-column">
          <label>图文详情</label>
          <div ref={this.editorEle}/>
        </div>
      </div>
    );
  }
}
