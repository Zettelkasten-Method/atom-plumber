'use babel';

import { CompositeDisposable } from 'atom';
import { spawn as spawn } from 'child_process';

export default {

  subscriptions: null,

  activate(state) {

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-plumber:plumb': () => this.plumb()
    }));

    this.subscriptions.add(atom.views.getView(atom.workspace)
      .addEventListener('click', function(event) {
        if (event.altKey) {
          curView = atom.views.getView(atom.workspace.getActiveTextEditor());
          atom.commands.dispatch(curView, 'atom-plumber:plumb');
        }
    }));

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  plumb() {

    // get active editor
    editor = atom.workspace.getActiveTextEditor();

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

    // get the link under the cursor in the editor
    // from: https://github.com/atom/link/
    linkUnderCursor = function(editor) {
      cursorPosition = editor.getCursorBufferPosition();
      link = linkAtPosition(editor, cursorPosition);
      if (link !== null) { return link; }

      // look for a link to the left of the cursor
      if (cursorPosition.column > 0) {
        linkAtPosition(editor, cursorPosition.translate([0, -1]));
      }
    };

    // get link if text under cursor is a link
    if (editor) {
      link = linkUnderCursor(editor);
    }

    // get active pane item
    curPane = atom.workspace.getActivePaneItem();

    // get current path of pane item
    // from: https://github.com/mark-hahn/shell-it/
    panePath = curPane.getPath();
    if (panePath) {
      iterable = atom.project.getPaths();
      for (i = 0; i < iterable.length; i++) {
        curPath = iterable[i];
        if (panePath.slice(0, curPath.length) === curPath) {
          break;
        }
      }
    } else {
      curPath = (base = atom.project.getPaths())[0] !== null ? base[0] : '/';
    }

    // set selection to pass to plumber
    if (curPane) {
      selection = curPane.getSelectedText().trim() ||
      link ||
      curPane.getWordUnderCursor({
        // regex source: http://stackoverflow.com/a/25575009
        wordRegex: /[🔗§\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\w]+(:\d+)?/i
      });
    }

    // set spawn options
    options = {
      cwd: curPath,
      env: process.env,
    };

    // run spawn command
    cmd = 'plumb';
    runPlumb = spawn(cmd, [selection], options);

    // log spawn stdout
    runPlumb.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    // log spawn stderr
    runPlumb.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

  }

};
