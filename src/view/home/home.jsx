import './home.scss';
import T from '../common/js/common';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import system, { getSystemState, register, login, forgotPassword, logout } from '../redux/system.jsx';
import menu from '../redux/menu.jsx'
import user from '../redux/user.jsx'
import carousel from '../redux/carousel.jsx';
import content from '../redux/content.jsx';
import category from '../redux/category.jsx';
import division from '../redux/division.jsx';
import slogan from '../redux/slogan.jsx';
import statistic from '../redux/statistic.jsx';
import testimony from '../redux/testimony.jsx';
import staffGroup from '../redux/staffGroup.jsx'
import video from '../redux/video.jsx';
import news from '../redux/news.jsx';
import subscriber from '../redux/subscriber.jsx';
import contact from '../redux/contact.jsx';

import Loadable from 'react-loadable';
import Loading from '../common/Loading.jsx';
import Loader from './Loader.jsx';
import HomeMenu from './HomeMenu.jsx';
import Footer from './Footer.jsx';
import LoginModal from './LoginModal.jsx';

// Initialize Redux ----------------------------------------------------------------------------------------------------
const allReducers = combineReducers({
    system, menu, user,
    carousel, content, division, slogan, statistic, testimony, staffGroup, video, subscriber, contact,
    category, news
});
const store = createStore(allReducers, {}, composeWithDevTools(applyMiddleware(thunk)));
store.dispatch(getSystemState());
window.T = T;

// Router -------------------------------------------------------------------------------------------------------------
class Router extends React.Component {
    constructor(props) {
        super(props);
        this.loader = React.createRef();
        this.loginModal = React.createRef();
        this.showLoginModal = this.showLoginModal.bind(this);

        // function Loading1(props) {
        //     if (!this.loader.current.isShown()) this.loader.current.show();
        //     return <div>...</div>;
        // }

        this.routeData = [
            { path: '/registered', component: Loadable({ loading: Loading, loader: () => import('../common/MessagePage.jsx') }) },
            { path: '/active-user/:userId', component: Loadable({ loading: Loading, loader: () => import('../common/MessagePage.jsx') }) },
            { path: '/forgot-password/:userId/:userToken', component: Loadable({ loading: Loading, loader: () => import('./ForgotPasswordPage.jsx') }) },
            { path: '/news/item/:newsId', component: Loadable({ loading: Loader, loader: () => import('./NewsDetail.jsx') }) },
            { path: '/tintuc/:link', component: Loadable({ loading: Loader, loader: () => import('./NewsDetail.jsx') }) },
            { path: '/division/item/:divisionId', component: Loadable({ loading: Loading, loader: () => import('./DivisionDetail.jsx') }) },
        ];
    }

    componentDidMount() {
        const done = () => $(this.loader.current).length > 0 ? this.loader.current.isShown() && this.loader.current.hide() : setTimeout(done, 200);
        $(document).ready(done);
    }

    showLoginModal(e) {
        e.preventDefault();
        if (this.props.system && this.props.system.user) {
            this.props.logout();
        } else {
            this.loginModal.current.showLogin();
        }
    }

    render() {
        // Update menu routes
        const pathes = [],
            routes = this.routeData.map((route, index) => {
                pathes.push(route.path);
                return <Route key={index} {...route} />;
            });
        let currentRouteData = this.routeData.slice(),
            key = routes.length;
        const solveMenus = (menus, level) => {
            for (let i = 0; i < menus.length; i++) {
                const item = menus[i],
                    link = item.link ? item.link.toLowerCase() : '/',
                    path = pathes.find(element => element == item.link);

                if (!link.startsWith('http://') && !link.startsWith('https://') && path == undefined) {
                    key++;
                    const newRouteData = { path: item.link };
                    if (level == 0) newRouteData.menuIndex = i;
                    currentRouteData.push(newRouteData);

                    const menuPage = Loadable({ loading: Loading, loader: () => import('./MenuPage.jsx') });
                    routes.push(<Route key={key} path={item.link} component={menuPage} />);
                }

                if (item.submenus) {
                    solveMenus(item.submenus, level + 1);
                }
            }
        }
        if (this.props.system && this.props.system.menus) {
            solveMenus(this.props.system.menus, 0);
        }

        for (let i = 0, pathname = window.location.pathname; i < currentRouteData.length; i++) {
            const route = T.routeMatcher(currentRouteData[i].path);
            if (route.parse(pathname)) {
                let userButtons = [];
                if (this.props.system && this.props.system.user) {
                    if (this.props.system.user.role == 'admin') {
                        userButtons.push(<a style={{ textDecorationLine: 'none', color: '#fff' }} href='/admin' key={0}>Admin</a>);
                        userButtons.push(' | ');
                    }
                    userButtons.push(<a style={{ textDecorationLine: 'none', color: '#f00' }} href='#' key={1} onClick={this.showLoginModal}>Đăng xuất</a>);
                } else {
                    userButtons.push(<a style={{ textDecorationLine: 'none' }} href='#' key={2} onClick={this.showLoginModal}>Đăng nhập</a>);
                }

                return [
                    <HomeMenu key={0} showLoginModal={this.showLoginModal} />,
                    <Switch key={1}>{routes}</Switch>,
                    <Footer key={2} />,
                    <LoginModal key={3} ref={this.loginModal} register={this.props.register} login={this.props.login} forgotPassword={this.props.forgotPassword} pushHistory={url => this.props.history.push(url)} />,
                    <Loader key={5} ref={this.loader} />,
                ];
            }
        }

        return (
            <main className='app'>
                <Route component={Loadable({ loading: Loading, loader: () => import('../common/MessagePage.jsx') })} />
            </main >
        );
    }
}

// Main DOM render -----------------------------------------------------------------------------------------------------
class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Router system={this.props.system} register={this.props.register} login={this.props.login} forgotPassword={this.props.forgotPassword} logout={this.props.logout} />
            </BrowserRouter >
        )
    }
}

const Main = connect(state => ({ system: state.system }), { register, login, forgotPassword, logout })(App);
ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('app'));