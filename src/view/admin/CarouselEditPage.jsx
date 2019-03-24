import React from 'react';
import { connect } from 'react-redux';
import { getCarousel, updateCarousel, createCarouselItem, updateCarouselItem, swapCarouselItem, deleteCarouselItem } from '../redux/carousel.jsx'
import { Link } from 'react-router-dom';
import ImageBox from '../common/ImageBox.jsx';

class CarouselItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
        this.imageBox = React.createRef();
        this.btnSave = React.createRef();
    }

    componentDidMount() {
        $(this.modal.current).on('shown.bs.modal', () => $('#carName').focus());
    }

    show(item, carouselId) {
        const { _id, title, image, link } = item ? item : { _id: null, title: '', image: '/img/avatar.jpg', link: '' };
        $(this.btnSave.current).data('id', _id).data('carouselId', carouselId);
        $('#carName').data('title', title).val(title);
        $('#carLink').data('link', link).val(link);

        this.setState({ image });
        this.imageBox.current.setData('carouselItem:' + (_id ? _id : 'new'));

        $(this.modal.current).modal('show');
    }

    save() {
        const _id = $(event.target).data('id'),
            carouselId = $(event.target).data('carouselId'),
            changes = { title: $('#carName').val().trim(), link: $('#carLink').val().trim() };
        if (changes.title == '') {
            T.notify('Tên hình ảnh bị trống!', 'danger');
            $('#carName').focus();
        } else {
            if (_id) { // Update
                this.props.updateCarouselItem(_id, changes, error => {
                    if (error == undefined || error == null) {
                        $(this.modal.current).modal('hide');
                    }
                });
            } else { // Create
                changes.carouselId = carouselId;
                this.props.createCarouselItem(changes, () => $(this.modal.current).modal('hide'));
            }
        }
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog' role='document' onSubmit={e => { this.save(); e.preventDefault(); }}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Hình ảnh</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='carName'>Tên hình ảnh</label>
                                <input className='form-control' id='carName' type='text' placeholder='Tên hình ảnh' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='carLink'>Link liên kết</label>
                                <input className='form-control' id='carLink' type='text' placeholder='Link liên kết' />
                            </div>
                            <div className='form-group'>
                                <label>Hình đại diện</label>
                                <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='CarouselItemImage' userData='carouselItem' image={this.state.image} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Đóng</button>
                            <button type='button' className='btn btn-primary' ref={this.btnSave} onClick={this.save}>Lưu</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class CarouselEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.table = React.createRef();
        this.modal = React.createRef();

        this.save = this.save.bind(this);
        this.createItem = this.createItem.bind(this);
        this.swapItem = this.swapItem.bind(this);
        this.changeItemActive = this.changeItemActive.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 0);

            setTimeout(() => {
                $('#crsTitle').focus();
            }, 250);

            const route = T.routeMatcher('/admin/carousel/edit/:carouselId'),
                params = route.parse(window.location.pathname);

            this.props.getCarousel(params.carouselId, data => {
                $('#crsTitle').val(data.title).focus();
                $('#crsHeight').val(data.height);

                this.setState(data);
            });
        });

        // T.socket.on('carousel-changed', changedItem => {
        //     const items = this.state.items.slice();
        //     for (let i = 0; i < items.length; i++) {
        //         if (items[i]._id == changedItem._id) {
        //             items[i] = changedItem;
        //             break;
        //         }
        //     }
        //     this.setState({ items });
        // });
    }

    save() {
        const changes = {
            title: $('#crsTitle').val(),
            height: parseInt($('#crsHeight').val()),
            single: this.state.single,
            active: this.state.active,
        };

        this.props.updateCarousel(this.state._id, changes);
    }

    createItem(e) {
        this.modal.current.show(null, this.state._id);
        e.preventDefault();
    }

    editItem(e, item) {
        this.modal.current.show(item);
        e.preventDefault();
    }

    swapItem(e, item, isMoveUp) {
        this.props.swapCarouselItem(item._id, isMoveUp);
        e.preventDefault();
    }

    changeItemActive(item) {
        this.props.updateCarouselItem(item._id, { active: !item.active });
    }

    deleteItem(e, item) {
        T.confirm('Xóa hình ảnh', 'Bạn có chắc bạn muốn xóa hình ảnh này?', true, isConfirm =>
            isConfirm && this.props.deleteCarouselItem(item._id));
        e.preventDefault();
    }

    render() {
        let items = this.props.carousel && this.props.carousel.selectedItem && this.props.carousel.selectedItem.items ? this.props.carousel.selectedItem.items : [],
            table = null;

        if (items.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '80%' }}>Tiêu đề</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Hình ảnh</th>
                            <th style={{ width: 'auto' }} nowrap='true'>Kích hoạt</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.editItem(e, item, index)}>
                                        {item.title}
                                    </a>
                                </td>
                                <td style={{ width: '20%', textAlign: 'center' }}>
                                    <img src={T.url(item.image)} alt='avatar' style={{ height: '32px' }} />
                                </td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <label>
                                        <input type='checkbox' checked={item.active} onChange={() => this.changeItemActive(item, index)} />
                                        <span className='button-indecator' />
                                    </label>
                                </td>
                                <td className='btn-group'>
                                    <a className='btn btn-success' href='#' onClick={e => this.swapItem(e, item, true)}>
                                        <i className='fa fa-lg fa-arrow-up' />
                                    </a>
                                    <a className='btn btn-success' href='#' onClick={e => this.swapItem(e, item, false)}>
                                        <i className='fa fa-lg fa-arrow-down' />
                                    </a>
                                    <a className='btn btn-primary' href='#' onClick={e => this.editItem(e, item, index)}>
                                        <i className='fa fa-lg fa-edit' />
                                    </a>
                                    <a className='btn btn-danger' href='#' onClick={e => this.deleteItem(e, item, index)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có hình ảnh!</p>;
        }

        const { title, height } = this.props.carousel && this.props.carousel.selectedItem ? this.props.carousel.selectedItem : { title: '', height: 0 };
        const carouselTitle = title != '' ? 'Tên: <b>' + title + '</b>' : '';
        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-image' /> Tập hình ảnh: Chỉnh sửa</h1>
                        <p dangerouslySetInnerHTML={{ __html: carouselTitle }} />
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;
                        <Link to='/admin/carousel'>Tập hình ảnh</Link>
                        &nbsp;/&nbsp;Chỉnh sửa
                    </ul>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className='tile'>
                            <h3 className='tile-title'>Thông tin chung</h3>
                            <div className='tile-body'>
                                <div className='form-group'>
                                    <label className='control-label'>Tiêu đề tập hình ảnh</label>
                                    <input className='form-control' type='text' placeholder='Tiêu đề tập hình ảnh' id='crsTitle' defaultValue={title} />
                                </div>
                                <div className='form-group'>
                                    <label className='control-label'>Chiều cao</label>
                                    <input className='form-control' type='number' placeholder='Chiều cao' id='crsHeight' defaultValue={height} style={{ textAlign: 'right' }} />
                                </div>
                                <div className='form-group row'>
                                    <label className='control-label col-3 col-sm-3'>Đơn ảnh</label>
                                    <div className='col-8 col-sm-8 toggle'>
                                        <label>
                                            <input type='checkbox' checked={this.state.single} onChange={e => this.setState({ single: e.target.checked })} /><span className='button-indecator' />
                                        </label>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='control-label col-3 col-sm-3'>Kích hoạt</label>
                                    <div className='col-8 col-sm-8 toggle'>
                                        <label>
                                            <input type='checkbox' checked={this.state.active} onChange={e => this.setState({ active: e.target.checked })} /><span className='button-indecator' />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='tile-footer'>
                                <div className='row'>
                                    <div className='col-md-12' style={{ textAlign: 'right' }}>
                                        <button className='btn btn-primary' type='button' onClick={this.save}>
                                            <i className='fa fa-fw fa-lg fa-check-circle'></i>Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-12'>
                        <div className='tile'>
                            <h3 className='tile-title'>Danh sách hình ảnh</h3>
                            <div className='tile-body'>
                                {table}
                            </div>
                        </div>
                    </div>
                </div>
                <Link to='/admin/carousel' className='btn btn-secondary btn-circle' style={{ position: 'fixed', lefft: '10px', bottom: '10px' }}>
                    <i className='fa fa-lg fa-reply' />
                </Link>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.createItem}>
                    <i className='fa fa-lg fa-plus' />
                </button>

                <CarouselItemModal ref={this.modal} createCarouselItem={this.props.createCarouselItem} updateCarouselItem={this.props.updateCarouselItem} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ carousel: state.carousel });
const mapActionsToProps = { getCarousel, updateCarousel, createCarouselItem, updateCarouselItem, swapCarouselItem, deleteCarouselItem };
export default connect(mapStateToProps, mapActionsToProps)(CarouselEditPage);