import React from 'react';

export default class ForgotPasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: '', error: '' };

        this.save = this.save.bind(this);
        this.goToHomePage = this.goToHomePage.bind(this);
    }

    componentDidMount() {
        T.post(window.location.pathname,
            res => this.setState({ message: res.error }),
            error => T.notify('System has errors!', 'danger'));
    }

    save() {
        let password1 = $('#fgtPassword1').val(),
            password2 = $('#fgtPassword2').val();
        if (password1 === '') {
            this.setState({ error: 'Please input new password!' });
            $('#fgtPassword1').focus();
        } else if (password2 === '') {
            this.setState({ error: 'Please retype new password!' });
            $('#fgtPassword2').focus();
        } else if (password1 != password2) {
            this.setState({ error: 'Two passwords do not match!' });
            $('#fgtPassword1').focus();
        } else {
            const route = T.routeMatcher('/forgot-password/:userId/:userToken'),
                params = route.parse(window.location.pathname);
            T.put('/forgot-password/new-password', { userId: params.userId, token: params.userToken, password: password1 },
                res => {
                    if (res.error) {
                        this.setState({ message: null, error: res.error });
                    } else {
                        this.setState({ message: 'Your password changed successfully!', error: null });
                    }
                },
                error => { });
        }
    }

    goToHomePage(e) {
        this.props.history.push('/');
        e.preventDefault();
    }

    render() {
        if (this.state.message && this.state.message !== '') {
            return (
                <div className='central-box'>
                    <h3 dangerouslySetInnerHTML={{ __html: this.state.message }} />
                    Click <a href='#' onClick={this.goToHomePage}>here</a> in order to go to home page.
                </div>
            );
        } else {
            return (
                <div className='central-box' style={{ textAlign: 'left' }}>
                    <div className='form-group'>
                        <label htmlFor='fgtPassword1'>New password</label>
                        <input type='password' className='form-control' id='fgtPassword1' placeholder='New password' autoFocus={true} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='fgtPassword2'>Retype password</label>
                        <input type='password' className='form-control' id='fgtPassword2' placeholder='Retype password' />
                    </div>
                    <p style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: this.state.error }} />
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <button type='button' className='btn btn-primary' onClick={this.save}>Lưu</button>
                    </div>
                </div>
            );
        }
    }
}