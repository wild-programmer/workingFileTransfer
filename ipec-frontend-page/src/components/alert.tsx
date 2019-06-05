import * as React from "react";
import "@assets/scss/model.scss";

interface ImodelProps {
  message: string,
  // isShow: string
  onClose: Function,
  onSubmit?: Function,
  // onModel: Function,
}

interface ImodelState {
  isShow: string,

}

export default class Alert extends React.Component<ImodelProps, ImodelState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: "block"
    };
  }

  componentDidMount(): void {
    // this.setState({
    //   isShow: "block"
    // })
  }

  render() {
    const {
      message, onClose,
      onSubmit,
      // onModel
    } = this.props;
    const { isShow } = this.state;
    return (
      <div className="model model-info"
           onClick={() => {
             onClose();
           }}
      >
        <div className="model-container">
          <div className="model-body">
            {message}
          </div>
          <div className="model-footer">
            <input type="button" className="btn btn-submit" value="确定"
                   onClick={() => {
                     onClose();
                     onSubmit();
                   }}/>
          </div>
        </div>
      </div>
    );
  }
};
