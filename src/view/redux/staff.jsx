import T from '../common/js/common';

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_STAFFS = 'staff:getStaffs';
const GET_STAFF_IN_PAGE = 'staff:getStaffInPage';
const UPDATE_STAFF = 'staff:UpdateStaff';

export default function staffReducer(state = null, data) {
    switch (data.type) {
        case GET_STAFFS:
            return Object.assign({}, state, { items: data.items });

        case GET_STAFF_IN_PAGE:
            return Object.assign({}, state, { page: data.page });

        case UPDATE_STAFF:
            if (state) {
                let updatedItems = Object.assign({}, state.items),
                    updatedPage = Object.assign({}, state.page),
                    updatedItem = data.item;
                if (updatedItems) {
                    for (let i = 0, n = updatedItems.length; i < n; i++) {
                        if (updatedItems[i]._id == updatedItem._id) {
                            updatedItems.splice(i, 1, updatedItem);
                            break;
                        }
                    }
                }
                if (updatedPage) {
                    for (let i = 0, n = updatedPage.list.length; i < n; i++) {
                        if (updatedPage.list[i]._id == updatedItem._id) {
                            updatedPage.list.splice(i, 1, updatedItem);
                            break;
                        }
                    }
                }
                return Object.assign({}, state, { items: updatedItems, page: updatedPage });
            } else {
                return null;
            }

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
T.initCookiePage('adminStaff');
export function getAllStaffs(done) {
    return dispatch => {
        const url = '/admin/staff/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_STAFFS, items: data.items ? data.items : [] });
            }
        }, error => T.notify('Lấy danh sách nhân viên bị lỗi!', 'danger'));
    }
}

export function getStaffInPage(pageNumber, pageSize, done) {
    const page = T.updatePage('adminStaff', pageNumber, pageSize);
    return dispatch => {
        const url = '/admin/staff/page/' + page.pageNumber + '/' + page.pageSize;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.page.pageNumber, data.page.pageSize, data.page.pageTotal, data.page.totalItem);
                dispatch({ type: GET_STAFF_IN_PAGE, page: data.page });
            }
        }, error => T.notify('Lấy danh sách nhân viên bị lỗi!', 'danger'));
    }
}

export function getStaff(staffId, done) {
    return dispatch => {
        const url = '/admin/staff/' + staffId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy thông tin nhân viên bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
                // dispatch({ type: GET_STAFFS, items: data.items });
            }
        }, error => {
            console.error('GET: ' + url + '. ' + error);
        });
    }
}

export function createStaff(data, done) {
    return dispatch => {
        const url = '/admin/staff';
        T.post(url, { data }, data => {
            if (data.error) {
                T.notify('Tạo nhân viên bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getStaffInPage());
                if (done) done(data);
            }
        }, error => T.notify('Tạo nhân viên bị lỗi!', 'danger'));
    }
}

export function updateStaff(_id, changes, done) {
    return dispatch => {
        const url = '/admin/staff';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin nhân viên bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật thông tin nhân viên thành công!', 'info');
                dispatch(getStaffInPage());
                done && done();
            }
        }, error => T.notify('Cập nhật thông tin nhân viên bị lỗi!', 'danger'));
    }
}

export function deleteStaff(_id) {
    return dispatch => {
        const url = '/admin/staff';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa nhân viên bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('Nhân viên đã xóa thành công!', 'error', false, 800);
                dispatch(getStaffInPage());
            }
        }, error => T.notify('Xóa nhân viên bị lỗi!', 'danger'));
    }
}

export function changeStaff(item) {
    return { type: UPDATE_STAFF, item };
}