import React from 'react';
import { connect } from 'react-redux';
import { updateProfile } from '../redux/system.jsx'
import { Link } from 'react-router-dom';
import ImageBox from '../common/ImageBox.jsx';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveProfile = this.saveProfile.bind(this);
        this.savePassword = this.savePassword.bind(this);

        this.firstname = React.createRef();
        this.lastname = React.createRef();
        this.email = React.createRef();
        this.phoneNumber = React.createRef();
        this.password1 = React.createRef();
        this.password2 = React.createRef();
        this.imageBox = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => {
                if (this.props.system && this.props.system.user) {
                    const image = this.props.system.user.image ? this.props.system.user.image : '/img/avatar.jpg';
                    this.setState({ image });
                }
            }, 500);
        });
    }

    saveProfile() {
        const firstname = $(this.firstname.current).val().trim(),
            lastname = $(this.lastname.current).val().trim(),
            email = $(this.email.current).val().trim(),
            phoneNumber = $(this.phoneNumber.current).val().trim();
        if (firstname == '') {
            T.notify('Tên của bạn bị trống!', 'danger');
            $(this.firstname.current).focus();
        } else if (lastname == '') {
            T.notify('Họ của bạn bị trống!', 'danger');
            $(this.lastname.current).focus();
        } else if (email == '') {
            T.notify('Email của bạn bị trống!', 'danger');
            $(this.email.current).focus();
        } else {
            this.props.updateProfile({ firstname, lastname, email, phoneNumber });
        }
    }

    savePassword() {
        const password1 = $(this.password1.current).val(),
            password2 = $(this.password2.current).val();
        if (password1 == '') {
            T.notify('Mật khẩu mới của bạn bị trống!', 'danger');
            $(this.password1.current).focus();
        } else if (password2 == '') {
            T.notify('Bạn vui lòng nhập lại mật khẩu!', 'danger');
            $(this.password2.current).focus();
        } else if (password1 != password2) {
            T.notify('Mật khẩu không trùng nhau!', 'danger');
            $(this.password1.current).focus();
        } else {
            this.props.updateProfile({ password: password1 });
        }
    }

    render() {
        const { firstname, lastname, email, phoneNumber } = this.props.system && this.props.system.user ?
            this.props.system.user : { firstname: '', lastname: '', email: '', phoneNumber: '' };

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-user' /> Thông tin cá nhân</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Thông tin cá nhân</li>
                    </ul>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className='tile'>
                            <h3 className='tile-title'>Thông tin cá nhân</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Tên</label>
                                    <input className='form-control' type='text' placeholder='Tên' ref={this.firstname} defaultValue={firstname} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Họ</label>
                                    <input className='form-control' type='text' placeholder='Họ' ref={this.lastname} defaultValue={lastname} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Email</label>
                                    <input className='form-control' type='email' placeholder='Email' ref={this.email} defaultValue={email} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Số điện thoại</label>
                                    <input className='form-control' type='text' placeholder='Số điện thoại' ref={this.phoneNumber} defaultValue={phoneNumber} />
                                </div>
                            </div>
                            <div className='tile-footer' style={{ textAlign: 'right' }}>
                                <button className='btn btn-primary' type='button' onClick={this.saveProfile}>Lưu</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='tile'>
                            <h3 className='tile-title'>Hình đại diện</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Hình ảnh</label>
                                    <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='ProfileImage' userData='profile' image={this.state.image} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='tile'>
                            <h3 className='tile-title'>Mật khẩu</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Mật khẩu mới</label>
                                    <input className='form-control' type='password' placeholder='Mật khẩu mới' ref={this.password1} defaultValue='' />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Nhập lại mật khẩu</label>
                                    <input className='form-control' type='password' placeholder='Nhập lại mật khẩu' ref={this.password2} defaultValue='' />
                                </div>
                            </div>
                            <div className='tile-footer' style={{ textAlign: 'right' }}>
                                <button className='btn btn-primary' type='button' onClick={this.savePassword}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({ system: state.system });
const mapActionsToProps = { updateProfile };
export default connect(mapStateToProps, mapActionsToProps)(ProfilePage);