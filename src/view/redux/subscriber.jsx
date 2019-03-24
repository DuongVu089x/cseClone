import T from '../common/js/common';

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_SUBSCRIBERS = 'subscriber:getSubscribers';
const GET_SUBSCRIBER_IN_PAGE = 'subscriber:getSubscriberInPage';
const UPDATE_SUBSCRIBER = 'subscriber:UpdateSubscriber';

export default function subscriberReducer(state = null, data) {
    switch (data.type) {
        case GET_SUBSCRIBERS:
            return Object.assign({}, state, { items: data.items });

        case GET_SUBSCRIBER_IN_PAGE:
            return Object.assign({}, state, { page: data.page });

        case UPDATE_SUBSCRIBER:
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
T.initCookiePage('adminSubscriber');
export function getAllSubscribers(done) {
    return dispatch => {
        const url = '/admin/subscriber/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách subscriber bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_SUBSCRIBERS, items: data.items ? data.items : [] });
            }
        }, error => T.notify('Lấy danh sách subscriber bị lỗi!', 'danger'));
    }
}

export function getSubscriberInPage(pageNumber, pageSize, done) {
    const page = T.updatePage('adminSubscriber', pageNumber, pageSize);
    return dispatch => {
        const url = '/admin/subscriber/page/' + page.pageNumber + '/' + page.pageSize;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách subscriber bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.page.pageNumber, data.page.pageSize, data.page.pageTotal, data.page.totalItem);
                dispatch({ type: GET_SUBSCRIBER_IN_PAGE, page: data.page });
            }
        }, error => T.notify('Lấy danh sách subscriber bị lỗi!', 'danger'));
    }
}

export function getSubscriber(subscriberId, done) {
    return dispatch => {
        const url = '/admin/subscriber/' + subscriberId;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy thông tin subscriber bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
                // dispatch({ type: GET_SUBSCRIBERS, items: data.items });
            }
        }, error => {
            console.error('GET: ' + url + '. ' + error);
        });
    }
}

export function createSubscriber(email, done) {
    return dispatch => {
        const url = '/home/subscriber';
        T.post(url, { email }, data => {
            if (data.error) {
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getSubscriberInPage());
            }
            if (done) done(data);
        }, error => T.notify('Tạo subscriber bị lỗi!', 'danger'));
    }
}

export function deleteSubscriber(_id) {
    return dispatch => {
        const url = '/admin/subscriber';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa subscriber bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('Subscriber đã xóa thành công!', 'error', false, 800);
                dispatch(getSubscriberInPage());
            }
        }, error => T.notify('Xóa subscriber bị lỗi!', 'danger'));
    }
}

export function changeSubscriber(item) {
    return { type: UPDATE_SUBSCRIBER, item };
}

export function downloadSubscriber() {
    T.download(T.url('/admin/subscriber/download'), 'subscriber.xlsx');
}

export function sendEmailToSubscriber(mailSubject, mailText, mailHtml, done) {
    const url = '/admin/subscriber/send';
    T.post(url, { mailSubject, mailText, mailHtml }, data => {
        if (data.error) {
            T.notify('Gửi email đến subscriber bị lỗi!', 'danger');
            console.error('POST: ' + url + '. ' + data.error);
        } else {
            T.alert('Gửi email đến subscriber thành công!', 'error', false, 800);
            if (done) done();
        }
    }, error => T.notify('Gửi email đến subscriber bị lỗi!', 'danger'));
}