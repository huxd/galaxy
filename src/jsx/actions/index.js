export const wordModalActions = {
	'hide' : function() {
		return {
			type : 'HIDE_WORD_MODAL'
		}
	},
	'displayWord' : function(word) {
		return {
			type : 'DISPLAY_WORD',
			word : word
		}
	}
}
export const familyMapActions = {
	'init' : function(words) {
		return {
			type : 'INIT_FAMILYMAP',
			words : words
		}
	}
}
export const wordsActions = {
	'init' : function(words) {
		return {
			type : 'INIT_WORDS',
			words : words
		}
	}
}

export const categoryActions = {
	'init' : function(categorys) {
		return {
			type : 'INIT_CATEGORY',
			categorys : categorys
		}
	},
	'add' : function(category) {
		return {
			type : 'ADD_CATEGORY',
			category : category
		}
	},
	'set' : function(category) {
		return {
			type : 'SET_CATEGORY',
			category : category
		}
	}
}

export const wordsMapActions = {
	'init' : function(words) {
		return {
			type : 'INIT_WORDSMAP',
			words : words
		}
	},
	'add' : function(word) {
		return {
			type : 'ADD_WORDSMAP',
			word : word
		}
	}
}

export const originMapActions = {
	'init' : function(originMap) {
		return {
			type : 'INIT_ORIGINMAP',
			originMap : originMap
		}
	}
}