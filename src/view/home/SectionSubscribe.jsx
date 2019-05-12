import React from 'react';
import { connect } from 'react-redux';
import { createSubscriber } from '../redux/subscriber.jsx'

class SectionSubscribe extends React.Component {
    constructor(props) {
        super(props);

        this.createSubscriber = this.createSubscriber.bind(this);
    }

    createSubscriber(e) {
        const subscriberEmail = $('#subscriberEmail');
        if (T.validateEmail(subscriberEmail.val())) {
            this.props.createSubscriber(subscriberEmail.val(), data => {
                if (data.error) {
                    T.alert(data.error, 'error', true, 3000);
                    console.error(data);
                } else {
                    T.alert('Subscription added successfully!', 'success', true, 3000);
                    subscriberEmail.val('');
                }
            });
        } else {
            T.alert('Your email is invalid!', 'error', false, 1200);
        }
        e.preventDefault();
    }

    render() {
        return (
            <section className='register-now d-flex justify-content-between align-items-center pt-5 w-100'>
                <div className='register-contact-form mb-5 wow fadeInUp' data-wow-delay='250ms'
                     style={{
                         visibility : 'visible',
                         animationDelay: '250ms',
                         animationName: 'fadeInUp'
                         }}>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='forms'>
                                    <h4>Subscribe for news</h4>
                                    <form action='#' method='post' onSubmit={this.createSubscriber}>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <div className='form-group'>
                                                    <input type='email' className='form-control' id='email'
                                                           placeholder='Enter your email here!'/>
                                                </div>
                                            </div>
                                            <div className='col-12'>
                                                <button className='btn clever-btn w-100'>Subscribe</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='register-now-countdown mb-100 wow fadeInUp' data-wow-delay='500ms'
                     style={{
                         visibility : 'visible',
                         animationDelay: '500ms',
                         animationName: 'fadeInUp'
                     }}>
                    <h4>Computer Science & Engineering</h4>
                    <p>Stay updated with our latest information</p>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({ subscriber: state.subscriber });
const mapActionsToProps = { createSubscriber };
export default connect(mapStateToProps, mapActionsToProps)(SectionSubscribe);