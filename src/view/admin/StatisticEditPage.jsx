import React from 'react';
import { connect } from 'react-redux';
import { getStatisticItem, updateStatistic, addStatisticIntoGroup, updateStatisticInGroup, removeStatisticFromGroup, swapStatisticInGroup } from '../redux/statistic.jsx'
import { Link } from 'react-router-dom';
import ImageBox from '../common/ImageBox.jsx';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.save = this.save.bind(this);
        this.imageChanged = this.imageChanged.bind(this);

        this.modal = React.createRef();
        this.editor = React.createRef();
        this.btnSave = React.createRef();
        this.imageBox = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => $(this.modal.current).on('shown.bs.modal', () => $('#sttTitle').focus()), 250);
        });
    }

    imageChanged(data) {
        this.setState({ image: data.url });
    }

    show(selectedItem, index) {
        const { title, image, number } = selectedItem ? selectedItem : { title: '', image: '', number: 0 };
        $('#sttTitle').val(title);
        $('#sttNumber').val(number);
        $(this.btnSave.current).data('isNewMember', selectedItem == null).data('index', index);

        this.imageBox.current.setData('statistic', image);
        this.setState({ image });

        $(this.modal.current).modal('show');
    }
    hide() {
        $(this.modal.current).modal('hide');
    }

    save(event) {
        const btnSave = $(this.btnSave.current),
            isNewMember = btnSave.data('isNewMember'),
            index = btnSave.data('index'),
            title = $('#sttTitle').val(),
            number = $('#sttNumber').val();
        if (isNewMember) {
            this.props.addStatistic(title, this.state.image, number);
        } else {
            this.props.updateStatistic(index, title, this.state.image, number);
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thống kê</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group row'>
                                <div className='col-8'>
                                    <div className='form-group'>
                                        <label htmlFor='sttTitle'>Tên</label><br />
                                        <input className='form-control' id='sttTitle' type='text' placeholder='Tên' />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='sttNumber'>Số lượng</label><br />
                                        <input className='form-control' id='sttNumber' type='number' placeholder='Số lượng' />
                                    </div>
                                </div>
                                <div className='col-4'>
                                    <label>Hình</label>
                                    <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='StatisticImage' userData='statistic' success={this.imageChanged} />
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Đóng</button>
                            <button type='button' className='btn btn-primary' ref={this.btnSave} onClick={this.save}>Lưu</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class StatisticEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.swap = this.swap.bind(this);
        this.showAddStatisticModal = this.showAddStatisticModal.bind(this);
        this.showEditStatisticModal = this.showEditStatisticModal.bind(this);

        this.modal = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 4);

            const route = T.routeMatcher('/admin/statistic/edit/:statisticId'),
                params = route.parse(window.location.pathname);

            this.props.getStatisticItem(params.statisticId, data => {
                if (data.error) {
                    T.notify('Lấy nhóm thống kê bị lỗi!', 'danger');
                    this.props.history.push('/admin/statistic');
                } else if (data.item) {
                    $('#tepTitle').val(data.item.title).focus();
                } else {
                    this.props.history.push('/admin/statistic');
                }
            });
        });
    }

    showAddStatisticModal() {
        this.modal.current.show();
    }
    showEditStatisticModal(e, selectedStatistic, index) {
        this.modal.current.show(selectedStatistic, index);
        e.preventDefault();
    }

    add(title, image, number) {
        this.props.addStatisticIntoGroup(title, image, number);
        this.modal.current.hide();
    }
    update(index, title, image, number) {
        this.props.updateStatisticInGroup(index, title, image, number);
        this.modal.current.hide();
    }
    remove(e, index) {
        this.props.removeStatisticFromGroup(index);
        e.preventDefault();
    }
    swap(e, index, isMoveUp) {
        this.props.swapStatisticInGroup(index, isMoveUp);
        e.preventDefault();
    }

    save() {
        const changes = {
            title: $('#tepTitle').val(),
            items: this.props.statistic.item.items,
        };
        this.props.updateStatistic(this.props.statistic.item._id, changes);
    }

    render() {
        let table = null,
            currentStatistic = this.props.statistic ? this.props.statistic.item : null;
        if (currentStatistic && currentStatistic.items.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Tên</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Số lượng</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStatistic.items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.showEditStatisticModal(e, item, index)}>{item.title}</a>
                                </td>
                                <td style={{ textAlign: 'right' }}>{T.numberDisplay(item.number)}</td>
                                <td className='btn-group'>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, index, true)}>
                                        <i className='fa fa-lg fa-arrow-up' />
                                    </a>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, index, false)}>
                                        <i className='fa fa-lg fa-arrow-down' />
                                    </a>
                                    <a className='btn btn-primary' href='#' onClick={e => this.showEditStatisticModal(e, item, index)}>
                                        <i className='fa fa-lg fa-edit' />
                                    </a>
                                    <a className='btn btn-danger' href='#' onClick={e => this.remove(e, index)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có thống kê!</p>;
        }

        const title = currentStatistic && currentStatistic.title && currentStatistic.title != '' ? currentStatistic.title : '<empty>';
        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-bar-chart' /> Thống kê: Chỉnh sửa</h1>
                        <p dangerouslySetInnerHTML={{ __html: title }} />
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;
                        <Link to='/admin/statistic'>Statistic</Link>
                        &nbsp;/&nbsp;Chỉnh sửa
                    </ul>
                </div>
                <div className='row'>
                    <div className='tile col-md-12'>
                        <div className='tile-body'>
                            <div className='form-group'>
                                <label className='control-label'>Tiêu đề</label>
                                <input className='form-control' type='text' placeholder='Tiêu đề' id='tepTitle' defaultValue={title} />
                            </div>
                            <div className='form-group'>
                                {table}
                            </div>
                        </div>
                        <div className='tile-footer'>
                            <div className='row'>
                                <div className='col-md-12' style={{ textAlign: 'right' }}>
                                    <button className='btn btn-info' type='button' onClick={this.showAddStatisticModal}>
                                        <i className='fa fa-fw fa-lg fa-plus'></i>Thêm statistic
                                    </button>&nbsp;
                                    <button className='btn btn-primary' type='button' onClick={this.save}>
                                        <i className='fa fa-fw fa-lg fa-save'></i>Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to='/admin/statistic' className='btn btn-secondary btn-circle' style={{ position: 'fixed', lefft: '10px', bottom: '10px' }}>
                    <i className='fa fa-lg fa-reply' />
                </Link>

                <ItemModal ref={this.modal} addStatistic={this.add} updateStatistic={this.update} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ statistic: state.statistic });
const mapActionsToProps = { getStatisticItem, updateStatistic, addStatisticIntoGroup, updateStatisticInGroup, removeStatisticFromGroup, swapStatisticInGroup };
export default connect(mapStateToProps, mapActionsToProps)(StatisticEditPage);