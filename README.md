# atom plumber package

Send text to the [Plan 9](https://swtch.com/plan9port/) [plumber](https://swtch.com/plan9port/man/man4/plumber.html) from within Atom. Sends the currently selected text, hyperlink or word under the cursor to the plumber. Web, file and custom linking protocols are supported.

![atom-plumber](https://cloud.githubusercontent.com/assets/9103375/20638523/2a99ab96-b35e-11e6-9463-1fb8165d73ee.gif)

Requires [`plumber` to be installed](https://github.com/9fans/plan9port/) and available on your path. Also requires a valid [`plumbing` file](http://faq.surge.sh/plan9-plumber-plumbing-file/) so `plumber` can interpret the messages you're sending to it from Atom.

## Usage

Running `plumber:plumb` will send the current selection to `plumber`. If nothing is selected, the current word under the cursor will be sent.

## Commands

You can activate the command in several ways:

* `alt-enter`
* `alt-click` on some text (sometimes `alt-click` will clear an existing selection. If so, use `ctrl-alt-click`)
* Hold `alt` then make a new selection
* Right-click and select "Plumb this" from the menu
* Run "Atom Plumber: Plumb" from the Command Palette

You can make your own keymap in your `keymap.cson`. Change `alt-enter` to something else:

```
'atom-workspace atom-text-editor:not([mini])':
  'alt-enter': 'plumber:plumb'
```

## Contribution

[Open an issue](https://github.com/xHN35RQ/atom-plumber/issues) if you have any problems, find any bugs or have any suggestions for improvement in the code or plugin architecture. Thanks.
