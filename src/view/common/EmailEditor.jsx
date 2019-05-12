import React from 'react';
import Editor from '../common/CkEditor4.jsx';

export default class EmailEditor extends React.Component {
    constructor(props) {
        super(props);
        this.save = this.save.bind(this);

        this.subject = React.createRef();
        this.editor = React.createRef();
    }

    save() {
        if (this.props.save) {
            this.props.save(Object.assign({}, this.props.email, {
                subject: $(this.subject.current).val(),
                html: this.editor.current.html(),
                text: this.editor.current.text(),
            }));
        }
    }

    render() {
        let { subject, html } = this.props && this.props.email ? this.props.email : {};
        if (subject == null) subject = '';
        if (this.editor.current) this.editor.current.html(html);

        return (
            <div style={{ width: '100%' }}>
                <div className='form-group'>
                    <label>Tiêu đề</label>
                    <input ref={this.subject} className='form-control' type='text' placeholder='Tiêu đề' defaultValue={subject} />
                </div>
                <div className='form-group'>
                    <label>Nội dung email</label>
                    <Editor ref={this.editor} placeholder='Nội dung Email' uploadUrl='/admin/upload' />
                </div>
                <button type='button' className='btn btn-primary float-right' data-dismiss='modal' onClick={this.save}>Lưu</button>
            </div>
        );
    }
}