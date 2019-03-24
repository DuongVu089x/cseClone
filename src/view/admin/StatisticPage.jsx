import React from 'react';
import { connect } from 'react-redux';
import { getAllStatistics, createStatistic, deleteStatistic } from '../redux/statistic.jsx'
import { Link } from 'react-router-dom';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
        this.btnSave = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => $(this.modal.current).on('shown.bs.modal', () => $('#statisticName').focus()), 250);
        });
    }

    show() {
        $('#statisticName').val('');
        $(this.modal.current).modal('show');
    }

    save(event) {
        const statisticName = $('#statisticName').val().trim();
        if (statisticName == '') {
            T.notify('Tên nhóm thống kê bị trống!', 'danger');
            $('#statisticName').focus();
        } else {
            this.props.createStatistic(statisticName, data => {
                if (data.error == undefined || data.error == null) {
                    $(this.modal.current).modal('hide');
                    if (data.statistic) {
                        this.props.showStatistic(data.statistic);
                    }
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thông tin nhóm thống kê</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='statisticName'>Tên nhóm thống kê</label>
                                <input className='form-control' id='statisticName' type='text' placeholder='Tên nhóm thống kê' />
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

class StatisticPage extends React.Component {
    constructor(props) {
        super(props);
        this.modal = React.createRef();

        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 4);
            this.props.getAllStatistics();
        });
    }

    create(e) {
        this.modal.current.show();
        e.preventDefault();
    }

    show(item) {
        this.props.history.push('/admin/statistic/edit/' + item._id);
    }

    delete(e, item) {
        T.confirm('Xóa nhóm thống kê', 'Bạn có chắc bạn muốn xóa nhóm thống kê này?', true, isConfirm =>
            isConfirm && this.props.deleteStatistic(item._id));
        e.preventDefault();
    }

    render() {
        let table = null;
        if (this.props.statistic && this.props.statistic.list && this.props.statistic.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Tên nhóm</th>
                            <th style={{ width: 'auto', whiteSpace: 'nowrap' }}>Số lượng</th>
                            <th style={{ width: 'auto', whiteSpace: 'nowrap' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.statistic.list.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={'/admin/statistic/edit/' + item._id} data-id={item._id}>
                                        {item.title}
                                    </Link>
                                </td>
                                <td style={{ textAlign: 'right' }}>{item.items.length}</td>
                                <td className='btn-group'>
                                    <Link to={'/admin/statistic/edit/' + item._id} data-id={item._id} className='btn btn-primary'>
                                        <i className='fa fa-lg fa-edit' />
                                    </Link>
                                    <a className='btn btn-danger' href='#' onClick={e => this.delete(e, item)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có nhóm thống kê!</p>;
        }

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-bar-chart' /> Thống kê</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Thống kê</li>
                    </ul>
                </div>

                <div className='row tile'>{table}</div>
                <ItemModal createStatistic={this.props.createStatistic} showStatistic={this.show} ref={this.modal} />
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ statistic: state.statistic });
const mapActionsToProps = { getAllStatistics, createStatistic, deleteStatistic };
export default connect(mapStateToProps, mapActionsToProps)(StatisticPage);