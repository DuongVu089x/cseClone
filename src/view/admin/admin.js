export function changeConference(update, _id, changes, selectors, index1, index2) {
    let values = selectors.map(selector => ({ v1: $(selector + index1).val(), v2: $(selector + index2).val() }));
    update(_id, changes, error => {
        selectors.forEach((selector, index) => {
            $(selector + index1).val(values[index].v2);
            $(selector + index2).val(values[index].v1);
        });
    });
}