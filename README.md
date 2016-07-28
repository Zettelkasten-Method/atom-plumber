# atom-plumber package

Send selected text or word under cursor to the [plan9](https://swtch.com/plan9port/) [plumber](https://swtch.com/plan9port/man/man4/plumber.html). Requires [`plumber` to be installed](https://github.com/9fans/plan9port/) and available on your path. Also requires a valid [`plumbing` file](https://github.com/search?utf8=%E2%9C%93&q=9p+write+plumb%2Frules+filename%3Aplumbing) so that `plumber` knows how to interpret the messages you're sending to it from Atom.

## Usage

Running `atom-plumber:plumb` will send the current selection to `plumber`. If nothing is selected, the current word under the cursor will be sent. "Word" is defined by this regex `/[\/A-Z\.\d-_:]+(:\d+)?/i` which means web, file and [custom protocols](https://gist.github.com/xHN35RQ/b79da3dccc53f9bdd953ba78403dd001#file-plumbing-L29) are supported.

## Commands

The default keymap is `alt-enter`. You can remap this in your `keymap.cson`:

```
'atom-workspace':
  'alt-enter': 'atom-plumber:plumb'
```

You can also right-click and select "Plumb this" to run atom-plumber.

Or you can `alt-click/cmd-click/win-click` on a selection or word. I may change this to `ctrl-click`. Let me know if you have any problems with the click functionality.

## Contribution

[Open an issue](https://github.com/xHN35RQ/atom-plumber/issues) if you have any problems, find any bugs or have any suggestions for improvement in the code or plugin architecture. Thanks.
