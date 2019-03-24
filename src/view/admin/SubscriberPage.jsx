import React from 'react';
import { connect } from 'react-redux';
import { getSubscriberInPage, deleteSubscriber, downloadSubscriber, sendEmailToSubscriber } from '../redux/subscriber.jsx'
import { Link } from 'react-router-dom';
import Pagination from '../common/Pagination.jsx';
import Editor from '../common/CkEditor4.jsx';

class SendEmailModal extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.sendEmail = this.sendEmail.bind(this);

        this.modal = React.createRef();
        this.editor = React.createRef();
    }

    show() {
        $('#semSubject').val('').focus();
        this.editor.current.html('');
        $(this.modal.current).modal('show');
    }
    hide() {
        $(this.modal.current).modal('hide');
    }

    sendEmail(event) {
        let mailSubject = $('#semSubject').val(),
            mailText = this.editor.current.text(),
            mailHtml = this.editor.current.html();
        sendEmailToSubscriber(mailSubject, mailText, mailHtml, () => this.hide());
        event.preventDefault();
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <form className='modal-dialog modal-lg' role='document' onSubmit={this.save}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Gửi email đến subscriber</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-group'>
                                <label htmlFor='semSubject'>Tựa đề</label><br />
                                <input className='form-control' id='semSubject' type='text' placeholder='Tựa đề' />
                            </div>
                            <div className='form-group'>
                                <label >Nội dung</label>
                                <Editor ref={this.editor} placeholder='Nội dung' />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Đóng</button>
                            <button type='button' className='btn btn-primary' onClick={this.sendEmail}>Gửi</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class SubscriberPage extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.sendEmail = this.sendEmail.bind(this);

        this.sendEmailModal = React.createRef();
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(1, 5);
            this.props.getSubscriberInPage();
        });
    }

    delete(e, item) {
        T.confirm('Xóa Subscriber', 'Bạn có chắc bạn muốn xóa subscriber này?', true, isConfirm => {
            isConfirm && this.props.deleteSubscriber(item._id);
        });
        e.preventDefault();
    }

    sendEmail() {
        this.sendEmailModal.current.show();
    }

    render() {
        let table = null;
        if (this.props.subscriber && this.props.subscriber.page && this.props.subscriber.page.list && this.props.subscriber.page.list.length > 0) {
            table = (
                <table className='table table-hover table-bordered' ref={this.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }}>Email</th>
                            <th style={{ width: '40%' }}>Ngày</th>
                            <th style={{ width: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.subscriber.page.list.map((item, index) => (
                            <tr key={index}>
                                <td>{item.email}</td>
                                <td>{new Date(item.createdDate).getText()}</td>
                                <td style={{ textAlign: 'center' }}>
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
            table = <p>Không có subscriber!</p>;
        }

        const { pageNumber, pageSize, pageTotal, totalItem } = this.props.subscriber ?
            this.props.subscriber.page : { pageNumber: 1, pageSize: 50, pageTotal: 1, totalItem: 0 };

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-users' /> Subscriber</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Subscriber</li>
                    </ul>
                </div>

                <div className='row tile'>
                    {table}
                </div>
                <Pagination name='adminSubscriber'
                    pageNumber={pageNumber} pageSize={pageSize} pageTotal={pageTotal} totalItem={totalItem}
                    getPage={this.props.getSubscriberInPage} />
                <SendEmailModal ref={this.sendEmailModal} />

                <button type='button' className='btn btn-warning btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px', padding: 0 }}
                    onClick={downloadSubscriber}>
                    <i className='fa fa-lg fa-file-excel-o' style={{ margin: '0 auto' }} />
                </button>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '70px', bottom: '10px', padding: 0 }}
                    onClick={this.sendEmail}>
                    <i className='fa fa-lg fa-send' style={{ margin: '0 auto' }} />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ subscriber: state.subscriber });
const mapActionsToProps = { getSubscriberInPage, deleteSubscriber };
export default connect(mapStateToProps, mapActionsToProps)(SubscriberPage);