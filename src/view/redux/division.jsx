import T from '../common/js/common';

const GET_ALL = 'division:getAll';
const GET_ITEM = 'division:getItem';
const CREATE_ITEM = 'division:createItem';
const UPDATE_ITEM = 'division:updateItem';
const DELETE_ITEM = 'division:deleteItem';
const GET_DIVISION_BY_USER = 'division:getDivisionByUser';
const GET_ALL_BY_USER = 'division:'

export default function divisionReducer(state = [], data) {
    switch (data.type) {
        case GET_ALL:
            return data.items;
            // return Object.assign({}, state, { items: data.items });

        case GET_ITEM:
            state = state.slice();
            for (let i = 0; i < state.length; i++) {
                if (state[i]._id == data.item._id) {
                    state[i] = data.item;
                    break;
                }
            }
            return state;

        case CREATE_ITEM:
            return [data.item].concat(state);

        case UPDATE_ITEM:
            state = state.slice();
            for (let i = 0; i < state.length; i++) {
                if (state[i]._id == data.item._id) {
                    state[i] = data.item;
                    break;
                }
            }
            return state;

        case DELETE_ITEM:
            state = state.slice();
            for (let i = 0; i < state.length; i++) {
                if (state[i]._id == data._id) {
                    state.splice(i, 1);
                    break;
                }
            }
            return state;

        case GET_ALL_BY_USER:
            return Object.assign({}, state, { items: data.items });

        case GET_DIVISION_BY_USER:
            return Object.assign({}, state, { userDivision: data.item });

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getAllDivisions() {
    return dispatch => {
        const url = '/admin/division/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy division bị lỗi!', 'danger');
                console.error('GET: ' + url + '.', data.error);
            } else {
                dispatch({ type: GET_ALL, items: data.items });
            }
        }, error => T.notify('Lấy division bị lỗi!', 'danger'));
    }
}

export function getDivision(_id, done) {
    return dispatch => {
        const url = '/admin/division/item/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy division bị lỗi!', 'danger');
                console.error('GET: ' + url + '.', data.error);
            } else {
                dispatch({ type: GET_ITEM, item: data.item });
                if (done) done(data.item);
            }
        }, error => T.notify('Lấy division bị lỗi!', 'danger'));
    }
}

export function createDivision(division, done) {
    return dispatch => {
        const url = '/admin/division';
        T.post(url, { division }, data => {
            if (data.error) {
                T.notify('Tạo division bị lỗi!', 'danger');
                console.error('POST: ' + url + '.', data.error);
            } else {
                dispatch({ type: CREATE_ITEM, item: data.item });
                if (done) done(data.item);
            }
        }, error => T.notify('Tạo division bị lỗi!', 'danger'));
    }
}

export function updateDivision(_id, changes, done) {
    return dispatch => {
        const url = '/admin/division';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật division bị lỗi!', 'danger');
                console.error('PUT: ' + url + '.', data.error);
            } else {
                T.notify('Cập nhật division thành công!', 'success');
                dispatch({ type: UPDATE_ITEM, item: data.item });
            }
            done && done(data);
        }, error => T.notify('Cập nhật division bị lỗi!', 'danger'));
    }
}

export function swapDivision(_id, isMoveUp, type) {
    return dispatch => {
        const url = '/admin/division/swap/';
        T.put(url, { _id, isMoveUp }, data => {
            if (data.error) {
                T.notify('Thay đổi vị trí division bị lỗi!', 'danger')
                console.error('PUT: ' + url + '.', data.error);
            } else {
                dispatch(getAllDivisions());
            }
        }, error => T.notify('Thay đổi vị trí division bị lỗi!', 'danger'));
    }
}

export function deleteDivision(_id) {
    return dispatch => {
        const url = '/admin/division';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa division bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '.', data.error);
            } else {
                T.alert('Xóa division thành công!', 'error', false, 800);
                dispatch({ type: DELETE_ITEM, _id });
            }
        }, error => T.notify('Xóa division bị lỗi!', 'danger'));
    }
}

export function changeDivision(division) {
    return { type: UPDATE_ITEM, item: division };
}


export function getAllDivisionsByUser() {
    return dispatch => {
        const url = '/home/division/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy division bị lỗi!', 'danger');
                console.error('GET: ' + url + '.', data.error);
            } else {
                dispatch({ type: GET_ALL_BY_USER, items: data.items });
            }
        }, error => T.notify('Lấy division bị lỗi!', 'danger'));
    }
}

export function getDivisionByUser(divisionId) {
    return dispatch => {
        const url = '/division/item/id/' + divisionId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy division bị lỗi!', 'danger');
                console.error('GET: ' + url + '.', data.error);
            } else {
                dispatch({ type: GET_DIVISION_BY_USER, item: data.item });
            }
        }, error => T.notify('Lấy tin tức bị lỗi!', 'danger'));
    }
}