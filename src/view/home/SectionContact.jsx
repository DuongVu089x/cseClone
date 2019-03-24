import React from 'react';
import { connect } from 'react-redux';
import { createContact } from '../redux/contact.jsx';

class SectionContact extends React.Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.email = React.createRef();
        this.subject = React.createRef();
        this.message = React.createRef();

        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        if (this.name.current.value == '') {
            T.alert('Your name is empty!', 'danger');
            (this.name.current.value).focus();
        } else if (this.email.current.value == '') {
            T.alert('Your email is empty!', 'danger');
            (this.email.current.value).focus();
        } else if (!T.validateEmail(this.email.current.value)) {
            T.alert('Invalid email!', 'danger');
            (this.email.current.value).focus();
        } else if (this.subject.current.value == '') {
            T.alert('Your subject is empty!', 'danger');
            (this.subject.current.value).focus();
        } else if (this.message.current.value == '') {
            T.alert('Your message is empty!', 'danger');
            (this.message.current.value).focus();
        } else {
            this.props.createContact({
                name: this.name.current.value,
                email: this.email.current.value,
                subject: this.subject.current.value,
                message: this.message.current.value
            }, () => {
                this.name.current.value = this.email.current.value = this.subject.current.value = this.message.current.value = '';
                T.alert('Your message has been sent!', 'success', true, 3000);
            });
        }
        e.preventDefault();
    }

    render() {
        const { address, mobile, email, map, latitude, longitude } = this.props.system ? this.props.system : { map: '', latitude: 0, longitude: 0 };

        return [
            <div key={0} className='row justify-content-center pb-3'>
                <div className='col-md-7 heading-sections text-center'>
                    <h2 className='mb-4'>Contact</h2>
                </div>
            </div>,
            <a key={1} href={'https://www.google.com/maps/@' + latitude + ',' + longitude + ',16z'} target='_blank'>
                <div key={0} className='map-area' style={{ height: '300px', background: 'url(' + map + ') no-repeat center center' }} />
            </a>,
            <section key={2} className='contact-area' className='mt-30'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12 col-lg-6'>
                            <div className='contact--info'>
                                <h4>Contact Info</h4>
                                <ul className='contact-list'>
                                    <li>
                                        <h6><i className='fa fa-phone' aria-hidden='true'></i> Phone</h6>
                                        <a href={'tel:' + email}>{mobile}</a>
                                    </li>
                                    <li>
                                        <h6><i className='fa fa-envelope' aria-hidden='true'></i> Email</h6>
                                        <a href={'mailto:' + email}>{email}</a>
                                    </li>
                                    <li>
                                        <h6 style={{ flex: 'none' }}><i className='fa fa-map-pin' aria-hidden='true'></i> Address</h6>&nbsp;
                                        <a href={'https://www.google.com/maps/@' + latitude + ',' + longitude + ',16z'} target='_blank'>
                                            {address}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className='col-12 col-lg-6 mb-30'>
                            <div className='contact-form'>
                                <h4>Get In Touch</h4>
                                <form onSubmit={this.sendMessage} className='row'>
                                    <div className='col-12 col-lg-6'>
                                        <input type='text' className='form-control' ref={this.name} placeholder='Name' />
                                    </div>
                                    <div className='col-12 col-lg-6'>
                                        <input type='email' className='form-control' ref={this.email} placeholder='Email' />
                                    </div>
                                    <div className='col-12'>
                                        <input type='text' className='form-control' ref={this.subject} placeholder='Subject' />
                                    </div>

                                    <div className='col-12'>
                                        <textarea name='message' className='form-control' ref={this.message} cols='30' rows='10' placeholder='Message'></textarea>
                                    </div>
                                    <div className='col-12'>
                                        <button className='btn clever-btn w-100'>Send message</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        ];
    }
}

const mapStateToProps = state => ({ system: state.system, contact: state.contact });
const mapActionsToProps = { createContact };
export default connect(mapStateToProps, mapActionsToProps)(SectionContact);