import React from 'react';
import { connect } from 'react-redux';
import { saveSystemState } from '../redux/system.jsx';
import { Link } from 'react-router-dom';
import ImageBox from '../common/ImageBox.jsx';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.address = React.createRef();
        this.email = React.createRef();
        this.emailPassword = React.createRef();
        this.emailPassword1 = React.createRef();
        this.emailPassword2 = React.createRef();
        this.mobile = React.createRef();
        this.fax = React.createRef();
        this.facebook = React.createRef();
        this.youtube = React.createRef();
        this.twitter = React.createRef();
        this.instagram = React.createRef();
        this.headerText = React.createRef();
        this.headerImage = React.createRef();
        this.logoImage = React.createRef();
        this.footerImage = React.createRef();
        this.logoUploadBox = React.createRef();
        this.footerUploadBox = React.createRef();
        this.latitude = React.createRef();
        this.longitude = React.createRef();
        this.hotNewsActive = React.createRef();
        this.hotNewsTitle = React.createRef();
        this.hotNewsUrl = React.createRef();
        this.hotNewsDescription = React.createRef();
        this.hotNews = React.createRef();

        this.saveCommonInfo = this.saveCommonInfo.bind(this);
        this.saveMapInfo = this.saveMapInfo.bind(this);
        this.saveHotNewsInfo = this.saveHotNewsInfo.bind(this);
        this.deleteHotNewsImage = this.deleteHotNewsImage.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(1, 0);
        });
    }

    saveCommonInfo() {
        this.props.saveSystemState({
            address: $(this.address.current).val().trim(),
            email: $(this.email.current).val().trim(),
            mobile: $(this.mobile.current).val().trim(),
            fax: $(this.fax.current).val().trim(),
            facebook: $(this.facebook.current).val().trim(),
            youtube: $(this.youtube.current).val().trim(),
            twitter: $(this.twitter.current).val().trim(),
            instagram: $(this.instagram.current).val().trim(),
            headerText: $(this.headerText.current).val().trim(),
        });
    }
    saveMapInfo() {
        this.props.saveSystemState({
            latitude: $(this.latitude.current).val().trim(),
            longitude: $(this.longitude.current).val().trim(),
        });
    }
    saveHotNewsInfo() {
        this.props.saveSystemState({
            hotNewsActive: $(this.hotNewsActive.current).prop('checked'),
            hotNewsTitle: $(this.hotNewsTitle.current).val().trim(),
            hotNewsUrl: $(this.hotNewsUrl.current).val().trim(),
            hotNewsDescription: $(this.hotNewsDescription.current).val().trim(),
        });
    }
    deleteHotNewsImage() {
        this.props.saveSystemState({ hotNewsImage: '' }, () => {
            this.hotNews.current.setData('hotNews', null);
        });
    }

    changePassword() {
        const emailPassword = $(this.emailPassword.current).val(),
            emailPassword1 = $(this.emailPassword1.current).val(),
            emailPassword2 = $(this.emailPassword2.current).val();
        if (emailPassword == '') {
            T.notify('Mật khẩu email hiện tại bị trống!', 'danger');
            $(this.emailPassword.current).focus();
        } else if (emailPassword1 == '') {
            T.notify('Mật khẩu mới của email hiện tại bị trống!', 'danger');
            $(this.emailPassword1.current).focus();
        } else if (emailPassword2 == '') {
            T.notify('Vui lòng nhập lại mật khẩu mới của email!', 'danger');
            $(this.emailPassword2.current)
        } else if (emailPassword1 != emailPassword2) {
            T.notify('Mật khẩu mới của email không trùng nhau!', 'danger');
            $(this.emailPassword1.current)
        } else {
            this.props.saveSystemState({
                currentPassword: emailPassword,
                newPassword: emailPassword1
            });
            $(this.emailPassword.current).val('');
            $(this.emailPassword1.current).val('');
            $(this.emailPassword2.current).val('');
        }
    }

    render() {
        let { address, email, mobile, fax, facebook, youtube, twitter, instagram, headerText, headerImage, logo, footer, latitude, longitude, map, hotNewsActive, hotNewsTitle, hotNewsUrl, hotNewsDescription, hotNewsImage } = this.props.system ?
            this.props.system : { address: '', email: '', mobile: '', fax: '', facebook: '', youtube: '', twitter: '', instagram: '', headerText: '', headerImage: '', logo: '', footer: '', hotNewsActive: true, hotNewsTitle: '', hotNewsUrl: '#', hotNewsDescription: '', hotNewsImage: '' };
        hotNewsActive = hotNewsActive && hotNewsActive.toString().toLowerCase() == 'true';

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-cog' /> Cấu hình</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Cấu hình</li>
                    </ul>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className='tile'>
                            <h3 className='tile-title'>Thông tin FAS</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Địa chỉ</label>
                                    <input className='form-control' type='text' placeholder='Địa chỉ' ref={this.address} defaultValue={address} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Email</label>
                                    <input className='form-control' type='email' placeholder='Email' ref={this.email} defaultValue={email} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Số điện thoại</label>
                                    <input className='form-control' type='text' placeholder='Số điện thoại' ref={this.mobile} defaultValue={mobile} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Fax</label>
                                    <input className='form-control' type='text' placeholder='Fax' ref={this.fax} defaultValue={fax} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Facebook</label>
                                    <input className='form-control' type='text' placeholder='Facebook' ref={this.facebook} defaultValue={facebook} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Youtube</label>
                                    <input className='form-control' type='text' placeholder='Youtube' ref={this.youtube} defaultValue={youtube} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Twitter</label>
                                    <input className='form-control' type='text' placeholder='Twitter' ref={this.twitter} defaultValue={twitter} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Instagram</label>
                                    <input className='form-control' type='text' placeholder='Instagram' ref={this.instagram} defaultValue={instagram} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Tiêu đề đầu trang chủ</label>
                                    <input className='form-control' type='text' placeholder='Tiêu đề trang chủ' ref={this.headerText} defaultValue={headerText} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Hình ảnh đầu trang chủ</label>
                                    <ImageBox postUrl='/admin/upload' uploadType='SettingImage' userData='headerImage' image={headerImage} />
                                </div>
                            </div>
                            <div className='tile-footer' style={{ textAlign: 'right' }}>
                                <button className='btn btn-primary' type='button' onClick={this.saveCommonInfo}>
                                    <i className='fa fa-fw fa-lg fa-check-circle'></i>Lưu
                                </button>
                            </div>
                        </div>

                        <div className='tile'>
                            <h3 className='tile-title'>Bản đồ</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Latitude</label>
                                    <input className='form-control' type='number' placeholder='Latitude' ref={this.latitude} defaultValue={latitude} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Longitude</label>
                                    <input className='form-control' type='number' placeholder='Longitude' ref={this.longitude} defaultValue={longitude} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Bản đồ</label>
                                    <ImageBox postUrl='/admin/upload' uploadType='SettingImage' userData='map' image={map} />
                                </div>
                            </div>
                            <div className='tile-footer' style={{ textAlign: 'right' }}>
                                <button className='btn btn-primary' type='button' onClick={this.saveMapInfo}>
                                    <i className='fa fa-fw fa-lg fa-check-circle'></i>Lưu
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className='tile'>
                            <h3 className='tile-title'>Đổi mật khẩu email khoa</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Mật khẩu hiện tại</label>
                                    <input className='form-control' type='password' placeholder='Mật khẩu hiện tại' ref={this.emailPassword} defaultValue='' />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Mật khẩu mới</label>
                                    <input className='form-control' type='password' placeholder='Mật khẩu mới' ref={this.emailPassword1} defaultValue='' />
                                    <input className='form-control' type='password' placeholder='Nhập lại mật khẩu' ref={this.emailPassword2} defaultValue='' />
                                </div>
                            </div>
                            <div className='tile-footer'>
                                <div className='row'>
                                    <div className='col-md-12' style={{ textAlign: 'right' }}>
                                        <button className='btn btn-primary' type='button' onClick={this.changePassword}>
                                            <i className='fa fa-fw fa-lg fa-check-circle'></i>Đổi mật khẩu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='tile'>
                            <h3 className='tile-title'>Hình ảnh</h3>
                            <div className='tile-body'>
                                <div className='tile-body'>
                                    <div className='form-group'>
                                        <label className='control-label'>Logo</label>
                                        <ImageBox postUrl='/admin/upload' uploadType='SettingImage' userData='logo' image={logo} />
                                    </div>
                                    <div className='form-group'>
                                        <label className='control-label'>Hình ảnh Footer</label>
                                        <ImageBox postUrl='/admin/upload' uploadType='SettingImage' userData='footer' image={footer} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='tile'>
                            <h3 className='tile-title'>Tin tức nóng</h3>
                            <div className='tile-body'>
                                <div className='tile-body'>
                                    <div className='toggle'>
                                        Kích hoạt:&nbsp;
                                        <label>
                                            <input type='checkbox' ref={this.hotNewsActive} defaultChecked={hotNewsActive} onChange={() => { }} /><span className='button-indecator' />
                                        </label>
                                    </div>
                                    <div className='form-group'>
                                        <label className='control-label'>Tiêu đề</label>
                                        <input className='form-control' type='text' placeholder='Tiêu đề' ref={this.hotNewsTitle} defaultValue={hotNewsTitle} />
                                    </div>
                                    <div className='form-group'>
                                        <label className='control-label'>URL</label>
                                        <input className='form-control' type='text' placeholder='URL' ref={this.hotNewsUrl} defaultValue={hotNewsUrl} />
                                    </div>
                                    <div className='form-group'>
                                        <label className='control-label'>Mô tả</label>
                                        <textarea placeholder='Mô tả' ref={this.hotNewsDescription} defaultValue={hotNewsDescription} style={{ width: '100%', minHeight: '100px' }} />
                                    </div>
                                    <div className='form-group'>
                                        <label className='control-label'>Hình ảnh</label>
                                        <ImageBox ref={this.hotNews} postUrl='/admin/upload' uploadType='SettingImage' userData='hotNews' image={hotNewsImage} />
                                    </div>
                                </div>
                                <div className='tile-footer' style={{ textAlign: 'right' }}>
                                    <button className='btn btn-danger' type='button' onClick={this.deleteHotNewsImage} style={{ marginRight: '6px' }}>
                                        <i className='fa fa-fw fa-lg fa-check-circle'></i>Xóa hình
                                    </button>
                                    <button className='btn btn-primary' type='button' onClick={this.saveHotNewsInfo}>
                                        <i className='fa fa-fw fa-lg fa-check-circle'></i>Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({ system: state.system });
const mapActionsToProps = { saveSystemState };
export default connect(mapStateToProps, mapActionsToProps)(SettingsPage);