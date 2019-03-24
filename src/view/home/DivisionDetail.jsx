import React from 'react';
import { connect } from 'react-redux';
import { getDivisionByUser } from '../redux/division.jsx'
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';

class DivisionDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let url = window.location.pathname,
            // isLink = url.startsWith('/tintuc/'),
            params = T.routeMatcher('/division/item/:divisionId').parse(url);
        this.props.getDivisionByUser(params.divisionId);
    }

    render() {
        const item = this.props.division && this.props.division.userDivision ? this.props.division.userDivision : null;
        if (item == null) {
            return <p>...</p>;
        } else {
            // const imageUrl = 'url(' + item.image + ')';
            return (
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='single-course-intro d-flex align-items-center justify-content-center'
                                style={{
                                    backgroundImage: 'url(' + item.image + ')',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                <div className='single-course-intro-content transparent text-center'>
                                    <h3>{item.name}</h3>
                                    <div className='meta d-flex align-items-center justify-content-center'>
                                        <a href='#' style={{ fontSize: '20px', color: '#000' }}>{T.divisionTypes[item.type]}</a>
                                        {/* <span><i className='fa fa-circle' aria-hidden='true' /></span> */}
                                        {/* <a href='#'>Art &amp; Design</a> */}
                                    </div>
                                    <div className='price' style={{ fontSize: '15px' }}>Division</div>
                                </div>
                            </div>


                            <div className='single-course-content section-padding-100'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='course--content'>
                                                <div className='clever-tabs-content'>
                                                    <div className='tab-content' id='myTabContent'>
                                                        <div className='tab-pane fade show active' id='tab1'
                                                            role='tabpanel' aria-labelledby='tab--1'>
                                                            <div className='clever-description'>

                                                                <div className='about-course mb-30'>
                                                                    <h4>About this Division</h4>
                                                                    <p dangerouslySetInnerHTML={{ __html: item.content }} />
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({ division: state.division });
const mapActionsToProps = { getDivisionByUser };
export default connect(mapStateToProps, mapActionsToProps)(DivisionDetail);