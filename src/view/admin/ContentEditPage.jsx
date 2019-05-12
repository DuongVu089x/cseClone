import React from 'react';
import { connect } from 'react-redux';
import { getContentItem, updateContent } from '../redux/content.jsx'
import { Link } from 'react-router-dom';
import Editor from '../common/CkEditor4.jsx';

class ContentEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.save = this.save.bind(this);
        this.editor = React.createRef();

        this.state = { _id: null, title: '', active: false, content: '' };
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 1);
            this.getData();

            setTimeout(() => {
                $('#cntTitle').focus();
            }, 250);
        });
    }

    getData() {
        const route = T.routeMatcher('/admin/content/edit/:contentId'),
            params = route.parse(window.location.pathname);

        this.props.getContentItem(params.contentId, data => {
            if (data.error) {
                T.notify('Lấy bài viết bị lỗi!', 'danger');
                this.props.history.push('/admin/content');
            } else if (data.item) {
                $('#cntTitle').val(data.item.title).focus();
                this.editor.current.html(data.item.content ? data.item.content : '');
                this.setState(data.item);
            } else {
                this.props.history.push('/admin/content');
            }
        });
    }

    changeActive(event) {
        this.setState({ active: event.target.checked });
    }
    save() {
        const changes = {
            title: $('#cntTitle').val(),
            content: this.editor.current.html(),
            active: this.state.active,
        };

        this.props.updateContent(this.state._id, changes);
    }

    render() {
        const contentName = this.state.title && this.state.title != '' ? 'Tên: <b>' + this.state.title + '</b>' : '';
        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-image' /> Bài viết: Chỉnh sửa</h1>
                        <p dangerouslySetInnerHTML={{ __html: contentName }} />
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;
                        <Link to='/admin/content'>Bài viết</Link>
                        &nbsp;/&nbsp;Chỉnh sửa
                    </ul>
                </div>
                <div className='row'>
                    <div className='tile col-md-12'>
                        <div className='tile-body'>
                            <div className='row'>
                                <div className='form-group col-md-6 col-12'>
                                    <label className='control-label'>Tiêu đề</label>
                                    <input className='form-control' type='text' placeholder='Tiêu đề' id='cntTitle' defaultValue={this.state.title} />
                                </div>
                                <div className='form-group col-md-6 col-12'>
                                    <label className='control-label'>Kích hoạt: &nbsp;&nbsp;&nbsp;</label>
                                    <label className='toggle'>
                                        <input type='checkbox' checked={this.state.active} onChange={this.changeActive} /><span className='button-indecator' />
                                    </label>
                                </div>
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Nội dung</label>
                                <Editor ref={this.editor} placeholder='Nội dung bài biết' />
                            </div>
                        </div>
                    </div>
                </div>
                <Link to='/admin/content' className='btn btn-secondary btn-circle' style={{ position: 'fixed', lefft: '10px', bottom: '10px' }}>
                    <i className='fa fa-lg fa-reply' />
                </Link>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.save}>
                    <i className='fa fa-lg fa-save' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ content: state.content });
const mapActionsToProps = { getContentItem, updateContent };
export default connect(mapStateToProps, mapActionsToProps)(ContentEditPage);