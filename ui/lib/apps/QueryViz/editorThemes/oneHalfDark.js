/* eslint-disable no-multi-str */

const ace = require('ace-builds/src-noconflict/ace')

ace.define(
  'ace/theme/oneHalfDark',
  ['require', 'exports', 'module', 'ace/lib/dom'],
  function (require, exports, module) {
    exports.isDark = true
    exports.cssClass = 'ace-one-half-dark'
    exports.cssText =
      '.ace-one-half-dark .ace_gutter {\
background: #282c34;\
color: rgb(130,134,140)\
}\
.ace-one-half-dark .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-one-half-dark {\
background-color: #282c34;\
color: #dcdfe4\
}\
.ace-one-half-dark .ace_cursor {\
color: #a3b3cc\
}\
.ace-one-half-dark .ace_marker-layer .ace_selection {\
background: #474e5d\
}\
.ace-one-half-dark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #282c34;\
border-radius: 2px\
}\
.ace-one-half-dark .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-one-half-dark .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #5c6370\
}\
.ace-one-half-dark .ace_marker-layer .ace_active-line {\
background: #313640\
}\
.ace-one-half-dark .ace_gutter-active-line {\
background-color: #313640\
}\
.ace-one-half-dark .ace_marker-layer .ace_selected-word {\
border: 1px solid #474e5d\
}\
.ace-one-half-dark .ace_fold {\
background-color: #61afef;\
border-color: #dcdfe4\
}\
.ace-one-half-dark .ace_keyword {\
color: #c678dd\
}\
.ace-one-half-dark .ace_constant {\
color: #e5c07b\
}\
.ace-one-half-dark .ace_constant.ace_numeric {\
color: #e5c07b\
}\
.ace-one-half-dark .ace_constant.ace_character.ace_escape {\
color: #56b6c2\
}\
.ace-one-half-dark .ace_support.ace_function {\
color: #61afef\
}\
.ace-one-half-dark .ace_support.ace_class {\
color: #e5c07b\
}\
.ace-one-half-dark .ace_storage {\
color: #c678dd\
}\
.ace-one-half-dark .ace_invalid.ace_illegal {\
color: #dcdfe4;\
background-color: #e06c75\
}\
.ace-one-half-dark .ace_invalid.ace_deprecated {\
color: #dcdfe4;\
background-color: #e5c07b\
}\
.ace-one-half-dark .ace_string {\
color: #98c379\
}\
.ace-one-half-dark .ace_string.ace_regexp {\
color: #98c379\
}\
.ace-one-half-dark .ace_comment {\
color: #5c6370\
}\
.ace-one-half-dark .ace_variable {\
color: #e06c75\
}\
.ace-one-half-dark .ace_meta.ace_selector {\
color: #c678dd\
}\
.ace-one-half-dark .ace_entity.ace_other.ace_attribute-name {\
color: #e5c07b\
}\
.ace-one-half-dark .ace_entity.ace_name.ace_function {\
color: #61afef\
}\
.ace-one-half-dark .ace_entity.ace_name.ace_tag {\
color: #e06c75\
}'

    var dom = require('../lib/dom')
    dom.importCssString(exports.cssText, exports.cssClass)
  }
)
;(function () {
  ace.require(['ace/theme/oneHalfDark'], function (m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m
    }
  })
})()
