import React from 'react';
import { connect } from 'react-redux';
import { getNewsInPageByUser } from '../redux/news.jsx'
import { Link } from 'react-router-dom';
import inView from 'in-view';

const linkFormat = '/tintuc/',
    idFormat = '/news/item/';

class NewsListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.ready = this.ready.bind(this);

        this.loading = false;
    }

    componentDidMount() {
        this.props.getNewsInPageByUser(1, T.defaultUserPageSize, () => this.loading = false);
    }

    ready() {
        inView('.listViewLoading').on('enter', () => {
            let userPage = this.props.news.userPage;
            if (!this.loading && this.props.getNewsInPageByUser && userPage && userPage.pageNumber < userPage.pageTotal) {
                this.loading = true;
                this.props.getNewsInPageByUser(userPage.pageNumber + 1, T.defaultUserPageSize, () => this.loading = false);
            }
        });
    }

    render() {
        let userPage = this.props.news ? this.props.news.userPage : null,
            elements = [];
        if (userPage) {
            elements = userPage.list.map((item, index) => {
                const link = item.link ? linkFormat + item.link : idFormat + item._id;
                return (
                    <div key={index} className='col-12 col-md-6 col-lg-4'>
                        <div className='single-popular-course mb-100 wow fadeInUp' data-wow-delay='250ms'>
                            <Link to={link}><img src={item.image} alt={item.title} /></Link>
                            <div className='course-content'>
                                <h4><Link to={link}>{item.title} </Link></h4>
                                <div className='meta d-flex align-items-center'>
                                    <p>{new Date(item.createdDate).getText()}</p>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: item.abstract }} />
                            </div>

                            <div className='seat-rating-fee d-flex justify-content-between'>
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

        if (userPage && userPage.pageNumber < userPage.pageTotal) {
            elements.push(
                <div key={elements.length} style={{ width: '100%', textAlign: 'center' }}>
                    <img className='listViewLoading' src='/img/loading.gif' style={{ width: '48px', height: 'auto' }}
                        onLoad={this.ready} />
                </div>
            );
        }

        return elements;
    }
}

const mapStateToProps = state => ({ news: state.news });
const mapActionsToProps = { getNewsInPageByUser };
export default connect(mapStateToProps, mapActionsToProps)(NewsListView);