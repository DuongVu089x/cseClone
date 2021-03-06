import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getUnreadContacts, getContact } from "../redux/contact.jsx";

class AdminHeader extends React.Component {
  constructor(props) {
    super(props);
    this.showContact = this.showContact.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.props.getUnreadContacts();
  }

  showContact(e, contactId) {
    e.preventDefault();
    this.props.getContact(contactId, contact =>
      this.props.showContactModal(contact)
    );
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    let list =
      this.props.contact &&
      this.props.contact.unreads &&
      this.props.contact.unreads.length > 0
        ? this.props.contact.unreads.map((item, index) => (
            <li key={index}>
              <a
                className="app-notification__item"
                href="#"
                onClick={e => this.showContact(e, item._id)}
              >
                <span className="app-notification__icon">
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x text-primary" />
                    <i className="fa fa-envelope fa-stack-1x fa-inverse" />
                  </span>
                </span>
                <div>
                  <p
                    className="app-notification__message"
                    style={{ fontWeight: "bold" }}
                  >
                    {item.subject}
                  </p>
                  <p className="app-notification__meta">
                    {new Date(item.createdDate).getText()}
                  </p>
                </div>
              </a>
            </li>
          ))
        : "";
    let notificationTitle =
      list.length > 0
        ? "Bạn có " + list.length + " liên hệ mới"
        : "Bạn không có liên hệ mới";

    return (
      <header key={0} className="app-header">
        <Link className="app-header__logo" to="/admin">
          CSE
        </Link>
        <a
          className="app-sidebar__toggle"
          href="#"
          data-toggle="sidebar"
          aria-label="Hide Sidebar"
        />
        <ul className="app-nav">
          {/* <li className='app-search'>
                        <input className='app-search__input' type='search' placeholder='Search' />
                        <button className='app-search__button'>
                            <i className='fa fa-search' />
                        </button>
                    </li> */}
          <li className="dropdown">
            <a
              className="app-nav__item"
              href="#"
              data-toggle="dropdown"
              aria-label="Show notifications"
            >
              <i className="fa fa-bell-o fa-lg" />
            </a>
            <ul className="app-notification dropdown-menu dropdown-menu-right">
              <li className="app-notification__title">{notificationTitle}</li>
              <div className="app-notification__content">{list}</div>
              <li className="app-notification__footer">
                <Link to="/admin/contact">Đến trang Liên hệ</Link>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <a
              className="app-nav__item"
              href="#"
              data-toggle="dropdown"
              aria-label="Open Profile Menu"
            >
              <i className="fa fa-user fa-lg" />
            </a>
            <ul className="dropdown-menu settings-menu dropdown-menu-right">
              <li>
                <Link className="dropdown-item" to="/admin/profile">
                  <i className="fa fa-user fa-lg" /> Thông tin cá nhân
                </Link>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={this.logout}>
                  <i className="fa fa-sign-out fa-lg" /> Đăng xuất
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </header>
    );
  }
}

const mapStateToProps = state => ({ contact: state.contact });
const mapActionsToProps = { getUnreadContacts, getContact };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(AdminHeader);
