import React from 'react';

function Options(props) {
	let optionItems = optionItems = props.options.map((option) => <li id={option.id} key={option.id} onClick={props.selectOption}>{option.name}</li>)
	if(!!props.show)
		return <ul className='active'>{optionItems}</ul>
	else
		return <ul>{optionItems}</ul>
}
class Select extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show : false,
		}
		this.hide = this.hide.bind(this);
		this.selectOption = this.selectOption.bind(this);
		this.change = this.change.bind(this);
	}
	change(event) {
		if(this.props.categorys.length <= 0)
			return;
		this.setState({
			show : !this.state.show
		})
	}
	selectOption(event) {
		this.props.selectOption(event.target.textContent);
		this.setState({
			show : false,
		})
	}
	hide(event) {
		this.setState({
			show : false
		})
	}
	render() {
		return (
			<div className='angel-select' tabIndex='-1' onBlur={this.hide}>
				<div className='selected-value' onClick={this.change}>{this.props.category}</div>
				<Options {...this.state} options={this.props.categorys} selectOption={this.selectOption} />
			</div>
		)
	}
}

export default Select;