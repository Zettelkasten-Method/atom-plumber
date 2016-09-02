# atom-plumber package

Send text to the [Plan 9](https://swtch.com/plan9port/) [plumber](https://swtch.com/plan9port/man/man4/plumber.html) from within Atom. Sends the currently selected text, hyperlink or word under the cursor to the plumber.

Requires [`plumber` to be installed](https://github.com/9fans/plan9port/) and available on your path. Also requires a valid [`plumbing` file](http://faq.surge.sh/plan9-plumber-plumbing-file/) so `plumber` can interpret the messages you're sending to it from Atom.

## Usage

Running `atom-plumber:plumb` will send the current selection to `plumber`. If nothing is selected, the current word under the cursor will be sent. "Word" is defined by this regex `/[?#＃@＠🔗\.\-\:\/\w\d]+(:\d+)?/i` which means web, file and custom linking protocols are supported.

## Commands

Available commands are:

* `alt-enter`
* `alt-click`
* right-click and select "Plumb this" from the menu
* run "Atom Plumber: Plumb" from the Command Palette

You can make your own keymap in your `keymap.cson`. Change `alt-enter` to something else:

```
'atom-workspace':
  'alt-enter': 'atom-plumber:plumb'
```

Sometimes alt-clicking on a selection will clear the selection. If so use `ctrl-alt-click` on selections. Let me know if you have any problems with the click functionality.

## Contribution

[Open an issue](https://github.com/xHN35RQ/atom-plumber/issues) if you have any problems, find any bugs or have any suggestions for improvement in the code or plugin architecture. Thanks.
