import React from 'react';
import { connect } from 'react-redux';
import { getVideoInPage, createVideo, updateVideo, deleteVideo } from '../redux/video.jsx'
import { Link } from 'react-router-dom';
import ImageBox from '../common/ImageBox.jsx';
import Pagination from '../common/Pagination.jsx';

class VideoModal extends React.Component {
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
        $(document).ready(() => {
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#videoTitle').focus());
            }, 250);
        });
    }

    show(item) {
        const { _id, title, link, image } = item ? item : { _id: null, title: '', link: '', image: '' };
        $(this.btnSave.current).data('id', _id);
        $('#videoTitle').val(title);
        $('#videoLink').val(link);
        this.setState({ image });
        this.imageBox.current.setData('video:' + (_id ? _id : 'new'));

        $(this.modal.current).modal('show');
    }

    save(event) {
        const _id = $(event.target).data('id'),
            changes = {
                title: $('#videoTitle').val().trim(),
                link: $('#videoLink').val().trim(),
                image: this.state.image,
            };
        if (changes.title == '') {
            T.notify('Tiêu đề video bị trống!', 'danger');
            $('#videoTitle').focus();
        } else if (changes.link == '') {
            T.notify('Link video bị trống!', 'danger');
            $('#videoLink').focus();
        } else {
            if (_id) {
                this.props.updateVideo(_id, changes, error => {
                    if (error == undefined || error == null) {
                        $(this.modal.current).modal('hide');
                    }
                });
            } else { // Create
                this.props.createVideo(changes, () => {
                    $(this.modal.current).modal('hide');
                });
            }
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thông tin video</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='videoTitle'>Tiêu đề</label>
                                <input className='form-control' id='videoTitle' type='text' placeholder='Tiêu đề video' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='videoLink'>Link</label>
                                <input className='form-control' id='videoLink' type='text' placeholder='Link' />
                            </div>
                            <div className='form-group'>
                                <label>Hình đại diện</label>
                                <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='VideoImage' userData='video' image={this.state.image} />
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

class VideoPage extends React.Component {
    constructor(props) {
        super(props);
        this.videoModal = React.createRef();

        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 3);
            this.props.getVideoInPage();
        });
    }

    create(e) {
        this.videoModal.current.show(null);
        e.preventDefault();
    }

    edit(e, item) {
        this.videoModal.current.show(item);
        e.preventDefault();
    }

    changeActive(item, index) {
        this.props.updateVideo(item._id, { active: !item.active });
    }

    delete(e, item) {
        T.confirm('Video: Xóa video', 'Bạn có chắc bạn muốn xóa video này?', true, isConfirm => {
            isConfirm && this.props.deleteVideo(item._id);
        });
        e.preventDefault();
    }

    render() {
        let table = null;
        if (this.props.video && this.props.video.page && this.props.video.page.list && this.props.video.page.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Tiêu đề</th>
                            <th style={{ width: '60%' }}>Link</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Hình ảnh</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.video.page.list.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.edit(e, item)}>{item.title}</a>
                                </td>
                                <td>
                                    <a href={item.link} target='_blank'>{item.link}</a>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <img src={item.image ? item.image : '/img/avatar.jpg'} alt='avatar' style={{ height: '32px' }} />
                                </td>
                                <td className='btn-group'>
                                    <a className='btn btn-primary' href='#' onClick={e => this.edit(e, item)}>
                                        <i className='fa fa-lg fa-edit' />
                                    </a>
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
            table = <p>Không có video!</p>;
        }

        const { pageNumber, pageSize, pageTotal, totalItem } = this.props.video ?
            this.props.video.page : { pageNumber: 1, pageSize: 50, pageTotal: 1, totalItem: 0 };
        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-file-video-o' /> Video</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Video</li>
                    </ul>
                </div>

                <div className='row tile'>{table}</div>
                <Pagination name='adminVideo' pageNumber={pageNumber} pageSize={pageSize} pageTotal={pageTotal} totalItem={totalItem}
                    getPage={this.props.getVideoInPage} />

                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>

                <VideoModal createVideo={this.props.createVideo} updateVideo={this.props.updateVideo} ref={this.videoModal} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ video: state.video });
const mapActionsToProps = { getVideoInPage, createVideo, updateVideo, deleteVideo };
export default connect(mapStateToProps, mapActionsToProps)(VideoPage);