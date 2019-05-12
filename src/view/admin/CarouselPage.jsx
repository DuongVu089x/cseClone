import React from 'react';
import { connect } from 'react-redux';
import { getCarouselInPage, createCarousel, updateCarousel, deleteCarousel, changeCarouselSingle, changeCarouselActive } from '../redux/carousel.jsx'
import { Link } from 'react-router-dom';

class CarouselModal extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
    }

    componentDidMount() {
        $(this.modal.current).on('shown.bs.modal', () => $('#crsTitle').focus());
    }

    show() {
        $('#crsTitle').val('');
        $('#crsHeight').val('0');

        $(this.modal.current).modal('show');
    }

    save(event) {
        const data = { title: $('#crsTitle').val().trim(), height: $('#crsHeight').val().trim() };
        if (data.title == '') {
            T.notify('Tên hình ảnh bị trống!', 'danger');
            $('#crsTitle').focus();
        } else {
            this.props.createCarousel(data, () => $(this.modal.current).modal('hide'));
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Hình ảnh</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label className='control-label'>Tiêu đề tập hình ảnh</label>
                                <input className='form-control' type='text' placeholder='Tiêu đề tập hình ảnh' id='crsTitle' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Chiều cao</label>
                                <input className='form-control' type='number' placeholder='Chiều cao' id='crsHeight' style={{ textAlign: 'right' }} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Đóng</button>
                            <button type='button' className='btn btn-primary' onClick={this.save}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class CarouselPage extends React.Component {
    constructor(props) {
        super(props);
        this.table = React.createRef();
        this.carouselModal = React.createRef();

        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 0);
            this.props.getCarouselInPage();
        });
    }

    create(e) {
        this.carouselModal.current.show();
        e.preventDefault();
    }

    delete(e, item) {
        T.confirm('Xóa tập hình ảnh', 'Bạn có chắc bạn muốn xóa tập hình ảnh này?', true, isConfirm => {
            isConfirm && this.props.deleteCarousel(item._id);
        });
        e.preventDefault();
    }

    render() {
        let table = null;
        if (this.props.carousel && this.props.carousel.page && this.props.carousel.page.list && this.props.carousel.page.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Tên</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Chiều cao</th>
                            <th style={{ width: 'auto' }} nowrap='true'>Đơn ảnh</th>
                            <th style={{ width: 'auto' }} nowrap='true'>Kích hoạt</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.carousel.page.list.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={'/admin/carousel/edit/' + item._id} data-id={item._id}>{item.title}</Link>
                                </td>
                                <td style={{ textAlign: 'right' }}>{item.height}</td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <label>
                                        <input type='checkbox' checked={item.single} onChange={() => this.props.updateCarousel(item._id, { single: !item.single })} />
                                        <span className='button-indecator' />
                                    </label>
                                </td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <label>
                                        <input type='checkbox' checked={item.active} onChange={() => this.props.updateCarousel(item._id, { active: !item.active })} />
                                        <span className='button-indecator' />
                                    </label>
                                </td>
                                <td className='btn-group'>
                                    <Link to={'/admin/carousel/edit/' + item._id} data-id={item._id} className='btn btn-primary'>
                                        <i className='fa fa-lg fa-edit' />
                                    </Link>
                                    <a className='btn btn-danger' href='#' onClick={e => this.delete(e, item)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có tập ảnh nào cả!</p>;
        }

        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-image' /> Tập hình ảnh</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;Tập hình ảnh
                    </ul>
                </div>
                <div className='row tile'>
                    {table}
                </div>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>

                <CarouselModal ref={this.carouselModal} createCarousel={this.props.createCarousel} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ carousel: state.carousel });
const mapActionsToProps = { getCarouselInPage, createCarousel, updateCarousel, deleteCarousel, changeCarouselSingle, changeCarouselActive };
export default connect(mapStateToProps, mapActionsToProps)(CarouselPage);