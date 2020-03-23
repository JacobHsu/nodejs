nodejs
======

Node.js

## Installation

    $ npm install express

[![NPM](https://nodei.co/npm/express.png?downloads=true&stars=true)](https://nodei.co/npm/express/)

    $ npm install kue

[![NPM](https://nodei.co/npm/kue.png?downloads=true&stars=true)](https://nodei.co/npm/kue/)

    $ npm install uuid

[![NPM](https://nodei.co/npm/uuid.png?downloads=true&stars=true)](https://nodei.co/npm/uuid/)

## Note

[深入解析 Node.js 的 console.log](https://juejin.im/post/5cf0e3bc518825105c4f7ad7?utm_source=gold_browser_extension)

`console.log` 是输出到 `stdout` 而 `console .error` 用的是 `stderr`  
node index.js > hello.log 2> error.log    
`>` 允许我们将命令的输出重定向到文件中  
`2>` 允许我们将 stderr 的输出重定向到文件中  

## docs

[docsify.js](https://docsify.js.org/#/zh-cn/quickstart)  
`$ docsify init ./docs`  
`$ docsify serve docs`

index.html

```html
  <script>
    window.$docsify = {
      name: '',
      repo: '',
      loadNavbar: true,
      loadSidebar: true,
      subMaxLevel: 2,
      search: 'auto', // 默认值
      search : [
        '/',            // => /README.md
        '/guide',       // => /guide.md
        '/get-started', // => /get-started.md
        '/zh-cn/',      // => /zh-cn/README.md
      ],
      // 完整配置参数
      search: {
        maxAge: 86400000, // 过期时间，单位毫秒，默认一天
        paths: [], // or 'auto'
        placeholder: 'Type to search',

        // 支持本地化
        placeholder: {
          '/zh-cn/': '搜索',
          '/': 'Type to search'
        },

        noData: 'No Results!',

        // 支持本地化
        noData: {
          '/zh-cn/': '找不到结果',
          '/': 'No Results'
        },

        // 搜索标题的最大程级, 1 - 6
        depth: 2
      }
    }
  </script>
```
