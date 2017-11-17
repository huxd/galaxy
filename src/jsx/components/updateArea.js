import React from 'react';

function UpdateTextArea(props) {
    if(!!props.edit)
        return <textarea rows={props.rows} id={props.id} value={props.content} onChange={props.handleChange} className='angel-textarea' autoFocus="true" onBlur={props.editChange}></textarea>
    else
        return <span id={props.id} onDoubleClick={props.editChange}>{props.content}</span>
}
function UpdateInputArea(props) {
    if(!!props.edit)
        return <input className='angel-input' id={props.id} value={props.content} onChange={props.handleChange} autoFocus="true" onBlur={props.editChange} />
    else
        return <span id={props.id} onDoubleClick={props.editChange}>{props.content}</span>
}

export {UpdateInputArea, UpdateTextArea};