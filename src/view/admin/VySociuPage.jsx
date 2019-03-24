import React from "react";
import { connect } from "react-redux";
import { getAll, deletevySociu, createVySociu } from "../redux/vySociu.jsx";
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
            $("#VySociuName").focus()
          ),
        250
      );
    });
  }

  show() {
    $("#VySociuName").val("");
    $("#VySociuAge").val("");
    $(this.modal.current).modal("show");
  }

  save(event) {
    const VySociuName = $("#VySociuName")
      .val()
      .trim();

    const VySociuAge = $("#VySociuAge")
      .val()
      .trim();

    console.log(this.props);
    if (VySociuName == "") {
      T.notify("Tên nhóm VySociu bị trống!", "danger");
      $("#VySociuName").focus();
    } else if (VySociuAge == "") {
      T.notify("Tuổi VySociu bị trống!", "danger");
      $("#VySociuAge").focus();
    } else {
      this.props.createVySociu(
        {
          name: VySociuName,
          age: VySociuAge
        },
        data => {
          if (data.error == undefined || data.error == null) {
            $(this.modal.current).modal("hide");
            if (data.VySociu) {
              this.props.showVySociu(data.VySociu);
            }
          }
        }
      );
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" ref={this.modal}>
        <form className="modal-dialog" role="document" onSubmit={this.save}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thông tin VySociu</h5>
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
                <label htmlFor="VySociuName">Tên VySociu</label>
                <input
                  className="form-control"
                  id="VySociuName"
                  type="text"
                  placeholder="Tên VySociu"
                />
              </div>
              <div className="form-group">
                <label htmlFor="VySociuAge">Tuổi VySociu</label>
                <input
                  className="form-control"
                  id="VySociuAge"
                  type="number"
                  placeholder="Tuổi VySociu"
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

class VySociuPage extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();

    this.create = this.create.bind(this);
    this.getData = this.getData.bind(this);
    this.show = this.show.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    $(document).ready(() => {
      T.selectMenu(2, 8);
      this.getData();
    });
  }

  create(e) {
    console.log(this.props);
    this.modal.current.show();
    e.preventDefault();
  }

  getData() {
    this.props.getAll();
  }

  show(item) {
    this.props.history.push("/admin/vySociu/edit/" + item._id);
  }

  delete(e, item) {
    T.confirm(
      "Xóa nhóm slogan",
      "Bạn có chắc bạn muốn xóa nhóm slogan này?",
      true,
      isConfirm => {
        isConfirm && this.props.deletevySociu(item._id);
      }
    );
    e.preventDefault();
  }

  render() {
    let table = null;
    if (this.props.vySociu && this.props.vySociu.length > 0) {
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
            {this.props.vySociu.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td className="btn-group">
                  <Link
                    to={"/admin/vySociu/edit/" + item._id}
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
              <i className="fa fa-file" /> Vy Sociu
            </h1>
            <p />
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">Tin tức: Vy Sociu</li>
          </ul>
        </div>
        <div className="row tile">{table}</div>
        <ItemModal
          createVySociu={this.props.createVySociu}
          showVySociu={this.show}
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
const mapStateToProps = state => ({ vySociu: state.vySociu });
const mapActionsToProps = { getAll, deletevySociu, createVySociu };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(VySociuPage);
