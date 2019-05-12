import React from 'react';
import { connect } from 'react-redux';
import { getTestimonyByUser } from '../redux/testimony.jsx';

class SectionTestimony extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.testimonyId) {
            this.props.getTestimonyByUser(this.props.testimonyId, testimony => {
                if (testimony) this.setState({ testimony })
            });
        }
    }

    componentDidUpdate() {
        setTimeout(() => {
            const tutors = $('.tutors-slide');
            tutors.owlCarousel({
                items: 3,
                margin: 0,
                loop: true,
                nav: true,
                navText: ['<i class="fa fa-angle-left"/>', '<i class="fa fa-angle-right"/>'],
                dots: false,
                autoplay: true,
                autoplayTimeout: 6000,
                smartSpeed: 1000,
                center: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    576: {
                        items: 2
                    },
                    992: {
                        items: 3
                    }
                }
            });
        },250);
    }

    render() {
        return this.state.testimony && this.state.testimony.items.length > 0 ? (
            <section className='best-tutors-area section-padding-100'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className="section-heading">
                                <h3>{this.state.testimony.title}</h3>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='tutors-slide owl-carousel wow fadeInUp' data-wow-delay='250ms'>
                                {this.state.testimony.items.map((item, index) => (
                                    <div key={index} className='single-tutors-slides'>
                                        <div className='tutor-thumbnail' style={{backgroundColor: 'white'}}>
                                            <img src={item.image} alt=''/>
                                        </div>
                                        <div className='tutor-information text-center'>
                                            <h5>{item.fullname}</h5>
                                            <span>{item.jobPosition}</span>
                                            <p dangerouslySetInnerHTML={{ __html: item.content }} />
                                        </div>
                                    </div>
                                ))};
                            </div>
                        </div>
                    </div>
                </div>
            </section>) : '';
    }
}

const mapStateToProps = state => ({ testimony: state.testimony });
const mapActionsToProps = { getTestimonyByUser };
export default connect(mapStateToProps, mapActionsToProps)(SectionTestimony);