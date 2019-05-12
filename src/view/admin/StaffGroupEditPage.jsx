import React from 'react';
import { connect } from 'react-redux';
import { getStaffGroupItem, updateStaffGroup, addStaffIntoGroup, updateStaffInGroup, removeStaffFromGroup, swapStaffInGroup } from '../redux/staffGroup.jsx'
import { getAllStaffs } from '../redux/staff.jsx'
import { Link } from 'react-router-dom';
import Editor from '../common/CkEditor4.jsx';
import Select from 'react-select';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.save = this.save.bind(this);
        this.onSelectStaff = this.onSelectStaff.bind(this);

        this.modal = React.createRef();
        this.editor = React.createRef();
        this.btnSave = React.createRef();

        this.state = { staffs: [], selectedStaff: null };
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#sgaName').focus());
            }, 250);
        });
    }

    show(staffs, selectedStaff, index) {
        const value = selectedStaff ? { value: selectedStaff.staffId, label: selectedStaff.info.firstname + ' ' + selectedStaff.info.lastname } : null;
        this.setState({ selectedStaff: value, staffs });
        this.editor.current.html(selectedStaff ? selectedStaff.content : '');
        $(this.btnSave.current).data('isNewMember', selectedStaff == null).data('index', index);

        $(this.modal.current).modal('show');
    }
    hide() {
        $(this.modal.current).modal('hide');
    }

    onSelectStaff(selectedStaff) {
        this.setState({ selectedStaff })
    }

    save(event) {
        if (this.state.selectedStaff) {
            const btnSave = $(this.btnSave.current),
                isNewMember = btnSave.data('isNewMember'),
                index = btnSave.data('index'),
                staffId = this.state.selectedStaff.value;
            if (isNewMember) {
                this.props.addStaff(staffId, this.editor.current.html());
            } else {
                this.props.updateStaff(index, staffId, this.editor.current.html());
            }
        } else {
            T.notify('Tên nhân viên bị trống!', 'danger');
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thêm nhân viên vào nhóm</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='sgaName'>Tên nhân viên</label><br />
                                <Select options={this.state.staffs} isClearable={true} onChange={this.onSelectStaff} value={this.state.selectedStaff} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='sgaContent'>Nội dung</label>
                                <Editor ref={this.editor} placeholder='Nội dung' />
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

class StaffGroupEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.swap = this.swap.bind(this);
        this.showAddStaffModal = this.showAddStaffModal.bind(this);
        this.showEditStaffModal = this.showEditStaffModal.bind(this);

        this.modal = React.createRef();
        this.staffGroupId = null;
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 5);

            const route = T.routeMatcher('/admin/staff-group/edit/:staffGroupId'),
                params = route.parse(window.location.pathname);

            this.props.getStaffGroupItem(params.staffGroupId, data => {
                if (data.error) {
                    T.notify('Lấy nhóm nhân viên bị lỗi!', 'danger');
                    this.props.history.push('/admin/staff-group');
                } else if (data.item) {
                    this.staffGroupId = params.staffGroupId;
                    $('#stfTitle').val(data.item.title).focus();
                } else {
                    this.props.history.push('/admin/staff-group');
                }
            });

            this.props.getAllStaffs();
        });
    }

    showAddStaffModal() {
        let staffs = this.props.staff.items.map(item => ({ value: item._id, label: item.firstname + ' ' + item.lastname }));
        this.modal.current.show(staffs);
    }
    showEditStaffModal(e, selectedStaff, index) {
        let staffs = this.props.staff.items.map(item => ({ value: item._id, label: item.firstname + ' ' + item.lastname }));
        this.modal.current.show(staffs, selectedStaff, index);
        e.preventDefault();
    }

    add(staffId, content) {
        this.props.addStaffIntoGroup(staffId, content, () => this.modal.current.hide());
    }
    update(index, staffId, content) {
        this.props.updateStaffInGroup(index, staffId, content, () => this.modal.current.hide());
    }
    remove(e, staff) {
        this.props.removeStaffFromGroup(staff._id);
        e.preventDefault();
    }
    swap(e, staff, isMoveUp) {
        this.props.swapStaffInGroup(staff._id, isMoveUp);
        e.preventDefault();
    }

    save() {
        const changes = {
            title: $('#stfTitle').val(),
            staff: this.props.staffGroup.item.staff,
        };
        this.props.updateStaffGroup(this.props.staffGroup.item._id, changes);
    }

    render() {
        let table = null,
            currentStaffGroup = this.props.staffGroup ? this.props.staffGroup.item : null;
        if (currentStaffGroup && currentStaffGroup.staff.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Nhân viên</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStaffGroup.staff.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.showEditStaffModal(e, item, index)}>
                                        {item.info.firstname + ' ' + item.info.lastname}
                                    </a>
                                </td>
                                <td className='btn-group'>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, item, true)}>
                                        <i className='fa fa-lg fa-arrow-up' />
                                    </a>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, item, false)}>
                                        <i className='fa fa-lg fa-arrow-down' />
                                    </a>
                                    <a className='btn btn-primary' href='#' onClick={e => this.showEditStaffModal(e, item, index)}>
                                        <i className='fa fa-lg fa-edit' />
                                    </a>
                                    <a className='btn btn-danger' href='#' onClick={e => this.remove(e, item)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có nhân viên!</p>;
        }

        const title = currentStaffGroup && currentStaffGroup.title && currentStaffGroup.title != '' ? currentStaffGroup.title : '<empty>';
        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-group' /> Nhóm nhân sự: Chỉnh sửa</h1>
                        <p dangerouslySetInnerHTML={{ __html: title }} />
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;
                        <Link to='/admin/staff-group'>Nhóm nhân sự</Link>
                        &nbsp;/&nbsp;Chỉnh sửa
                    </ul>
                </div>
                <div className='row'>
                    <div className='tile col-md-12'>
                        <div className='tile-body'>
                            <div className='form-group'>
                                <label className='control-label'>Tiêu đề</label>
                                <input className='form-control' type='text' placeholder='Tiêu đề' id='stfTitle' defaultValue={title} />
                            </div>
                            <div className='form-group'>{table}</div>
                        </div>
                        <div className='tile-footer'>
                            <div className='row'>
                                <div className='col-md-12' style={{ textAlign: 'right' }}>
                                    <button className='btn btn-info' type='button' onClick={this.showAddStaffModal}>
                                        <i className='fa fa-fw fa-lg fa-plus'></i>Thêm nhân viên
                                    </button>&nbsp;
                                    <button className='btn btn-primary' type='button' onClick={this.save}>
                                        <i className='fa fa-fw fa-lg fa-save'></i>Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to='/admin/staff-group' className='btn btn-secondary btn-circle' style={{ position: 'fixed', lefft: '10px', bottom: '10px' }}>
                    <i className='fa fa-lg fa-reply' />
                </Link>

                <ItemModal ref={this.modal} addStaff={this.add} updateStaff={this.update} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ staffGroup: state.staffGroup, staff: state.staff });
const mapActionsToProps = { getStaffGroupItem, updateStaffGroup, addStaffIntoGroup, updateStaffInGroup, removeStaffFromGroup, swapStaffInGroup, getAllStaffs };
export default connect(mapStateToProps, mapActionsToProps)(StaffGroupEditPage);