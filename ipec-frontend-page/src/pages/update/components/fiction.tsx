import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";

// interface IFictionState {
//   // 作者
//   author: string,
//   // 译者
//   translator: string,
//   // 出版社
//   press: string,
// }

export default class Fiction extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    // this.state = {
    //   author: "",
    //   translator: "",
    //   press: "",
    // };
  }

  private publishTime = (o: any) => {
    const { date = "" } = o;
    this.callback({ publishTime: date })
  };

  private callback = (o: any) => _isFunc(this.props.callback) && this.props.callback(o);

  render() {
    return (
      <div className="create-right-container flex-column">

      </div>
    )
  }
}
