
`$ node bin\test --help`

```js
Usage: test [options]

  Options:

    -v, --version   output the version number
    -i, --init      init something
    -g, --generate  generate something
    -r, --remove    remove something
    -h, --help      output usage information
  Examples:

    this is an example
```

`$ node bin/test -i`
init something

`$ node bin/test -d`

```js
{ version: '0.1.0',
  init: undefined,
  generate: undefined,
  remove: undefined,
  debug: true }
```

## References

[Commander.js](https://www.npmjs.com/package/commander)
[Commander.js 中文文檔(cli必備)](https://juejin.im/post/5cefb981e51d454f73356ce9)
[用commander.js構建自己的腳手架工具](https://zhuanlan.zhihu.com/p/38520504)
