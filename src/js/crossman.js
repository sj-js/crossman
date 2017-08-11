/***************************************************************************
 *
 * newElement
 *
 ***************************************************************************/
// window.newEl = function(elNm, id, classNm, attrs, inner, eventNm, eventFunc){
window.newEl = function(elNm, attributes, inner, eventNm, eventFunc){
    var newElement = document.createElement(elNm);   // HTML객체 생성
    // // 아이디
    // if (id)
    //     newElement.id = id;
    // // 클래스
    // if (classNm)
    //     newElement.setAttribute('class', classNm);
    // 속성
    for (var attrNm in attributes){
        newElement.setAttribute(attrNm, attributes[attrNm]);
    }
    // 내용
    if (inner)
        newElement.innerHTML = inner;
    // 이벤트
    if (eventNm){
        getEl(newElement).addEventListener(eventNm, function(event){
            eventFunc(event);
        });
    }
    return newElement;
};




/***************************************************************************
 *
 * getElement
 *  - do cross browsing
 *
 ***************************************************************************/
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

    var el
    if (id != null)
        el = (typeof id == 'object') ? id : document.getElementById(id);
    else
        el = document;

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
        /* FireFox */
        if (navigator.userAgent.indexOf('Firefox') != -1){  
            el.addEventListener(eventNm, function(e){window.event=e;}, true);
        }       
        /* general */
        if (el.addEventListener){           
            el.addEventListener(eventNm, function(event){
                fn(event);
                // fn(event, getEventTarget(event)); 
            });     
        /* IE8 */
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





    
    this.isAccepted = function(acceptObj, rejectObj){    
        var isOk = false;    
        if (acceptObj){
            if (this.find(acceptObj)){
                isOk = true;
            }
        }else{
            isOk = true;
        }
        if (rejectObj){
            if (this.find(rejectObj)){
                isOk = false;
            }
        }
        return isOk;
    };
    this.find = function(param){    
        if (el instanceof Array){
            var results = [];
            for (var i=0; i<el.length; i++){            
                var matchedObj = this.getMatchedObjWithParam(el[i], param);
                if (matchedObj) 
                    results.push(matchedObj);
            }        
            return results;
        }
        if (el instanceof Object){ 
            var matchedObj = this.getMatchedObjWithParam(el, param);
            return matchedObj;
        }        
    };

    // Param==Array => Or조건
    // Param==Object => 해당조건
    this.getMatchedObjWithParam = function(obj, param){
        if (typeof param == 'string'){        
            param = {id:param};
        }
        if (param instanceof Array){        
            for (var i=0; i<param.length; i++){            
                if (this.find(param[i]))
                    return obj;
            }
            return; //No Matching
        }
        if (param instanceof Object){        
            var keys = Object.keys(param);        
            for (var i=0; i<keys.length; i++){
                var key = keys[i];
                var attributeValue = obj[key];
                var conditionValue = param[key];
                if ( attributeValue && (attributeValue == conditionValue || this.checkMatchingWithExpression(attributeValue, conditionValue)) ){
                }else{
                    return; //No Matching
                }
            }
            return obj;
        }    
    };
    this.checkMatchingWithExpression = function(value, condition){
        var result;
        if (value && condition){
            var tempCondition;
            var exclamationFlag;
            exclamationFlag = (condition.indexOf('!') == 0);
            tempCondition = condition.substr( (exclamationFlag)?1:0 );
            tempCondition = tempCondition.replace('.', '[.]');
            var splitCondition = tempCondition.split("*");
            var regExpCondition = splitCondition.join('.*');
            regExpCondition = "^" + regExpCondition + "$"
            result = new RegExp(regExpCondition).test(value);
            result = (exclamationFlag) ? !result : result;
        }
        return result;
    }



    // Find HTMLDOMElement 
    this.findDomAttribute = function(param){
        if (el instanceof Array){
            var results = [];
            for (var i=0; i<el.length; i++){            
                var matchedObj = this.getMatchedDomAttributeWithParam(el[i], param);
                if (matchedObj) 
                    results.push(matchedObj);
            }        
            return results;
        }
        if (el instanceof Object){ 
            var matchedObj = this.getMatchedDomAttributeWithParam(el, param);
            return matchedObj;
        }        
    };    

    // Param==Array => Or조건
    // Param==Object => 해당조건
    this.getMatchedDomAttributeWithParam = function(obj, param){
        if (typeof param == 'string'){        
            param = {id:param};
        }
        if (param instanceof Array){        
            for (var i=0; i<param.length; i++){            
                if (this.findDomAttribute(param[i])) return obj;
            }
            return;
        }
        if (param instanceof Object){        
            var keys = Object.keys(param);
//            var domAttrPrefix = "data-";
            for (var i=0; i<keys.length; i++){
                var key = keys[i];
                var attributeValue = obj.getAttribute(key);
                var conditionValue = param[key];
//                if ( !(obj.getAttribute(domAttrPrefix + key) && obj.getAttribute(domAttrPrefix + key) == param[key]) ){
                if ( attributeValue && attributeValue == conditionValue || this.checkMatchingWithExpression(attributeValue, conditionValue)){
                }else{
                    return; //No Matching
                }
            }              
            return obj;
        }    
    };





    this.getParentEl = function(attrNm){
        var searchSuperObj = el;
        while(searchSuperObj){
            if (searchSuperObj.getAttribute(attrNm) != undefined) break;
            searchSuperObj = searchSuperObj.parentNode;
        }
        return searchSuperObj;
    };
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



    /*****
     * 문서의 스크롤된 수치 반환
     * IE8 : document.documentElement.scrollLeft 
     * IE9 : window.pageXOffset 
     * IE11 & others : document.body.scrollLeft 
     *****/
    this.getBodyScrollX = function(event){    
        var bodyPageX = 0;
        if (document.documentElement && document.documentElement.scrollLeft) bodyPageX = document.documentElement.scrollLeft;
        if (window.pageXOffset) bodyPageY = window.pageXOffset;
        if (document.body && document.body.scrollLeft) bodyPageX = document.body.scrollLeft;
        return bodyPageX;
    };
    this.getBodyScrollY = function(event){    
        var bodyPageY = 0;
        if (document.documentElement && document.documentElement.scrollTop) bodyPageY = document.documentElement.scrollTop;
        if (window.pageYOffset) bodyPageY = window.pageYOffset;
        if (document.body && document.body.scrollTop) bodyPageY = document.body.scrollTop;
        return bodyPageY;
    };
    /*****
     * 문서의 크기
     * IE구버전 : document.documentElement.offsetWidth 
     * IE11 & others : document.body.offsetWidth 
     *****/
    this.getBodyOffsetX = function(event){    
        var bodyOffsetX = 0;
        if (document.documentElement && document.documentElement.offsetWidth) return document.documentElement.offsetWidth;
        if (document.body && document.body.offsetWidth) return document.body.offsetWidth;
        return bodyOffsetX;
    };
    this.getBodyOffsetY = function(event){
        var bodyOffsetY = 0;
        if (document.documentElement && document.documentElement.offsetHeight) return document.documentElement.offsetHeight;
        if (document.body && document.body.offsetHeight) return document.body.offsetHeight;
        return bodyOffsetY;
    };
    /* 눈에 보이는 좌표 값 (객체마다  DOM TREE구조와 position의 영향을 받기 때문에, 다른 계산이 필요하여 만든 함수)
     * 재료는 DOM객체 */
    this.getBoundingClientRect = function(){
        if (el.getBoundingClientRect)
            return el.getBoundingClientRect();
        var sumOffsetLeft = 0;
        var sumOffsetTop = 0;
        var thisObj = el;
        var parentObj = el.parentNode;
        while(parentObj){
            var scrollX = 0;
            var scrollY = 0;
            if (thisObj != document.body){
                scrollX = thisObj.scrollLeft;
                scrollY = thisObj.scrollTop;
            }
            if (parentObj.style){
                if (parentObj.style.position == 'absolute') {
                    sumOffsetLeft += thisObj.offsetLeft - scrollX;
                    sumOffsetTop += thisObj.offsetTop - scrollY;
                }else if(parentObj.style.position == 'fixed' || thisObj.style.position == 'fixed'){
                    sumOffsetLeft += thisObj.offsetLeft + this.getBodyScrollX();
                    sumOffsetTop += thisObj.offsetTop + this.getBodyScrollY();
                    break;
                }else{
                    sumOffsetLeft += (thisObj.offsetLeft - parentObj.offsetLeft) - scrollX;
                    sumOffsetTop += (thisObj.offsetTop - parentObj.offsetTop) - scrollY;
                }
            }else{
                break;
            }
            thisObj = parentObj;
            parentObj = parentObj.parentNode;
        }
        var objBodyOffset = {left:sumOffsetLeft, top:sumOffsetTop, width:el.offsetWidth, height:el.offsetHeight};
        return objBodyOffset;
    };

    this.ready = function(afterLoadFunc){
        if (document.readyState == 'complete' || document.readyState == 'interactive'){
            afterLoadFunc();
        }else{
            window.addEventListener('load', afterLoadFunc);
        }
    };

    this.resize = function(funcToAdd){
        var oldFunc = window.onresize;
        window.onresize = function(){
            if (oldFunc)
                oldFunc();
            funcToAdd();
        };
    };

    return this;
};




