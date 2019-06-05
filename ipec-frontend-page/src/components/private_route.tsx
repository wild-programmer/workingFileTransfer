import * as React from "react";
import { Redirect, withRouter } from "react-router";

export default function privateRoute(WrappedComponent) {
  if (!WrappedComponent) {
    throw new Error("missing component");
  }

  return withRouter(class extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return !sessionStorage.getItem("user") ? (
        <Redirect to="/login"/>
      ) : <WrappedComponent {...this.props}/>;
    }
  });
}

