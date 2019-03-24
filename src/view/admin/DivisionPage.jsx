import React from 'react';
import { connect } from 'react-redux';
import { getAllDivisions, getDivision, createDivision, swapDivision, updateDivision, deleteDivision } from '../redux/division.jsx'
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Editor from '../common/CkEditor4.jsx';
import ImageBox from '../common/ImageBox.jsx';
import Dropdown from '../common/Dropdown.jsx';

class NewItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);
        this.onSelectType = this.onSelectType.bind(this);
        this.imageChanged = this.imageChanged.bind(this);

        this.modal = React.createRef();
        this.imageBox = React.createRef();
        this.editor = React.createRef();
        this.btnSave = React.createRef();

        let types = Object.keys(T.divisionTypes).map(key => ({ value: key, label: T.divisionTypes[key] }));
        this.state = { divisionTypes: types, selectedDivision: null };
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#divisionName').focus());
            }, 250);
        });
    }

    show(_id) {
        if (_id) {
            this.props.getDivision(_id, item => {
                const { _id, name, image, type, active, abstract, content } = item ? item : { image: '/img/avatar.jpg' };
                $('#divisionName').val(name);
                $('#divisionActive').prop('checked', active != null && active.toString().toLowerCase() == 'true');
                $('#divisionAbstract').val(abstract);
                this.editor.current.html(content);
                // this.imageBox.current.setData('division', image);
                this.imageBox.current.setData('division:' + (item._id ? item._id : 'new'));
                this.setState({ selectedItem: { value: type, label: T.divisionTypes[type] }, image });

                $(this.btnSave.current).data('_id', _id);
                $(this.modal.current).modal('show');
            });
        } else {
            $('#divisionName').val('');
            $('#divisionActive').prop('checked', false);
            $('#divisionAbstract').val('');
            this.editor.current.html('');
            this.imageBox.current.setData('division', null);
            this.setState({ selectedItem: null, image: null });

            $(this.btnSave.current).data('_id', null);
            $(this.modal.current).modal('show');
        }
    }

    onSelectType(selectedItem) {
        this.setState({ selectedItem })
    }

    imageChanged(data) {
        this.setState({ image: data.url });
    }

    save(event) {
        const _id = $(this.btnSave.current).data('_id'),
            name = $('#divisionName').val().trim(),
            type = this.state.selectedItem ? this.state.selectedItem.value : null,
            image = this.state.image,
            active = $('#divisionActive').prop('checked'),
            abstract = $('#divisionAbstract').val(),
            content = this.editor.current.html();
        if (divisionName == '') {
            T.notify('Tên bộ phận bị trống!', 'danger');
            $('#divisionName').focus();
        }
        else if (type == null) {
            T.notify('Loại bộ phận bị trống!', 'danger');
        } else if (_id) {
            this.props.updateDivision(_id, { name, type, image, active, abstract, content }, data => {
                if (data.error == undefined || data.error == null) {
                    $(this.modal.current).modal('hide');
                }
            });
        } else {
            this.props.createDivision({ name, type, image, active, abstract, content }, data => {
                if (data.error == undefined || data.error == null) {
                    $(this.modal.current).modal('hide');
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thông tin bộ phận</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group row'>
                                <div className='col-8'>
                                    <div className='form-group'>
                                        <label htmlFor='divisionName'>Tên</label>
                                        <input className='form-control' id='divisionName' type='text' placeholder='Tên' />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='divisionType'>Loại</label><br />
                                        <Select options={this.state.divisionTypes} isClearable={true} onChange={this.onSelectType} value={this.state.selectedItem} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='divisionAbstract'>Giới thiệu ngắn</label>
                                        <textarea className='form-control' id='divisionAbstract' type='text' placeholder='Giới thiệu ngắn' defaultValue=''
                                            style={{ border: 'solid 1px #eee', width: '100%', minHeight: '100px', padding: '0 3px' }} />
                                    </div>
                                </div>
                                <div className='col-4'>
                                    <label>Hình đại diện</label>
                                    <ImageBox ref={this.imageBox} postUrl='/admin/upload' uploadType='DivisionImage' userData='division' image={this.state.image} success={this.imageChanged} />
                                    <br />
                                    <div style={{ display: 'inline-flex' }}>
                                        <label htmlFor='divisionActive'>Kích hoạt: </label>&nbsp;&nbsp;
                                        <div className='toggle'>
                                            <label>
                                                <input type='checkbox' id='divisionActive' onChange={() => { }} /><span className='button-indecator' />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='divisionContent'>Giới thiệu chi tiết</label>
                                <Editor ref={this.editor} className='form-control' id='divisionContent' placeholder='Giới thiệu chi tiết' />
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

class DivisionPage extends React.Component {
    constructor(props) {
        super(props);
        this.create = this.create.bind(this);
        this.swap = this.swap.bind(this);
        this.changeType = this.changeType.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.delete = this.delete.bind(this);

        this.modal = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 6);
            this.props.getAllDivisions();
        });
    }

    create(e) {
        this.props.createDivision();
        e.preventDefault();
    }

    swap(e, item, isMoveUp) {
        this.props.swapDivision(item._id, isMoveUp);
        e.preventDefault();
    }

    changeType(item, selectedType) {
        this.props.updateDivision(item._id, { type: selectedType.value });
    }

    changeActive(item, index) {
        this.props.updateDivision(item._id, { active: !item.active });
    }

    delete(e, item) {
        T.confirm('Xóa division', 'Bạn có chắc bạn muốn xóa bộ phận này?', true, isConfirm => {
            isConfirm && this.props.deleteDivision(item._id);
        });
        e.preventDefault();
    }

    edit(e, item) {
        this.modal.current.show(item._id);
        e.preventDefault();
    }

    render() {
        let table = null,
            items = this.props.division ? this.props.division : null,
            divisionTypeItems = Object.keys(T.divisionTypes).map(key => ({ value: key, text: T.divisionTypes[key] }));
        if (items && items.length > 0) {
            table = (
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th style={{ width: '80%' }}>Tên</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Phân loại</th>
                            <th style={{ width: '20%', textAlign: 'center', whiteSpace: 'nowrap' }}>Hình ảnh</th>
                            <th style={{ width: 'auto', whiteSpace: 'nowrap' }}>Kích hoạt</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <a href='#' onClick={e => this.edit(e, item)}>{item.name}</a>
                                </td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <Dropdown text={T.divisionTypes[item.type]} items={divisionTypeItems} onSelected={selectedItem => this.changeType(item, selectedItem)} />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <img src={item.image ? item.image : '/img/avatar.jpg'} alt='avatar' style={{ height: '32px' }} />
                                </td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <label>
                                        <input type='checkbox' checked={item.active} onChange={() => this.changeActive(item, index)} /><span className='button-indecator' />
                                    </label>
                                </td>
                                <td className='btn-group'>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, item, true)}>
                                        <i className='fa fa-lg fa-arrow-up' />
                                    </a>
                                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, item, false)}>
                                        <i className='fa fa-lg fa-arrow-down' />
                                    </a>
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
            table = <p>Không có bộ phận nào cả!</p>;
        }

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-bullseye' /> Các bộ phận khoa</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Các bộ phận khoa</li>
                    </ul>
                </div>

                <div className='row tile'>{table}</div>
                <NewItemModal createDivision={this.props.createDivision} updateDivision={this.props.updateDivision} getDivision={this.props.getDivision} ref={this.modal} />

                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={() => this.modal.current.show()}>
                    <i className='fa fa-lg fa-plus' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ division: state.division });
const mapActionsToProps = { getAllDivisions, getDivision, createDivision, swapDivision, updateDivision, deleteDivision };
export default connect(mapStateToProps, mapActionsToProps)(DivisionPage);