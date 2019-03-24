import React from "react";
import { connect } from "react-redux";
import {
  getAllTestimonys,
  createTestimony,
  deleteTestimony
} from "../redux/testimony.jsx";
import { Link } from "react-router-dom";

class ItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
    this.save = this.save.bind(this);

    this.modal = React.createRef();
    this.btnSave = React.createRef();
  }

  componentDidMount() {
    $(document).ready(() => {
      setTimeout(
        () =>
          $(this.modal.current).on("shown.bs.modal", () =>
            $("#testimonyName").focus()
          ),
        250
      );
    });
  }

  show() {
    $("#testimonyName").val("");
    $(this.modal.current).modal("show");
  }

  save(event) {
    const testimonyName = $("#testimonyName")
      .val()
      .trim();
    if (testimonyName == "") {
      T.notify("Tên nhóm testimony bị trống!", "danger");
      $("#testimonyName").focus();
    } else {
      this.props.createTestimony(testimonyName, data => {
        if (data.error == undefined || data.error == null) {
          $(this.modal.current).modal("hide");
          if (data.testimony) {
            this.props.showTestimony(data.testimony);
          }
        }
      });
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" ref={this.modal}>
        <form className="modal-dialog" role="document" onSubmit={this.save}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thông tin nhóm testimony</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="testimonyName">Tên nhóm testimony</label>
                <input
                  className="form-control"
                  id="testimonyName"
                  type="text"
                  placeholder="Tên nhóm testimony"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary"
                ref={this.btnSave}
                onClick={this.save}
              >
                Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class TestimonyPage extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();

    this.create = this.create.bind(this);
    this.show = this.show.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    $(document).ready(() => {
      T.selectMenu(2, 7);
      this.props.getAllTestimonys();
    });
  }

  create(e) {
    this.modal.current.show();
    e.preventDefault();
  }

  show(item) {
    this.props.history.push("/admin/testimony/edit/" + item._id);
  }

  delete(e, item) {
    T.confirm(
      "Xóa nhóm testimony",
      "Bạn có chắc bạn muốn xóa nhóm testimony này?",
      true,
      isConfirm => isConfirm && this.props.deleteTestimony(item._id)
    );
    e.preventDefault();
  }

  render() {
    let table = null;
    if (
      this.props.testimony &&
      this.props.testimony.list &&
      this.props.testimony.list.length > 0
    ) {
      table = (
        <table className="table table-hover table-bordered" ref={this.table}>
          <thead>
            <tr>
              <th style={{ width: "100%" }}>Tên nhóm</th>
              <th style={{ width: "auto", whiteSpace: "nowrap" }}>Số lượng</th>
              <th style={{ width: "auto", textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {this.props.testimony.list.map((testimony, index) => (
              <tr key={index}>
                <td>
                  <Link
                    to={"/admin/testimony/edit/" + testimony._id}
                    data-id={testimony._id}
                  >
                    {testimony.title}
                  </Link>
                </td>
                <td style={{ textAlign: "right" }}>{testimony.items.length}</td>
                <td className="btn-group">
                  <Link
                    to={"/admin/testimony/edit/" + testimony._id}
                    data-id={testimony._id}
                    className="btn btn-primary"
                  >
                    <i className="fa fa-lg fa-edit" />
                  </Link>
                  <a
                    className="btn btn-danger"
                    href="#"
                    onClick={e => this.delete(e, testimony)}
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
      table = <p>Không có nhóm testimony!</p>;
    }

    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-assistive-listening-systems" /> Nói về khoa
            </h1>
            <p />
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin">
                <i className="fa fa-home fa-lg" />
              </Link>
            </li>
            <li className="breadcrumb-item">Nói về khoa</li>
          </ul>
        </div>

        <div className="row tile">{table}</div>
        <ItemModal
          createTestimony={this.props.createTestimony}
          showTestimony={this.show}
          ref={this.modal}
        />
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

const mapStateToProps = state => ({ testimony: state.testimony });
const mapActionsToProps = {
  getAllTestimonys,
  createTestimony,
  deleteTestimony
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(TestimonyPage);
