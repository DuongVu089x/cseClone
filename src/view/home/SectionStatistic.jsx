import React from 'react';
import { connect } from 'react-redux';
import { getStatisticByUser } from '../redux/statistic.jsx';

class SectionStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.statisticId) {
            this.props.getStatisticByUser(this.props.statisticId, statistic => this.setState({ statistic }));
        }
    }

    componentDidUpdate() {
        setTimeout(() => {
            $('section.ftco-counter').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.number').each(function (e) {
                        const $this = $(this);
                        $this.animateNumber({
                            number: $this.data('number'),
                            numberStep: $.animateNumber.numberStepFactories.separator('.')
                        }, 7000);
                    });
                }
            }, { offset: '95%' });

            if ($.fn.counterUp) {
                $('.counter').counterUp({
                    delay: 10,
                    time: 2000
                });
            }
        }, 250);
    }

    render() {
        const itemLength = this.state.statistic ? this.state.statistic.items.length : 0,
            itemClassName = 'col-md-' + (12 / Math.min(itemLength, 4));
        return itemLength > 0 ? (
            <section className='cool-facts-area section-padding-60-0 row'>
                {this.state.statistic.items.map((item, index) => (
                    <div key={index} className={itemClassName} style={{ marginTop: '24px' }}>
                        <div className='single-cool-facts-area text-center mb-50 wow fadeInUp' data-wow-delay='250ms'>
                            <div className='icon'>
                                <img src={item.image} alt={item.title} />
                            </div>
                            <h2 className='counter'>{item.number}</h2>
                            <h5>{item.title}</h5>
                        </div>
                    </div>
                ))}
            </section>) : '';
    }
}

const mapStateToProps = state => ({ statistic: state.statistic });
const mapActionsToProps = { getStatisticByUser };
export default connect(mapStateToProps, mapActionsToProps)(SectionStatistic);