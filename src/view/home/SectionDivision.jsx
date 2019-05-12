import React from 'react';
import { connect } from 'react-redux';
import { getAllDivisionsByUser } from '../redux/division.jsx';
import { Link } from 'react-router-dom';

class SectionDivision extends React.Component {
    componentDidMount() {
        this.props.getAllDivisionsByUser();
    }

    componentDidUpdate() {
        setTimeout(T.ftcoAnimate, 250);
    }

    render() {
        let divisions = null;
        //TODO: link
        if (this.props.division && this.props.division.items){
            divisions = this.props.division.items.map((item, index) => {
                if (item.active) {
                    return (
                        <div key={index} className='col-12 col-md-6 col-lg-4'>
                            <div className='mb-30 wow fadeInUp' data-wow-delay='250ms'>
                                <div className='division-item' style={{cursor: 'pointer'}}>
                                    <Link to={'/division/item/' + item._id}><img src={item.image} alt={item.name} /></Link>
                                    <Link to={'/division/item/' + item._id}><h6 className='division-type'>{T.divisionTypes[item.type]}</h6></Link>
                                    <Link to={'/division/item/' + item._id}><h4 className='division-name'>{item.name}</h4></Link>
                                </div>
                            </div>
                        </div >
                    );
                };
            });
        }
        

        return (
            <section className='container upcoming-events section-padding-60-0'>
                <div className='row'>
                    <div className='col-12 justify-content-center'>
                        <div className='section-heading'>
                            <h3>Division</h3>
                        </div>
                    </div>
                </div>
                <div className='row'>{divisions}</div>
            </section>
        );
    }
}

const mapStateToProps = state => ({ division: state.division });
const mapActionsToProps = { getAllDivisionsByUser };
export default connect(mapStateToProps, mapActionsToProps)(SectionDivision);