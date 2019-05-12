import React from 'react';
import { connect } from 'react-redux';
import { homeGetCarousel } from '../redux/carousel.jsx'

class SectionCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.homeGetCarousel(this.props.viewId, carousel => this.setState(carousel));
    }

    render() {
        let elements = null, indicator = [];
        const carouselId = 'carousel_' + this.props.viewId;

        if (this.state.items) {
            elements = this.state.items.map((item, index) => {
                const activeClass = index == 0 ? 'active' : '';
                indicator.push(<li key={index} data-target={'#' + carouselId} data-slide-to={index} className={activeClass} />);

                return (
                    <div key={index} className={'carousel-item center-hide ' + activeClass}>
                        <div>
                            <img src={item.image} alt={item.title} />
                        </div>
                    </div>
                );
            });

            // height = this.state.height;
        }

        return (
            <div id={carouselId} className='carousel slide w-100 mb-20' data-ride='carousel' style={{ height: 'auto' }}>
                <ol className='carousel-indicators'>
                    {indicator}
                </ol>

                <div className='carousel-inner w-100'>
                    {elements}
                </div>

                <a className='carousel-control-prev' href={'#' + carouselId} role='button' data-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true' />
                    <span className='sr-only'>Previous</span>
                </a>
                <a className='carousel-control-next' href={'#' + carouselId} role='button' data-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true' />
                    <span className='sr-only'>Next</span>
                </a>
            </div>
        )

    }
}

const mapStateToProps = state => ({});
const mapActionsToProps = { homeGetCarousel };
export default connect(mapStateToProps, mapActionsToProps)(SectionCarousel);