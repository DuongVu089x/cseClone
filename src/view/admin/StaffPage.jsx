import React from 'react';
import { connect } from 'react-redux';
import { getStaffInPage, createStaff, updateStaff, deleteStaff } from '../redux/staff.jsx'
import { getAllDivisions } from '../redux/division.jsx'
import { Link } from 'react-router-dom';
import ImageBox from '../common/ImageBox.jsx';
import Pagination from '../common/Pagination.jsx';

class StaffModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
        // this.division = React.createRef();
        this.imageBox = React.createRef();
        this.btnSave = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            this.props.getAllDivisions();
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#staffLastname').focus());
            }, 250);
        });
    }

    show(item) {
        const { _id, academicTitle, academicDistinction, lastname, firstname, email, divisionId, website, facebook, phoneNumber, active, image } = item ?
            item : { _id: null, academicTitle: '', academicDistinction: '', lastname: '', firstname: '', email: '', divisionId: [], website: '', facebook: '', phoneNumber: '', active: false, image: '' };
        $(this.btnSave.current).data('id', _id);
        $('#staffAcademicTitle').val(academicTitle);
        $('#staffAcademicDistinction').val(academicDistinction);
        $('#staffLastname').val(lastname);
        $('#staffFirstname').val(firstname);
        $('#staffEmail').val(email);
        $('#staffWebsite').val(website);
        $('#staffFacebook').val(facebook);
        $('#staffPhoneNumber').val(phoneNumber);
        $('#staffActive').prop('checked', active);
        $(document).ready(() => {
            $('#neStaffDivision').select2();
        });
        this.setState({ image });
        this.imageBox.current.setData('staff:' + (_id ? _id : 'new'));

        const items = this.props.division ? this.props.division : null;
        const divisionList = [];
        $.each(items, function(index,value){
            divisionList.push({
                id: value._id,
                text: value.name
            });
        })
        $('#neStaffDivision').select2({ data: divisionList}).val(divisionId);
        $(this.modal.current).modal('show');
    }

    save(event) {
        const _id = $(event.target).data('id'),
            // division = this.division.current.getSelectedItem().toLowerCase(),
            changes = {
                academicTitle: $('#staffAcademicTitle').val().trim(),
                academicDistinction: $('#staffAcademicDistinction').val().trim(),
                lastname: $('#staffLastname').val().trim(),
                firstname: $('#staffFirstname').val().trim(),
                email: $('#staffEmail').val().trim(),
                website: $('#staffWebsite').val().trim(),
                facebook: $('#staffFacebook').val().trim(),
                phoneNumber: $('#staffPhoneNumber').val().trim(),
                active: $('#staffActive').prop('checked'),
                divisionId: ($('#neStaffDivision').val().length > 0) ? $('#neStaffDivision').val() : '',
            };

        if (changes.lastname == '') {
            T.notify('Họ và chữ lót nhân viên bị trống!', 'danger');
            $('#staffLastname').focus();
        } else if (changes.firstname == '') {
            T.notify('Tên nhân viên bị trống!', 'danger');
            $('#staffFirstname').focus();
        } else if (changes.email == '') {
            T.notify('Email nhân viên bị trống!', 'danger');
            $('#staffEmail').focus();
        } else {
            if (_id) { // Update
                this.props.updateStaff(_id, changes, error => {
                    if (error == undefined || error == null) {
                        $(this.modal.current).modal('hide');
                    }
                });
            } else { // Create
                this.props.createStaff(changes, () => {
                    $(this.modal.current).modal('hide');
                });
            }
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thông tin nhân viên</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group row'>
                                <div className='col-8'>
                                    <label htmlFor='staffLastname'>Họ và chữ lót nhân viên</label>
                                    <input className='form-control' id='staffLastname' type='text' placeholder='Họ và chữ lót nhân viên' />
                                    <label htmlFor='staffFirstname'>Tên nhân viên</label>
                                    <input className='form-control' id='staffFirstname' type='text' placeholder='Tên nhân viên' />
                                    <label htmlFor='staffFacebook'>Facebook nhân viên</label>
                                    <input className='form-control' id='staffFacebook' type='text' placeholder='Facebook nhân viên' />
                                    <label htmlFor='staffWebsite'>Website nhân viên</label>
                                    <input className='form-control' id='staffWebsite' type='text' placeholder='Website nhân viên' />
                                </div>
                                <div className='col-4'>
                                    <label>Hình đại diện</label>
                                    <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='StaffImage' userData='staff' image={this.state.image} />
                                    <br />
                                    <div style={{ display: 'inline-flex' }}>
                                        <label htmlFor='staffActive'>Kích hoạt: </label>&nbsp;&nbsp;
                                        <div className='toggle'>
                                            <label>
                                                <input type='checkbox' id='staffActive' onChange={() => { }} /><span className='button-indecator' />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group row'>
                                <div className='col-6'>
                                    <label htmlFor='staffAcademicTitle'>Học hàm</label>
                                    <input className='form-control' id='staffAcademicTitle' type='text' placeholder='Học hàm' />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor='staffAcademicDistinction'>Học vị</label>
                                    <input className='form-control' id='staffAcademicDistinction' type='text' placeholder='Học vị' />
                                </div>
                            </div>
                            <div className='form-group row'>
                                <div className='col-6'>
                                    <label htmlFor='staffEmail'>Email nhân viên</label>
                                    <input className='form-control' id='staffEmail' type='email' placeholder='Email nhân viên' />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor='staffPhoneNumber'>Số điện thoại</label>
                                    <input className='form-control' id='staffPhoneNumber' type='text' placeholder='Số điện thoại' />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor='neStaffDivision' className='control-label'>Bộ phận</label><br/>
                                    <select className='form-control' id='neStaffDivision' multiple={true} defaultValue={[]}>
                                        <optgroup label='Lựa chọn danh mục' />                                       
                                    </select>
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

class StaffPage extends React.Component {
    constructor(props) {
        super(props);
        this.staffModal = React.createRef();

        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(1, 3);
            this.props.getStaffInPage();
        });
    }

    create(e) {
        this.staffModal.current.show(null);
        e.preventDefault();
    }

    edit(e, item) {
        this.staffModal.current.show(item);
        e.preventDefault();
    }

    changeActive(item, index) {
        this.props.updateStaff(item._id, { active: !item.active });
    }

    delete(e, item) {
        T.confirm('Xóa nhân viên', 'Bạn có chắc bạn muốn xóa nhân viên này?', true, isConfirm => {
            isConfirm && this.props.deleteStaff(item._id);
        });
        e.preventDefault();
    }

    render() {
        let table = null;
        if (this.props.staff && this.props.staff.page && this.props.staff.page.list && this.props.staff.page.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Tên</th>
                            <th style={{ width: '60%' }}>Email</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Hình ảnh</th>
                            <th style={{ width: 'auto' }} nowrap='true'>Kích hoạt</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.staff.page.list.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.edit(e, item)}>{item.firstname + ' ' + item.lastname}</a>
                                </td>
                                <td>{item.email}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <img src={item.image ? item.image : '/img/avatar.jpg'} alt='avatar' style={{ height: '32px' }} />
                                </td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <label>
                                        <input type='checkbox' checked={item.active} onChange={() => this.changeActive(item, index)} /><span className='button-indecator' />
                                    </label>
                                </td>
                                <td className='btn-group'>
                                    <a className='btn btn-primary' href='#' onClick={e => this.edit(e, item)}>
                                        <i className='fa fa-lg fa-edit' />
                                    </a>
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
            table = <p>Không có nhân viên!</p>;
        }

        const { pageNumber, pageSize, pageTotal, totalItem } = this.props.staff ?
            this.props.staff.page : { pageNumber: 1, pageSize: 50, pageTotal: 1, totalItem: 0 };
        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-file-video-o' /> Nhân sự</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Nhân sự</li>
                    </ul>
                </div>

                <div className='row tile'>{table}</div>
                <Pagination name='adminStaff' pageNumber={pageNumber} pageSize={pageSize} pageTotal={pageTotal} totalItem={totalItem}
                    getPage={this.props.getStaffInPage} />

                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>

                <StaffModal division={this.props.division} getAllDivisions={this.props.getAllDivisions} createStaff={this.props.createStaff} updateStaff={this.props.updateStaff} ref={this.staffModal} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ staff: state.staff, division: state.division });
const mapActionsToProps = { getStaffInPage, createStaff, updateStaff, deleteStaff, getAllDivisions };
export default connect(mapStateToProps, mapActionsToProps)(StaffPage);