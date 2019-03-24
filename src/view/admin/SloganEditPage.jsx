import React from 'react';
import { connect } from 'react-redux';
import { getSloganItem, updateSlogan, addSloganIntoGroup, updateSloganInGroup, removeSloganFromGroup, swapSloganInGroup } from '../redux/slogan.jsx'
import { Link } from 'react-router-dom';
import Editor from '../common/CkEditor4.jsx';
import ImageBox from '../common/ImageBox.jsx';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.imageChanged = this.imageChanged.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
        this.imageBox = React.createRef();
        this.editor = React.createRef();
        this.btnSave = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#seiTitle').focus());
            }, 250);
        });
    }

    imageChanged(data) {
        this.setState({ image: data.url });
    }


    show(selectedItem, index) {
        const { title, image, content } = selectedItem ? selectedItem : { title: '', image: '', content: '' };
        $('#seiTitle').val(title);
        this.editor.current.html(content);
        $(this.btnSave.current).data('isNewMember', selectedItem == null).data('index', index);

        this.imageBox.current.setData('slogan', image);
        this.setState({ image });

        $(this.modal.current).modal('show');
    }
    hide() {
        $(this.modal.current).modal('hide');
    }

    save(event) {
        const btnSave = $(this.btnSave.current),
            isNewMember = btnSave.data('isNewMember'),
            index = btnSave.data('index'),
            title = $('#seiTitle').val();
        if (isNewMember) {
            this.props.addSlogan(title, this.state.image, this.editor.current.html());
        } else {
            this.props.updateSlogan(index, title, this.state.image, this.editor.current.html());
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Slogan</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='seiTitle'>Tiêu đề</label><br />
                                <input className='form-control' id='seiTitle' type='text' placeholder='Tiêu đề' />
                            </div>
                            <div className='form-group'>
                                <label>Hình ảnh</label>
                                <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='SloganImage' userData='slogan' success={this.imageChanged} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='sgaContent'>Nội dung</label>
                                <Editor ref={this.editor} placeholder='Nội dung' />
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

class SloganEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.swap = this.swap.bind(this);
        this.showAddSloganModal = this.showAddSloganModal.bind(this);
        this.showEditSloganModal = this.showEditSloganModal.bind(this);

        this.modal = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 2);

            const route = T.routeMatcher('/admin/slogan/edit/:sloganId'),
                params = route.parse(window.location.pathname);

            this.props.getSloganItem(params.sloganId, data => {
                if (data.error) {
                    T.notify('Lấy nhóm slogan bị lỗi!', 'danger');
                    this.props.history.push('/admin/slogan');
                } else if (data.item) {
                    $('#slgTitle').val(data.item.title).focus();
                } else {
                    this.props.history.push('/admin/slogan');
                }
            });
        });
    }

    showAddSloganModal() {
        this.modal.current.show();
    }
    showEditSloganModal(e, selectedSlogan, index) {
        this.modal.current.show(selectedSlogan, index);
        e.preventDefault();
    }

    add(title, image, content) {
        this.props.addSloganIntoGroup(title, image, content);
        this.modal.current.hide();
    }
    update(index, title, image, content) {
        this.props.updateSloganInGroup(index, title, image, content);
        this.modal.current.hide();
    }
    remove(e, index) {
        this.props.removeSloganFromGroup(index);
        e.preventDefault();
    }
    swap(e, index, isMoveUp) {
        this.props.swapSloganInGroup(index, isMoveUp);
        e.preventDefault();
    }

    save() {
        const changes = {
            title: $('#slgTitle').val(),
            items: this.props.slogan.item.items,
        };
        this.props.updateSlogan(this.props.slogan.item._id, changes);
    }

    render() {
        let table = null,
            currentSlogan = this.props.slogan ? this.props.slogan.item : null;
        if (currentSlogan && currentSlogan.items.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }}>Tiêu đề</th>
                            <th style={{ width: '40%', textAlign: 'center' }}>Hình ảnh</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSlogan.items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.showEditSloganModal(e, item, index)}>{item.title}</a>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <img src={item.image} style={{ width: '100%' }} />
                                </td>
                                <td className='btn-group'>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, index, true)}>
                                        <i className='fa fa-lg fa-arrow-up' />
                                    </a>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, index, false)}>
                                        <i className='fa fa-lg fa-arrow-down' />
                                    </a>
                                    <a className='btn btn-primary' href='#' onClick={e => this.showEditSloganModal(e, item, index)}>
                                        <i className='fa fa-lg fa-edit' />
                                    </a>
                                    <a className='btn btn-danger' href='#' onClick={e => this.remove(e, index)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có slogan!</p>;
        }

        const title = currentSlogan && currentSlogan.title && currentSlogan.title != '' ? currentSlogan.title : '<empty>';
        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-yelp' /> Slogan: Chỉnh sửa</h1>
                        <p dangerouslySetInnerHTML={{ __html: title }} />
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;
                        <Link to='/admin/slogan'>Slogan</Link>
                        &nbsp;/&nbsp;Chỉnh sửa
                    </ul>
                </div>
                <div className='row'>
                    <div className='tile col-md-12'>
                        <div className='tile-body'>
                            <div className='form-group'>
                                <label className='control-label'>Tiêu đề</label>
                                <input className='form-control' type='text' placeholder='Tiêu đề' id='slgTitle' defaultValue={title} />
                            </div>
                            <div className='form-group'>
                                {table}
                            </div>
                        </div>
                        <div className='tile-footer'>
                            <div className='row'>
                                <div className='col-md-12' style={{ textAlign: 'right' }}>
                                    <button className='btn btn-info' type='button' onClick={this.showAddSloganModal}>
                                        <i className='fa fa-fw fa-lg fa-plus'></i>Thêm slogan
                                    </button>&nbsp;
                                    <button className='btn btn-primary' type='button' onClick={this.save}>
                                        <i className='fa fa-fw fa-lg fa-save'></i>Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to='/admin/slogan' className='btn btn-secondary btn-circle' style={{ position: 'fixed', lefft: '10px', bottom: '10px' }}>
                    <i className='fa fa-lg fa-reply' />
                </Link>

                <ItemModal ref={this.modal} addSlogan={this.add} updateSlogan={this.update} />
            </main>
        );
    }
}

const mapStateToProps = state => ({ slogan: state.slogan });
const mapActionsToProps = { getSloganItem, updateSlogan, addSloganIntoGroup, updateSloganInGroup, removeSloganFromGroup, swapSloganInGroup };
export default connect(mapStateToProps, mapActionsToProps)(SloganEditPage);