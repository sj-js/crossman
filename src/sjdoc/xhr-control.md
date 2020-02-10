# XHR Control

HTTP 프로토콜로 Request 보내고 Response를 받습니다.

#### ※ 표
종류 | 특징 
-----|------
getXHR | GET Method로 호출
postXHR | POST Method로 호출
putXHR | PUT Method로 호출
deleteXHR | DELETE Method로 호출


#### ※ 표
종류 | Parameter |특징 
-----|-----------|-----
setURL | String | URL을 설정
setBody | Object | Body Object를 설정
setHeader | Object | Header Object를 설정
setAsync | true OR false | 비동기 여부 설정
request | callbackWhenSuccess, callbackWhenError, callbackWhenFinally | 설정을 기반으로 호출합니다.


## getXHR
- 👨‍💻
    *@* *!* *@*
    ```html
    <body>
        <span id="test-span"></span>
    </body>
    <script>
        getXHR('./').setAsync(true).request(
            function(e){ //success 
                getEl('test-span').add('[SUCCESS]').add(e.length);    
            },
            function(e){ //error
                getEl('test-span').add('[ERROR]');    
            },
            function(e){ //finally
                getEl('test-span').add('[FINALLY]');                  
            },
        );
        getEl('test-span').add('$$');
    </script>   
    ```

## postXHR
- 👨‍💻
    *@* *!* *@*
    ```html
    <body>
        <span id="test-span"></span>
    </body>
    <script>
        postXHR('./').request(
            function(e){ //success 
                getEl('test-span').add('[SUCCESS]').add(e);    
            },
            function(e){ //error
                getEl('test-span').add('[ERROR]');    
            },
            function(e){ //finally
                getEl('test-span').add('[FINALLY]');                  
            },
        );
    </script>   
    ```