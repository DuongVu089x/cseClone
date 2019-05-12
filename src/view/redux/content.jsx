import T from '../common/js/common';

// Cookie -------------------------------------------------------------------------------------------------------------
T.initCookiePage('adminContent');

// Reducer -------------------------------------------------------------------------------------------------------------
const UPDATE_CONTENT_STATE = 'content:updateContentState';
const UPDATE_CONTENT = 'content:updateContent';
const DELETE_CONTENT = 'content:deleteContent';

export default function contentReducer(state = [], data) {
    switch (data.type) {
        case UPDATE_CONTENT_STATE:
            return data.items;

        case UPDATE_CONTENT:
            state = state.slice();
            for (let i = 0; i < state.length; i++) {
                if (state[i]._id == data.item._id) {
                    state[i] = data.item;
                    break;
                }
            }
            return state;

        case DELETE_CONTENT:
            state = state.slice();
            for (let i = 0; i < state.length; i++) {
                if (state[i]._id == data._id) {
                    state.splice(i, 1);
                    break;
                }
            }
            return state;

        default:
            return state;
    }
}

// Action --------------------------------------------------------------------------------------------------------------
export function getAllContents() {
    return dispatch => {
        const url = '/admin/content/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách nội dung bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                dispatch({ type: UPDATE_CONTENT_STATE, items: data.items ? data.items : [] });
            }
        }, error => {
            console.error('GET: ' + url + '. ' + error);
        });
    }
}

export function createContent(done) {
    return dispatch => {
        const url = '/admin/content';
        T.post(url, data => {
            if (data.error) {
                T.notify('Tạo nội dung bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getAllContents());
                if (done) done(data);
            }
        }, error => T.notify('Tạo nội dung bị lỗi!', 'danger'));
    }
}

export function updateContent(_id, changes) {
    return dispatch => {
        const url = '/admin/content';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật nội dung bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
            } else {
                T.notify('Nội dung cập nhật thành công!', 'info');
                dispatch(Object.assign({}, { type: UPDATE_CONTENT }, data));
            }
        }, error => T.notify('Cập nhật nội dung bị lỗi!', 'danger'));
    }
}

export function deleteContent(_id) {
    return dispatch => {
        const url = '/admin/content';
        T.delete(url, { id: _id }, data => {
            if (data.error) {
                T.notify('Xóa nội dung bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('Nội dung được xóa thành công!', 'error', false, 800);
                dispatch({ type: DELETE_CONTENT, _id });
            }
        }, error => T.notify('Xóa nội dung bị lỗi!', 'danger'));
    }
}


export function getContentItem(_id, done) {
    return dispatch => {
        const url = '/admin/content/item/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách nội dung bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                dispatch({ type: UPDATE_CONTENT, item: data.item });
                if (done) done({ item: data.item });
            }
        }, error => {
            console.error('GET: ' + url + '. ' + error);
        });
    }
}

export function getContent(_id, done) {
    return dispatch => {
        const url = '/home/content/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách nội dung bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                done(data.items);
            }
        }, error => T.notify('Lấy danh sách nội dung bị lỗi!', 'danger'));
    }
}