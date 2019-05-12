import T from "../common/js/common";

const GET_ALL = "demo2:getAll";
const UPDATE_ITEM = "demo2:updateItem";
const UPDATE_DEMO2_GROUP = "demo2:updateDemo2Group";

export default function demo2Reducer(state = [], data) {
  switch (data.type) {
    case GET_ALL:
      //   return Object.assign({}, state, { items: data.items });
      return data.items;

    case UPDATE_ITEM:
      let updateItemState = state.slice();
      for (let i = 0; i < updateItemState.length; i++) {
        if (updateItemState[i]._id == data.item._id) {
          updateItemState[i] = data.item;
          break;
        }
      }
      return updateItemState;
    case UPDATE_DEMO2_GROUP:
      data.item.ageData = data.item.age;
      return Object.assign({}, state, { item: data.item });

    default:
      return state;
  }
}
// Actions ------------------------------------------------------------------------------------------------------------
export function getAll() {
  return dispatch => {
    const url = "/admin/demo2/all";
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
export function createDemo2(data, done) {
  return dispatch => {
    const url = "/admin/demo2";
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
export function updatedemo2(_id, changes, done) {
  return dispatch => {
    const url = "/admin/demo2";
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
export function getdemo2(_id, done) {
  return dispatch => {
    const url = "/admin/demo2/item/" + _id;
    T.get(
      url,
      data => {
        if (data.error) {
          T.notify("Lấy demo2 bị lỗi!", "danger");
          console.error("GET: " + url + ". " + data.error);
        } else {
          if (done) done({ item: data.item });
          dispatch({ type: UPDATE_DEMO2_GROUP, item: data.item });
        }
      },
      error => T.notify("Lấy DEMO2 bị lỗi!", "danger")
    );
  };
}
