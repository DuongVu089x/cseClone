import React from "react";
import { connect } from "react-redux";
import Pagination from "../common/Pagination.jsx";
import { getAll, createDemo2 } from "../redux/demo2.jsx";
import { Link } from "react-router-dom";

class demo2Page extends React.Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    $(document).ready(() => {
      T.selectMenu(2, 9);
      this.getData();
    });
  }

  getData() {
    this.props.getAll();
    // this.props.createDemo2({
    //   name: "demo2",
    //   age: 12
    // });
  }

  render() {
    let table = null;
    if (this.props.demo2 && this.props.demo2.length > 0) {
      table = (
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Id</th>
              <th style={{ width: "40%" }}>Tên</th>
              <th style={{ width: "40%" }}>Tuổi</th>
              <th style={{ width: "auto", textAlign: "center" }} nowrap="true">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.demo2.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td className="btn-group">
                  <Link
                    to={"/admin/demo2/edit/" + item._id}
                    data-id={item._id}
                    className="btn btn-primary"
                  >
                    <i className="fa fa-lg fa-edit" />
                  </Link>
                  <a
                    className="btn btn-danger"
                    href="#"
                    onClick={e => this.delete(e, item)}
                  >
                    <i className="fa fa-lg fa-trash" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      table = <p>Không có danh mục!</p>;
    }
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-image" /> Bài viết
            </h1>
            <p />
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <Link to="/admin">
              <i className="fa fa-home fa-lg" />
            </Link>
            &nbsp;/&nbsp;Bài viết
          </ul>
        </div>
        <div className="row tile">{table}</div>
        <button
          type="button"
          className="btn btn-primary btn-circle"
          style={{ position: "fixed", right: "10px", bottom: "10px" }}
          onClick={this.create}
        >
          <i className="fa fa-lg fa-plus" />
        </button>
      </main>
    );
  }
}

const mapStateToProps = state => ({ demo2: state.demo2 });
const mapActionsToProps = { getAll, createDemo2 };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(demo2Page);
