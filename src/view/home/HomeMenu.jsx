import React from 'react';
import { connect } from 'react-redux';
import { register, login, logout, forgotPassword } from '../redux/system.jsx';
import { Link } from 'react-router-dom';

class HomeMenu extends React.Component {
    constructor(props) {
        super(props);
        this.nav = React.createRef();

        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const done = () => {
            if ($.fn.classyNav && this.nav.current != null && $(this.nav.current).length > 0 && this.props.system && this.props.system.menus) {
                $(this.nav.current).classyNav();
                $('.clever-main-menu').sticky({ topSpacing: 0 });
            } else {
                setTimeout(done, 100);
            }
        };
        $(document).ready(done);

        $(window).scroll(() => {
            // let $w = $(window),
            //     st = $w.scrollTop(),
            //     navbar = $('.ftco_navbar'),
            //     sd = $('.js-scroll-wrap');

            // if (st > 150) {
            //     if (!navbar.hasClass('scrolled')) {
            //         navbar.addClass('scrolled');
            //     }
            // }
            // if (st < 150) {
            //     if (navbar.hasClass('scrolled')) {
            //         navbar.removeClass('scrolled sleep');
            //     }
            // }
            // if (st > 350) {
            //     if (!navbar.hasClass('awake')) {
            //         navbar.addClass('awake');
            //     }

            //     if (sd.length > 0) {
            //         sd.addClass('sleep');
            //     }
            // }
            // if (st < 350) {
            //     if (navbar.hasClass('awake')) {
            //         navbar.removeClass('awake');
            //         navbar.addClass('sleep');
            //     }
            //     if (sd.length > 0) {
            //         sd.removeClass('sleep');
            //     }
            // }

            // // navigation
            // $(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on('click', function (e) {
            //     e.preventDefault();

            //     let hash = this.hash,
            //         navToggler = $('.navbar-toggler');
            //     $('html, body').animate({
            //         scrollTop: $(hash).offset().top
            //     }, 700, 'easeInOutExpo', () => window.location.hash = hash);

            //     if (navToggler.is(':visible')) {
            //         navToggler.click();
            //     }
            // });
            // $('body').on('activate.bs.scrollspy', () => console.log('nice'));

            // $('nav .dropdown').hover(function () {
            //     var $this = $(this);
            //     $this.addClass('show');
            //     $this.find('> a').attr('aria-expanded', true);
            //     $this.find('.dropdown-menu').addClass('show');
            // }, function () {
            //     var $this = $(this);
            //     $this.removeClass('show');
            //     $this.find('> a').attr('aria-expanded', false);
            //     $this.find('.dropdown-menu').removeClass('show');
            // });
        });
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        let menus = [];
        if (this.props.system && this.props.system.menus) {
            menus = this.props.system.menus.map((item, index) => {
                let link = item.link ? item.link.toLowerCase().trim() : '/',
                    isExternalLink = link.startsWith('http://') || link.startsWith('https://');
                link = item.link ? item.link : '#';

                return (item.submenus && item.submenus.length > 0) ? (
                    <li key={index}>
                        {isExternalLink ? <a href={link} target='_blank'>{item.title}</a> : <Link to={link}>{item.title}</Link>}
                        <ul className='dropdown'>{
                            item.submenus.map((subMenu, subIndex) => {
                                const link = subMenu.link ? subMenu.link.toLowerCase().trim() : '/';
                                if (subMenu.title == '-') {
                                    return <li key={subIndex}>---</li>;
                                } else if (link.startsWith('http://') || link.startsWith('https://')) {
                                    return <a key={subIndex} href={subMenu.link}>{subMenu.title}</a>;
                                } else {
                                    return <Link key={subIndex} to={subMenu.link}>{subMenu.title}</Link>;
                                }
                            })}
                        </ul>
                    </li>
                ) : <li key={index}>{isExternalLink ? <a href={link} target='_blank'>{item.title}</a> :
                    (link.startsWith('#') ? <a href={link}>{item.title}</a> : <Link to={link} >{item.title}</Link>)}</li>;
            });
        }

        const { logo, user } = this.props.system ? this.props.system : {};
        return (
            <header className='header-area'>
                <div className='clever-main-menu'>
                    <div className='classy-nav-container breakpoint-off'>
                        <nav className='classy-navbar justify-content-between' ref={this.nav} id="cleverNav">

                            <Link className='navbar-brand' to='/' style={{ display: 'flex' }}>
                                {logo ? <img src={logo} style={{ height: '36px', width: 'auto' }} /> : ''}&nbsp;
                                <h4>CSE</h4>
                            </Link>

                            <div className='classy-navbar-toggler'>
                                <span className='navbarToggler'><span /><span /><span /></span>
                            </div>

                            <div className='classy-menu'>
                                <div className='classycloseIcon'>
                                    <div className='cross-wrap'><span className='top' /><span className='bottom' /></div>
                                </div>
                                <div className='classynav'>
                                    <ul>
                                        {menus}
                                        {/* <li><a href='index.html'>Home</a></li>
                                        <li><a href='#'>Pages</a>
                                            <ul className='dropdown'>
                                                <li><a href='index.html'>Home</a></li>
                                                <li><a href='courses.html'>Courses</a></li>
                                                <li><a href='single-course.html'>Single Courses</a></li>
                                                <li><a href='instructors.html'>Instructors</a></li>
                                                <li><a href='blog.html'>Blog</a></li>
                                                <li><a href='blog-details.html'>Single Blog</a></li>
                                                <li><a href='regular-page.html'>Regular Page</a></li>
                                                <li><a href='contact.html'>Contact</a></li>
                                            </ul>
                                        </li>
                                        <li><a href='courses.html'>Courses</a></li>
                                        <li><a href='instructors.html'>Instructors</a></li>
                                        <li><a href='blog.html'>Blog</a></li>
                                        <li><a href='contact.html'>Contact</a></li> */}
                                    </ul>

                                    <div className='register-login-area'>
                                        {user ? [
                                            <a key={0} href={'/' + user.role.toLowerCase()} className='text-primary' style={{ textTransform: 'capitalize', fontWeight: 'normal' }}>{user.role}</a>,
                                            <a key={1} href='#' className='text-danger' onClick={this.logout}><i className='fa fa-power-off' /></a>
                                        ] : <a href='#' onClick={this.props.showLoginModal}><i className='fa fa-user' /></a>}
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({ system: state.system });
const mapActionsToProps = { register, login, logout, forgotPassword };
export default connect(mapStateToProps, mapActionsToProps)(HomeMenu);