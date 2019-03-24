import T from '../common/js/common';

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_STAFF_GROUPS = 'staffGroup:getAllStaffGroups';
const UPDATE_STAFF_GROUP = 'staffGroup:updateStaffGroup';
const ADD_STAFF_INTO_GROUP = 'staffGroup:addStaffIntoGroup';
const UPDATE_STAFF_IN_GROUP = 'staffGroup:updateStaffInGroup';
const REMOVE_STAFF_IN_GROUP = 'staffGroup:removeStaffInGroup';
const SWAP_STAFF_IN_GROUP = 'staffGroup:swapStaffInGroup';

export default function staffGroupReducer(state = null, data) {
    switch (data.type) {
        case GET_STAFF_GROUPS:
            return Object.assign({}, state, { list: data.items });

        case ADD_STAFF_INTO_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                state.item.staff.push({
                    staffId: data.staffId,
                    staffName: data.staffName,
                    info: data.info,
                    content: data.content
                });
            }
            return state;

        case UPDATE_STAFF_IN_GROUP:
            console.log(state, data);
            if (state && state.item) {
                state = Object.assign({}, state);
                if (data.index < state.item.staff.length) {
                    state.item.staff.splice(data.index, 1, {
                        staffId: data.staffId,
                        staffName: data.staffName,
                        info: data.info,
                        content: data.content
                    });
                }
            }
            return state;

        case REMOVE_STAFF_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                for (let i = 0, n = state.item.staff.length; i < n; i++) {
                    if (state.item.staff[i]._id == data.staffId) {
                        state.item.staff.splice(i, 1);
                        break;
                    }
                }
            }
            return state;

        case UPDATE_STAFF_GROUP:
            return Object.assign({}, state, { item: data.item });

        case SWAP_STAFF_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                for (let i = 0, n = state.item.staff.length; i < n; i++) {
                    let staff = state.item.staff[i];
                    if (staff._id == data.staffId) {
                        if (data.isMoveUp && i > 0) {
                            state.item.staff.splice(i, 1);
                            state.item.staff.splice(i - 1, 0, staff);
                        } else if (!data.isMoveUp && i < n - 1) {
                            state.item.staff.splice(i, 1);
                            state.item.staff.splice(i + 1, 0, staff);
                        }
                        break;
                    }
                }
            }
            return state;

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getAllStaffGroups(done) {
    return dispatch => {
        const url = '/admin/staff-group/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách nhóm nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_STAFF_GROUPS, items: data.items });
            }
        }, error => T.notify('Lấy danh sách nhóm nhân viên bị lỗi!', 'danger'));
    }
}

export function createStaffGroup(title, done) {
    return dispatch => {
        const url = '/admin/staff-group';
        T.post(url, { title }, data => {
            if (data.error) {
                T.notify('Tạo nhóm nhân viên bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getAllStaffGroups());
                if (done) done(data);
            }
        }, error => T.notify('Tạo nhóm nhân viên bị lỗi!', 'danger'));
    }
}

export function updateStaffGroup(_id, changes, done) {
    return dispatch => {
        const url = '/admin/staff-group';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin nhóm nhân viên bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật thông tin nhóm nhân viên thành công!', 'info');
                dispatch(getAllStaffGroups());
                done && done();
            }
        }, error => T.notify('Cập nhật thông tin nhóm nhân viên bị lỗi!', 'danger'));
    }
}

export function deleteStaffGroup(_id) {
    return dispatch => {
        const url = '/admin/staff-group';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa nhóm nhân viên bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('nhân viên được xóa thành công!', 'error', false, 800);
                dispatch(getAllStaffGroups());
            }
        }, error => T.notify('Xóa nhóm nhân viên bị lỗi!', 'danger'));
    }
}



export function getStaffGroupItem(staffGroupId, done) {
    return dispatch => {
        const url = '/admin/staff-group/item/' + staffGroupId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy nhóm nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done({ item: data.item });
                dispatch({ type: UPDATE_STAFF_GROUP, item: data.item });
            }
        }, error => T.notify('Lấy nhóm nhân viên bị lỗi!', 'danger'));
    }
}

export function addStaffIntoGroup(staffId, content, done) {
    return dispatch => {
        const url = '/admin/staff/' + staffId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy thông tin nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done();
                dispatch({ type: ADD_STAFF_INTO_GROUP, staffId, content, info: data.item });
            }
        }, error => T.notify('Lấy thông tin nhân viên bị lỗi!', 'danger'));
    }
}

export function updateStaffInGroup(index, staffId, content, done) {
    return dispatch => {
        const url = '/admin/staff/' + staffId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done();
                dispatch({ type: UPDATE_STAFF_IN_GROUP, index, staffId, content, info: data.item });
            }
        }, error => T.notify('Cập nhật thông tin nhân viên bị lỗi!', 'danger'));
    }
}

export function removeStaffFromGroup(staffId) {
    return { type: REMOVE_STAFF_IN_GROUP, staffId };
}

export function swapStaffInGroup(staffId, isMoveUp) {
    return { type: SWAP_STAFF_IN_GROUP, staffId, isMoveUp };
}

export function getStaffGroupItemByUser(staffGroupId, done) {
    return dispatch => {
        const url = '/home/staff-group/' + staffGroupId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy nhóm nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done({ item: data.item });
            }
        }, error => T.notify('Lấy nhóm nhân viên bị lỗi!', 'danger'));
    }
}