/***************************************************************************
 *
 * getData
 *
 ***************************************************************************/
window.getData = function(obj){
  
    var obj = obj;

    this.parse = function(){
        if (obj){
            var startStr = obj.substr(0, 1);
            var endStr = obj.substr(obj.length-1, 1);
            if (typeof obj == 'string'){
                if (startStr == '{' && endStr == '}'){
                    return JSON.parse(obj);

                }else if (startStr == '[' && endStr == ']'){
                    return JSON.parse(obj);

                }else if (obj.indexOf(',') != -1){
                    var list = obj.split(',');
                    for (var i=0; i<list.length; i++){
                        list[i] = list[i].trim();
                    }
                    return list;
                }else if (obj == 'true'){
                    return true
                }else if (obj == 'false'){
                    return false
                }
            }
            return obj;
        }        
    };

    this.findHighestZIndex = function(tagName){
        var highestIndex = 0;
        //Makes parameter array
        if (!tagName){
            tagName = ['div'];
        }else if (typeof tagName == 'string'){
            tagName = [tagName];
        }
        //Search
        if (tagName instanceof Array){        
            for (var i=0; i<tagName.length; i++){
                var elementList = document.getElementsByTagName(tagName[0]);            
                for (var i=0; i<elementList.length; i++){
                    var zIndex = document.defaultView.getComputedStyle(elementList[i], null).getPropertyValue("z-index");
                    if (zIndex > highestIndex && zIndex != 'auto'){
                        highestIndex = zIndex;
                    }
                }    
            }    
        }else{
            console.log('Could not get highest z-index. because, not good parameter', tagName);
        }
        return parseInt(highestIndex);
    };

    this.getContextPath = function(){
        var offset=location.href.indexOf(location.host)+location.host.length;
        var ctxPath=location.href.substring(offset,location.href.indexOf('/',offset+1));
        return ctxPath;
    };

    return this;
};





