import home from "@pages/home/store";
import login from "@pages/login/store";
import ip_list from "@pages/ip_list/store";
import user from "@pages/user/store";
import contract from "@pages/contrast/store";
import register from "@pages/register/store";
import authentication from "@pages/authentication/store";
import upPassword from "@pages/upPassword/store";
import update from "@pages/update/store";
import industry from "@pages/ip_research/store";
import nav_store from "@components/nav_store";
import detail from "@pages/detail/store";
import ipSearch from "@pages/ip_search/store";
import industry_detail from "@pages/industry_detail/store";
import company from "@pages/company/store";

export default {
  // pages store
  home,
  login,
  register,
  authentication,
  ip_list,
  user,
  industry,
  update,
  upPassword,
  detail,
  ipSearch,
  industry_detail,
  // components store
  nav_store,
  contract,
  company,
};
