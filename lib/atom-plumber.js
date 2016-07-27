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
        if (event.altKey || event.metaKey) {
          curEditor = atom.views.getView(atom.workspace.getActiveTextEditor());
          atom.commands.dispatch(curEditor, 'atom-plumber:plumb');
        }
    }));

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  plumb() {

    // get editor
    editor = atom.workspace.getActivePaneItem();

    // get path
    // borrowed from: https://github.com/mark-hahn/shell-it/
    editorPath = editor.getPath();
    if (editorPath) {
      iterable = atom.project.getPaths();
      for (i = 0; i < iterable.length; i++) {
        curPath = iterable[i];
        if (editorPath.slice(0, curPath.length) === curPath) {
          break;
        }
      }
    } else {
      curPath = (base = atom.project.getPaths())[0] !== null ? base[0] : '/';
    }

    // get selection
    if (editor) {
      selection = editor.getSelectedText() || editor.getWordUnderCursor({
        wordRegex: /[\/A-Z\.\d-_:]+(:\d+)?/i
      });
    }

    // set options
    options = {
      cwd: curPath,
      env: process.env,
    };

    // run command
    cmd = 'plumb';

    runPlumb = spawn(cmd, [selection], options);

    runPlumb.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    runPlumb.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

  }

};
