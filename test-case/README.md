# Insatallation

[![NPM](https://nodei.co/npm/mocha.png?downloads=true&stars=true)](https://www.npmjs.com/package/mocha)  
[![NPM](https://nodei.co/npm/should.png?downloads=true&stars=true)](https://www.npmjs.com/package/should)  
[![NPM](https://nodei.co/npm/istanbul.png?downloads=true&stars=true)](https://www.npmjs.com/package/istanbul)  

`$ npm i should --save`  
`$ npm install mocha -g`  
`$ npm install istanbul -g`

`$ make`
我的電腦→右鍵→內容→系統→進階  
環境變數→系統變數→path→編輯  
加入;C:\Program Files (x86)\GnuWin32\bin;  
建議設定後重新開機，以便讓環境變數生效  


# Usage

`$ mocha`    
`$ istanbul cover %APPDATA%/npm/node_modules/mocha/bin/_mocha`  
`$ make test`  
`$ make cover`  

# Knowledge nodes

試驅動開發：先把要達到的目的都描述清楚，然後讓現有的程序跑不過的情況下，再修補程序，讓的情況下通過。

測試框架 mocha  
斷言庫 should  
測試率覆蓋工具 istanbul  
自動化編譯 Makefile  

# References

* [node測試用例](https://github.com/alsotang/node-lessons/tree/master/lesson6)
* [fibonacci](http://en.wikipedia.org/wiki/Fibonacci_number)
* [Code coverage for Mocha in Windows 7](http://stackoverflow.com/questions/27084392/code-coverage-for-mocha-in-windows-7)
* [在Windows下建立GNU編譯環境 make](http://itspg.github.io/blog/2012/04/06/windows-gnu-tutorial/)
