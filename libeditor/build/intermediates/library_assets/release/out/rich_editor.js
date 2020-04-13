/**
 * Copyright (C) 2020 PetaniIklan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var NZ = {};

NZ.currentSelection = {
    "startContainer": 0,
    "startOffset": 0,
    "endContainer": 0,
    "endOffset": 0};

NZ.editor = document.getElementById('editor');

document.addEventListener("selectionchange", function() { NZ.backuprange(); });

// Initializations
NZ.callback = function() {
    window.location.href = "re-callback://" + encodeURI(NZ.getHtml());
}

NZ.setHtml = function(contents) {
    NZ.editor.innerHTML = decodeURIComponent(contents.replace(/\+/g, '%20'));
}

NZ.getHtml = function() {
    return NZ.editor.innerHTML;
}

NZ.getText = function() {
    return NZ.editor.innerText;
}

NZ.setBaseTextColor = function(color) {
    NZ.editor.style.color  = color;
}

NZ.setBaseFontSize = function(size) {
    NZ.editor.style.fontSize = size;
}

NZ.setPadding = function(left, top, right, bottom) {
  NZ.editor.style.paddingLeft = left;
  NZ.editor.style.paddingTop = top;
  NZ.editor.style.paddingRight = right;
  NZ.editor.style.paddingBottom = bottom;
}

NZ.setBackgroundColor = function(color) {
    document.body.style.backgroundColor = color;
}

NZ.setBackgroundImage = function(image) {
    NZ.editor.style.backgroundImage = image;
}

NZ.setWidth = function(size) {
    NZ.editor.style.minWidth = size;
}

NZ.setHeight = function(size) {
    NZ.editor.style.height = size;
}

NZ.setTextAlign = function(align) {
    NZ.editor.style.textAlign = align;
}

NZ.setVerticalAlign = function(align) {
    NZ.editor.style.verticalAlign = align;
}

NZ.setPlaceholder = function(placeholder) {
    NZ.editor.setAttribute("placeholder", placeholder);
}

NZ.setInputEnabled = function(inputEnabled) {
    NZ.editor.contentEditable = String(inputEnabled);
}

NZ.undo = function() {
    document.execCommand('undo', false, null);
}

NZ.redo = function() {
    document.execCommand('redo', false, null);
}

NZ.setBold = function() {
    document.execCommand('bold', false, null);
}

NZ.setItalic = function() {
    document.execCommand('italic', false, null);
}

NZ.setSubscript = function() {
    document.execCommand('subscript', false, null);
}

NZ.setSuperscript = function() {
    document.execCommand('superscript', false, null);
}

NZ.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
}

NZ.setUnderline = function() {
    document.execCommand('underline', false, null);
}

NZ.setBullets = function() {
    document.execCommand('insertUnorderedList', false, null);
}

NZ.setNumbers = function() {
    document.execCommand('insertOrderedList', false, null);
}

NZ.setTextColor = function(color) {
    NZ.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

NZ.setTextBackgroundColor = function(color) {
    NZ.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

NZ.setFontSize = function(fontSize){
    document.execCommand("fontSize", false, fontSize);
}

NZ.setHeading = function(heading) {
    document.execCommand('formatBlock', false, '<h'+heading+'>');
}

NZ.setIndent = function() {
    document.execCommand('indent', false, null);
}

NZ.setOutdent = function() {
    document.execCommand('outdent', false, null);
}

NZ.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
}

NZ.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
}

NZ.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
}

NZ.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
}

NZ.insertImage = function(url, alt) {
    var html = '<img src="' + url + '" alt="' + alt + '" />';
    NZ.insertHTML(html);
}

NZ.insertHTML = function(html) {
    NZ.restorerange();
    document.execCommand('insertHTML', false, html);
}

NZ.insertLink = function(url, title) {
    NZ.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length == 0) {
        document.execCommand("insertHTML",false,"<a href='"+url+"'>"+title+"</a>");
    } else if (sel.rangeCount) {
       var el = document.createElement("a");
       el.setAttribute("href", url);
       el.setAttribute("title", title);

       var range = sel.getRangeAt(0).cloneRange();
       range.surroundContents(el);
       sel.removeAllRanges();
       sel.addRange(range);
   }
    NZ.callback();
}

NZ.setTodo = function(text) {
    var html = '<input type="checkbox" name="'+ text +'" value="'+ text +'"/> &nbsp;';
    document.execCommand('insertHTML', false, html);
}

NZ.prepareInsert = function() {
    NZ.backuprange();
}

NZ.backuprange = function(){
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      NZ.currentSelection = {
          "startContainer": range.startContainer,
          "startOffset": range.startOffset,
          "endContainer": range.endContainer,
          "endOffset": range.endOffset};
    }
}

NZ.restorerange = function(){
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(NZ.currentSelection.startContainer, NZ.currentSelection.startOffset);
    range.setEnd(NZ.currentSelection.endContainer, NZ.currentSelection.endOffset);
    selection.addRange(range);
}

NZ.enabledEditingItems = function(e) {
    var items = [];
    if (document.queryCommandState('bold')) {
        items.push('bold');
    }
    if (document.queryCommandState('italic')) {
        items.push('italic');
    }
    if (document.queryCommandState('subscript')) {
        items.push('subscript');
    }
    if (document.queryCommandState('superscript')) {
        items.push('superscript');
    }
    if (document.queryCommandState('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (document.queryCommandState('underline')) {
        items.push('underline');
    }
    if (document.queryCommandState('insertOrderedList')) {
        items.push('orderedList');
    }
    if (document.queryCommandState('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (document.queryCommandState('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (document.queryCommandState('justifyFull')) {
        items.push('justifyFull');
    }
    if (document.queryCommandState('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (document.queryCommandState('justifyRight')) {
        items.push('justifyRight');
    }
    if (document.queryCommandState('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }

    window.location.href = "re-state://" + encodeURI(items.join(','));
}

NZ.focus = function() {
    var range = document.createRange();
    range.selectNodeContents(NZ.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    NZ.editor.focus();
}

NZ.blurFocus = function() {
    NZ.editor.blur();
}

NZ.removeFormat = function() {
    document.execCommand('removeFormat', false, null);
}

// Event Listeners
NZ.editor.addEventListener("input", NZ.callback);
NZ.editor.addEventListener("keyup", function(e) {
    var KEY_LEFT = 37, KEY_RIGHT = 39;
    if (e.which == KEY_LEFT || e.which == KEY_RIGHT) {
        NZ.enabledEditingItems(e);
    }
});
NZ.editor.addEventListener("click", NZ.enabledEditingItems);
