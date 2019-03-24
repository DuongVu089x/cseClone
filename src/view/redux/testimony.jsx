import T from '../common/js/common';

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_TESTIMONY_GROUPS = 'testimony:getAllTestimonyGroups';
const ADD_TESTIMONY_INTO_GROUP = 'testimony:addTestimonyIntoGroup';
const UPDATE_TESTIMONY_IN_GROUP = 'testimony:updateTestimonyInGroup';
const REMOVE_TESTIMONY_IN_GROUP = 'testimony:removeTestimonyInGroup';
const SWAP_TESTIMONY_IN_GROUP = 'testimony:swapTestimonyInGroup';
const UPDATE_TESTIMONY_GROUP = 'testimony:updateTestimonyGroup';

export default function testimonyReducer(state = null, data) {
    switch (data.type) {
        case GET_TESTIMONY_GROUPS:
            return Object.assign({}, state, { list: data.items });

        case ADD_TESTIMONY_INTO_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                state.item.items.push({
                    fullname: data.fullname,
                    jobPosition: data.jobPosition,
                    image: data.image,
                    content: data.content
                });
            }
            return state;

        case UPDATE_TESTIMONY_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                if (0 <= data.index && data.index < state.item.items.length) {
                    state.item.items.splice(data.index, 1, {
                        fullname: data.fullname,
                        jobPosition: data.jobPosition,
                        image: data.image,
                        content: data.content
                    });
                }
            }
            return state;

        case REMOVE_TESTIMONY_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                if (0 <= data.index && data.index < state.item.items.length) {
                    state.item.items.splice(data.index, 1);
                }
            }
            return state;

        case SWAP_TESTIMONY_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                const testimony = state.item.items[data.index];
                if (data.isMoveUp && data.index > 0) {
                    state.item.items.splice(data.index, 1);
                    state.item.items.splice(data.index - 1, 0, testimony);
                } else if (!data.isMoveUp && data.index < state.item.items.length - 1) {
                    state.item.items.splice(data.index, 1);
                    state.item.items.splice(data.index + 1, 0, testimony);
                }
            }
            return state;

        case UPDATE_TESTIMONY_GROUP:
            return Object.assign({}, state, { item: data.item });

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getAllTestimonys(done) {
    return dispatch => {
        const url = '/admin/testimony/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách testimony bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_TESTIMONY_GROUPS, items: data.items });
            }
        }, error => T.notify('Lấy danh sách testimony bị lỗi!', 'danger'));
    }
}

export function createTestimony(title, done) {
    return dispatch => {
        const url = '/admin/testimony';
        T.post(url, { title }, data => {
            if (data.error) {
                T.notify('Tạo testimony bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getAllTestimonys());
                if (done) done(data);
            }
        }, error => T.notify('Tạo testimony bị lỗi!', 'danger'));
    }
}

export function updateTestimony(_id, changes, done) {
    return dispatch => {
        const url = '/admin/testimony';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin testimony bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật thông tin testimony thành công!', 'info');
                dispatch(getAllTestimonys());
                done && done();
            }
        }, error => T.notify('Cập nhật thông tin testimony bị lỗi!', 'danger'));
    }
}

export function deleteTestimony(_id) {
    return dispatch => {
        const url = '/admin/testimony';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa testimony bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('nhân viên được xóa thành công!', 'error', false, 800);
                dispatch(getAllTestimonys());
            }
        }, error => T.notify('Xóa testimony bị lỗi!', 'danger'));
    }
}



export function getTestimonyItem(_id, done) {
    return dispatch => {
        const url = '/admin/testimony/item/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy testimony bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done({ item: data.item });
                dispatch({ type: UPDATE_TESTIMONY_GROUP, item: data.item });
            }
        }, error => T.notify('Lấy testimony bị lỗi!', 'danger'));
    }
}

export function addTestimonyIntoGroup(fullname, jobPosition, image, content) {
    return { type: ADD_TESTIMONY_INTO_GROUP, fullname, jobPosition, image, content };
}

export function updateTestimonyInGroup(index, fullname, jobPosition, image, content) {
    return { type: UPDATE_TESTIMONY_IN_GROUP, index, fullname, jobPosition, image, content };
}

export function removeTestimonyFromGroup(index) {
    return { type: REMOVE_TESTIMONY_IN_GROUP, index };
}

export function swapTestimonyInGroup(index, isMoveUp) {
    return { type: SWAP_TESTIMONY_IN_GROUP, index, isMoveUp };
}


export function getTestimonyByUser(_id, done) {
    return dispatch => {
        const url = '/home/testimony/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy testimony bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
            }
        }, error => T.notify('Lấy testimony bị lỗi!', 'danger'));
    }
}