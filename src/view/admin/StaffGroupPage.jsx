import React from 'react';
import { connect } from 'react-redux';
import { getAllStaffGroups, createStaffGroup, deleteStaffGroup } from '../redux/staffGroup.jsx'
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
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#staffGroupName').focus());
            }, 250);
        });
    }

    show() {
        $('#staffGroupName').val('');
        $(this.modal.current).modal('show');
    }

    save(event) {
        const staffGroupName = $('#staffGroupName').val().trim();
        if (staffGroupName == '') {
            T.notify('Tên nhóm nhân sự bị trống!', 'danger');
            $('#staffGroupName').focus();
        } else {
            this.props.createStaffGroup(staffGroupName, data => {
                if (data.error == undefined || data.error == null) {
                    $(this.modal.current).modal('hide');
                    if (data.staffGroup) {
                        this.props.showStaffGroup(data.staffGroup);
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
                            <h5 className='modal-title'>Thông tin nhóm nhân sự</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='staffGroupName'>Tên nhóm nhân sự</label>
                                <input className='form-control' id='staffGroupName' type='text' placeholder='Tên nhóm nhân sự' />
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

class StaffGroupPage extends React.Component {
    constructor(props) {
        super(props);
        this.staffGroupModal = React.createRef();

        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 5);
            this.props.getAllStaffGroups();
        });
    }

    create(e) {
        this.staffGroupModal.current.show();
        e.preventDefault();
    }

    show(staffGroup) {
        this.props.history.push('/admin/staff-group/edit/' + staffGroup._id);
    }

    delete(e, item) {
        T.confirm('Xóa nhóm nhân viên', 'Bạn có chắc bạn muốn xóa nhóm nhân viên này?', true, isConfirm => {
            isConfirm && this.props.deleteStaffGroup(item._id);
        });
        e.preventDefault();
    }

    render() {
        let table = null;
        if (this.props.staffGroup && this.props.staffGroup.list && this.props.staffGroup.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Tên nhóm</th>
                            <th style={{ width: 'auto', whiteSpace: 'nowrap' }}>Số lượng</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.staffGroup.list.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={'/admin/staff-group/edit/' + item._id} data-id={item._id}>{item.title}</Link>
                                </td>
                                <td style={{ textAlign: 'right' }}>{item.staff.length}</td>
                                <td className='btn-group'>
                                    <Link to={'/admin/staff-group/edit/' + item._id} data-id={item._id} className='btn btn-primary'>
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
            table = <p>Không có nhóm nhân viên!</p>;
        }

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-group' /> Nhóm nhân viên</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Nhóm nhân viên</li>
                    </ul>
                </div>

                <div className='row tile'>{table}</div>
                <ItemModal createStaffGroup={this.props.createStaffGroup} showStaffGroup={this.show} ref={this.staffGroupModal} />
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ staffGroup: state.staffGroup });
const mapActionsToProps = { getAllStaffGroups, createStaffGroup, deleteStaffGroup };
export default connect(mapStateToProps, mapActionsToProps)(StaffGroupPage);