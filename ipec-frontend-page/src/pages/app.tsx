import * as React from "react";
import { lazy, Suspense } from "react";
import { Provider } from "mobx-react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// import hashHistory  from "react-router";
import Loading from "@components/loading";
import privateRoute from "@components/private_route";
import "@assets/fonts/iconfont.css";
import "@assets/fonts2.0/iconfont.css";
import stores from "../stores";

const Home = lazy(() => import("@pages/home"));
const Login = lazy(() => import("@pages/login"));
const Register = lazy(() => import("@pages/register"));
const User = lazy(() => import("@pages/user"));
const Contact = lazy(() => import("@pages/contact"));
const Rights = lazy(() => import("@pages/rights"));
const Who_am_i = lazy(() => import("@pages/who_am_i"));
const Join = lazy(() => import("@pages/join"));
const Rule = lazy(() => import("@pages/rule"));
const Use = lazy(() => import("@pages/use"));
const IpList = lazy(() => import("@pages/ip_list"));
const NoMatch = lazy(() => import("@pages/no_match"));
const Detail = lazy(() => import("@pages/detail/index"));
const Authentication = lazy(() => import("@pages/authentication"));
const UpdatePassword = lazy(() => import("@pages/upPassword"));
const IpResearch = lazy(() => import("@pages/ip_research"));
const Update = lazy(() => import("@pages/update"));
const IpSearch = lazy(() => import("@pages/ip_search"));
const Industry_detail = lazy(() => import("@pages/industry_detail"));
const Solution = lazy(() => import("@pages/solution"));
const Contrast = lazy(() => import("@pages/contrast"));
const Download = lazy(() => import("@pages/download"));

const PrivateRoute = privateRoute(Route);

export default class App extends React.Component {

  public render(): React.ReactNode {
    return (
      <Provider {...stores}>
        <Router >
          <Suspense fallback={<Loading/>}>
            <Switch>
              <Route path="/" exact component={(props: any) => <Home {...props}/>}/>
              <Route path="/index" exact component={(props: any) => <Home {...props}/>}/>
              <Route path="/ip-list" component={(props: any) => <IpList {...props}/>}/>
              <Route path="/contact" component={(props: any) => <Contact {...props}/>}/>
              <Route path="/rights" component={(props: any) => <Rights {...props}/>}/>
              <Route path="/who_am_i" component={(props: any) => <Who_am_i {...props}/>}/>
              <Route path="/join" component={(props: any) => <Join {...props}/>}/>
              <Route path="/rule" component={(props: any) => <Rule {...props}/>}/>
              <Route path="/use" component={(props: any) => <Use {...props}/>}/>
              <Route path="/portal" component={(props: any) => <IpList {...props}/>}/>
              <Route path="/detail/:ipTypeNumber/:id" component={(props: any) => <Detail {...props}/>}/>
              <Route path="/login" component={(props: any) => <Login {...props}/>}/>
              <Route path="/register" component={(props: any) => <Register {...props}/>}/>
              <PrivateRoute path="/user" component={(props: any) => <User {...props}/>}/>
              <Route path="/authentication" component={(props: any) => <Authentication {...props}/>}/>
              <Route path="/update-password" component={(props: any) => <UpdatePassword {...props}/>}/>
              <PrivateRoute path="/update/:ipTypeNumber/:id" exact component={(props: any) => <Update {...props}/>}/>
              <PrivateRoute path="/update/:ipTypeNumber/:id/:iCheckStatus" exact component={(props: any) => <Update {...props}/>}/>
              <PrivateRoute path="/update" component={(props: any) => <Update {...props}/>}/>
              <PrivateRoute path="/download" component={(props: any) => <Download {...props}/>}/>
              <Route path="/ip-research" component={(props: any) => <IpResearch {...props}/>}/>
              <Route path="/ip-search/:key" component={(props: any) => <IpSearch {...props}/>}/>
              <Route path="/industry_detail/:ipid" component={(props: any) => <Industry_detail {...props}/>}/>
              <Route path="/solution" component={(props: any) => <Solution {...props}/>}/>
              <Route path="/contrast" component={(props: any) => <Contrast {...props}/>}/>
              <Route component={() => <NoMatch/>}/>
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    );
  }
}
