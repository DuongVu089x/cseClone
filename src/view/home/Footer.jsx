import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
    render() {
        let { logo, facebook, youtube, twitter, instagram, todayViews, allViews } = this.props.system ? this.props.system : { logo: '', todayViews: 0, allViews: 0 };
        facebook = facebook ? <a href={facebook} target='_blank'><i className='fa fa-facebook' /></a> : '';
        youtube = youtube ? <a href={youtube} target='_blank'><i className='fa fa-youtube' /></a> : '';
        twitter = twitter ? <a href={twitter} target='_blank'><i className='fa fa-twitter' /></a> : '';
        instagram = instagram ? <a href={instagram} target='_blank'><i className='fa fa-instagram' /></a> : '';

        return (
            <footer className='footer-area'>
                <div className='top-footer-area'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <Link to='/'><img src={logo} alt='CSE' style={{ height: '36px', width: 'auto' }} /></Link>
                                <p>
                                    Copyright © 2002 - {new Date().getFullYear()} Computer Science & Engineering. All rights reserved.<br />
                                    Ho Chi Minh City University of Technology
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bottom-footer-area d-flex justify-content-between align-items-center'>
                    <div className='contact-info'>
                        <a href='#'><span>Address:</span> {todayViews}</a>
                        <a href='#'><span>Total views:</span> {allViews}</a>
                    </div>
                    <div className='follow-us'>
                        <span>Follow us</span>
                        {facebook} {youtube} {twitter} {instagram}
                    </div>
                </div>
            </footer >
        );
    }
}

const mapStateToProps = state => ({ system: state.system });
const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(Footer);