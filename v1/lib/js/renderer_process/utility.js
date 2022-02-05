"use strict";

const fs = require('fs');
import {editor} from './markdown_support.js';

export function read_file(target_filepath) {
  let data = fs.readFileSync(target_filepath, 'utf8');
  return data;
}

export function write_file(target_filepath) {
  fs.writeFile(target_filepath, editor.getValue(), function (error) {});
}

export function put2editor(str) {
  editor.session.insert(editor.getCursorPosition(), str);
  editor.focus();
}
