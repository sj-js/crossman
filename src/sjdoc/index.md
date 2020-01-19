# CrossMan
## 🤹‍♂️
[![Build Status](https://travis-ci.org/sj-js/crossman.svg?branch=master)](https://travis-ci.org/sj-js/crossman)
[![All Download](https://img.shields.io/github/downloads/sj-js/crossman/total.svg)](https://github.com/sj-js/crossman/releases)
[![Release](https://img.shields.io/github/release/sj-js/crossman.svg)](https://github.com/sj-js/crossman/releases)
[![License](https://img.shields.io/github/license/sj-js/crossman.svg)](https://github.com/sj-js/crossman/releases)

- sj-js의 기반이 되는 Util입니다. 
- Source: https://github.com/sj-js/crossman
- Document: https://sj-js.github.io/sj-js/crossman
    
      
        
## Index
*@* **order** *@*
```
- CrossMan
```


## 1. Getting Started

### 1-1. How to use?

1. 라이브러리 불러오기
    - Browser
        ```html
        <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
        ```  
    - ES6+
        ```bash
        npm i @sj-js/crossman
        ```
        ```js
        const { ready, getEl, newEl, cloneEl, searchEl, getData, SjEvent } = require('@sj-js/crossman');
        ```




### 1-2. Simple Example
- For convenience, the following code, which loads and creates a Library in the example, is omitted.
    ```html
    <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
    ```
  
    *@* *+prefix* *x* *@* 
    ```html
    <script src="../crossman/crossman.js"></script>
    ```


##### Example with script  (Document does not complete...)
          
1. Box 생성
    ```js
    getEl();
    ```

2. Obj 생성
    ```js
    newEl();
    ```

3. Test
    *@* *!* *@*
    ```html
    <body>
        Test
    </body>
    <script>
        getEl(document.body).add([
             newEl('div').html('Hello A').style('background:pink; border:1px solid skyblue;'),
             newEl('div').html('Hello B').addClass('test-1'),
             newEl('div').html('Hello C').add([
                 newEl('span').html('Hello C-1'),
                 newEl('span').html('Hello C-2')
             ])
        ]);
    </script>
    ```

