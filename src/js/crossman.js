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


    /*************************
     * selector
     *************************/
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

    var el;
    if (id != null)
        el = (typeof id == 'object') ? id : document.getElementById(id);
    else
        el = document;

    // var el = (typeof id == 'object') ? id : querySelectorAll(id);    
    this.obj = el;



    /*************************
     * element
     *************************/
    this.returnElement = function(){
        return el;
    }



    /*************************
     * attribute
     *************************/
    this.attr = function(key, val){
        if (val){
            el.setAttribute(key, val);
            return this;
        }else{
            return el.getAttribute(key);
        }
    };
    this.html = function(innerHTML){
        el.innerHTML = innerHTML;
        return this;
    };
    this.value = function(value){
        if (value != null){
            el.value = value;
            return this;
        }
        return el.value;
    };
    this.clear = function(){
        el.innerHTML = '';
        return this;
    };


    /*************************
     * class
     *************************/
    this.clas = (function(){
        var classFuncs = {
            has: function(classNm){
                return (el.className && el.className.indexOf(classNm) != -1);
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
                }else if (el.className != undefined){
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
    this.clazz = this.clas;

    this.addClass = function(clazz){
        if (clazz instanceof Array){
            for (var i=0; i<clazz.length; i++){
                var c = clazz[i];
                this.clazz.add(c);
            }
        }else{
            this.clazz.add(clazz);
        }
        return this;
    };
    this.hasClass = function(clazz){
        var result = true;
        if (clazz instanceof Array){
            for (var i=0; i<clazz.length; i++){
                var c = clazz[i];
                if (!this.clazz.has(c)){
                    result = false;
                    break;
                }
            }
        }else{
            result = this.clazz.has(clazz);
        }
        return result;
    };
    this.removeClass = function(clazz){
        if (clazz instanceof Array){
            for (var i=0; i<clazz.length; i++){
                var c = clazz[i];
                this.clazz.remove(c);
            }
        }else{
            this.clazz.remove(clazz);
        }
        return this;
    };



    /*************************
     * append
     *************************/
    this.add = function(appender){
        if (typeof appender == 'object')
            el.appendChild(appender);
        else
            el.innerHTML += appender;
        return this;
    };
    this.addln = function(appender){
        if (appender){
            if (typeof appender == 'object')
                el.appendChild(appender);
            else
                el.innerHTML += (appender) ? appender : '';
        }
        el.appendChild(document.createElement('br'));
        return this;
    };
    this.addToFirst = function(appender){
        el.insertBefore(appender, el.firstChild);
        return this;
    };
    this.appendTo = function(parent){
        if (typeof parent == 'string')
            parent = document.getElementById(parent);
        parent.appendChild(el);
        return this;
    };
    this.addFrontOf = function(node, sibling){
        el.insertBefore(node, sibling);
        return this;
    };
    this.del = function(removeElObj){
        el.removeChild(removeElObj);
        return this;
    };
    this.removeFromParent = function(){
        if (el && el.parentNode)
            el.parentNode.removeChild(el);
        return this;
    };


    /*************************
     * event
     *************************/
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
            try{
                el.attachEvent('on'+eventNm, function(event){
                    if (!event.target && event.srcElement) event.target = event.srcElement;
                    fn(event);
                    // fn(event, getEventTarget(event));
                });
            }catch(e){
                console.error(e);
            }

        }
        return this;
    };
    this.trigger = function(eventNm){
        if ("createEvent" in document) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent(eventNm, false, true);
            el.dispatchEvent(event);
        }else{
            el.fireEvent("on" +eventNm);
        }
    };

    //TODO: 조금 이상한 현상이 일어남.
    this.ready = function(afterLoadFunc){
        if (window.parentWindow){
            /** Maybe when window.open **/
            afterLoadFunc();
        }else{
            /** Maybe when usually **/
            if (document.readyState == 'complete' || document.readyState == 'interactive'){
                afterLoadFunc();
            }else{
                // Mozilla, Opera, Webkit
                if (document.addEventListener){
                    document.addEventListener("DOMContentLoaded", function(){
                        document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                        afterLoadFunc();
                    }, false);
                    // Internet Explorer
                }else if (document.attachEvent){
                    document.attachEvent("onreadystatechange", function(){
                        if (document.readyState === "complete"){
                            document.detachEvent("onreadystatechange", arguments.callee);
                            afterLoadFunc();
                        }
                    });
                }
            }
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





    /*************************
     * each
     *************************/
    this.forChildren = function(functionForLoop){
        var children = el.children;
        for (var iii=0; iii<children.length; iii++){
            var child = children[iii];
            functionForLoop(child);
        }
    };




    /*************************
     * etc
     *************************/
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
    };

    this.findAll = function(finder){
        var resultList = [];
        if (el instanceof Array){
            for (var i=0; i<el.length; i++){
                var data = el[i];
                var found = getEl(data).find(finder);
                if (found != null)
                    resultList.push(found);
            }
        }else if (el instanceof Object){
            for (var dataCode in this.dataPool){
                var data = el[dataCode];
                var found = getEl(data).find(finder);
                if (found != null)
                    resultList.push(found);
            }
        }
        return resultList
    };


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
        if (document.documentElement && document.documentElement.scrollLeft)
            bodyPageX = document.documentElement.scrollLeft;
        if (window.pageXOffset)
            bodyPageX = window.pageXOffset;
        if (document.body && document.body.scrollLeft)
            bodyPageX = document.body.scrollLeft;
        return bodyPageX;
    };
    this.getBodyScrollY = function(event){
        var bodyPageY = 0;
        if (document.documentElement && document.documentElement.scrollTop)
            bodyPageY = document.documentElement.scrollTop;
        if (window.pageYOffset)
            bodyPageY = window.pageYOffset;
        if (document.body && document.body.scrollTop)
            bodyPageY = document.body.scrollTop;
        return bodyPageY;
    };
    /*****
     * 문서의 크기
     * IE구버전 : document.documentElement.offsetWidth
     * IE11 & others : document.body.offsetWidth
     *****/
    this.getBodyOffsetX = function(event){
        var bodyOffsetX = 0;
        if (document.documentElement && document.documentElement.offsetWidth)
            return document.documentElement.offsetWidth;
        if (document.body && document.body.offsetWidth)
            return document.body.offsetWidth;
        return bodyOffsetX;
    };
    this.getBodyOffsetY = function(event){
        var bodyOffsetY = 0;
        if (document.documentElement && document.documentElement.offsetHeight)
            return document.documentElement.offsetHeight;
        if (document.body && document.body.offsetHeight)
            return document.body.offsetHeight;
        return bodyOffsetY;
    };
    /* 눈에 보이는 좌표 값 (객체마다  DOM TREE구조와 position의 영향을 받기 때문에, 다른 계산이 필요하여 만든 함수)
     * 재료는 DOM객체 */
    this.getBoundingClientRect = function(){
        if (el.getBoundingClientRect)
            return el.getBoundingClientRect();  //TODO: BODY의 화면상 Scroll된 영역으로부터 상대적인 수치를 주는 것 같다.
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


    this.getBoundingOffsetRect = function(){
        //SJTEST
        var pScrollLeft = 0;
        var pScrollTop = 0;
        if (el.parentNode){
            pScrollLeft = el.parentNode.scrollLeft;
            pScrollTop = el.parentNode.scrollTop;
        }

        var domRect = this.getBoundingClientRect();
        // console.error(domRect, domRect.top, domRect.top + pScrollTop, pScrollTop);
        var left = domRect.left + pScrollLeft;
        var top = domRect.top + pScrollTop;

        var objBodyOffset = {
            left:left,
            right: left + domRect.width,
            top: top,
            bottom: top + domRect.height,
            x: left,
            y: top,
            width: domRect.width,
            height: domRect.height,
        };
        return objBodyOffset;
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

    /* 모바일여부 확인 */
    this.isMobile = (function(){
        var mFilter = "win16|win32|win64|mac";
        var mCheck = false;
        if (navigator.platform)
            mCheck = ( mFilter.indexOf(navigator.platform.toLowerCase())<0 ) ? true : false;
        return mCheck;
    })();

    /* 웹브라우져 알아내기 */
    this.browserName = (function(){
        if (navigator){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('naver') != -1){
                return 'naver';
            }else if(ua.indexOf('kakaotalk') != -1){
                return 'kakaotalk';
            }else if(ua.indexOf('opr') != -1 || ua.indexOf('opera') != -1){
                return 'opera';
            }else if(ua.indexOf('bdbrowser') != -1){
                return 'baidu';
            }else if(ua.indexOf('ucbrowser') != -1){
                return 'uc';
            }else if(ua.indexOf('chrome') != -1 && window.speechSynthesis){
                return 'chrome';
            }else if(ua.indexOf('safari') != -1 && ua.indexOf('android') == -1 ){
                return 'safari';
            }else if(ua.indexOf('firefox') != -1){
                return 'firefox';
            }else if(ua.indexOf('msie') != -1){
                return 'ie';
            }else if(ua.indexOf('trident') != -1){
                return 'ie10+';
            }
            return 'etc';
        }
    })();



    this.parse = function(){
        if (obj){
            var startStr = obj.substr(0, 1);
            var endStr = obj.substr(obj.length-1, 1);
            if (typeof obj == 'string'){
                if (startStr == '{' && endStr == '}'){
                    return JSON.parse(obj);

                }else if (startStr == '[' && endStr == ']'){
                    return JSON.parse(obj);

                }else if (obj.indexOf(',') != -1 || obj.trim().indexOf(' ')){
                    var list = obj.split(/[\s,]+/);
                    for (var i = 0; i < list.length; i++) {
                        list[i] = list[i].trim();
                    }
                    return list;

                }else if (obj == 'true'){
                    return true;
                }else if (obj == 'false'){
                    return false;
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



/***************************************************************************
 *
 * EVENT
 *
 ***************************************************************************/
function SjEvent(){
    this.specialEventListenerFunc;
    this.globalEventMap = {};
    this.objectEventMap = {};
}

/*************************
 *
 * EVENT - ADD
 *
 *************************/
SjEvent.prototype.addEventListener = function(element, eventName, eventFunc){
    var hasEvent = false;
    var hasId = (element != null);
    var hasEventName = (eventName != null);
    var hasEventFunc = (eventFunc != null);
    if (hasEventFunc){
        if (typeof eventFunc == 'string'){
            eventFunc = new Function('event', eventFunc);
        }
    }

    if (hasId){
        //Get Element ID
        var elementId = '';
        if (element instanceof Element){
            elementId = element.id;
        }else if (typeof element == 'string' && element != ''){
            elementId = element
        }
        console.log('EVENT ADDITION: ', elementId, eventName);
        //Add Object Event
        if (hasEventName && hasEventFunc){
            if (!this.objectEventMap[elementId])
                this.objectEventMap[elementId] = {};
            this.addEvent(this.objectEventMap[elementId], eventName, eventFunc);
        }
    }else{
        //Add Global Event
        if (hasEventName && hasEventFunc)
            this.addEventListenerByEventName(eventName, eventFunc);
    }

    //Special Event (After Add)
    this.addSpecialEvent(element, eventName);
};
SjEvent.prototype.addEventListenerByEventName = function(eventName, eventFunc){
    if (!this.globalEventMap)
        this.globalEventMap = {};
    this.addEvent(this.globalEventMap, eventName, eventFunc);
};
SjEvent.prototype.addEvent = function(eventMap, eventName, eventFunc){
    if (!eventMap[eventName])
        eventMap[eventName] = [];
    eventMap[eventName].push(eventFunc);
};
/* Special Event */
SjEvent.prototype.setSpecialEventListener = function(func){
    this.specialEventListenerFunc = func;
};
SjEvent.prototype.addSpecialEvent = function(element, eventName){
    if (this.specialEventListenerFunc)
        this.specialEventListenerFunc(element, eventName);
};

/*************************
 *
 * EVENT - CHECK
 *
 *************************/
SjEvent.prototype.hasEventListener = function(element, eventName, eventFunc){
    var hasEvent = false;
    var hasId = (element != null);
    var hasEventName = (eventName != null);
    var hasEventFunc = (eventFunc != null);
    if (hasId){
        //Get Element ID
        var elementId = '';
        if (element instanceof Element){
            elementId = element.id;
        }else if (typeof element == 'string' && element != ''){
            elementId = element;
        }
        //Check Object Event
        if (hasEventName){
            var eventMapForObject = this.objectEventMap[elementId];
            if (eventMapForObject != null){
                for (var name in eventMapForObject){
                    if (name == eventName)
                        hasEvent = this.hasEvent(eventMapForObject, eventName, eventFunc);
                }
            }
        }
    }else{
        //Check Global & Object Event
        if (hasEventName && !hasEventFunc)
            hasEvent = this.hasEventListenerByEventName(eventName);
        if (hasEventName && hasEventFunc)
            hasEvent = this.hasEventListenerByEventName(eventName, eventFunc);
        if (!hasEventName && hasEventFunc)
            hasEvent = this.hasEventListenerByEventFunc(eventFunc);
    }
    return hasEvent;
};
SjEvent.prototype.hasEventListenerByEventName = function(eventName, eventFunc){
    //Check Global Event
    if (this.hasEvent(this.globalEventMap, eventName, eventFunc))
        return true;
    //Check Object Event
    for (var elementId in this.objectEventMap){
        var eventMapForObject = this.objectEventMap[elementId];
        var hasEventOnObject = this.hasEvent(eventMapForObject, eventName, eventFunc);
        if (hasEventOnObject)
            return true;
    }
    return false;
};
SjEvent.prototype.hasEventListenerByEventFunc = function(eventFunc){
    //Check Global Event
    if (this.hasEventFunc(this.globalEventMap, eventFunc))
        return true;
    //Check Object Event
    for (var elementId in this.objectEventMap){
        var eventMapForObject = this.objectEventMap[elementId];
        var hasEventOnObject = this.hasEventFunc(eventMapForObject, eventFunc);
        if (hasEventOnObject)
            return true;
    }
    return false;
};
SjEvent.prototype.hasEvent = function(eventMap, eventName, eventFunc){
    var hasEvent = false;
    //Find Event
    var eventFuncList = eventMap[eventName];
    if (eventFunc == null){
        //Find by eventName
        hasEvent = (eventFuncList != null && eventFuncList.length > 0);
    }else{
        //Find by eventName, eventFunc
        for (var i=0; i<eventFuncList.length; i++){
            var func = eventFuncList[i];
            hasEvent = (func == eventFunc);
            if (hasEvent)
                break;
        }
    }
    return hasEvent;
};
SjEvent.prototype.hasEventFunc = function(eventMap, eventFunc){
    var hasEvent = false;
    //FindAll
    for (var eventName in eventMap){
        hasEvent = this.hasEvent(eventMap, eventName, eventFunc);
        if (hasEvent)
            break;
    }
    return hasEvent;
};

/*************************
 *
 * EVENT - REMOVE
 *
 *************************/
SjEvent.prototype.removeEventListener = function(element, eventName, eventFunc){
    var result = false;
    var hasId = (element != null);
    var hasEventName = (eventName != null);
    var hasEventFunc = (eventFunc != null);
    if (hasId){
        //Get Element ID
        var elementId = '';
        if (element instanceof Element){
            elementId = element.id;
        }else if (typeof element == 'string' && element != ''){
            elementId = element
        }
        //Remove Object Event
        if (hasEventName && elementId != ''){
            var eventMapForObject = this.objectEventMap[elementId];
            if (eventMapForObject != null){
                for (var name in eventMapForObject){
                    if (name == eventName)
                        result = this.removeEvent(eventMapForObject, eventName, eventFunc);
                }
            }
        }
    }else{
        //Remove Global & Object Event
        if (hasEventName && !hasEventFunc)
            result = this.removeEventListenerByEventName(eventName);
        if (hasEventName && hasEventFunc)
            result = this.removeEventListenerByEventName(eventName, eventFunc);
        if (!hasEventName && hasEventFunc)
            result = this.removeEventListenerByEventFunc(eventFunc);
    }
    return result;
};
SjEvent.prototype.removeEventListenerByEventName = function(eventName, eventFunc){
    var resultOnGlobal;
    var resultOnObject;
    //Remove Global Event
    resultOnGlobal = this.removeEvent(this.globalEventMap, eventName, eventFunc);
    //Remove Object Event
    for (var elementId in this.objectEventMap){
        var eventMapForObject = this.objectEventMap[elementId];
        resultOnObject = this.removeEvent(eventMapForObject, eventName, eventFunc);
        if (resultOnObject)
            resultOnObject = true;
    }
    return (resultOnGlobal || resultOnObject);
};
SjEvent.prototype.removeEventListenerByEventFunc = function(eventFunc){
    var resultOnGlobal;
    var resultOnObject;
    //Remove Global Event
    resultOnGlobal = this.removeEventFunc(this.globalEventMap, eventFunc);
    //Remove Object Event
    for (var elementId in this.objectEventMap){
        var eventMapForObject = this.objectEventMap[elementId];
        resultOnObject = this.removeEventFunc(eventMapForObject, eventFunc);
        if (resultOnObject)
            resultOnObject = true;
    }
    return (resultOnGlobal || resultOnObject);
};
SjEvent.prototype.removeEvent = function(eventMap, eventName, eventFunc){
    var result;
    //Find Event
    var eventFuncList = eventMap[eventName];
    if (eventFunc == null && eventFunc == undefined){
        delete eventMap[eventName];
        result = true;
    }else{
        //Find by eventName, eventFunc
        if (eventFuncList && eventFuncList.length > 0){
            for (var i=0; i<eventFuncList.length; i++){
                if (eventFunc == eventFuncList[i]){
                    eventFuncList.splice(i, 1);
                    result = true;
                }
            }
        }
    }
    return result;
};
SjEvent.prototype.removeEventFunc = function(eventMap, eventFunc){
    var result;
    //FindAll
    for (var eventName in eventMap){
        result = this.removeEvent(eventMap, eventName, eventFunc);
    }
    return result;
};

/*************************
 *
 * EVENT - EXECUTE
 *
 *************************/
SjEvent.prototype.execEventListener = function(element, eventName, event){
    console.log('///// Execute Event', element.id, eventName);
    var resultForGlobal;
    var resultForObject;
    //Exec Global Event
    resultForGlobal = this.execEvent(this.globalEventMap, eventName, event);
    //Exec Object Event
    if (element != null){
        //Get Element ID
        var elementId = '';
        if (element instanceof Element){
            elementId = element.id;
        }else if (typeof element == 'string' && element != ''){
            elementId = element
        }
        //Exec Event
        if (elementId != '')
            resultForObject = this.execEvent(this.objectEventMap[elementId], eventName, event);
    }
    return (resultForGlobal || resultForObject);
};
SjEvent.prototype.execEventListenerByEventName = function(eventName, event){
    var resultOnGlobal;
    var resultOnObject;
    //Exec Global Event
    resultOnGlobal = this.execEvent(this.globalEventMap, eventName, event);
    //Exec Object Event
    for (var elementId in this.objectEventMap){
        var eventMapForObject = this.objectEventMap[elementId];
        resultOnObject = this.execEvent(eventMapForObject, eventName, event);
        if (resultOnObject)
            resultOnObject = true;
    }
    return (resultOnGlobal || resultOnObject);
};
SjEvent.prototype.execEvent = function(eventMap, eventNm, event){
    var result;
    var eventList = eventMap[eventNm];
    if (eventList){
        for (var i=0; i<eventList.length; i++){
            result = eventList[i](event);
        }
    }
    return result;
};
window.SjEvent = SjEvent;


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


/** PointerLock **/
// document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
// document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;


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

/////////////////////////
// String.trim()
/////////////////////////
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}