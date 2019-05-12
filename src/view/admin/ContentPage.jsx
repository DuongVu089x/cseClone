import React from 'react';
import { connect } from 'react-redux';
import { getAllContents, createContent, updateContent, deleteContent, changeContentActive } from '../redux/content.jsx'
import { Link } from 'react-router-dom';

class ContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.create = this.create.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(2, 1);
            this.props.getAllContents();
        });
    }

    create(e) {
        this.props.createContent(data => this.props.history.push('/admin/content/edit/' + data.item._id));
        e.preventDefault();
    }

    delete(e, item) {
        T.confirm('Xóa nội dung', 'Bạn có chắc bạn muốn xóa nội dung này?', true, isConfirm => {
            isConfirm && this.props.deleteContent(item._id);
        });
        e.preventDefault();
    }

    render() {
        let table = null,
            items = this.props.content ? this.props.content : null;
        if (items && items.length > 0) {
            table = (
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>Tên</th>
                            <th style={{ width: 'auto', whiteSpace: 'nowrap' }} >Kích hoạt</th>
                            <th style={{ width: 'auto', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={'/admin/content/edit/' + item._id} data-id={item._id}>
                                        {item.title}
                                    </Link>
                                </td>
                                <td className='toggle' style={{ textAlign: 'center' }} >
                                    <label>
                                        <input type='checkbox' checked={item.active} onChange={() => this.props.updateContent(item._id, { active: !item.active })} />
                                        <span className='button-indecator' />
                                    </label>
                                </td>
                                <td className='btn-group'>
                                    <Link to={'/admin/content/edit/' + item._id} data-id={item._id} className='btn btn-primary'>
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
            table = <p>Không có nội dung nào cả!</p>;
        }

        return (
            <main className='app-content' >
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-image' /> Bài viết</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        &nbsp;/&nbsp;Bài viết
                    </ul>
                </div>
                <div className='row tile'>
                    {table}
                </div>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ content: state.content });
const mapActionsToProps = { getAllContents, createContent, updateContent, deleteContent, changeContentActive };
export default connect(mapStateToProps, mapActionsToProps)(ContentPage);