import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class AdminMenu extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      var treeviewMenu = $(".app-menu");

      // Toggle Sidebar
      $('[data-toggle="sidebar"]').click(function(event) {
        $(".app").toggleClass("sidenav-toggled");
        event.preventDefault();
      });

      // Activate sidebar treeview toggle
      $('[data-toggle="treeview"]').click(function(event) {
        if (
          !$(this)
            .parent()
            .hasClass("is-expanded")
        ) {
          treeviewMenu
            .find('[data-toggle="treeview"]')
            .parent()
            .removeClass("is-expanded");
        }
        $(this)
          .parent()
          .toggleClass("is-expanded");
        event.preventDefault();
      });

      // Set initial active toggle
      $('[data-toggle="treeview."].is-expanded')
        .parent()
        .toggleClass("is-expanded");

      //Activate bootstrip tooltips
      $('[data-toggle="tooltip"]').tooltip();
    }, 500);
  }

  render() {
    let { user, conferences } = this.props.system ? this.props.system : {};
    if (user == null)
      user = {
        firstname: "firstname",
        lastname: "lastname",
        image: "/img/avatar.jpg",
        role: ""
      };
    if (conferences == null) conferences = [];

    return [
      <div key={1} className="app-sidebar__overlay" data-toggle="sidebar" />,
      <aside key={2} className="app-sidebar">
        <div className="app-sidebar__user">
          <img
            className="app-sidebar__user-avatar"
            src={user.image}
            alt="Avatar"
            style={{ width: "48px", height: "auto" }}
          />
          <div>
            <p className="app-sidebar__user-name">
              {user.firstname + " " + user.lastname}
            </p>
            <p className="app-sidebar__user-designation">{user.role}</p>
          </div>
        </div>
        <ul className="app-menu">
          <li>
            <Link className="app-menu__item" to="/admin">
              <i className="app-menu__icon fa fa-dashboard" />
              <span className="app-menu__label">Dashboard</span>
            </Link>
          </li>
          <li className="treeview">
            <a className="app-menu__item" href="#" data-toggle="treeview">
              <i className="app-menu__icon fa fa-cog" />
              <span className="app-menu__label">Cấu hình</span>
              <i className="treeview-indicator fa fa-angle-right" />
            </a>
            <ul className="treeview-menu">
              <li>
                <Link className="treeview-item" to="/admin/settings">
                  <i className="icon fa fa-circle-o" />
                  Thông tin chung
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/menu">
                  <i className="icon fa fa-circle-o" />
                  Menu
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/email">
                  <i className="icon fa fa-circle-o" />
                  Email
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/staff">
                  <i className="icon fa fa-circle-o" />
                  Nhân sự
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/user">
                  <i className="icon fa fa-circle-o" />
                  Người dùng
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/subscriber">
                  <i className="icon fa fa-circle-o" />
                  Subscriber
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/contact">
                  <i className="icon fa fa-circle-o" />
                  Liên hệ
                </Link>
              </li>
            </ul>
          </li>

          <li className="treeview">
            <a className="app-menu__item" href="#" data-toggle="treeview">
              <i className="app-menu__icon fa fa-database" />
              <span className="app-menu__label">Tài nguyên</span>
              <i className="treeview-indicator fa fa-angle-right" />
            </a>
            <ul className="treeview-menu">
              <li>
                <Link className="treeview-item" to="/admin/carousel">
                  <i className="icon fa fa-circle-o" />
                  Tập hình ảnh
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/content">
                  <i className="icon fa fa-circle-o" />
                  Bài viết
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/slogan">
                  <i className="icon fa fa-circle-o" />
                  Slogan
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/video">
                  <i className="icon fa fa-circle-o" />
                  Video
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/statistic">
                  <i className="icon fa fa-circle-o" />
                  Thống kê
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/staff-group">
                  <i className="icon fa fa-circle-o" />
                  Nhóm nhân viên
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/division">
                  <i className="icon fa fa-circle-o" />
                  Các bộ phận khoa
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/testimony">
                  <i className="icon fa fa-circle-o" />
                  Nói về khoa
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/vySociu">
                  <i className="icon fa fa-circle-o" />
                  Nói về Vy Sociu
                </Link>
              </li>
            </ul>
          </li>
          <li className="treeview">
            <a className="app-menu__item" href="#" data-toggle="treeview">
              <i className="app-menu__icon fa fa-file" />
              <span className="app-menu__label">Tin tức</span>
              <i className="treeview-indicator fa fa-angle-right" />
            </a>
            <ul className="treeview-menu">
              <li>
                <Link className="treeview-item" to="/admin/news/category">
                  <i className="icon fa fa-circle-o" />
                  Danh mục
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/news/list">
                  <i className="icon fa fa-circle-o" />
                  Tin tức
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    ];
  }
}

const mapStateToProps = state => ({ system: state.system });
const mapActionsToProps = {};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(AdminMenu);
