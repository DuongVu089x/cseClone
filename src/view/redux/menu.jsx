import T from '../common/js/common';

const DEFAULT = 'menu:default';
const GET_ALL = 'menu:getAll';

export default function menuReducer(state = null, data) {
    switch (data.type) {
        case GET_ALL:
            return data.items;

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getAll() {
    return dispatch => {
        const url = '/admin/menu/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy menu bị lỗi!', 'danger');
                console.error('GET: ' + url + '.', data.error);
            } else {
                dispatch({ type: GET_ALL, items: data.items });
            }
        }, error => T.notify('Lấy menu bị lỗi!', 'danger'));
    }
}

export function createMenu(_id, done) {
    return dispatch => {
        const url = '/admin/menu';
        T.post(url, { _id }, data => {
            if (data.error) {
                T.notify('Tạo menu bị lỗi!', 'danger');
                console.error('POST: ' + url + '.', data.error);
            } else {
                dispatch(getAll());
                if (done) done(data);
            }
        }, error => T.notify('Tạo menu bị lỗi!', 'danger'));
    }
}

export function updateMenu(_id, changes, done) {
    return dispatch => {
        const url = '/admin/menu';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật menu bị lỗi!', 'danger');
                console.error('PUT: ' + url + '.', data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật menu thành công!', 'success');
                dispatch(getAll());
                done && done();
            }
        }, error => T.notify('Cập nhật menu bị lỗi!', 'danger'));
    }
}

export function swapMenu(_id, isMoveUp) {
    return dispatch => {
        const url = '/admin/menu/swap/';
        T.put(url, { _id, isMoveUp }, data => {
            if (data.error) {
                T.notify('Thay đổi vị trí menu bị lỗi!', 'danger')
                console.error('PUT: ' + url + '.', data.error);
            } else {
                dispatch(getAll());
            }
        }, error => T.notify('Thay đổi vị trí menu bị lỗi!', 'danger'));
    }
}

export function deleteMenu(_id) {
    return dispatch => {
        const url = '/admin/menu';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa menu bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '.', data.error);
            } else {
                T.alert('Xóa menu thành công!', 'error', false, 800);
                dispatch(getAll());
            }
        }, error => T.notify('Xóa menu bị lỗi!', 'danger'));
    }
}


export function getMenu(menuId, done) {
    return dispatch => {
        T.get('/admin/menu/' + menuId,
            data => done(data),
            error => done({ error }));
    }
}

export function createComponent(parentId, component, done) {
    return dispatch => {
        const url = '/admin/menu/component';
        T.post(url, { parentId, component }, data => {
            if (data.error) {
                T.notify('Tạo thành phần trang bị lỗi!', 'danger');
                console.error('POST: ' + url + '.', data.error);
            } else {
                if (done) done(data);
            }
        }, error => T.notify('Tạo thành phần trang bị lỗi!', 'danger'));
    }
}

export function updateComponent(_id, changes, done) {
    return dispatch => {
        const url = '/admin/menu/component';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thành phần trang bị lỗi!', 'danger');
                console.error('PUT: ' + url + '.', data.error);
            } else {
                if (done) done(data);
            }
        }, error => T.notify('Cập nhật thành phần trang bị lỗi!', 'danger'));
    }
}

export function swapComponent(_id, isMoveUp, done) {
    return dispatch => {
        const url = '/admin/menu/component/swap/';
        T.put(url, { _id, isMoveUp }, data => {
            if (data.error) {
                T.notify('Thay đổi thứ tự thành phần trang bị lỗi!', 'danger');
                console.error('PUT: ' + url + '.', data.error);
            } else {
                T.notify('Thay đổi thứ tự thành phần trang thành công!', 'info');
                done();
            }
        }, error => T.notify('Thay đổi thứ tự thành phần trang bị lỗi!', 'danger'));
    }
}

export function deleteComponent(_id, done) {
    return dispatch => {
        const url = '/admin/menu/component';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa thành phần trang bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '.', data.error);
            } else {
                if (done) done(data);
            }
        }, error => T.notify('Xóa thành phần trang bị lỗi!', 'danger'));
    }
}

export function getComponentViews(type, done) {
    return dispatch => {
        const url = '/admin/menu/component/type/' + type;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy menu bị lỗi!', 'danger');
                console.error('GET: ' + url + '.', data.error);
            } else {
                done(data.items);
            }
        }, error => T.notify('Lấy menu bị lỗi!', 'danger'));
    }
}

export function buildMenu() {
    return dispatch => {
        const url = '/admin/menu/build';
        T.put(url, () => T.notify('Cập nhật menu thành công!', 'info'),
            error => T.notify('Cập nhật menu bị lỗi!', 'danger'));
    };
}