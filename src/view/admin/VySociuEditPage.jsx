import React from "react";
import { connect } from "react-redux";
import { getVySociuItem } from "../redux/vySociu.jsx";
import { Link } from "react-router-dom";

class VySociuEditPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(document).ready(() => {
      T.selectMenu(2, 8);

      const route = T.routeMatcher("/admin/vySociu/edit/:vySociuId"),
        params = route.parse(window.location.pathname);

      this.props.getVySociuItem(params.vySociuId, data => {
        if (data.error) {
          T.notify("Lấy thông tin vySociu bị lỗi!", "danger");
          this.props.history.push("/admin/vySociu");
        } else if (data.item) {
          $("#name")
            .val(data.item.name)
            .focus();
        } else {
          this.props.history.push("/admin/vySociu");
        }
      });
    });
  }
  render() {
    const currentVySociu = this.props.vySociu.item
      ? this.props.vySociu.item
      : {
          ageData: "0",
          name: ""
        };
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
        <div className="row">
          <div className="tile col-md-12">
            <div className="form-body">
              <div className="form-group">
                <label className="control-label">Tên</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Tên"
                  id="name"
                  defaultValue={currentVySociu.name}
                />
              </div>
              <div className="form-group">
                <label className="control-label">Tuổi</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Tuổi"
                  id="ageData"
                  defaultValue={currentVySociu.age}
                />
              </div>
            </div>
            <div className="tile-footer">
              <div className="row">
                <div className="col-md-12" style={{ textAlign: "right" }}>
                  &nbsp;
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={this.save}
                  >
                    <i className="fa fa-fw fa-lg fa-save" />
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
const mapStateToProps = state => ({ vySociu: state.vySociu });
const mapActionsToProps = { getVySociuItem };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(VySociuEditPage);
