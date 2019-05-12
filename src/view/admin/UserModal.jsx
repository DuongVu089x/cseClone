import React from 'react';
import ImageBox from '../common/ImageBox.jsx';
import Dropdown from '../common/Dropdown.jsx';

export default class UserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
        this.role = React.createRef();
        this.imageBox = React.createRef();
        this.btnSave = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#userFirstname').focus());
            }, 250);
        });
    }

    show(item) {
        const { _id, firstname, lastname, email, phoneNumber, role, active, image } = item ?
            item : { _id: null, firstname: '', lastname: '', email: '', phoneNumber: '', role: 'user', active: false, image: '' };
        $(this.btnSave.current).data('id', _id);
        $('#userFirstname').val(firstname);
        $('#userLastname').val(lastname);
        $('#userEmail').val(email);
        $('#userPhoneNumber').val(phoneNumber);
        $('#userActive').prop('checked', active);
        this.role.current.setText(role);

        this.setState({ image });
        this.imageBox.current.setData('user:' + (_id ? _id : 'new'));

        $(this.modal.current).modal('show');
    }

    save(event) {
        const _id = $(event.target).data('id'),
            role = this.role.current.getSelectedItem().toLowerCase(),
            changes = {
                firstname: $('#userFirstname').val().trim(),
                lastname: $('#userLastname').val().trim(),
                email: $('#userEmail').val().trim(),
                phoneNumber: $('#userPhoneNumber').val().trim(),
                active: $('#userActive').prop('checked'),
            };
        if (T.roles.indexOf(role) != -1) {
            changes.role = role;
        }
        if (changes.firstname == '') {
            T.notify('Tên người dùng bị trống!', 'danger');
            $('#userFirstname').focus();
        } else if (changes.lastname == '') {
            T.notify('Họ người dùng bị trống!', 'danger');
            $('#userLastname').focus();
        } else if (changes.email == '') {
            T.notify('Email người dùng bị trống!', 'danger');
            $('#userEmail').focus();
        } else {
            this.props.updateUser(_id, changes, error => {
                if (error == undefined || error == null) {
                    $(this.modal.current).modal('hide');
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thông tin người dùng</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='userFirstname'>Tên người dùng</label>
                                <input className='form-control' id='userFirstname' type='text' placeholder='Tên người dùng' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='userLastname'>Họ người dùng</label>
                                <input className='form-control' id='userLastname' type='text' placeholder='Họ người dùng' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='userEmail'>Email người dùng</label>
                                <input className='form-control' id='userEmail' type='email' placeholder='Email người dùng' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='userPhoneNumber'>Số điện thoại</label>
                                <input className='form-control' id='userPhoneNumber' type='text' placeholder='Số điện thoại' />
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-12' style={{ display: 'inline-flex' }}>
                                    <label>Vai trò: </label>&nbsp;&nbsp;
                                    <Dropdown ref={this.role} text='' items={T.roles} />
                                </div>
                                <div className='col-md-6 col-12' style={{ display: 'inline-flex' }}>
                                    <label htmlFor='userActive'>Kích hoạt: </label>&nbsp;&nbsp;
                                    <div className='toggle'>
                                        <label>
                                            <input type='checkbox' id='userActive' onChange={() => { }} /><span className='button-indecator' />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Hình đại diện</label>
                                <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='UserImage' userData='user' image={this.state.image} />
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