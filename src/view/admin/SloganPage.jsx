import React from 'react';
import { connect } from 'react-redux';
import { getAllSlogans, createSlogan, deleteSlogan } from '../redux/slogan.jsx'
import { Link } from 'react-router-dom';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);

        this.modal = React.createRef();
        this.btnSave = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            setTimeout(() => {
                $(this.modal.current).on('shown.bs.modal', () => $('#sloganName').focus());
            }, 250);
        });
    }

    show() {
        $('#sloganName').val('');
        $(this.modal.current).modal('show');
    }

    save(event) {
        const sloganName = $('#sloganName').val().trim();
        if (sloganName == '') {
            T.notify('Tên nhóm slogan bị trống!', 'danger');
            $('#sloganName').focus();
        } else {
            this.props.createSlogan(sloganName, data => {
                if (data.error == undefined || data.error == null) {
                    $(this.modal.current).modal('hide');
                    if (data.slogan) {
                        this.props.showSlogan(data.slogan);
                    }
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Thông tin nhóm slogan</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='sloganName'>Tên nhóm slogan</label>
                                <input className='form-control' id='sloganName' type='text' placeholder='Tên nhóm slogan' />
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

class SloganPage extends React.Component {
    constructor(props) {
        super(props);
        this.modal = React.createRef();

        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 2);
            this.props.getAllSlogans();
        });
    }

    create(e) {
        this.modal.current.show();
        e.preventDefault();
    }

    show(item) {
        this.props.history.push('/admin/slogan/edit/' + item._id);
    }

    delete(e, item) {
        T.confirm('Xóa nhóm slogan', 'Bạn có chắc bạn muốn xóa nhóm slogan này?', true, isConfirm => {
            isConfirm && this.props.deleteSlogan(item._id);
        });
        e.preventDefault();
    }

    render() {
        let table = null;
        if (this.props.slogan && this.props.slogan.list && this.props.slogan.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Tên nhóm</th>
                            <th style={{ width: 'auto', whiteSpace: 'nowrap' }}>Số lượng</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.slogan.list.map((slogan, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={'/admin/slogan/edit/' + slogan._id} data-id={slogan._id}>{slogan.title}</Link>
                                </td>
                                <td style={{ textAlign: 'right' }}>{slogan.items.length}</td>
                                <td className='btn-group'>
                                    <Link to={'/admin/slogan/edit/' + slogan._id} data-id={slogan._id} className='btn btn-primary'>
                                        <i className='fa fa-lg fa-edit' />
                                    </Link>
                                    <a className='btn btn-danger' href='#' onClick={e => this.delete(e, slogan)}>
                                        <i className='fa fa-lg fa-trash' />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có nhóm slogan!</p>;
        }

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-yelp' /> Slogan</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Slogan</li>
                    </ul>
                </div>

                <div className='row tile'>{table}</div>
                <ItemModal createSlogan={this.props.createSlogan} showSlogan={this.show} ref={this.modal} />
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ slogan: state.slogan });
const mapActionsToProps = { getAllSlogans, createSlogan, deleteSlogan };
export default connect(mapStateToProps, mapActionsToProps)(SloganPage);