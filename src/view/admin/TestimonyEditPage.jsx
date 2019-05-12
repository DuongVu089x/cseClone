import React from "react";
import { connect } from "react-redux";
import {
  getTestimonyItem,
  updateTestimony,
  addTestimonyIntoGroup,
  updateTestimonyInGroup,
  removeTestimonyFromGroup,
  swapTestimonyInGroup
} from "../redux/testimony.jsx";
import { Link } from "react-router-dom";
import Editor from "../common/CkEditor4.jsx";
import ImageBox from "../common/ImageBox.jsx";

class ItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imageChanged = this.imageChanged.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.save = this.save.bind(this);

    this.modal = React.createRef();
    this.imageBox = React.createRef();
    this.editor = React.createRef();
    this.btnSave = React.createRef();
  }

  componentDidMount() {
    $(document).ready(() => {
      setTimeout(() => {
        $(this.modal.current).on("shown.bs.modal", () =>
          $("#ttmFullname").focus()
        );
      }, 250);
    });
  }

  imageChanged(data) {
    this.setState({ image: data.url });
  }

  show(selectedItem, index) {
    const { fullname, jobPosition, image, content } = selectedItem
      ? selectedItem
      : { fullname: "", jobPosition: "", image: "", content: "" };
    $("#ttmFullname").val(fullname);
    $("#ttmJobPosition").val(jobPosition);
    this.editor.current.html(content);
    $(this.btnSave.current)
      .data("isNewMember", selectedItem == null)
      .data("index", index);

    this.imageBox.current.setData("testimony", image);
    this.setState({ image });

    $(this.modal.current).modal("show");
  }
  hide() {
    $(this.modal.current).modal("hide");
  }

  save(event) {
    const btnSave = $(this.btnSave.current),
      isNewMember = btnSave.data("isNewMember"),
      index = btnSave.data("index"),
      fullname = $("#ttmFullname").val(),
      jobPosition = $("#ttmJobPosition").val();
    if (isNewMember) {
      this.props.addTestimony(
        fullname,
        jobPosition,
        this.state.image,
        this.editor.current.html()
      );
    } else {
      this.props.updateTestimony(
        index,
        fullname,
        jobPosition,
        this.state.image,
        this.editor.current.html()
      );
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" ref={this.modal}>
        <form
          className="modal-dialog modal-lg"
          role="document"
          onSubmit={this.save}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Testimony</h5>
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
                <label htmlFor="ttmFullname">Họ và Tên</label>
                <br />
                <input
                  className="form-control"
                  id="ttmFullname"
                  type="text"
                  placeholder="Họ và Tên"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ttmJobPosition">Vị trí việc làm</label>
                <br />
                <input
                  className="form-control"
                  id="ttmJobPosition"
                  type="text"
                  placeholder="Vị trí việc làm"
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh</label>
                <ImageBox
                  ref={this.imageBox}
                  postUrl="/admin/upload"
                  uploadType="TestimonyImage"
                  userData="testimony"
                  success={this.imageChanged}
                />
              </div>
              <div className="form-group">
                <label htmlFor="sgaContent">Nội dung</label>
                <Editor ref={this.editor} placeholder="Nội dung" />
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

class TestimonyEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.swap = this.swap.bind(this);
    this.showAddTestimonyModal = this.showAddTestimonyModal.bind(this);
    this.showEditTestimonyModal = this.showEditTestimonyModal.bind(this);

    this.modal = React.createRef();
  }

  componentDidMount() {
    $(document).ready(() => {
      T.selectMenu(2, 7);

      const route = T.routeMatcher("/admin/testimony/edit/:testimonyId"),
        params = route.parse(window.location.pathname);

      this.props.getTestimonyItem(params.testimonyId, data => {
        if (data.error) {
          T.notify("Lấy nhóm testimony bị lỗi!", "danger");
          this.props.history.push("/admin/testimony");
        } else if (data.item) {
          $("#tepTitle")
            .val(data.item.title)
            .focus();
        } else {
          this.props.history.push("/admin/testimony");
        }
      });
    });
  }

  showAddTestimonyModal() {
    this.modal.current.show();
  }
  showEditTestimonyModal(e, selectedTestimony, index) {
    this.modal.current.show(selectedTestimony, index);
    e.preventDefault();
  }

  add(fullname, jobPosition, image, content) {
    this.props.addTestimonyIntoGroup(fullname, jobPosition, image, content);
    this.modal.current.hide();
  }
  update(index, fullname, jobPosition, image, content) {
    this.props.updateTestimonyInGroup(
      index,
      fullname,
      jobPosition,
      image,
      content
    );
    this.modal.current.hide();
  }
  remove(e, index) {
    this.props.removeTestimonyFromGroup(index);
    e.preventDefault();
  }
  swap(e, index, isMoveUp) {
    this.props.swapTestimonyInGroup(index, isMoveUp);
    e.preventDefault();
  }

  save() {
    const changes = {
      title: $("#tepTitle").val(),
      items: this.props.testimony.item.items
    };
    this.props.updateTestimony(this.props.testimony.item._id, changes);
  }

  render() {
    let table = null,
      currentTestimony = this.props.testimony
        ? this.props.testimony.item
        : null;
    if (currentTestimony && currentTestimony.items.length > 0) {
      table = (
        <table className="table table-hover table-bordered" ref={this.table}>
          <thead>
            <tr>
              <th style={{ width: "60%" }}>Họ tên</th>
              <th style={{ width: "40%", textAlign: "center" }}>Hình ảnh</th>
              <th style={{ width: "auto", textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentTestimony.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <a
                    href="#"
                    onClick={e => this.showEditTestimonyModal(e, item, index)}
                  >
                    {item.fullname}
                  </a>
                  <p>{item.jobPosition}</p>
                </td>
                <td style={{ textAlign: "center" }}>
                  <img src={item.image} style={{ width: "100%" }} />
                </td>
                <td className="btn-group">
                  <a
                    className="btn btn-success"
                    href="#"
                    onClick={e => this.swap(e, index, true)}
                  >
                    <i className="fa fa-lg fa-arrow-up" />
                  </a>
                  <a
                    className="btn btn-success"
                    href="#"
                    onClick={e => this.swap(e, index, false)}
                  >
                    <i className="fa fa-lg fa-arrow-down" />
                  </a>
                  <a
                    className="btn btn-primary"
                    href="#"
                    onClick={e => this.showEditTestimonyModal(e, item, index)}
                  >
                    <i className="fa fa-lg fa-edit" />
                  </a>
                  <a
                    className="btn btn-danger"
                    href="#"
                    onClick={e => this.remove(e, index)}
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
      table = <p>Không có testimony!</p>;
    }

    const title =
      currentTestimony && currentTestimony.title && currentTestimony.title != ""
        ? currentTestimony.title
        : "<empty>";
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-yelp" /> Testimony: Chỉnh sửa
            </h1>
            <p dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <Link to="/admin">
              <i className="fa fa-home fa-lg" />
            </Link>
            &nbsp;/&nbsp;
            <Link to="/admin/testimony">Testimony</Link>
            &nbsp;/&nbsp;Chỉnh sửa
          </ul>
        </div>
        <div className="row">
          <div className="tile col-md-12">
            <div className="tile-body">
              <div className="form-group">
                <label className="control-label">Tiêu đề</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Tiêu đề"
                  id="tepTitle"
                  defaultValue={title}
                />
              </div>
              <div className="form-group">{table}</div>
            </div>
            <div className="tile-footer">
              <div className="row">
                <div className="col-md-12" style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={this.showAddTestimonyModal}
                  >
                    <i className="fa fa-fw fa-lg fa-plus" />
                    Thêm testimony
                  </button>
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
        <Link
          to="/admin/testimony"
          className="btn btn-secondary btn-circle"
          style={{ position: "fixed", lefft: "10px", bottom: "10px" }}
        >
          <i className="fa fa-lg fa-reply" />
        </Link>

        <ItemModal
          ref={this.modal}
          addTestimony={this.add}
          updateTestimony={this.update}
        />
      </main>
    );
  }
}

const mapStateToProps = state => ({ testimony: state.testimony });
const mapActionsToProps = {
  getTestimonyItem,
  updateTestimony,
  addTestimonyIntoGroup,
  updateTestimonyInGroup,
  removeTestimonyFromGroup,
  swapTestimonyInGroup
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(TestimonyEditPage);
