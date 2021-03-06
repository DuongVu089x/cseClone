import T from '../common/js/common';

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_SLOGAN_GROUPS = 'slogan:getAllSloganGroups';
const ADD_SLOGAN_INTO_GROUP = 'slogan:addSloganIntoGroup';
const UPDATE_SLOGAN_IN_GROUP = 'slogan:updateSloganInGroup';
const REMOVE_SLOGAN_IN_GROUP = 'slogan:removeSloganInGroup';
const SWAP_SLOGAN_IN_GROUP = 'slogan:swapSloganInGroup';
const UPDATE_SLOGAN_GROUP = 'slogan:updateSloganGroup';

export default function sloganReducer(state = null, data) {
    switch (data.type) {
        case GET_SLOGAN_GROUPS:
            return Object.assign({}, state, { list: data.items });

        case ADD_SLOGAN_INTO_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                state.item.items.push({
                    title: data.title,
                    image: data.image,
                    content: data.content
                });
            }
            return state;

        case UPDATE_SLOGAN_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                if (0 <= data.index && data.index < state.item.items.length) {
                    state.item.items.splice(data.index, 1, {
                        title: data.title,
                        image: data.image,
                        content: data.content
                    });
                }
            }
            return state;

        case REMOVE_SLOGAN_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                if (0 <= data.index && data.index < state.item.items.length) {
                    state.item.items.splice(data.index, 1);
                }
            }
            return state;

        case SWAP_SLOGAN_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                const slogan = state.item.items[data.index];
                if (data.isMoveUp && data.index > 0) {
                    state.item.items.splice(data.index, 1);
                    state.item.items.splice(data.index - 1, 0, slogan);
                } else if (!data.isMoveUp && data.index < state.item.items.length - 1) {
                    state.item.items.splice(data.index, 1);
                    state.item.items.splice(data.index + 1, 0, slogan);
                }
            }
            return state;

        case UPDATE_SLOGAN_GROUP:
            return Object.assign({}, state, { item: data.item });

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getAllSlogans(done) {
    return dispatch => {
        const url = '/admin/slogan/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách slogan bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_SLOGAN_GROUPS, items: data.items });
            }
        }, error => T.notify('Lấy danh sách slogan bị lỗi!', 'danger'));
    }
}

export function createSlogan(title, done) {
    return dispatch => {
        const url = '/admin/slogan';
        T.post(url, { title }, data => {
            if (data.error) {
                T.notify('Tạo slogan bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getAllSlogans());
                if (done) done(data);
            }
        }, error => T.notify('Tạo slogan bị lỗi!', 'danger'));
    }
}

export function updateSlogan(_id, changes, done) {
    return dispatch => {
        const url = '/admin/slogan';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin slogan bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật thông tin slogan thành công!', 'info');
                dispatch(getAllSlogans());
                done && done();
            }
        }, error => T.notify('Cập nhật thông tin slogan bị lỗi!', 'danger'));
    }
}

export function deleteSlogan(_id) {
    return dispatch => {
        const url = '/admin/slogan';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa slogan bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('nhân viên được xóa thành công!', 'error', false, 800);
                dispatch(getAllSlogans());
            }
        }, error => T.notify('Xóa slogan bị lỗi!', 'danger'));
    }
}



export function getSloganItem(sloganId, done) {
    return dispatch => {
        const url = '/admin/slogan/item/' + sloganId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy slogan bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done({ item: data.item });
                dispatch({ type: UPDATE_SLOGAN_GROUP, item: data.item });
            }
        }, error => T.notify('Lấy slogan bị lỗi!', 'danger'));
    }
}

export function addSloganIntoGroup(title, image, content) {
    return { type: ADD_SLOGAN_INTO_GROUP, title, image, content };
}

export function updateSloganInGroup(index, title, image, content) {
    return { type: UPDATE_SLOGAN_IN_GROUP, index, title, image, content };
}

export function removeSloganFromGroup(index) {
    return { type: REMOVE_SLOGAN_IN_GROUP, index };
}

export function swapSloganInGroup(index, isMoveUp) {
    return { type: SWAP_SLOGAN_IN_GROUP, index, isMoveUp };
}


export function getSloganByUser(sloganId, done) {
    return dispatch => {
        const url = '/home/slogan/' + sloganId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy slogan bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
            }
        }, error => T.notify('Lấy slogan bị lỗi!', 'danger'));
    }
}