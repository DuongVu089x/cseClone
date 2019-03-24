import React from 'react';
import { connect } from 'react-redux';
import { getSloganByUser } from '../redux/slogan.jsx';

class SectionSlogan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.sloganId) {
            this.props.getSloganByUser(this.props.sloganId, slogan => slogan && this.setState({ slogan }));
        }
    }

    renderItem(item) {
        return (
            <div className='media block-6 services p-3 py-4 d-block text-center'>
                <img src={item.image} alt={item.title} style={{ width: '40%', height: 'auto' }} />
                <div className='media-body px-3'>
                    <h3 className='heading'>{item.title}</h3>
                    <p dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
            </div>
        );
    }

    render() {
        let slogans = null;
        if (this.state.slogan) {
            const items = this.state.slogan.items,
                n = items.length;
            if (n == 1) {
                slogans = [<div key={0} className='col-md-4 d-flex align-self-stretch offset-md-4'>{this.renderItem(items[0])}</div>];
            } else if (n == 2) {
                slogans = [
                    <div key={0} className='col-md-4 d-flex align-self-stretch offset-md-2'>{this.renderItem(items[0])}</div>,
                    <div key={1} className='col-md-4 d-flex align-self-stretch'>{this.renderItem(items[1])}</div>,
                ];
            } else if (n == 3) {
                slogans = [
                    <div key={0} className='col-md-4 d-flex align-self-stretch'>{this.renderItem(items[0])}</div>,
                    <div key={1} className='col-md-4 d-flex align-self-stretch'>{this.renderItem(items[1])}</div>,
                    <div key={2} className='col-md-4 d-flex align-self-stretch'>{this.renderItem(items[2])}</div>,
                ];
            } else if (n == 4) {
                slogans = [
                    <div key={0} className='col-md-3 d-flex align-self-stretch'>{this.renderItem(items[0])}</div>,
                    <div key={1} className='col-md-3 d-flex align-self-stretch'>{this.renderItem(items[1])}</div>,
                    <div key={2} className='col-md-3 d-flex align-self-stretch'>{this.renderItem(items[2])}</div>,
                    <div key={3} className='col-md-3 d-flex align-self-stretch'>{this.renderItem(items[3])}</div>,
                ];
            }
        }

        return <section className='row'>{slogans}</section>;
    }
}

const mapStateToProps = state => ({ slogan: state.slogan });
const mapActionsToProps = { getSloganByUser };
export default connect(mapStateToProps, mapActionsToProps)(SectionSlogan);