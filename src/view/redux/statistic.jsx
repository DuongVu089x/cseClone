import T from '../common/js/common';

// Reducer ------------------------------------------------------------------------------------------------------------
const GET_STATISTIC_GROUPS = 'statistic:getAllStatisticGroups';
const ADD_STATISTIC_INTO_GROUP = 'statistic:addStatisticIntoGroup';
const UPDATE_STATISTIC_IN_GROUP = 'statistic:updateStatisticInGroup';
const REMOVE_STATISTIC_IN_GROUP = 'statistic:removeStatisticInGroup';
const SWAP_STATISTIC_IN_GROUP = 'statistic:swapStatisticInGroup';
const UPDATE_STATISTIC_GROUP = 'statistic:updateStatisticGroup';

export default function statisticReducer(state = null, data) {
    switch (data.type) {
        case GET_STATISTIC_GROUPS:
            return Object.assign({}, state, { list: data.items });

        case ADD_STATISTIC_INTO_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                state.item.items.push({
                    title: data.title,
                    image: data.image,
                    number: data.number,
                });
            }
            return state;

        case UPDATE_STATISTIC_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                if (0 <= data.index && data.index < state.item.items.length) {
                    state.item.items.splice(data.index, 1, {
                        title: data.title,
                        image: data.image,
                        number: data.number,
                    });
                }
            }
            return state;

        case REMOVE_STATISTIC_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                if (0 <= data.index && data.index < state.item.items.length) {
                    state.item.items.splice(data.index, 1);
                }
            }
            return state;

        case SWAP_STATISTIC_IN_GROUP:
            if (state && state.item) {
                state = Object.assign({}, state);
                const statistic = state.item.items[data.index];
                if (data.isMoveUp && data.index > 0) {
                    state.item.items.splice(data.index, 1);
                    state.item.items.splice(data.index - 1, 0, statistic);
                } else if (!data.isMoveUp && data.index < state.item.items.length - 1) {
                    state.item.items.splice(data.index, 1);
                    state.item.items.splice(data.index + 1, 0, statistic);
                }
            }
            return state;

        case UPDATE_STATISTIC_GROUP:
            return Object.assign({}, state, { item: data.item });

        default:
            return state;
    }
}

// Actions ------------------------------------------------------------------------------------------------------------
export function getAllStatistics(done) {
    return dispatch => {
        const url = '/admin/statistic/all';
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy danh sách thống kê bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.items);
                dispatch({ type: GET_STATISTIC_GROUPS, items: data.items });
            }
        }, error => T.notify('Lấy danh sách statistic bị lỗi!', 'danger'));
    }
}

export function createStatistic(title, done) {
    return dispatch => {
        const url = '/admin/statistic';
        T.post(url, { title }, data => {
            if (data.error) {
                T.notify('Tạo thống kê bị lỗi!', 'danger');
                console.error('POST: ' + url + '. ' + data.error);
            } else {
                dispatch(getAllStatistics());
                if (done) done(data);
            }
        }, error => T.notify('Tạo thống kê bị lỗi!', 'danger'));
    }
}

export function updateStatistic(_id, changes, done) {
    return dispatch => {
        const url = '/admin/statistic';
        T.put(url, { _id, changes }, data => {
            if (data.error) {
                T.notify('Cập nhật thông tin thống kê bị lỗi!', 'danger');
                console.error('PUT: ' + url + '. ' + data.error);
                done && done(data.error);
            } else {
                T.notify('Cập nhật thông tin thống kê thành công!', 'info');
                dispatch(getAllStatistics());
                done && done();
            }
        }, error => T.notify('Cập nhật thông tin thống kê bị lỗi!', 'danger'));
    }
}

export function deleteStatistic(_id) {
    return dispatch => {
        const url = '/admin/statistic';
        T.delete(url, { _id }, data => {
            if (data.error) {
                T.notify('Xóa thống kê bị lỗi!', 'danger');
                console.error('DELETE: ' + url + '. ' + data.error);
            } else {
                T.alert('nhân viên được xóa thành công!', 'error', false, 800);
                dispatch(getAllStatistics());
            }
        }, error => T.notify('Xóa thống kê bị lỗi!', 'danger'));
    }
}



export function getStatisticItem(_id, done) {
    return dispatch => {
        const url = '/admin/statistic/item/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy thống kê bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done({ item: data.item });
                dispatch({ type: UPDATE_STATISTIC_GROUP, item: data.item });
            }
        }, error => T.notify('Lấy thống kê bị lỗi!', 'danger'));
    }
}

export function addStatisticIntoGroup(title, image, number) {
    return { type: ADD_STATISTIC_INTO_GROUP, title, image, number };
}

export function updateStatisticInGroup(index, title, image, number) {
    return { type: UPDATE_STATISTIC_IN_GROUP, index, title, image, number };
}

export function removeStatisticFromGroup(index) {
    return { type: REMOVE_STATISTIC_IN_GROUP, index };
}

export function swapStatisticInGroup(index, isMoveUp) {
    return { type: SWAP_STATISTIC_IN_GROUP, index, isMoveUp };
}


export function getStatisticByUser(_id, done) {
    return dispatch => {
        const url = '/home/statistic/' + _id;
        T.get(url, data => {
            if (data.error) {
                T.notify('Lấy thống kê bị lỗi!', 'danger');
                console.error('GET: ' + url + '. ' + data.error);
            } else {
                if (done) done(data.item);
            }
        }, error => T.notify('Lấy thống kê bị lỗi!', 'danger'));
    }
}