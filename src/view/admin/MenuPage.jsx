import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAll, createMenu, swapMenu, updateMenu, deleteMenu, buildMenu } from '../redux/menu.jsx'

class MenuPage extends React.Component {
    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);
        this.create = this.create.bind(this);
        this.createChild = this.createChild.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.swap = this.swap.bind(this);
        this.delete = this.delete.bind(this);
        this.createMenuItems = this.createMenuItems.bind(this);
    }

    componentDidMount() {
        $(document).ready(() => {
            T.selectMenu(1, 1);
            this.getData();
        });
    }

    getData() {
        this.props.getAll();
    }

    create(e) {
        this.props.createMenu(null, data => this.props.history.push('/admin/menu/edit/' + data.item._id));
        e.preventDefault();
    }

    createChild(e, item) {
        this.props.createMenu(item._id, data => this.props.history.push('/admin/menu/edit/' + data.item._id));
        e.preventDefault();
    }

    swap(e, item, isMoveUp) {
        this.props.swapMenu(item._id, isMoveUp);
        e.preventDefault();
    }

    changeActive(item, index) {
        this.props.updateMenu(item._id, { active: !item.active });
    }

    delete(e, item) {
        T.confirm('Xóa menu', 'Bạn có chắc bạn muốn xóa menu này?', true, isConfirm =>
            isConfirm && this.props.deleteMenu(item._id)
        );
        e.preventDefault();
    }

    createMenuItems(menus, item, index, level) {
        let titleStyle = { marginLeft: (12 * level) + 'px' },
            linkStyle = {},
            buttonsStyle = {},
            createChildButton = (
                <a className='btn btn-info' href='#' onClick={e => this.createChild(e, item)}>
                    <i className='fa fa-lg fa-plus' />
                </a>
            );
        if (level > 0) {
            titleStyle.color = 'black';
            linkStyle.color = 'black';
            buttonsStyle = { textAlign: 'right', display: 'block' };
            createChildButton = '';
        }

        menus.push(
            <tr key={menus.length}>
                <td>
                    <Link to={'/admin/menu/edit/' + item._id} data-id={item._id} style={titleStyle}>
                        {item.title}
                    </Link>
                </td>
                <td style={{ width: '20%' }}>
                    <a href={item.link} target='blank'>{item.link}</a>
                </td>
                <td className='toggle' style={{ textAlign: 'center' }} >
                    <label>
                        <input type='checkbox' checked={item.active} onChange={() => this.changeActive(item, index)} /><span className='button-indecator' />
                    </label>
                </td>
                <td className='btn-group' style={buttonsStyle}>
                    {createChildButton}
                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, item, true)}>
                        <i className='fa fa-lg fa-arrow-up' />
                    </a>
                    <a className='btn btn-success' href='#' onClick={e => this.swap(e, item, false)}>
                        <i className='fa fa-lg fa-arrow-down' />
                    </a>
                    <Link to={'/admin/menu/edit/' + item._id} data-id={item._id} className='btn btn-primary'>
                        <i className='fa fa-lg fa-edit' />
                    </Link>
                    <a className='btn btn-danger' href='#' onClick={e => this.delete(e, item)}>
                        <i className='fa fa-lg fa-trash' />
                    </a>
                </td>
            </tr>
        );

        if (item.submenus) {
            item.submenus.forEach((subItem, subIndex) => this.createMenuItems(menus, subItem, subIndex, level + 1));
        }
    }

    render() {
        let table = null;
        if (this.props.menu && this.props.menu.length > 0) {
            const menus = [];
            this.props.menu.forEach((item, index) => this.createMenuItems(menus, item, index, 0));

            table = (
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Tên</th>
                            <th style={{ width: '60%' }}>Link</th>
                            <th style={{ width: 'auto' }} nowrap='true'>Kích hoạt</th>
                            <th style={{ width: 'auto', textAlign: 'center' }} nowrap='true'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menus}
                    </tbody>
                </table>
            );
        } else {
            table = <p>Không có menu!</p>;
        }

        return (
            <main className='app-content'>
                <div className='app-title'>
                    <div>
                        <h1><i className='fa fa-user' /> Menu chính</h1>
                        <p></p>
                    </div>
                    <ul className='app-breadcrumb breadcrumb'>
                        <li className='breadcrumb-item'>
                            <Link to='/admin'><i className='fa fa-home fa-lg' /></Link>
                        </li>
                        <li className='breadcrumb-item'>Menu chính</li>
                    </ul>
                </div>

                <div className='row tile'>
                    {table}
                </div>

                <button type='button' className='btn btn-danger btn-circle' style={{ position: 'fixed', bottom: '10px' }}
                    onClick={this.props.buildMenu}>
                    <i className='fa fa-lg fa-refresh' />
                </button>
                <button type='button' className='btn btn-primary btn-circle' style={{ position: 'fixed', right: '10px', bottom: '10px' }}
                    onClick={this.create}>
                    <i className='fa fa-lg fa-plus' />
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({ menu: state.menu });
const mapActionsToProps = { getAll, createMenu, swapMenu, updateMenu, deleteMenu, buildMenu };
export default connect(mapStateToProps, mapActionsToProps)(MenuPage);