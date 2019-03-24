import React from 'react';

export default class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.modal = React.createRef();
        this.txtFirstname = React.createRef();
        this.txtLastname = React.createRef();
        this.txtEmail = React.createRef();
        this.txtPassword = React.createRef();
        this.btnForgotPassword = React.createRef();
        this.btnSend = React.createRef();
        this.errorMessage = React.createRef();

        this.showRegister = this.showRegister.bind(this);
        this.showLogin = this.showLogin.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNavLinkClick = this.onNavLinkClick.bind(this);
        this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
    }

    componentDidMount() {
        $(this.modal.current).on('shown.bs.modal', () => {
            if ($(this.btnSend.current).attr('data-action') === 'register') {
                $(this.txtFirstname.current).focus();
            } else {
                $(this.txtEmail.current).focus();
            }
        });
    }

    updateView(state) {
        const modal = $(this.modal.current);
        modal.find('a.nav-link').removeClass('active').removeClass('show');
        modal.find('a.nav-link[href="#' + state + '"]').addClass('active').addClass('show');

        modal.find('div.modal-content div.modal-body div.form-group').css('display', 'flex')
        if (state === 'register') {
            $(this.btnForgotPassword.current).css('display', 'none');
            modal.find('input').val('');
            $(this.btnSend.current).attr('data-action', state).html('Register');
        } else {
            $(this.btnForgotPassword.current).css('display', 'block');
            $(this.txtFirstname.current).parent().parent().css('display', 'none')
            $(this.txtLastname.current).parent().parent().css('display', 'none')
            $(this.btnSend.current).attr('data-action', state).html('Login');
        }
    }

    showRegister() {
        $('input').val('');
        $(this.errorMessage.current).html('');
        this.updateView('register');
        $(this.modal.current).modal('show');
    }

    showLogin() {
        $('input').val('');
        $(this.errorMessage.current).html('');
        this.updateView('login');
        $(this.modal.current).modal('show');
    }

    onNavLinkClick(e) {
        e.preventDefault();
        const state = $(e.target).attr('href').substring(1).toLowerCase();
        this.updateView(state);
    }

    onForgotPasswordClick(event) {
        const email = this.txtEmail.current.value.trim(),
            errorMessage = $(this.errorMessage.current);
        if (T.validateEmail(email) === false || email === '') {
            errorMessage.html('Invalid email!');
            $(this.txtEmail.current).focus();
        } else {
            this.props.forgotPassword(email, result => {
                if (result.error) {
                    errorMessage.html('Error when reset your password!');
                } else {
                    errorMessage.html('Your password has been reseted. Please check your email to get new password!');
                }
            }, () => errorMessage.html('Error when reset your password!'));
        }
        event.preventDefault();
    }

    onSubmit(e) {
        e.preventDefault();
        let btnSend = $(this.btnSend.current).attr('disabled', true),
            errorMessage = $(this.errorMessage.current),
            data = {
                lastname: this.txtFirstname.current.value.trim(),
                firstname: this.txtLastname.current.value.trim(),
                email: this.txtEmail.current.value.trim(),
                password: this.txtPassword.current.value
            };

        if (btnSend.attr('data-action') === 'register') { // Register
            if (data.firstname === '') {
                btnSend.attr('disabled', false);
                errorMessage.html('Your firstname is empty now!');
                $(this.txtFirstname.current).focus();
            } else if (data.lastname === '') {
                btnSend.attr('disabled', false);
                errorMessage.html('Your lastname is empty now!');
                $(this.txtLastname.current).focus();
            } else if (data.email === '') {
                btnSend.attr('disabled', false);
                errorMessage.html('Your email is empty now!');
                $(this.txtEmail.current).focus();
            } else if (data.password === '') {
                btnSend.attr('disabled', false);
                errorMessage.html('Your password is empty now!');
                $(this.txtPassword.current).focus();
            } else {
                this.props.register(data, result => {
                    btnSend.attr('disabled', false);
                    errorMessage.html(result.error);

                    if (result.user) {
                        $(this.modal.current).modal('hide');
                        T.alert('Thank you so much for becoming a member of our conference. Please check your email to active account.');
                    }
                });
            }
        } else { // Login
            if (data.email === '') {
                btnSend.attr('disabled', false);
                errorMessage.html('Your email is empty now!');
                $(this.txtEmail.current).focus();
            } else if (data.password === '') {
                btnSend.attr('disabled', false);
                errorMessage.html('Your password is empty now!');
                $(this.txtPassword.current).focus();
            } else {
                this.props.login(data, result => {
                    btnSend.attr('disabled', false);
                    errorMessage.html(result.error);

                    if (result.user) {
                        $(this.modal.current).modal('hide');
                        window.location = '/' + result.user.role.toLowerCase();
                    }
                });
            }
        }
    }

    render() {
        return (
            <div ref={this.modal} className='modal' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header' style={{ padding: 0 }}>
                            <ul className='nav nav-pills nav-fill'
                                style={{ width: '100%', display: 'flex' }}>
                                <li className='nav-item'>
                                    <a href='#register' onClick={this.onNavLinkClick} className='nav-link' style={{ paddingTop: '12px', paddingBottom: '12px', borderRadius: '4.5px 0 0 0' }}>Register</a>
                                </li>
                                <li className='nav-item'>
                                    <a href='#login' onClick={this.onNavLinkClick} className='nav-link' style={{ paddingTop: '12px', paddingBottom: '12px', borderRadius: '0 4.5px 0 0' }}>Login</a>
                                </li>
                            </ul>
                        </div>
                        <form className='needs-validation' onSubmit={this.onSubmit} noValidate={true}>
                            <div className='modal-body'>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label'>Firstname</label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' required={true} placeholder='Firstname' ref={this.txtFirstname} />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label'>Lastname</label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' required={true} placeholder='Lastname' ref={this.txtLastname} />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='loginModalEmail' className='col-sm-3 col-form-label'>Email</label>
                                    <div className='col-sm-9'>
                                        <input type='email' className='form-control' required={true} placeholder='Email' id='loginModalEmail' ref={this.txtEmail} />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label'>Password</label>
                                    <div className='col-sm-9'>
                                        <input type='password' className='form-control' required={true} placeholder='Password' id='loginModalPassword' ref={this.txtPassword} />
                                        <a style={{ margin: '10px' }} ref={this.btnForgotPassword} href='#' className='onlyLoginForm'
                                            onClick={this.onForgotPasswordClick}>Forgot password?</a>
                                    </div>
                                </div>
                                <p ref={this.errorMessage} className='text-danger' />
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' data-dismiss='modal' style={{ width: '100px' }}>Close</button>
                                <button type='submit' className='btn btn-primary' ref={this.btnSend} style={{ width: '100px' }} data-action='register'>Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}