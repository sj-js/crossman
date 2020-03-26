# CrossMan
## 🤹‍♂️
[![Build Status](https://travis-ci.org/sj-js/crossman.svg?branch=master)](https://travis-ci.org/sj-js/crossman)
[![Coverage Status](https://coveralls.io/repos/github/sj-js/crossman/badge.svg)](https://coveralls.io/github/sj-js/crossman)
[![All Download](https://img.shields.io/github/downloads/sj-js/crossman/total.svg)](https://github.com/sj-js/crossman/releases)
[![Release](https://img.shields.io/github/release/sj-js/crossman.svg)](https://github.com/sj-js/crossman/releases)
[![License](https://img.shields.io/github/license/sj-js/crossman.svg)](https://github.com/sj-js/crossman/releases)

- sj-js의 기반이 되는 `Util & Framework`로서 제작되고 있습니다. 
- `CrossBrowsing`과 `쉬운 인터페이스` 구현을 목표로 합니다.
- ✨ Source: https://github.com/sj-js/crossman
- ✨ Document: https://sj-js.github.io/sj-js/crossman

## Functions to start    
1. `getEl(ID & ELEMENT)`: ID와 Element를 매개로 해당 Element를 편집합니다. 
2. `searchEl(SELECTOR)`: querySelector를 사용하여 해당 Element를 편집합니다.
3. `newEl(TAGNAME)`: 새로운 Element 생성을 시작으로 해당 Element를 편집합니다.
4. `cloneEl(ID & ELEMENT)`: 기존 Element를 'clone'을 시작으로 해당 Element를 편집합니다.
5. `getData(OBJECT)`: 다양한 자료형(Number, Object, Array..) 데이터로 편집합니다.
6. `getXHR(OBJECT)`: HTTP프로토콜로 Request를 보냅니다.
    - postXHR, putXHR, deleteXHR  
7. `ready(FUNCTION)`: Document 문서를 불러온 후 작동합니다. 기존 JQuery의 ready와 유사합니다.  
8. `SjEvent`: 자체 Event를 관리할 수 있는 솔루션을 제공합니다. 각종 
    - addEventListener, removeEventListener, hasEventListener, execEventListener ...



## Getting Started
0. Load
    - Browser
        ```html
        <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
        ```  
    - ES6+
        ```bash
        npm i @sj-js/crossman
        ```
        ```js
        const { ready, getEl, newEl, cloneEl, searchEl, getData, SjEvent } = require('@sj-js/crossman');
        ```

1. Simple Example
    - getEl()
        ```html
        <body>
            Hello CrossMan!<br/>
            <span id="test-span-1" class="test-cls">Hey?</span>
            <span id="test-span-2" class="test-cls">Anybody</span>
            <span id="test-span-3" class="test-cls">There??</span>
        </body>
        <script>
            var testSpan = getEl('test-span-1').add('Hello??').style('color:white; background:black;').returnElement();
            testSpan.style.fontSize = '35px';
        </script>   
        ```
    
    - searchEl()
        ```html
        <body>
            Hello CrossMan!<br/>
            <span id="test-span-1" class="test-cls">Hey</span>
            <span id="test-span-2" class="test-cls">Hey</span>
            <span id="test-span-3" class="dev-cls">Hey</span>
            <span id="test-span-4" class="test-cls">Hey</span>
        </body>
        <script>
            searchEl('.test-cls').add('Hello??').style('color:white; background:black; font-size:35px;');
        </script>   
        ```
         
    - newEl()
        ```html
        <style>
            div { border:1px solid black; margin:2px; }
            button { border-radius:30px; height:20px; cursor:pointer; }
        </style>
        <body>
            Hello CrossMan!<br/>
        </body>
        <script>
            newEl('div').addClass(['test-container', 'outer']).style('width:100%;').add([
                newEl('div').attr('id', 'top').html('[TOP SOMETHING]'),
                newEl('div').addClass('test-title').html('Hello? How about CrossMan?<br/>'),
                newEl('div').addClass('test-content').style('border:3px dashed gray; color:white; background:black;').addln([
                    'Love all and all and all.. OK?',
                    newEl('span').html('Why are you seeing it? for what?').add([
                        newEl('button').html('SQUARE').addEventListener('click', function(){ 
                            getEl('top').add( 
                                newEl('span').style('display:inline-block; width:30px; height:30px;').setStyle('background', '#' +getData().randomColor()) 
                            ) 
                        }),
                        newEl('button').html('CIRCLE').addEventListener('click', function(){
                            getEl('top').add( 
                                newEl('span').style('display:inline-block; width:30px; height:30px; border-radius:30px;').setStyle('background', '#' +getData().randomColor()) 
                            )        
                        }),
                    ])
                ])   
            ]).appendTo(document.body);
        </script>   
        ```
      
    - cloneEl()
        ```html
        <body>
            Hello CrossMan!<br/>
            <button id="test-button">CLONE</button>
            <span id="test-span" style="color:white; background:#BBBBBB; margin:1px; cursor:pointer;">Hi Hi Hi</span>
        </body>
        <script>
            var latestId = 0;
            getEl('test-button').addEventListener('click', function(e){
                var elementId = 'test-' + (++latestId);
                var testSpan = cloneEl('test-span', true)
                                  .attr('id', elementId)
                                  .add(elementId)
                                  .addEventListener('mouseover', function(){ getEl(testSpan).setStyle('background', '#555555'); })
                                  .addEventListener('mouseout', function(){ getEl(testSpan).setStyle('background', '#BBBBBB'); })
                                  .addEventListener('click', function(){ alert(elementId); })
                                  .appendToNextOf('test-span')
                                  .returnElement();
            });
        </script>   
        ```