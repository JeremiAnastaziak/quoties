import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import AutoComplete from 'material-ui/AutoComplete';
import './NewPost.css'
import { toggleBodyClass } from '../utils/helpers';

const FileInput = require('react-file-input');

class NewPost extends Component {

	constructor() {
		super();
		this.state = {
			quoteText: '',
			quoteAuthor: '',
			quoteTitle: '',
			quoteTags: '',
			edition: false,
			authors: []
		}

	}

	componentDidMount() {
		let authors = []
		const quotes = this.props.quotes;
		const editionId = this.props.edition.quoteId;

		quotes && Object
			.keys(quotes)
			.map(index => !authors.includes(quotes[index].quoteAuthor) && authors.push(quotes[index].quoteAuthor))

		this.setState({
			authors: authors
		})

		quotes && editionId && this.setState({
			...quotes[editionId],
			quoteTags: quotes[editionId].quoteTags && (quotes[editionId].quoteTags.join(' ') + ' ')
		})
		console.log('mounted');

	}

	submitQuote = (e) => {
		e.preventDefault();
		const isEdition = this.props.edition;
		this.props.submitQuote(isEdition, isEdition ? this.props.edition.quoteId : null, {
			quoteAuthor: this.state.quoteAuthor,
			quoteText: this.state.quoteText,
			quoteTitle: this.state.quoteTitle,
			quoteTags: this.state.quoteTags ? this.state.quoteTags.trim().split(' ') : []
		})
	}

	handleFileUpload = (e) => {
		window.Tesseract.recognize(e.target.files[0])
			.then((result) => {
				console.log(result)
			})
			.progress(message => console.log(message))
			.catch(err => console.error(err))
	}

	render() {
		return (
			<div className="wrapper">
				<form ref={(input) => this.quoteForm = input} onSubmit={(e) => this.submitQuote(e)}>
					<AutoComplete
						className="field"
						ref={(input) => this.qAuthor = input}
						onUpdateInput={value => this.setState({ quoteAuthor: value })}
						onFocus={e => this.setState({ edition: true })}
						onBlur={e => this.setState({ edition: false })}
						floatingLabelText="Author"
						fullWidth
						required
						searchText={this.state.quoteAuthor}
						filter={AutoComplete.caseInsensitiveFilter}
						dataSource={this.state.authors}
					/>
					<TextField
						className="field"
						ref={(input) => this.qText = input}
						onChange={e => this.setState({ quoteText: e.target.value })}
						onFocus={e => this.setState({ edition: true })}
						onBlur={e => this.setState({ edition: false })}
						floatingLabelText="Text"
						multiLine
						rows={3}
						fullWidth
						required
						value={this.state.quoteText}
					/>
					<TextField
						className="field"
						onChange={e => this.setState({ quoteTitle: e.target.value })}
						onFocus={e => this.setState({ edition: true })}
						onBlur={e => this.setState({ edition: false })}
						floatingLabelText="Source"
						fullWidth
						value={this.state.quoteTitle}
					/>
					<TextField
						className="field"
						onChange={e => this.setState({ quoteTags: e.target.value })}
						onFocus={e => this.setState({ edition: true })}
						onBlur={e => this.setState({ edition: false })}
						floatingLabelText="Tags"
						fullWidth
						value={this.state.quoteTags}
					/>
					<RaisedButton
						className="button-submit"
						type="submit"
						label={this.props.edition ? 'Update' : 'Save'}
						primary
					/>
					{this.state.edition ? toggleBodyClass('edition-mode') : ''}
				</form>
			</div>
		);
	}
}

export default NewPost;