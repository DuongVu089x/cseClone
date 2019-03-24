import T from "../common/js/common";

const GET_ALL = "vySociu:getAll";
const CREATE_ITEM = "vySociu:createItem";
const UPDATE_ITEM = "vySociu:updateItem";
const DELETE_ITEM = "vySociu:deleteItem";
const UPDATE_VYSOCIU_GROUP = "vySociu:updateVySociuGroup";

export default function vySociuReducer(state = [], data) {
  switch (data.type) {
    case GET_ALL:
      //   return Object.assign({}, state, { items: data.items });
      return data.items;

    case CREATE_ITEM:
      return [data.item].concat(state);

    case UPDATE_ITEM:
      let updateItemState = state.slice();
      for (let i = 0; i < updateItemState.length; i++) {
        if (updateItemState[i]._id == data.item._id) {
          updateItemState[i] = data.item;
          break;
        }
      }
      return updateItemState;

    case DELETE_ITEM:
      let deleteItemState = state.slice();
      for (let i = 0; i < deleteItemState.length; i++) {
        if (deleteItemState[i]._id == data._id) {
          deleteItemState.splice(i, 1);
          break;
        }
      }
      return deleteItemState;

    case UPDATE_VYSOCIU_GROUP:
      data.item.ageData = data.item.age;
      return Object.assign({}, state, { item: data.item });

    default:
      return state;
  }
}
// Actions ------------------------------------------------------------------------------------------------------------
export function getAll() {
  return dispatch => {
    const url = "/admin/vySociu/all";
    T.get(
      url,
      data => {
        if (data.error) {
          T.notify("Lấy danh mục bị lỗi!", "danger");
          console.error("GET: " + url + ".", data.error);
        } else {
          dispatch({ type: GET_ALL, items: data.items });
        }
      },
      error => {
        console.error("GET: " + url + ".", data.error);
      }
    );
  };
}

export function createVySociu(data, done) {
  return dispatch => {
    const url = "/admin/vySociu";
    console.log(data);
    T.post(
      url,
      { data },
      data => {
        if (data.error) {
          T.notify("Tạo danh mục bị lỗi!", "danger");
          console.error("POST: " + url + ".", data.error);
        } else {
          dispatch({ type: CREATE_ITEM, item: data.item });
          if (done) done(data);
        }
      },
      error => T.notify("Tạo danh mục bị lỗi!", "danger")
    );
  };
}

export function updatevySociu(_id, changes, done) {
  return dispatch => {
    const url = "/admin/vySociu";
    T.put(
      url,
      { _id, changes },
      data => {
        if (data.error) {
          T.notify("Cập nhật danh mục bị lỗi!", "danger");
          console.error("PUT: " + url + ".", data.error);
          done && done(data.error);
        } else {
          T.notify("Cập nhật danh mục thành công!", "success");
          dispatch({ type: UPDATE_ITEM, item: data.item });
          done && done();
        }
      },
      error => T.notify("Cập nhật danh mục bị lỗi!", "danger")
    );
  };
}
export function getVySociuItem(_id, done) {
  return dispatch => {
    const url = "/admin/vySociu/item/" + _id;
    T.get(
      url,
      data => {
        if (data.error) {
          T.notify("Lấy vySociu bị lỗi!", "danger");
          console.error("GET: " + url + ". " + data.error);
        } else {
          if (done) done({ item: data.item });
          dispatch({ type: UPDATE_VYSOCIU_GROUP, item: data.item });
        }
      },
      error => T.notify("Lấy vySociu bị lỗi!", "danger")
    );
  };
}

export function deletevySociu(_id) {
  return dispatch => {
    const url = "/admin/vySociu";
    T.delete(
      url,
      { _id },
      data => {
        if (data.error) {
          T.notify("Xóa danh mục VySociu bị lỗi!", "danger");
          console.error("DELETE: " + url + ".", data.error);
        } else {
          T.alert("Xóa danh mục VySociu thành công!", "error", false, 800);
          dispatch({ type: DELETE_ITEM, _id });
        }
      },
      error => T.notify("Xóa danh mục bị lỗi!", "danger")
    );
  };
}

export function changevySociu(vySociu) {
  return { type: UPDATE_ITEM, item: vySociu };
}
