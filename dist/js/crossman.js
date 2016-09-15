/*************************
 * getEl
 * do cross browsing
 *************************/
window.getNewEl = function(elNm, id, classNm, attrs, inner, eventNm, eventFunc){  
    var newEl = document.createElement(elNm);   // HTML객체 생성
    if (id) newEl.id = id;                              // 아이디  
    if (classNm) newEl.setAttribute('class', classNm);      // 클래스 
    for (var attrNm in attrs){ newEl.setAttribute(attrNm, attrs[attrNm]); } // 속성   
    if (inner) newEl.innerHTML = inner;         // 안 값  
    if (eventNm) getEl(newEl).addEventListener(eventNm, function(event){ eventFunc(event); });  // 이벤트
    return newEl;                               // 반환 
};



window.getEl = function(id){

    var querySelectorAll = function(selector){
        if (document.querySelectorAll){
            // return document.querySelectorAll(selector);
            return document.getElementById(selector);
        }else if (document.getElementsByTagName){
            /* Attribute */         
            var startIdx = selector.indexOf('[');
            var endIdx = selector.indexOf(']');
            var attr;
            var selectedList = [];
            if (startIdx != -1 && endIdx != -1){
                attr = selector.substring(startIdx +1, endIdx);
                /* 유효성검사에 맞는 Form 태그 들만 */
                var nodeNames = ['div', 'span', 'form', 'input', 'select', 'textarea'];
                for (var searchI=0; searchI< nodeNames.length; searchI++){
                    var elements = document.getElementsByTagName(nodeNames[searchI]);                   
                    for (var searchJ=0; searchJ<elements.length; searchJ++){                        
                        if (elements[searchJ].getAttribute(attr) != undefined){
                            selectedList.push(elements[searchJ]);
                        }
                    }
                }
            }
            return selectedList;        
        }
    };  
    
    
    var el = (typeof id == 'object') ? id : document.getElementById(id);    
    // var el = (typeof id == 'object') ? id : querySelectorAll(id);    
    this.obj = el;  

    this.attr = function(key, val){ 
        if (val){
            el.setAttribute(key, val); 
            return this;
        }else{
            return el.getAttribute(key);
        }       
    };
    this.clas = (function(){
        var classFuncs = {
            has: function(classNm){
                return (el.className.indexOf(classNm) != -1);                   
            },
            add: function(classNm){
                if (el.classList){
                    el.classList.add(classNm);
                }else{
                    el.className += ' ' +classNm+ ' ';
                }
                return classFuncs;
            },
            remove: function(classNm){
                if (el.classList){
                    el.classList.remove(classNm);
                }else{                  
                    var classList = el.className.split(' ');                    
                    while (classList.indexOf(classNm) != -1){
                        classList.splice(classList.indexOf(classNm), 1);                        
                    }
                    el.className = classList.join(' ');
                }
                return classFuncs;
            }
        };
        return classFuncs;
    }());
    this.findEl = function(attr, val){
        var subEls = el.children;
        for (var i=0; i<subEls.length; i++){
            if (subEls[i].getAttribute(attr) == val) return subEls[i];          
        }                   
    };
    this.findParentEl = function(attr, val){
        var foundEl;
        var parentEl = el;      
        while(parentEl){
            if (parentEl != document.body.parentNode){
                if (parentEl.getAttribute(attr) == val){
                    foundEl = parentEl;
                    break;              
                }
            }else{
                foundEl = null;
                break;
            }
            parentEl = parentEl.parentNode;
        }       
        return foundEl;
    };
    this.add = function(appender){
        if (typeof appender == 'object') 
            el.appendChild(appender);
        else 
            el.innerHTML += appender;
        return this;
    };
    this.addln = function(appender){        
        if (typeof appender == 'object')
            el.appendChild(appender);
        else
            el.innerHTML += (appender) ? appender : '';     
        el.appendChild(document.createElement('br'));
        return this;
    };
    this.hasEventListener = function(eventNm){
        return el.hasEventListener(eventNm);
    };
    this.removeEventListener = function(eventNm, fn){
        el.removeEventListener(eventNm, fn);
        return this;
    };
    this.addEventListener = function(eventNm, fn){      
        /* FireFox는 이 작업을 선행하게 하여 window.event객체를 전역으로 돌려야한다.*/
        if (navigator.userAgent.indexOf('Firefox') != -1){  
            el.addEventListener(eventNm, function(e){window.event=e;}, true);
        }       
        /* 일반 */
        if (el.addEventListener){           
            el.addEventListener(eventNm, function(event){
                fn(event);
                // fn(event, getEventTarget(event)); 
            });     
        /* 옛 IE */
        }else{                      
            el.attachEvent('on'+eventNm, function(event){               
                if (!event.target && event.srcElement) event.target = event.srcElement;
                fn(event);
                // fn(event, getEventTarget(event)); 
            });         
        }
        return;
    };  
    this.del = function(removeElObj){
        el.removeChild(removeElObj);
        return this;
    };
    this.html = function(innerHTML){
        el.innerHTML = innerHTML;
        return this;
    };  
    this.clear = function(){
        el.innerHTML = '';
        return this;
    };
    this.scrollDown = function(){
        el.scrollTop = el.scrollHeight;
        return this;
    };
    this.disableSelection = function(){
        if (typeof el.ondragstart != 'undefined') el.ondragstart = function(){return false;};
        if (typeof el.onselectstart != 'undefined') el.onselectstart = function(){return false;};
        if (typeof el.oncontextmenu != 'undefined') el.oncontextmenu = function(){return false;};
        /* 파이어폭스에서 드래그 선택 금지 */
        if (typeof el.style.MozUserSelect != 'undefined') document.body.style.MozUserSelect = 'none';
        return this;
    };
    this.hideDiv = function(){          
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '-5555px';
        el.style.top = '-5555px';
        return this;
    };
    this.showDiv = function(){      
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '0px';
        el.style.top = '0px';       
        return this;        
    };
    this.getNewSeqId = function(idStr){        
        for (var seq=1; seq < 50000; seq++){
            var searchEmptyId = idStr + seq
            if (!(searchEmptyId in el)) return searchEmptyId;
        }       
        return null;
    };
    this.getParentEl = function(attrNm){
        var searchSuperObj = el;
        while(searchSuperObj){
            if (searchSuperObj.getAttribute(attrNm) != undefined) break;
            searchSuperObj = searchSuperObj.parentNode;
        }
        return searchSuperObj;
    };

    return this;
};






// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function(){ 
                callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



/**************/
/* 파일  객체 */
/**************/
(function(){
    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
}());



/**************/
/* EVENT 객체 */
/**************/
(function(){
    /* FireFox는 이 작업을 선행하게 하여 window.event객체를 전역으로 돌려야한다.*/
    if (navigator.userAgent.indexOf('Firefox') != -1){  
        window.addEventListener(eventNm, function(e){window.event=e;}, true);
    }
    if (!window.addEventListener && window.attachEvent){
        window.addEventListener = function(eventNm, fn){
            window.attachEvent('on'+eventNm, function(event){ 
                if (!event.target && event.srcElement) event.target = event.srcElement;
                if (!event.preventDefault) event.preventDefault = function(){};
                if (!event.stopPropagation){
                    event.stopPropagation = function(){
                        event.returnValue = false; 
                        event.cancelBubble = true;
                    };
                }
                fn(event); 
            });         
        }   
    }
}());


/******************/
/* 필수 구현 객체 */
/******************/
(function(){
    if (!Array.prototype.indexOf){
        Array.prototype.indexOf = function(obj){
            for (var i=0; i<this.length; i++){
                if (this[i] == obj) return i;
            }
            return -1;
        }
    }
}());



(function(){
    if (!document.querySelectorAll){
        if(document.getElementsByTagName){
            document.querySelectorAll = function(){
                /* Attribute */         
                var startIdx = selector.indexOf('[');
                var endIdx = selector.indexOf(']');
                var attr;
                var selectedList = [];
                if (startIdx != -1 && endIdx != -1){
                    attr = selector.substring(startIdx +1, endIdx);
                    /* 유효성검사에 맞는 Form 태그 들만 */
                    var nodeNames = ['div', 'span', 'form', 'input', 'select', 'textarea'];
                    for (var searchI=0; searchI< nodeNames.length; searchI++){
                        var elements = document.getElementsByTagName(nodeNames[searchI]);                   
                        for (var searchJ=0; searchJ<elements.length; searchJ++){                        
                            if (elements[searchJ].getAttribute(attr) != undefined){
                                selectedList.push(elements[searchJ]);
                            }
                        }
                    }
                }
                return selectedList;        
            };
        }
    }    
}());

