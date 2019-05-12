import "../common/scss/bootstrap/bootstrap.scss";
import "./admin.scss";

import T from "../common/js/common";
import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { connect, Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import system, {
  getSystemState,
  updateSystemState,
  logout
} from "../redux/system.jsx";
import menu from "../redux/menu.jsx";
import staff, { changeStaff } from "../redux/staff.jsx";
import user, { changeUser } from "../redux/user.jsx";
import carousel, { changeCarouselItem } from "../redux/carousel.jsx";
import content from "../redux/content.jsx";
import category, { changeCategory } from "../redux/category.jsx";
import division from "../redux/division.jsx";
import slogan from "../redux/slogan.jsx";
import staffGroup from "../redux/staffGroup.jsx";
import video, { changeVideo } from "../redux/video.jsx";
import news from "../redux/news.jsx";
import contact from "../redux/contact.jsx";
import vySociu from "../redux/vySociu.jsx";
import demo2 from "../redux/demo2.jsx";

import statistic from "../redux/statistic.jsx";
import testimony from "../redux/testimony.jsx";
import subscriber from "../redux/subscriber.jsx";

import Loadable from "react-loadable";
import Loading from "../common/Loading.jsx";
import AdminHeader from "./AdminHeader.jsx";
import AdminMenu from "./AdminMenu.jsx";
import ContactModal from "./ContactModal.jsx";

// Initialize Redux ----------------------------------------------------------------------------------------------------
const allReducers = combineReducers({
  system,
  menu,
  user,
  staff,
  staffGroup,
  carousel,
  content,
  division,
  slogan,
  video,
  statistic,
  testimony,
  subscriber,
  contact,
  category,
  news,
  vySociu,
  demo2
});
const store = createStore(
  allReducers,
  {},
  composeWithDevTools(applyMiddleware(thunk))
);
store.dispatch(getSystemState());
window.T = T;

// Router -------------------------------------------------------------------------------------------------------------
class Router extends React.Component {
  constructor(props) {
    super(props);
    this.contactModal = React.createRef();
    this.showContactModal = this.showContactModal.bind(this);

    const ContactPageTag = Loadable({
      loading: Loading,
      loader: () => import("./ContactPage.jsx")
    });
    this.routeData = [
      {
        path: "/admin/settings",
        component: Loadable({
          loading: Loading,
          loader: () => import("./SettingsPage.jsx")
        })
      },
      {
        path: "/admin/profile",
        component: Loadable({
          loading: Loading,
          loader: () => import("./ProfilePage.jsx")
        })
      },
      {
        path: "/admin/menu/edit/:menuId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./MenuEditPage.jsx")
        })
      },
      {
        path: "/admin/menu",
        component: Loadable({
          loading: Loading,
          loader: () => import("./MenuPage.jsx")
        })
      },
      {
        path: "/admin/email",
        component: Loadable({
          loading: Loading,
          loader: () => import("./EmailPage.jsx")
        })
      },
      {
        path: "/admin/staff",
        component: Loadable({
          loading: Loading,
          loader: () => import("./StaffPage.jsx")
        })
      },
      {
        path: "/admin/user",
        component: Loadable({
          loading: Loading,
          loader: () => import("./UserPage.jsx")
        })
      },
      {
        path: "/admin/subscriber",
        component: Loadable({
          loading: Loading,
          loader: () => import("./SubscriberPage.jsx")
        })
      },
      {
        path: "/admin/contact",
        component: () => (
          <ContactPageTag showContactModal={this.showContactModal} />
        )
      },
      {
        path: "/admin/carousel/edit/:carouselId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./CarouselEditPage.jsx")
        })
      },
      {
        path: "/admin/carousel",
        component: Loadable({
          loading: Loading,
          loader: () => import("./CarouselPage.jsx")
        })
      },
      {
        path: "/admin/content/edit/:contentId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./ContentEditPage.jsx")
        })
      },
      {
        path: "/admin/content",
        component: Loadable({
          loading: Loading,
          loader: () => import("./ContentPage.jsx")
        })
      },
      {
        path: "/admin/slogan/edit/:sloganId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./SloganEditPage.jsx")
        })
      },
      {
        path: "/admin/slogan",
        component: Loadable({
          loading: Loading,
          loader: () => import("./SloganPage.jsx")
        })
      },
      {
        path: "/admin/video",
        component: Loadable({
          loading: Loading,
          loader: () => import("./VideoPage.jsx")
        })
      },
      {
        path: "/admin/statistic/edit/:statisticId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./StatisticEditPage.jsx")
        })
      },
      {
        path: "/admin/statistic",
        component: Loadable({
          loading: Loading,
          loader: () => import("./StatisticPage.jsx")
        })
      },
      {
        path: "/admin/staff-group/edit/:staffGroupId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./StaffGroupEditPage.jsx")
        })
      },
      {
        path: "/admin/staff-group",
        component: Loadable({
          loading: Loading,
          loader: () => import("./StaffGroupPage.jsx")
        })
      },
      {
        path: "/admin/division",
        component: Loadable({
          loading: Loading,
          loader: () => import("./DivisionPage.jsx")
        })
      },
      {
        path: "/admin/testimony/edit/:testimonyId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./TestimonyEditPage.jsx")
        })
      },
      {
        path: "/admin/testimony",
        component: Loadable({
          loading: Loading,
          loader: () => import("./TestimonyPage.jsx")
        })
      },
      {
        path: "/admin/news/category",
        component: Loadable({
          loading: Loading,
          loader: () => import("./NewsCategoryPage.jsx")
        })
      },
      {
        path: "/admin/news/list",
        component: Loadable({
          loading: Loading,
          loader: () => import("./NewsPage.jsx")
        })
      },
      {
        path: "/admin/news/edit/:newsId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./NewsEditPage.jsx")
        })
      },
      {
        path: "/admin/vySociu/edit/:vySociuId",
        component: Loadable({
          loading: Loading,
          loader: () => import("./VySociuEditPage.jsx")
        })
      },
      {
        path: "/admin/vySociu",
        component: Loadable({
          loading: Loading,
          loader: () => import("./VySociuPage.jsx")
        })
      },
      {
        path: "/admin/demo2/edit/:demo2Id",
        component: Loadable({
          loading: Loading,
          loader: () => import("./demo2EditPage.jsx")
        })
      },
      {
        path: "/admin/demo2",
        component: Loadable({
          loading: Loading,
          loader: () => import("./demo2Page.jsx")
        })
      },
      {
        path: "/admin",
        component: Loadable({
          loading: Loading,
          loader: () => import("./DashboardPage.jsx")
        })
      }
    ];
    this.routes = this.routeData.map((route, index) => (
      <Route key={index} {...route} />
    ));
  }

  showContactModal(contact) {
    this.contactModal.current.show(contact);
  }

  render() {
    for (
      let i = 0, pathname = window.location.pathname;
      i < this.routeData.length;
      i++
    ) {
      const route = T.routeMatcher(this.routeData[i].path);
      if (route.parse(pathname)) {
        return (
          <div className="app sidebar-mini rtl">
            <AdminHeader
              logout={this.props.logout}
              showContactModal={this.showContactModal}
            />
            <AdminMenu />
            <div className="site-content">
              <Switch>{this.routes}</Switch>
            </div>
            <ContactModal ref={this.contactModal} />
          </div>
        );
      }
    }

    return (
      <main className="app">
        <Route
          component={Loadable({
            loading: Loading,
            loader: () => import("../common/MessagePage.jsx")
          })}
        />
      </main>
    );
  }
}

// Main DOM render -----------------------------------------------------------------------------------------------------
class App extends React.Component {
  componentDidMount() {
    // console.log(store.getState());

    T.socket.on("newsCategory-changed", item =>
      store.dispatch(changeCategory(item))
    );

    T.socket.on("carouselItem-changed", item =>
      store.dispatch(changeCarouselItem(item))
    );
    T.socket.on("staff-changed", item => store.dispatch(changeStaff(item)));
    T.socket.on("video-changed", item => store.dispatch(changeVideo(item)));

    T.socket.on("contact-added", item => store.dispatch(addContact(item)));
    T.socket.on("contact-changed", item => store.dispatch(changeContact(item)));

    T.socket.on("user-changed", item => {
      if (
        this.props.system &&
        this.props.system.user &&
        this.props.system.user._id == item._id
      ) {
        store.dispatch(updateSystemState({ user: item }));
      }
      store.dispatch(changeUser(item));
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Router system={this.props.system} logout={this.props.logout} />
      </BrowserRouter>
    );
  }
}

const Main = connect(
  state => ({ system: state.system }),
  { logout }
)(App);
ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("app")
);