/////////////////////////
// requestAnimationFrame
/////////////////////////
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



/////////////////////////
// File
/////////////////////////
(function(){
    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
}());



/////////////////////////
// window.addEventListener
/////////////////////////
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

/////////////////////////
// Array.indexOf
/////////////////////////
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


/////////////////////////
// querySelectorAll
/////////////////////////
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

/////////////////////////
// getComputedStyle
/////////////////////////
/* for IE */
(function(){
    if (!window.getComputedStyle) {
        window.getComputedStyle = function(element){
            return element.currentStyle;
        }
    }
})();

/////////////////////////
// JSON.stringify, JSON.parse
/////////////////////////
(function(){
    if (!JSON){
        // implement JSON.stringify serialization
        JSON.stringify = JSON.stringify || function (obj) {

            var t = typeof (obj);
            if (t != "object" || obj === null) {

                // simple data type
                if (t == "string") obj = '"'+obj+'"';
                return String(obj);

            }
            else {

                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);

                for (n in obj) {
                    v = obj[n]; t = typeof(v);

                    if (t == "string") v = '"'+v+'"';
                    else if (t == "object" && v !== null) v = JSON.stringify(v);

                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };

        // implement JSON.parse de-serialization
        JSON.parse = JSON.parse || function (str) {
            if (str === "") str = '""';
            eval("var p=" + str + ";");
            return p;
        };
    }
}());