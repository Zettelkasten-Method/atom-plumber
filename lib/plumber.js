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

    // set selection to pass to process
    if (curPane) {
      selection = curPane.getSelectedText().trim() ||
      curPane.getWordUnderCursor({
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
