const moment = require('moment')

// to make the displayed invite short
module.exports = {
  
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },

  //edit
  editIcon: function (user, loggedUser, commId, float = true) {
    if (user._id.toString() == loggedUser._id.toString()) {
      if (float) {
        return `<a href="/comments/edit/${commId}" class="btn">edit</i></a>`
      } else {
        return `<a href="/comments/edit/${commId}">edit</a>`
      }
    } else {
      return ''
    }
  },

  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      ).replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}