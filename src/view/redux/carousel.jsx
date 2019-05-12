import T from '../common/js/common';

// Cookie -------------------------------------------------------------------------------------------------------------
T.initCookiePage('adminCarousel');

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_CAROUSELS = 'carousel:getCarousels';
const GET_CAROUSEL_IN_PAGE = 'carousel:getCarouselInPage';
const GET_CAROUSEL = 'carousel:getCarousel';
const UPDATE_CAROUSEL_ITEM = 'carousel:UpdateCarouselItem';

export default function carouselReducer(state = null, data) {
    switch (data.type) {
        case GET_CAROUSELS:
            return Object.assign({}, state, { items: data.items });

        case GET_CAROUSEL_IN_PAGE:
            return Object.assign({}, state, { page: data.page });

        case GET_CAROUSEL:
            return Object.assign({}, state, { selectedItem: data.item });

        case UPDATE_CAROUSEL_ITEM:
            state = Object.assign({}, state);
            const updatedItem = data.item;
            if (state && state.selectedItem && state.selectedItem._id == updatedItem.carouselId) {
                for (let i = 0, items = state.selectedItem.items, n = items.length; i < n; i++) {
                    if (items[i]._id = updatedItem._id) {
                        state.selectedItem.items.splice(i, 1, updatedItem);
                        break;
                    }
                }
            }
            return state;

        default:
            return state;
    }
}

// Action --------------------------------------------------------------------------------------------------------------
export function getAllCarousels(done) {
    return dispatch => {
        const url = '/admin/carousel/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách tập hình ảnh bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_CAROUSELS, items: data.items ? data.items : [] });
            }
        }, error => T.notify('Lấy danh sách tập hình ảnh bị lỗi!', 'danger'));
    }
}

export function getCarouselInPage(pageNumber, pageSize, done) {
    const page = T.updatePage('adminCarousel', pageNumber, pageSize);
    return dispatch => {
        const url = '/admin/carousel/page/' + page.pageNumber + '/' + page.pageSize;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách hình ảnh bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.page.pageNumber, data.page.pageSize, data.page.pageTotal, data.page.totalItem);
                dispatch({ type: GET_CAROUSEL_IN_PAGE, page: data.page });
            }
        }, error => T.notify('Lấy danh sách hình ảnh bị lỗi!', 'danger'));
    }
}

export function getCarousel(_id, done) {
    return dispatch => {
        const url = '/admin/carousel/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy thông tin tập hình ảnh bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
                dispatch({ type: GET_CAROUSEL, item: data.item });
            }
        }, error => T.notify('Lấy thông tin tập hình ảnh bị lỗi!', 'danger'));
    }
}

export function createCarousel(data, done) {
    return dispatch => {
        const url = '/admin/carousel';
        T.post(url, { data }, data => {
            if (data.error) {
                T.notify('Tạo tập hình ảnh bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getCarouselInPage());
                if (done) done(data);
            }
        }, error => T.notify('Tạo tập hình ảnh bị lỗi!', 'danger'));
    }
}

export function updateCarousel(_id, changes, done) {
    return dispatch => {
        const url = '/admin/carousel';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật tập hình ảnh bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
            } else {
                T.notify('Tập hình ảnh cập nhật thành công!', 'info');
                dispatch(getCarouselInPage());
                done && done();
            }
        }, error => T.notify('Cập nhật tập hình ảnh bị lỗi!', 'danger'));
    }
}

export function deleteCarousel(id) {
    return dispatch => {
        const url = '/admin/carousel';
        T.delete(url, { id }, data => {
            if (data.error) {
                T.notify('Xóa tập hình ảnh bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('Tập hình ảnh đã xóa thành công!', 'error', false, 800);
                dispatch(getCarouselInPage());
            }
        }, error => T.notify('Xóa hình ảnh bị lỗi!', 'danger'));
    }
}




export function createCarouselItem(data, done) {
    return dispatch => {
        const url = '/admin/carousel/item';
        T.post(url, { data }, data => {
            if (data.error) {
                T.notify('Tạo hình ảnh bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getCarousel(data.item.carouselId));
                if (done) done(data);
            }
        }, error => T.notify('Tạo hình ảnh bị lỗi!', 'danger'));
    }
}

export function updateCarouselItem(_id, changes, done) {
    return dispatch => {
        const url = '/admin/carousel/item';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật hình ảnh bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
            } else {
                T.notify('Cập nhật hình ảnh thành công!', 'info');
                dispatch(getCarousel(data.item.carouselId));
                if (done) done();
            }
        }, error => T.notify('Cập nhật hình ảnh bị lỗi!', 'danger'));
    }
}

export function swapCarouselItem(_id, isMoveUp) {
    return dispatch => {
        const url = '/admin/carousel/item/swap/';
        T.put(url, { _id, isMoveUp }, data => {
            if (data.error) {
                T.notify('Thay đổi vị trí hình ảnh bị lỗi!', 'danger')
                console.error('PUT: ' + url + '. ' + data.error);
            } else {
                dispatch(getCarousel(data.item1.carouselId));
            }
        }, error => T.notify('Thay đổi vị trí hình ảnh bị lỗi!', 'danger'));
    }
}

export function deleteCarouselItem(_id) {
    return dispatch => {
        const url = '/admin/carousel/item';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa hình ảnh bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('Hình ảnh được xóa thành công!', 'error', false, 800);
                dispatch(getCarousel(data.carouselId));
            }
        }, error => T.notify('Xóa hình ảnh bị lỗi!', 'danger'));
    }
}

export function changeCarouselItem(item) {
    return { type: UPDATE_CAROUSEL_ITEM, item };
}


// Home -------------------------------------------------------------------------------------------
export function homeGetCarousel(_id, done) {
    return dispatch => {
        const url = '/home/carousel/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Error when got images!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
            }
        }, error => {
            console.error('GET: ' + url + '. ' + error);
        });
    }
}