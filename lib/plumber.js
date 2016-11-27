'use babel';

import { BufferedProcess, CompositeDisposable, Disposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'plumber:plumb': () => this.plumb()
    }));

    let addEventListener = function(editor, eventName, handler) {
      editorView = atom.views.getView(editor);
      editorView.addEventListener(eventName, handler);
      return new Disposable(() => editorView.removeEventListener(eventName, handler));
    };

    return this.subscriptions.add(atom.workspace.observeTextEditors(editor => {
      disposables = new CompositeDisposable();
      disposables.add(addEventListener(editor, 'mouseup', event => {
        if (event.altKey) {
          return this.plumb();
        }
      }));
      disposables.add(editor.onDidDestroy(() => {
        disposables.dispose();
        return this.subscriptions.remove(disposables);
      }));
      return this.subscriptions.add(disposables);
    }));

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  plumb() {

    // get active editor
    editor = atom.workspace.getActiveTextEditor();

    // get the link under the cursor in the editor
    // from: https://github.com/atom/link/
    linkUnderCursor = function(editor) {
      cursorPosition = editor.getCursorBufferPosition();
      link = linkAtPosition(editor, cursorPosition);
      if (link !== null) { return link; }

      // Look for a link to the left of the cursor
      if (cursorPosition.column > 0) {
        return linkAtPosition(editor, cursorPosition.translate([0, -1]));
      }
    };

    // get the link at the buffer position in the editor
    // from: https://github.com/atom/link/
    linkAtPosition = function(editor, bufferPosition) {
      selector = null;
      if (selector === null) {
        let {ScopeSelector} = require('first-mate');
        selector = new ScopeSelector('markup.underline.link');
      }

      if ((token = editor.tokenForBufferPosition(bufferPosition))) {
        if (token.value && selector.matches(token.scopes)) {
          return token.value;
        }
      }
    };

    // get link if text under cursor is a link
    if (editor) {
      link = linkUnderCursor(editor);
    }

    // get current path of editor
    // from: https://github.com/mark-hahn/shell-it/
    if ((editorPath = editor.getPath())) {
      for (var curPath of atom.project.getPaths()) {
        if (editorPath.slice(0, curPath.length) === curPath) {
          break;
        }
      }
    } else {
      curPath = (base = atom.project.getPaths())[0] !== null ? base[0] : '/';
    }

    // set selection to pass to process
    if (editor) {
      selection = editor.getSelectedText().trim() ||
      link ||
      editor.getWordUnderCursor({
        // regex source: http://stackoverflow.com/a/25575009
        wordRegex: /[🔗§\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\w]+(:\d+)?/i
      });
    }

    // setup process
    command = 'plumb';
    args = [selection];
    options = {
      cwd: curPath,
      env: process.env,
    };

    // run process
    stdout = output => console.log(output);
    stderr = output => console.error(output);
    exit = code => console.log(`plumber exited with ${code}`);
    process = new BufferedProcess({command, args, options, stdout, stderr, exit});

  }

};
