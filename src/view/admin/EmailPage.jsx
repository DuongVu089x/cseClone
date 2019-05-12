import React from 'react';
import { getSystemEmails, saveSystemEmails } from '../redux/system.jsx'
import { Link } from 'react-router-dom';
import Editor from '../common/CkEditor4.jsx';

class EmailItem extends React.Component {
    constructor(props) {
        super(props);

        this.title = React.createRef();
        this.text = React.createRef();
        this.editor = React.createRef();
    }

    set(title, text, html) {
        this.title.current.value = title;
        this.text.current.value = text;
        this.editor.current.html(html);
    }

    get() {
        return {
            title: this.title.current.value,
            text: this.text.current.value,
            html: this.editor.current.html(),
        }
    }

    render() {
        const className = this.props.active ? 'tab-pane fade active show' : 'tab-pane fade';
        return (
            <div className={className} id={this.props.id}>
                <div className='tile-body'>
                    <div className='form-group'>
                        <label className='control-label'>Tiêu đề</label>
                        <input className='form-control' type='text' defaultValue='' ref={this.title} placeholder='Tiêu đề email' />
                    </div>
                    <div className='form-group'>
                        <label className='control-label'>Text</label>
                        <small className='form-text text-muted'>Tham số: {this.props.params}</small>
                        <textarea defaultValue='' ref={this.text} style={{ border: 'solid 1px #eee', width: '100%', minHeight: '200px', padding: '0 3px' }} />
                    </div>
                    <div className='form-group'>
                        <label className='control-label'>HTML</label>
                        <small className='form-text text-muted'>Tham số: {this.props.params}</small>
                        <Editor ref={this.editor} placeholder='Nội dung email' />
                    </div>
                </div>
            </div>
        );
    }
}

export default class EmailPage extends React.Component {
    constructor(props) {
        super(props);
        this.emailRegisterMember = React.createRef();
        this.emailCreateMemberByAdmin = React.createRef();
        this.emailNewPassword = React.createRef();
        this.emailForgotPassword = React.createRef();
        this.emailContact = React.createRef();

        this.save = this.save.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(1, 2);

            getSystemEmails(data => {
                this.emailRegisterMember.current.set(data.emailRegisterMemberTitle, data.emailRegisterMemberText, data.emailRegisterMemberHtml);
                this.emailCreateMemberByAdmin.current.set(data.emailCreateMemberByAdminTitle, data.emailCreateMemberByAdminText, data.emailCreateMemberByAdminHtml);
                this.emailNewPassword.current.set(data.emailNewPasswordTitle, data.emailNewPasswordText, data.emailNewPasswordHtml);
                this.emailForgotPassword.current.set(data.emailForgotPasswordTitle, data.emailForgotPasswordText, data.emailForgotPasswordHtml);
                this.emailContact.current.set(data.emailContactTitle, data.emailContactText, data.emailContactHtml);
            });
        });
    }

    save() {
        const emailType = $('ul.nav.nav-tabs li.nav-item a.nav-link.active').attr('href').substring(1);
        const email = this[emailType].current.get();
        saveSystemEmails(emailType, email);
    }

    render() {
        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-cog' /> Email</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Email</li>
                    </ul>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <div className='tile'>
                            <ul className='nav nav-tabs'>
                                <li className='nav-item'>
                                    <a className='nav-link active show' data-toggle='tab' href='#emailRegisterMember'>Thành viên mới</a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' data-toggle='tab' href='#emailCreateMemberByAdmin'>Admin tạo thành viên</a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' data-toggle='tab' href='#emailNewPassword'>Mật khẩu mới</a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' data-toggle='tab' href='#emailForgotPassword'>Quên mật khẩu</a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' data-toggle='tab' href='#emailContact'>Liên hệ</a>
                                </li>
                            </ul>
                            <div className='tab-content' style={{ marginTop: '12px' }}>
                                <EmailItem ref={this.emailRegisterMember} id='emailRegisterMember' active={true}
                                    params='{name}, {url}' />
                                <EmailItem ref={this.emailCreateMemberByAdmin} id='emailCreateMemberByAdmin'
                                    params='{name}, {email}, {password}, {url}' />
                                <EmailItem ref={this.emailNewPassword} id='emailNewPassword'
                                    params='{name}, {email}, {password}' />
                                <EmailItem ref={this.emailForgotPassword} id='emailForgotPassword'
                                    params='{name}, {email}, {url}' />
                                <EmailItem ref={this.emailContact} id='emailContact'
                                    params='{title}, {message}' />
                            </div>

                        </div>
                    </div>
                </div>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.save}>
                    <i className='fa fa-lg fa-save' />
                </button>
            </main>
        );
    }
}