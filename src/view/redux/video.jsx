import T from '../common/js/common';

// Cookie -------------------------------------------------------------------------------------------------------------
T.initCookiePage('adminVideo');

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_VIDEO_IN_PAGE = 'video:getVideoInPage';
const UPDATE_VIDEO_IN_PAGE = 'video:UpdateVideoInPage';

export default function videoReducer(state = null, data) {
    switch (data.type) {
        case GET_VIDEO_IN_PAGE:
            return Object.assign({}, state, { page: data.page });

        case UPDATE_VIDEO_IN_PAGE:
            let updatedPage = Object.assign({}, state.page),
                updatedItem = data.item;
            for (let i = 0, n = updatedPage.list.length; i < n; i++) {
                if (updatedPage.list[i]._id == updatedItem._id) {
                    updatedPage.list.splice(i, 1, updatedItem);
                    return Object.assign({}, state, { page: updatedPage });
                }
            }
            return state;

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getVideoInPage(pageNumber, pageSize, done) {
    const page = T.updatePage('adminVideo', pageNumber, pageSize);

    return dispatch => {
        const url = '/admin/video/page/' + page.pageNumber + '/' + page.pageSize;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách video bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.page.pageNumber, data.page.pageSize, data.page.pageTotal, data.page.totalItem);
                dispatch({ type: GET_VIDEO_IN_PAGE, page: data.page });
            }
        }, error => T.notify('Lấy danh sách video bị lỗi!', 'danger'));
    }
}

export function createVideo(video, done) {
    return dispatch => {
        const url = '/admin/video';
        T.post(url, { data: video }, data => {
            if (data.error) {
                T.notify('Tạo video bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getVideoInPage());
                if (done) done(data);
            }
        }, error => T.notify('Tạo video bị lỗi!', 'danger'));
    }
}

export function updateVideo(_id, changes, done) {
    return dispatch => {
        const url = '/admin/video';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin video bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật thông tin video thành công!', 'info');
                dispatch(getVideoInPage());
                done && done();
            }
        }, error => T.notify('Cập nhật thông tin video bị lỗi!', 'danger'));
    }
}

export function deleteVideo(_id) {
    return dispatch => {
        const url = '/admin/video';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa video bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('Video được xóa thành công!', 'error', false, 800);
                dispatch(getVideoInPage());
            }
        }, error => T.notify('Xóa video bị lỗi!', 'danger'));
    }
}

export function changeVideo(video) {
    return { type: UPDATE_VIDEO_IN_PAGE, item: video };
}


// Home ---------------------------------------------------------------------------------------------------------------
export function getVideo(_id, done) {
    return dispatch => {
        const url = '/home/video/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy video bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                done(data.item);
            }
        }, error => T.notify('Lấy video bị lỗi!', 'danger'));
    }
}