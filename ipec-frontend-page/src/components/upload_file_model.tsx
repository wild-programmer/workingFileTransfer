import * as React from "react";
import "@assets/scss/model.scss";
import upload_img from "@assets/images/upload.png";
import icon_close from "@assets/images/ic_close.svg";
import { uploadBusinessData } from "@utils/api";
import Alert from "@components/alert";
import icon_excel from "@assets/images/update/ic_excel.svg";
import icon_pdf from "@assets/images/update/ic_pdf.svg";
import icon_ppt from "@assets/images/update/ic_ppt.svg";
import icon_delete from "@assets/images/update/ic_delete.svg";
import { inject } from 'mobx-react';

interface ImodelProps extends IComponentProps {
  title: string,
  onClose: Function,
  ipid: string,
  // onSubmit: Function,
  // onModel: Function,
}

interface ImodelState {
  result: any,
  uploadBox: boolean;
  isAlert: boolean;
  message: string;

}

@inject('update')
export default class UploadFileModel extends React.Component<ImodelProps, ImodelState> {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      uploadBox: true,
      isAlert: false,
      message: "",
    };
  }

  async uploadFile(e) {
    const {  ipid } = this.props;
    const { userGuid } = JSON.parse(sessionStorage.getItem("user"));
    let file = e.target.files[0];
    let size = file.size;
    let name = file.name;
    let is50M = size / 1024 / 1024 < 50;
    let type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      "application/pdf" || "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (!is50M) {
      this.setState({
        isAlert: true,
        message: "文件过大，请重新选择上传"
      });
      return false;
    } else if (type !== file.type) {
      this.setState({
        isAlert: true,
        message: "文件格式不对，请重新选择上传"
      });
      return false;
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
        this.setState({
          result: [...this.state.result, name]
        });
        let formData = new FormData();
        formData.append("file", file);
        const params = { file: formData, userGuid, ipid };
        const { errorCode, result }: any = await uploadBusinessData(params);
        if (errorCode === '200' && result.errorCode === 200) {
          this.setState({
            uploadBox: false,
          });
        } else {
          this.setState({
            uploadBox: true,
            isAlert: true,
            message: result.errorMsg
          });
        }
      };
    }
  }

  render() {
    const { title, onClose, } = this.props;
    const { uploadBox, isAlert, message, result } = this.state;
    return (
      <div className="model model-upload-file">
        <div className="menban" onClick={() => onClose()}/>
        {isAlert && <Alert
          onClose={() => {
            this.setState({ isAlert: false });
          }}
          onSubmit={() => {
            this.setState({ isAlert: false });
          }}
          message={message}/>
        }
        <div className="model-container">
          <div className="model-header">
            <span className="model-title">{title}</span>
            <img src={icon_close} className="close" onClick={() => {
              onClose();
            }} alt=""/>
            <p>温馨提示：只支持PPT、PDF、Excel格式，单个文件大小在50M以内</p>
          </div>
          <div className="model-body">
            {uploadBox &&
            <div className="upload-box">
              <input type="file" style={{ opacity: 0 }} onChange={async (e) => {
                await this.uploadFile(e);
              }}/>
              <div className="upload-container" style={{ backgroundImage: `url(${upload_img})` }}/>
            </div>
            }
            {!uploadBox &&
            <div className="upload-list">
              {
                result && result.map((item, index) => {
                  return (
                    <div className="single-list" key={index}>
                      <img src="" className="file-type-img" alt=""/>
                      <div className="file-content">
                        <p className="file-name">{item}</p>
                        <p className="file-state">上传成功！</p>
                      </div>
                      <img src="" className="file-remove-this" alt=""/>
                    </div>
                  );
                })
              }
            </div>
            }
          </div>
          {
            !uploadBox &&
            <div className="model-footer">
              <span className="btn btn-submit">
                继续 上传
                <input className="btn btn-submit" type="file" style={{ opacity: 0 }} onChange={async (e) => {
                  await this.uploadFile(e);
                }}/>
              </span>

              <input type="button" className="btn btn-cancel" value="确定" onClick={() => onClose()}/>
            </div>
          }
        </div>
      </div>
    );
  }
}
