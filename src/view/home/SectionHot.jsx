import React from 'react';
import { connect } from 'react-redux';

class SectionHot extends React.Component {
    render() {
        return (
            <section className='ftco-search-course'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='courseSearch-wrap d-md-flex flex-column-reverse'>
                                <div className='full-wrap'>
                                    <div className='one-half'>
                                        <div className='featured-blog d-md-flex'>
                                            <div className='image d-flex order-last'>
                                                <a href='#' className='img' style={{ background: 'url(img/image_2.jpg)' }}></a>
                                            </div>
                                            <div className='text order-first'>
                                                <span className='date'>Aug 20, 2018</span>
                                                <h3><a href='#'>We Conduct Workshop 2018</a></h3>
                                                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({});
const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(SectionHot);