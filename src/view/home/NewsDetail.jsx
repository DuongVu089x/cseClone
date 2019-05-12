import React from 'react';
import { connect } from 'react-redux';
import { getNewsByUser } from '../redux/news.jsx'

class NewsDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let url = window.location.pathname,
            isLink = url.startsWith('/tintuc/'),
            params = T.routeMatcher(isLink ? '/tintuc/:link' : '/news/item/:id').parse(url);
        this.props.getNewsByUser(params.id, params.link);
    }

    render() {
        const item = this.props.news && this.props.news.userNews ? this.props.news.userNews : null;
        if (item == null) {
            return <p>...</p>;
        } else {
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
                                }}>
                                <div className='single-course-intro-content text-center'>
                                    <h3>{item.title}</h3>
                                    <div className='meta d-flex align-items-center justify-content-center'>
                                        <a href='#'>Sarah Parker</a>
                                        <span><i className='fa fa-circle' aria-hidden='true' /></span>
                                        <a href='#'>Art &amp; Design</a>
                                    </div>
                                    <div className='price'>New</div>
                                </div>
                            </div>


                            <div className='single-course-content section-padding-100'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-12 col-lg-8'>
                                            <div className='course--content'>
                                                <div className='clever-tabs-content'>
                                                    <div className='tab-content' id='myTabContent'>
                                                        <div className='tab-pane fade show active' id='tab1'
                                                            role='tabpanel' aria-labelledby='tab--1'>
                                                            <div className='clever-description'>

                                                                <div className='about-course mb-30'>
                                                                    <h4>About this new</h4>
                                                                    <p dangerouslySetInnerHTML={{ __html: item.content }} />
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 col-lg-4'>
                                            <div className='course-sidebar'>
                                                <a href='#' className='btn clever-btn mb-30 w-100'>More news</a>


                                                <div className='sidebar-widget'>
                                                    <h4>Course Features</h4>
                                                    <ul className='features-list'>
                                                        <li>
                                                            <h6><i className='fa fa-clock-o'
                                                                aria-hidden='true' /> Duration</h6>
                                                            <h6>2 Weeks</h6>
                                                        </li>
                                                        <li>
                                                            <h6><i className='fa fa-bell'
                                                                aria-hidden='true' /> Lectures</h6>
                                                            <h6>10</h6>
                                                        </li>
                                                        <li>
                                                            <h6><i className='fa fa-file'
                                                                aria-hidden='true' /> Quizzes</h6>
                                                            <h6>3</h6>
                                                        </li>
                                                        <li>
                                                            <h6><i className='fa fa-thumbs-up'
                                                                aria-hidden='true' /> Pass Percentage</h6>
                                                            <h6>60</h6>
                                                        </li>
                                                        <li>
                                                            <h6><i className='fa fa-thumbs-down'
                                                                aria-hidden='true' /> Max Retakes</h6>
                                                            <h6>5</h6>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className='sidebar-widget'>
                                                    <h4>Certification</h4>
                                                    <img src={item.image} alt='' />
                                                </div>


                                                <div className='sidebar-widget'>
                                                    <h4>You may like</h4>

                                                    <div className='single--courses d-flex align-items-center'>
                                                        <div className='thumb'>
                                                            <img src={item.image} alt='' />
                                                        </div>
                                                        <div className='content'>
                                                            <h5>Vocabulary</h5>
                                                            <h6>$20</h6>
                                                        </div>
                                                    </div>

                                                    <div className='single--courses d-flex align-items-center'>
                                                        <div className='thumb'>
                                                            <img src={item.image} alt='' />
                                                        </div>
                                                        <div className='content'>
                                                            <h5>Expository writing</h5>
                                                            <h6>$45</h6>
                                                        </div>
                                                    </div>

                                                    <div className='single--courses d-flex align-items-center'>
                                                        <div className='thumb'>
                                                            <img src={item.image} alt='' />
                                                        </div>
                                                        <div className='content'>
                                                            <h5>Vocabulary</h5>
                                                            <h6>$20</h6>
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

const mapStateToProps = state => ({ news: state.news });
const mapActionsToProps = { getNewsByUser };
export default connect(mapStateToProps, mapActionsToProps)(NewsDetail);