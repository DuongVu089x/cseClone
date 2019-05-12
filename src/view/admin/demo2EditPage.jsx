import React from "react";
import { connect } from "react-redux";
import { getdemo2 } from "../redux/demo2.jsx";
import { Link } from "react-router-dom";

class demo2EditPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(document).ready(() => {
      T.selectMenu(2, 9);
    });
    const route = T.routeMatcher("/admin/demo2/edit/:demo2Id"),
      params = route.parse(window.location.pathname);

    this.props.getDemo2(params.demo2Id, data => {
      if (data.error) {
        T.notify("Lấy thông tin vySociu bị lỗi!", "danger");
        this.props.history.push("/admin/demo2");
      } else if (data.item) {
        //   $("#name")
        //     .val(data.item.name)
        //     .focus();
      } else {
        this.props.history.push("/admin/demo2");
      }
    });
  }
  render() {
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-yelp" /> VySociu: Chỉnh sửa
            </h1>
            <p dangerouslySetInnerHTML={{ __html: "title" }} />
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <Link to="/admin">
              <i className="fa fa-home fa-lg" />
            </Link>
            &nbsp;/&nbsp;
            <Link to="/admin/vySociu">VySociu</Link>
            &nbsp;/&nbsp;Chỉnh sửa
          </ul>
        </div>
      </main>
    );
  }
}

const mapStateToProps = state => ({ demo2: state.demo2 });
const mapActionsToProps = { getdemo2 };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(demo2EditPage);
