import React from 'react';
import { connect } from 'react-redux';
import { getStaffGroupItemByUser } from '../redux/staffGroup.jsx'

class SectionStaffGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.staffGroupId) {
            this.props.getStaffGroupItemByUser(this.props.staffGroupId, data => {
                this.setState(data.item);
            });
        }
    }

    componentDidUpdate() {
        setTimeout(() => {
            const tutors = $('.course-slide');
            let numOfStaff = (this.state.staff ? this.state.staff.length : 0);

            let getResponsive = (items) => {
                if (numOfStaff < items) return getResponsive(numOfStaff);
                return {
                    items: items,
                    autoplay: numOfStaff > items,
                    loop: numOfStaff > items,
                    nav: false
                }
            };

            numOfStaff > 0 && tutors.owlCarousel({
                margin: 20,
                autoplay: false,
                responsive: {
                    0: getResponsive(1),
                    750: getResponsive(2),
                    970: getResponsive(3),
                    1170: getResponsive(4)
                }
            });
        },250);
    }
    render() {
        let staffs = null,
            numOfStaff = this.state.staff ? this.state.staff.length : 0;

        if (numOfStaff > 0)
        staffs = this.state.staff.map((staff, index) => {
            return (
                <div className='single-popular-course mb-100 d-flex flex-column'>
                    <img className='' src={staff.info.image} alt=''/>
                    <div className='course-content'>
                        <h4>{staff.info.academicTitle} {staff.info.academicDistinction}<br/>
                            {staff.info.firstname + ' ' + staff.info.lastname}
                        </h4>
                        <div className='meta d-flex align-items-center'>
                            <a href='#'>{staff.info.jobPosition}</a>
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: staff.content }}/>
                    </div>
                    <div className='seat-rating-fee d-flex justify-content-between mt-auto'>
                        <div className='seat-rating h-100 d-flex align-items-center'>
                            <div className='seat'>
                                <a href={staff.info.facebook}>
                                    <i className='fa fa-facebook' aria-hidden='true'/>
                                </a>
                            </div>
                            <div className='seat'>
                                <a href={staff.info.website}>
                                    <i className='fa fa-globe' aria-hidden='true'/>
                                </a>
                            </div>
                            <div className='seat'>
                                <a href={'mailto:' + staff.info.mail}>
                                    <i className='fa fa-envelope' aria-hidden='true'/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        let staffsClassName = 'row course-slide owl-carousel';
        return (
            <section className='popular-courses-area section-padding-100-0'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='section-heading'>
                                <h3>{this.state.title}</h3>
                            </div>
                        </div>
                    </div>
                    <div className={staffsClassName}>
                        {staffs}
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({ staffGroup: state.staffGroup });
const mapActionsToProps = { getStaffGroupItemByUser };
export default connect(mapStateToProps, mapActionsToProps)(SectionStaffGroup);