import React from 'react';
import { connect } from 'react-redux';
import { getNewsFeed } from '../redux/news.jsx'
import { Link } from 'react-router-dom';

class SectionNews extends React.Component {
    componentDidMount() {
        this.props.getNewsFeed();
    }

    render() {
        let title = 'No latest news!',
            news = null;
        if (this.props.news && this.props.news.newsFeed) {
            if (this.props.news.newsFeed.length > 0) title = 'Latest news';

            news = this.props.news.newsFeed.map((item, index) => {
                const link = item.link ? '/tintuc/' + item.link : '/news/item/' + item._id;
                return (
                    <div key={index} className='col-12 col-md-6 col-lg-4' >
                        <div className='single-popular-course mb-30 wow fadeInUp' data-wow-delay='250ms' style={{ height: '100%' }}>
                            <Link to={link}><img src={item.image} alt={item.title} /></Link>
                            <div className='course-content'>
                                <h4><Link to={link}>{item.title} </Link></h4>
                                <div className='meta d-flex align-items-center'>
                                    <p>{new Date(item.createdDate).getText()}</p>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: item.abstract }} />
                            </div>

                            <div className='seat-rating-fee d-flex justify-content-between' style={{ position: 'absolute', bottom: '0' }}>
                                <div className='seat-rating h-100 d-flex align-items-center'>
                                    <div className='seat'>
                                        <i className='fa fa-user' aria-hidden='true' /> {item.view}
                                    </div>
                                    <div className='rating'>
                                        <i className='fa fa-heart-o' aria-hidden='true' /> 4.5
                                    </div>
                                </div>
                                <div className='course-fee h-100'>
                                    <Link to={link} className='free'>Detail</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }

        return (
            <section style={{ width: '100%', marginBottom: '60px' }}>
                <div className='row justify-content-center pb-3'>
                    <div className='col-md-7 heading-sections text-center'>
                        <h2 className='mb-4'>{title}</h2>
                    </div>
                </div>
                {news ? <div className='row d-flex'>{news}</div> : ''}
            </section>
        );
    }
}

const mapStateToProps = state => ({ news: state.news });
const mapActionsToProps = { getNewsFeed };
export default connect(mapStateToProps, mapActionsToProps)(SectionNews);