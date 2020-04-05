/***************************************************************************
 *
 * Start
 *
 ***************************************************************************/
function ready(func){
    new CrossMan().ready(func);
}

/***************************************************************************
 *
 * Element
 *
 ***************************************************************************/
function getEl(id){
    if (id instanceof CrossMan)
        return id;
    var el;
    if (id != null)
        el = (typeof id == 'object') ? id : document.getElementById(id);
    // else
    //     el = document;
    return new CrossMan(el);
}

function newEl(tagName, attributes, inner){
    if (!tagName)
        throw 'No Name!!!';
    var newElement;
    if (tagName.indexOf('<') == 0){
        var p = document.createElement('p');
        p.innerHTML = tagName;
        newElement = p.children[0];
    }else{
        newElement = document.createElement(tagName);
    }
    // 속성
    for (var attrNm in attributes){
        newElement.setAttribute(attrNm, attributes[attrNm]);
    }
    // 내용
    if (inner)
        newElement.innerHTML = inner;
    return new CrossMan(newElement);
}

function searchEl(query){
    var elementList = document.querySelectorAll(query);
    return new CrossMan(elementList);
}

function cloneEl(id, modeDeep){
    return getEl(id).clone(modeDeep);
}

function forEl(arrayOrObjectOrNumber, closure){
    return new CrossMan.Iterator(arrayOrObjectOrNumber, closure);
}

function ifEl(trueOrFalse, closure){
    return new CrossMan.Condition(trueOrFalse, closure);
}


/***************************************************************************
 *
 * Data
 *
 ***************************************************************************/
function getData(data){
    return new CrossMan.Data(data);
}

function cloneData(id, modeDeep){
    return getData(id).clone(modeDeep);
}


/***************************************************************************
 *
 * Class
 *
 ***************************************************************************/
function getClass(ClassFunction){
    return new CrossMan.Clazz(ClassFunction);
}



/***************************************************************************
 *
 * XHR
 *
 ***************************************************************************/
function getXHR(url, bodyObject, headerObject){
    return new CrossMan.XHR(url, bodyObject, headerObject).setMethod(CrossMan.XHR.GET);
}
function postXHR(url, bodyObject, headerObject){
    return new CrossMan.XHR(url, bodyObject, headerObject).setMethod(CrossMan.XHR.POST);
}
function putXHR(url, bodyObject, headerObject){
    return new CrossMan.XHR(url, bodyObject, headerObject).setMethod(CrossMan.XHR.PUT);
}
function deleteXHR(url, bodyObject, headerObject){
    return new CrossMan.XHR(url, bodyObject, headerObject).setMethod(CrossMan.XHR.DELETE);
}


/***************************************************************************
 *
 * CrossMan
 *
 ***************************************************************************/
function CrossMan(element){
    this.el = element;
    var that = this;

    /*************************
     * class
     *************************/
    this.clas = (function(){
        var classFuncs = {
            has: function(classNm){
                return (that.el.className && that.el.className.indexOf(classNm) != -1);
            },
            add: function(classNm){
                if (that.el.classList){
                    that.el.classList.add(classNm);
                }else{
                    that.el.className += ' ' +classNm+ ' ';
                }
                return classFuncs;
            },
            remove: function(classNm){
                if (that.el.classList){
                    that.el.classList.remove(classNm);
                }else if (that.el.className != undefined){
                    var classList = that.el.className.split(' ');
                    while (classList.indexOf(classNm) != -1){
                        classList.splice(classList.indexOf(classNm), 1);
                    }
                    that.el.className = classList.join(' ');
                }
                return classFuncs;
            }
        };
        return classFuncs;
    }());
    this.clazz = this.clas;
}


/**************************************************
 *
 * Binder for multiple element or parameter
 *
 **************************************************/
CrossMan.multiCheck = function(funcName, args, instance){
    return (CrossMan.multiElCheck.bind(instance)(funcName, args) || CrossMan.multiParamCheck.bind(instance)(funcName, args));
};
CrossMan.multiReverseCheck = function(funcName, args, instance){
    return (CrossMan.multiElReverseCheck.bind(instance)(funcName, args) || CrossMan.multiParamReverseCheck.bind(instance)(funcName, args));
};
CrossMan.multiElCheck = function(functionName, args){
    var maybeElementList = this.el;
    if (maybeElementList instanceof Array || maybeElementList instanceof NodeList){
        for (var i=0; i<maybeElementList.length; i++){
            var CrossManForNode = getEl(maybeElementList[i]);
            CrossManForNode[functionName].apply(CrossManForNode, args);
        }
        return true;
    }
    return false;
};
CrossMan.multiElReverseCheck = function(functionName, args){
    var maybeElementList = this.el;
    if (maybeElementList instanceof Array || maybeElementList instanceof NodeList){
        for (var i=maybeElementList.length -1; i>-1; i--){
            var CrossManForNode = getEl(maybeElementList[i]);
            CrossManForNode[functionName].apply(CrossManForNode, args);
        }
        return true;
    }
    return false;
};
CrossMan.multiParamCheck = function(functionName, args){
    var maybeParamList = args[0];
    if (maybeParamList instanceof Array || maybeParamList instanceof NodeList){
        for (var i=0; i<maybeParamList.length; i++){
            args[0] = maybeParamList[i];
            this[functionName].apply(this, args);
        }
        return true;
    }
    return false;
};
CrossMan.multiParamReverseCheck = function(functionName, args){
    var maybeParamList = args[0];
    if (maybeParamList instanceof Array || maybeParamList instanceof NodeList){
        for (var i=maybeParamList.length -1; i>-1; i--){
            args[0] = maybeParamList[i];
            this[functionName].apply(this, args);
        }
        return true;
    }
    return false;
};



/*************************
 * element
 *************************/
CrossMan.prototype.returnElement = function(){
    return this.el;
};
CrossMan.prototype.returnCloneElement = function(modeDeep){
    return (modeDeep) ? this.el.cloneNode(modeDeep) : this.el.cloneNode();
};
CrossMan.prototype.clone = function(modeDeep){
    var element = (modeDeep) ? this.el.cloneNode(modeDeep) : this.el.cloneNode();
    return getEl(element);
};


/*************************
 * attribute
 *************************/
CrossMan.prototype.attr = function(key, val){
    if (val == null)
        return this.el.getAttribute(key);
    if (CrossMan.multiCheck('attr', arguments, this))
        return this;
    this.el.setAttribute(key, val);
    return this;
};
CrossMan.prototype.prop = function(key, val){
    if (val == null)
        return this.el[key];
    if (CrossMan.multiCheck('prop', arguments, this))
        return this;
    this.el[key] = val;
    return this;
};
CrossMan.prototype.html = function(innerHTML){
    if (innerHTML == null)
        return this.el.innerHTML;
    if (CrossMan.multiCheck('html', arguments, this))
        return this;
    this.el.innerHTML = innerHTML;
    return this;
};
CrossMan.prototype.value = function(value){
    if (value == null)
        return this.el.value;
    if (CrossMan.multiCheck('value', arguments, this))
        return this;
    this.el.value = value;
    return this;
};
CrossMan.prototype.setValue = function(value){
    if (CrossMan.multiCheck('setValue', arguments, this))
        return this;
    this.el.value = value;
    return this;
};
CrossMan.prototype.parse = function(){
    if (this.el instanceof Element){
        var tagName = this.el.tagName.toLocaleUpperCase();
        var value = null;
        switch (tagName){
            case 'TEXTAREA': value = this.el.value; break;
            case 'INPUT': value = this.el.value; break;
            default: value = this.html(); break;
        }
        return getData(value).parse();
    }
};
CrossMan.prototype.check = function(flag){
    if (CrossMan.multiCheck('check', arguments, this))
        return this;
    this.el.checked = flag;
    return this;
};
CrossMan.prototype.clear = function(){
    if (CrossMan.multiCheck('clear', arguments, this))
        return this;
    this.el.innerHTML = '';
    return this;
};
CrossMan.prototype.style = function(cssText){
    if (CrossMan.multiCheck('style', arguments, this))
        return this;
    this.el.style.cssText = cssText;
    return this;
};
CrossMan.prototype.setStyle = function(property, value){
    if (typeof property == 'object'){
        var styleDataObject = property;
        for (var key in styleDataObject){
            CrossMan.prototype.setStyle(key, property[key]);
        }
        return this;
    }
    //Object로 간주
    this.el.style[property] = value;
    return this;
};
CrossMan.prototype.getStyle = function(property){
    return this.el.style[property];
};


CrossMan.prototype.if = function(trueOrFalse, callback){
    if (!!trueOrFalse)
        (callback && callback(this));
    return this;
};
CrossMan.prototype.exists = function(callback){
    var result = !!(this.el);
    if (result)
        (callback && callback(this));
    return result;
};
CrossMan.prototype.existsParent = function(callback){
    var result = !!(this.el && this.el.parentNode);
    if (result)
        (callback && callback(this));
    return result;
};



/*************************
 * Class
 *************************/
CrossMan.prototype.addClass = function(clazz){
    if (CrossMan.multiCheck('addClass', arguments, this))
        return this;
    if (clazz)
        this.clazz.add(clazz);
    return this;
};
CrossMan.prototype.hasClass = function(clazz){
    var result = true;
    if (clazz instanceof Array){
        for (var i=0; i<clazz.length; i++){
            if (!this.clazz.has(clazz[i])){
                result = false;
                break;
            }
        }
    }else{
        result = this.clazz.has(clazz);
    }
    return result;
};
CrossMan.prototype.hasSomeClass = function(clazz){
    var result = false;
    if (clazz instanceof Array){
        for (var i=0; i<clazz.length; i++){
            if (this.clazz.has(clazz[i])){
                result = true;
                break;
            }
        }
    }else{
        result = this.clazz.has(clazz);
    }
    return result;
};
CrossMan.prototype.removeClass = function(clazz){
    if (CrossMan.multiCheck('removeClass', arguments, this))
        return this;
    this.clazz.remove(clazz);
    return this;
};



/*************************
 * append
 *************************/
CrossMan.prototype.add = function(appender){
    if (CrossMan.multiCheck('add', arguments, this))
        return this;
    if (appender){
        if (appender instanceof CrossMan)
            this.add(appender.returnElement());
        else if (appender instanceof CrossMan.Iterator || appender instanceof CrossMan.Condition)
            this.add(appender.returnElement());
        else if (typeof appender == 'object')
            this.el.appendChild(appender);
        else
            this.el.appendChild( document.createTextNode((appender)?appender:'') );
    }
    return this;
};
CrossMan.prototype.addln = function(appender){
    if (CrossMan.multiCheck('addln', arguments, this))
        return this;
    if (appender){
        if (appender instanceof CrossMan)
            this.add(appender.returnElement());
        else if (typeof appender == 'object')
            this.el.appendChild(appender);
        else
            this.el.appendChild( document.createTextNode((appender)?appender:'') );
    }
    this.el.appendChild( document.createElement('br') );
    return this;
};
CrossMan.prototype.addEl = function(appender){
    if (CrossMan.multiCheck('addEl', arguments, this))
        return this;
    if (typeof appender == 'string'){
        var p = document.createElement('p');
        p.innerHTML = appender;
        for (var i=0, node; i<p.children.length; i++){ //TODO: What situation did you have?... 검토필요
            node = p.children[i];
            this.add(node);
        }
    }else{
        this.add(appender);
    }
    return this;
};
CrossMan.prototype.addAsFirst = function(appender){
    if (CrossMan.multiReverseCheck('addAsFirst', arguments, this))
        return this;
    if (appender instanceof CrossMan)
        this.addAsFirst(appender.returnElement());
    else if (typeof appender == 'object')
        this.el.insertBefore(appender, this.el.firstChild);
    else
        this.el.insertBefore(document.createTextNode((appender)?appender:''), this.el.firstChild);
    return this;
};

/** @Deprecated **/
CrossMan.prototype.addFrontOf = function(node, sibling){
    this.el.insertBefore(node, sibling);
    return this;
};

CrossMan.prototype.appendTo = function(parent){
    if (CrossMan.multiCheck('appendTo', arguments, this))
        return this;
    if (parent instanceof CrossMan)
        parent = parent.returnElement();
    else if (typeof parent == 'string')
        parent = document.getElementById(parent);
    parent.appendChild(this.el);
    return this;
};
CrossMan.prototype.appendToAsFirst = function(parent){
    if (CrossMan.multiReverseCheck('appendToAsFirst', arguments, this))
        return this;
    if (typeof parent == 'string')
        parent = document.getElementById(parent);
    parent.insertBefore(this.el, parent.firstChild);
    return this;
};
CrossMan.prototype.appendToFrontOf = function(target){
    if (CrossMan.multiReverseCheck('appendToFrontOf', arguments, this))
        return this;
    if (typeof target == 'string')
        target = document.getElementById(target);
    target.parentNode.insertBefore(this.el, target);
    return this;
};
CrossMan.prototype.appendToNextOf = function(target){
    if (CrossMan.multiCheck('appendToNextOf', arguments, this))
        return this;
    if (typeof target == 'string')
        target = document.getElementById(target);
    target.parentNode.insertBefore(this.el, target.nextSibling);
    return this;
};

CrossMan.prototype.remove = function(removeElObj){
    if (CrossMan.multiCheck('remove', arguments, this))
        return this;
    if (removeElObj && removeElObj.parentNode)
        removeElObj.parentNode.removeChild(removeElObj);
    return this;
};
CrossMan.prototype.del = CrossMan.prototype.remove;
CrossMan.prototype.removeFromParent = function(){
    if (CrossMan.multiCheck('removeFromParent', arguments, this))
        return this;
    return this.remove(this.el);
};
CrossMan.prototype.deleteAll = function(){
    if (CrossMan.multiCheck('deleteAll', arguments, this))
        return this;
    if (this.el instanceof Array){
        this.el = [];
    }
    return this;
};



/*************************
 * event
 *************************/
CrossMan.prototype.hasEventListener = function(eventNm){
    return this.el.hasEventListener(eventNm);
};
CrossMan.prototype.removeEventListener = function(eventNm, fn){
    if (CrossMan.multiCheck('removeEventListener', arguments, this))
        return this;
    this.el.removeEventListener(eventNm, fn);
    return this;
};
CrossMan.prototype.addEventListener = function(eventNm, fn){
    if (CrossMan.multiCheck('addEventListener', arguments, this))
        return this;
    /* FireFox */
    if (navigator.userAgent.indexOf('Firefox') != -1){
        this.el.addEventListener(eventNm, function(e){ window.event = e; }, true);
    }
    /* general */
    if (this.el.addEventListener){
        this.el.addEventListener(eventNm, function(event){
            fn(event);
            // fn(event, getEventTarget(event));
        });
    /* IE8 */
    }else{
        if (!this.el.attachEvent){
            //No attachEvent
            return this;
        }
        try{
            this.el.attachEvent('on'+eventNm, function(event){
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

/*************************
 * event - trigger
 *************************/
CrossMan.prototype.trigger = function(eventNm){
    if (CrossMan.multiCheck('trigger', arguments, this))
        return this;
    if ("createEvent" in document) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent(eventNm, false, true);
        this.el.dispatchEvent(event);
    }else{
        this.el.fireEvent("on" +eventNm);
    }
    return this;
};
CrossMan.prototype.focus = function(){
    this.el.focus();
    return this;
};





/**************************************************
 *
 * Ready
 * https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
 *
 **************************************************/
CrossMan.prototype.ready = (function(){

    var readyList,
        DOMContentLoaded,
        class2type = {};
    class2type["[object Boolean]"] = "boolean";
    class2type["[object Number]"] = "number";
    class2type["[object String]"] = "string";
    class2type["[object Function]"] = "function";
    class2type["[object Array]"] = "array";
    class2type["[object Date]"] = "date";
    class2type["[object RegExp]"] = "regexp";
    class2type["[object Object]"] = "object";

    var ReadyObj = {
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                ReadyObj.readyWait++;
            } else {
                ReadyObj.ready( true );
            }
        },
        // Handle when the DOM is ready
        ready: function( wait ) {
            // Either a released hold or an DOMready/load event and not yet ready
            if ( (wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady) ) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( !document.body ) {
                    return setTimeout( ReadyObj.ready, 1 );
                }

                // Remember that the DOM is ready
                ReadyObj.isReady = true;
                // If a normal DOM Ready event fired, decrement, and wait if need be
                if ( wait !== true && --ReadyObj.readyWait > 0 ) {
                    return;
                }
                // If there are functions bound, to execute
                readyList.resolveWith( document, [ ReadyObj ] );

                // Trigger any bound ready events
                //if ( ReadyObj.fn.trigger ) {
                //    ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
                //}
            }
        },
        bindReady: function() {
            if ( readyList ) {
                return;
            }
            readyList = ReadyObj._Deferred();

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                return setTimeout( ReadyObj.ready, 1 );
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                // A fallback to window.onload, that will always work
                window.addEventListener( "load", ReadyObj.ready, false );

                // If IE event model is used
            } else if ( document.attachEvent ) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", DOMContentLoaded );

                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", ReadyObj.ready );

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch(e) {}

                if ( document.documentElement.doScroll && toplevel ) {
                    doScrollCheck();
                }
            }
        },
        _Deferred: function() {
            var // callbacks list
                callbacks = [],
                // stored [ context , args ]
                fired,
                // to avoid firing when already doing so
                firing,
                // flag to know if the deferred has been cancelled
                cancelled,
                // the deferred itself
                deferred  = {

                    // done( f1, f2, ...)
                    done: function() {
                        if ( !cancelled ) {
                            var args = arguments,
                                i,
                                length,
                                elem,
                                type,
                                _fired;
                            if ( fired ) {
                                _fired = fired;
                                fired = 0;
                            }
                            for ( i = 0, length = args.length; i < length; i++ ) {
                                elem = args[ i ];
                                type = ReadyObj.type( elem );
                                if ( type === "array" ) {
                                    deferred.done.apply( deferred, elem );
                                } else if ( type === "function" ) {
                                    callbacks.push( elem );
                                }
                            }
                            if ( _fired ) {
                                deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
                            }
                        }
                        return this;
                    },

                    // resolve with given context and args
                    resolveWith: function( context, args ) {
                        if ( !cancelled && !fired && !firing ) {
                            // make sure args are available (#8421)
                            args = args || [];
                            firing = 1;
                            try {
                                while( callbacks[ 0 ] ) {
                                    callbacks.shift().apply( context, args );//shifts a callback, and applies it to document
                                }
                            }
                            finally {
                                fired = [ context, args ];
                                firing = 0;
                            }
                        }
                        return this;
                    },

                    // resolve with this as context and given arguments
                    resolve: function() {
                        deferred.resolveWith( this, arguments );
                        return this;
                    },

                    // Has this deferred been resolved?
                    isResolved: function() {
                        return !!( firing || fired );
                    },

                    // Cancel
                    cancel: function() {
                        cancelled = 1;
                        callbacks = [];
                        return this;
                    }
                };

            return deferred;
        },
        type: function( obj ) {
            return obj == null ?
                String( obj ) :
                class2type[ Object.prototype.toString.call(obj) ] || "object";
        }
    }
    // The DOM ready check for Internet Explorer
    function doScrollCheck() {
        if ( ReadyObj.isReady ) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch(e) {
            setTimeout( doScrollCheck, 1 );
            return;
        }

        // and execute any waiting functions
        ReadyObj.ready();
    }
    // Cleanup functions for the document ready method
    if ( document.addEventListener ) {
        DOMContentLoaded = function() {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            ReadyObj.ready();
        };

    } else if ( document.attachEvent ) {
        DOMContentLoaded = function() {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", DOMContentLoaded );
                ReadyObj.ready();
            }
        };
    }
    function ready( fn ) {
        // Attach the listeners
        ReadyObj.bindReady();

        var type = ReadyObj.type( fn );

        // Add the callback
        readyList.done( fn );//readyList is result of _Deferred()
    }
    return ready;
})();



CrossMan.prototype.click = function(){
    this.el.click();
    return this;
};
CrossMan.prototype.change = function(){
    this.el.change();
    return this;
};
//TODO: 재검토 필요.
CrossMan.prototype.resize = function(funcToAdd){
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
CrossMan.prototype.forChildren = function(functionForLoop){
    var children = this.el.children;
    for (var iii=0; iii<children.length; iii++){
        var child = children[iii];
        functionForLoop(child);
    }
};

CrossMan.prototype.each = function(closure){
    getData(this.el).each(closure);
    return this;
};

CrossMan.prototype.any = function(closure){
    getData(this.el).some(closure);
    return this;
};

CrossMan.prototype.some = CrossMan.prototype.any;


CrossMan.prototype.getChildEl = function(child){
    var childElement = null;
    if (typeof child == 'number'){
        childElement = this.el.children[child];
    }
    return getEl(childElement);
}


/*************************
 * etc
 *************************/
CrossMan.prototype.scrollDown = function(){
    this.el.scrollTop = this.el.scrollHeight;
    return this;
};
CrossMan.prototype.disableSelection = function(){
    if (typeof this.el.ondragstart != 'undefined') this.el.ondragstart = function(){return false;};
    if (typeof this.el.onselectstart != 'undefined') this.el.onselectstart = function(){return false;};
    if (typeof this.el.oncontextmenu != 'undefined') this.el.oncontextmenu = function(){return false;};
    /* 파이어폭스에서 드래그 선택 금지 */
    if (typeof this.el.style.MozUserSelect != 'undefined') document.body.style.MozUserSelect = 'none';
    return this;
};



CrossMan.prototype.hideDiv = function(){ //TODO: 검토필요
    this.el.style.display = 'block';
    this.el.style.position = 'absolute';
    this.el.style.left = '-5555px';
    this.el.style.top = '-5555px';
    return this;
};
CrossMan.prototype.showDiv = function(){ //TODO: 검토필요
    this.el.style.display = 'block';
    this.el.style.position = 'absolute';
    this.el.style.left = '0px';
    this.el.style.top = '0px';
    return this;
};
CrossMan.prototype.getNewSeqId = function(idStr){ //TODO: 검토필요
    for (var seq=1; seq<99999; seq++){
        var searchEmptyId = idStr + seq;
        if (!(searchEmptyId in this.el))
        // if (!document.getElementById(searchEmptyId))
            return searchEmptyId;
    }
    return null;
};






CrossMan.prototype.isAccepted = function(acceptObj, rejectObj){
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
CrossMan.prototype.find = function(param){
    if (this.el instanceof Array){
        var results = [];
        for (var i=0; i<this.el.length; i++){
            var matchedObj = this.getMatchedObjWithParam(this.el[i], param);
            if (matchedObj)
                results.push(matchedObj);
        }
        return results;
    }
    if (this.el instanceof Object){
        var matchedObj = this.getMatchedObjWithParam(this.el, param);
        return matchedObj;
    }
};
CrossMan.prototype.findAll = function(finder){
    var resultList = [];
    if (this.el instanceof Array){
        for (var i=0; i<this.el.length; i++){
            var found = getEl(this.el[i]).find(finder);
            if (found != null)
                resultList.push(found);
        }
    }else if (typeof this.el == 'object'){
        for (var property in this.el){
            var found = getEl(this.el[property]).find(finder);
            if (found != null)
                resultList.push(found);
        }
    }
    return resultList
};

// Param==Array => Or조건
// Param==Object => 해당조건
CrossMan.prototype.getMatchedObjWithParam = function(obj, param){
    if (typeof param == 'string'){
        param = {id:param};
    }
    if (param instanceof Function){
        return (param(obj)) ? obj : null;
    }else if (param instanceof Array){
        for (var i=0; i<param.length; i++){
            if (this.find(param[i])) //TODO: 좀 이상한 거 같은데?? findAll을 최종형으로 보면 될까??
                return obj;
        }
        return null; //No Matching
    }else if (param instanceof Object){
        var keys = Object.keys(param);
        for (var i=0, key; i<keys.length; i++){
            key = keys[i];
            var attributeValue = obj[key];
            var conditionValue = param[key];
            //- Object Condition안에 value가 Array이면 OR조건으로 Maching여부를 알아낸다.
            //TODO: 실제값도 Array일 경우는 어떻게 할까나..?...
            conditionValue = (conditionValue instanceof Array) ? conditionValue : [conditionValue];
            var checkFlag = false;
            for (var jj=0; jj<conditionValue.length; jj++){
                if ( attributeValue && (attributeValue == conditionValue[jj] || CrossMan.checkMatchingWithExpression(attributeValue, conditionValue[jj])) ){
                    checkFlag = true;
                    break;
                }
            }
            if (!checkFlag)
                return null; //No Matching
        }
        return obj;
    }
};
CrossMan.checkMatchingWithExpression = function(value, condition){
    var result;
    if (value && condition){
        //- Function으로
        if (condition instanceof Function)
            return !!condition(value);
        //- 일반상황
        var tempCondition;
        var exclamationFlag;
        var conditionStr = (condition+'');
        exclamationFlag = (conditionStr.indexOf('!') == 0);
        tempCondition = conditionStr.substr( (exclamationFlag)?1:0 );
        tempCondition = tempCondition.replace('.', '[.]');
        var splitCondition = tempCondition.split("*");
        var regExpCondition = splitCondition.join('.*');
        regExpCondition = "^" + regExpCondition + "$"
        result = new RegExp(regExpCondition).test(value);
        result = (exclamationFlag) ? !result : result;
    }
    return result;
};




// Find HTMLDOMElement
CrossMan.prototype.findDomAttribute = function(param){
    if (this.el instanceof Array){
        var results = [];
        for (var i=0; i<this.el.length; i++){
            var matchedObj = CrossMan.prototype.getMatchedDomAttributeWithParam(this.el[i], param);
            if (matchedObj)
                results.push(matchedObj);
        }
        return results;
    }
    if (this.el instanceof Object){
        var matchedObj = this.getMatchedDomAttributeWithParam(this.el, param);
        return matchedObj;
    }
};

// Param==Array => Or조건
// Param==Object => 해당조건
CrossMan.prototype.getMatchedDomAttributeWithParam = function(obj, param){
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
            if ( attributeValue && attributeValue == conditionValue || CrossMan.checkMatchingWithExpression(attributeValue, conditionValue)){
            }else{
                return; //No Matching
            }
        }
        return obj;
    }
};





CrossMan.prototype.getParentEl = function(attrNm){
    var searchSuperObj = this.el;
    while(searchSuperObj){
        if (searchSuperObj.getAttribute(attrNm) != undefined)
            break;
        searchSuperObj = searchSuperObj.parentNode;
    }
    return searchSuperObj;
};
CrossMan.prototype.findEl = function(attr, val){
    var subEls = this.el.children;
    for (var i=0; i<subEls.length; i++){
        if (subEls[i].getAttribute(attr) == val)
            return subEls[i];
    }
};
CrossMan.prototype.findChildEl = function(closureToFind, depth){
    depth = (depth === null) ? 3 : depth;
    if (closureToFind instanceof Function){
        return CrossMan.findChildEl(this.el, closureToFind, depth);
    }else if (typeof closureToFind == 'object'){
        // return CrossMan.findChildEl(this.el, function(it){
        //     return getEl(it).attr()
        // }, depth);
    }
};
CrossMan.findChildEl = function(element, closureToFind, depth){
    var subEls = element.children;
    if (!subEls || depth == 0)
        return getEl();
    for (var i=0, node, subNode; i<subEls.length; i++){
        node = getEl(subEls[i]);
        if (closureToFind(node))
            return node;
        subNode = CrossMan.findChildEl(subEls[i], closureToFind, depth -1);
        if (subNode.el)
            return subNode;
    }
    return getEl();
};
CrossMan.findChildElByAttributeObject = function(element, closureToFind, depth){
    var subEls = element.children;
    if (!subEls || depth == 0)
        return getEl();
    for (var i=0; i<subEls.length; i++){
        if (closureToFind(subEls[i]))
            return getEl(subEls[i]);
        return CrossMan.findChildElByAttributeObject(subEls[i], closureToFind, depth -1);
    }
};

CrossMan.prototype.findParentEl = function(attr, val){
    var foundEl;
    var parentEl = this.el;
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
CrossMan.prototype.getBodyScrollX = function(event){
    var standardElement = this.el ? this.el : document;
    if (standardElement == document){
        var bodyPageX = 0;
        if (document.documentElement && document.documentElement.scrollLeft)
            bodyPageX = document.documentElement.scrollLeft;
        if (window.pageXOffset)
            bodyPageX = window.pageXOffset;
        if (document.body && document.body.scrollLeft)
            bodyPageX = document.body.scrollLeft;
    }else{
        bodyPageX = this.el.scrollLeft;
    }
    return bodyPageX;
};
CrossMan.prototype.getBodyScrollY = function(event){
    var standardElement = this.el ? this.el : document;
    if (standardElement == document){
        var bodyPageY = 0;
        if (document.documentElement && document.documentElement.scrollTop)
            bodyPageY = document.documentElement.scrollTop;
        if (window.pageYOffset)
            bodyPageY = window.pageYOffset;
        if (document.body && document.body.scrollTop)
            bodyPageY = document.body.scrollTop;
    }else{
        bodyPageY = this.el.scrollTop;
    }
    return bodyPageY;
};
/*****
 * 문서의 크기
 * IE구버전 : document.documentElement.offsetWidth
 * IE11 & others : document.body.offsetWidth
 *****/
CrossMan.prototype.getBodyOffsetX = function(event){ //TODO: 뭔가 잘못 됐네.. 크기와 위치 개념정리 필요
    var standardElement = this.el ? this.el : document;
    if (standardElement == document){
        var bodyOffsetX = 0;
        if (document.documentElement && document.documentElement.offsetWidth)
            return document.documentElement.offsetWidth;
        if (document.body && document.body.offsetWidth)
            return document.body.offsetWidth;
    }else{
        this.el.offsetLeft;
    }
    return bodyOffsetX;
};
CrossMan.prototype.getBodyOffsetY = function(event){ //TODO: 뭔가 잘못 됐네.. 크기와 위치 개념정리 필요
    var bodyOffsetY = 0;
    if (document.documentElement && document.documentElement.offsetHeight)
        return document.documentElement.offsetHeight;
    if (document.body && document.body.offsetHeight)
        return document.body.offsetHeight;
    return bodyOffsetY;
};
/* 눈에 보이는 좌표 값 (객체마다  DOM TREE구조와 position의 영향을 받기 때문에, 다른 계산이 필요하여 만든 함수)
 * 재료는 DOM객체 */
CrossMan.prototype.getBoundingClientRect = function(){
    if (this.el.getBoundingClientRect)
        return this.el.getBoundingClientRect();  //TODO: BODY의 화면상 Scroll된 영역으로부터 상대적인 수치를 주는 것 같다.
    //TODO: 정리필요
    return this.getBoundingPageRect();
};
/* 눈에 보이는 좌표 값 (객체마다  DOM TREE구조와 position의 영향을 받기 때문에, 다른 계산이 필요하여 만든 함수)
 * 재료는 DOM객체 */
CrossMan.prototype.getBoundingPageRect = function(){ //TODO: 지금 이게 조금 유력!??
    var sumOffsetLeft = 0;
    var sumOffsetTop = 0;
    var thisObj = this.el;
    var parentObj = this.el.parentNode;
    if (thisObj.style && thisObj.style.position == 'fixed'){
        sumOffsetLeft += thisObj.offsetLeft + getEl(document).getBodyScrollX();
        sumOffsetTop += thisObj.offsetTop + getEl(document).getBodyScrollY();
    }else{
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
                }else if(parentObj.style.position == 'fixed'){
                    sumOffsetLeft += thisObj.offsetLeft + (parentObj.offsetLeft + getEl(document).getBodyScrollX());
                    sumOffsetTop += thisObj.offsetTop + (parentObj.offsetTop + getEl(document).getBodyScrollY());
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
    }
    var objBodyOffset = {
        left:sumOffsetLeft,
        top:sumOffsetTop,
        width:this.el.offsetWidth,
        height:this.el.offsetHeight
    };
    return objBodyOffset;
};



CrossMan.prototype.getBoundingOffsetRect = function(){
    //SJTEST
    var pScrollLeft = 0;
    var pScrollTop = 0;
    if (this.el.parentNode){
        pScrollLeft = this.el.parentNode.scrollLeft;
        pScrollTop = this.el.parentNode.scrollTop;
    }

    var domRect = this.getBoundingClientRect();
    // console.error(domRect, domRect.top, domRect.top + pScrollTop, pScrollTop);
    var left = domRect.left + pScrollLeft;
    var top = domRect.top + pScrollTop;

    var objBodyOffset = {
        left: left,
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



/***************************************************************************
 *
 * forEl
 *
 ***************************************************************************/
CrossMan.Iterator = function(arrayOrObject, closure){
    this.data = arrayOrObject;
    this.closure = closure;
    this.result = null;
};
CrossMan.Iterator.prototype.returnElement = function(){
    return this.run();
};
CrossMan.Iterator.prototype.run = function(){
    var closure = this.closure;
    var data = this.data;
    var resultElementList = [];
    if (data instanceof Array){
        for (var i = 0; i < data.length; i++){
            resultElementList.push(closure(data[i], i));
        }
    }else if (typeof data == 'number'){
        for (var i=0; i<data; i++){
            resultElementList.push( closure(i) );
        }
    }else{
        var i = -1;
        for (var key in data){
            resultElementList.push( closure(key, data[key], ++i) );
        }
    }
    return resultElementList;
};


/***************************************************************************
 *
 * ifEl
 *
 ***************************************************************************/
CrossMan.Condition = function(trueOrFalse, closureOrCrossManOrTextNode){
    this.trueOrFalse = trueOrFalse;
    this.closureOrCrossManOrTextNode = closureOrCrossManOrTextNode;
    this.result = null;
};
CrossMan.Condition.prototype.returnElement = function(){
    return this.run();
};
CrossMan.Condition.prototype.run = function(){
    if (this.trueOrFalse){
        if (this.closureOrCrossManOrTextNode instanceof Function){
            return this.closureOrCrossManOrTextNode();
        }else{
            return this.closureOrCrossManOrTextNode;
        }
    }
    return [];
};



/***************************************************************************
 *
 * getData
 *
 ***************************************************************************/
CrossMan.Data = function(data){
    this.data = data;
};
/* 모바일여부 확인 */
CrossMan.Data.prototype.isMobile = (function(){
    var mFilter = "win16|win32|win64|mac";
    var mCheck = false;
    if (navigator.platform)
        mCheck = ( mFilter.indexOf(navigator.platform.toLowerCase())<0 ) ? true : false;
    return mCheck;
})();
/* 웹브라우져 알아내기 */
CrossMan.Data.prototype.browserName = (function(){
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
/* URL Parameter 따오기 */
CrossMan.Data.prototype.getFromURLParameter = function(key){
    var params = window.location.search.substring(1).split("&");
    //- Make ParamObject
    var res = {};
    for (var i in params){
        var keyvalue = params[i].split("=");
        res[keyvalue[0]] = (keyvalue[1] === undefined) ? undefined : decodeURI(keyvalue[1]);
    }
    //- Return
    return (key) ? res[key] : res;
};
CrossMan.Data.prototype.getListFromURLParameter = function(key){
    var value = this.getFromURLParameter(key);
    return (value && typeof value == 'string') ? value.split(',') : [];
};
CrossMan.Data.prototype.checkFromURLParameter = function(key, valueToCheck, callback){
    var valueFromParam = this.getFromURLParameter(key);
    if (key != null && valueToCheck !=null){
        if (valueFromParam !== null && valueFromParam !== undefined && valueFromParam == valueToCheck){
            var returnValue = (callback & callback(valueFromParam));
            if (returnValue == false)
                return false;
            return true;
        }
        return false;
    }
    if (key != null && valueToCheck == null){
        if (valueFromParam !== null && valueFromParam !== undefined){
            var returnValue = (callback && callback(valueFromParam));
            if (returnValue == false)
                return false;
            return true;
        }
        return false;
    }
};
CrossMan.Data.prototype.getFromURLHash = function(){
    return window.location.hash;
};
CrossMan.Data.prototype.checkFromURLHash = function(key, callback){
    var hashURL = this.getFromURLHash();
    if (hashURL){
        if (key == hashURL){
            var returnValue = (callback && callback(hashURL));
            if (returnValue == false)
                return false;
            return true;
        }else{
            var returnValue = (callback && callback(hashURL));
            if (returnValue == false)
                return false;
            return true;
        }
    }
    return false;
};



CrossMan.Data.prototype.returnData = function(){
    return this.data;
};
CrossMan.Data.prototype.returnCloneData = function(){
    return CrossMan.Data.cloneObject(this.data);
};
CrossMan.Data.prototype.clone = function(){
    var data = this.returnCloneData();
    return getData(data);
};



CrossMan.Data.prototype.log = function(logMessage){
    var logData = this.data;
    try{
        logData = JSON.stringify(this.data);
    }catch(e){
        try{
            console.warn(e);
        }catch(ee){
            console.log(e);
        }
    }
    console.log(logMessage + logData);
    return this;
};

CrossMan.Data.prototype.contains = function(checkThing){
    if (typeof this.data == 'string'){
        if (checkThing instanceof Array){
            for (var i=0; i<checkThing.length; i++){
                if (!this.contains(checkThing[i]))
                    return false;
            }
            return true;
        }
        return this.data.indexOf(checkThing) != -1;
    }
};

CrossMan.Data.prototype.nvl = function(valueIfNull){
    return (this.data == null || this.data === undefined) ? valueIfNull : this.data;
};

CrossMan.Data.prototype.count = function(checkThing, allowOverlapping){
    var string = this.data += "";
    checkThing += "";
    if (checkThing.length <= 0)
        return (string.length + 1);

    var n = 0, pos = 0, step = allowOverlapping ? 1 : checkThing.length;

    while (true){
        pos = string.indexOf(checkThing, pos);
        if (pos >= 0){
            ++n;
            pos += step;
        }else{
            break;
        }
    }
    return n;
};

CrossMan.Data.prototype.each = function(closure){
    if (this.data instanceof Array || this.data instanceof NodeList){
        for (var i = 0; i < this.data.length; i++){
            if (closure(this.data[i], i) == false)
                break;
        }
    }else{
        for (var key in this.data){
            if (closure(key, this.data[key]) == false)
                break;
        }
    }
    return this.data;
};

CrossMan.Data.prototype.find = function(closure){
    if (this.data instanceof Array){
        for (var i=0; i<this.data.length; i++){
            if (closure(this.data[i], i))
                return this.data[i];
        }
    }else{
        for (var key in this.data){
            if (closure(key, this.data[key]))
                return this.data[key];
        }
    }
    return null;
};

CrossMan.Data.prototype.findAll = function(closure){
    if (this.data instanceof Array){
        var foundList = [];
        for (var i=0; i<this.data.length; i++){
            if (closure(this.data[i], i))
                foundList.push(this.data[i]);
        }
        return foundList;
    }else{
        var foundList = [];
        for (var key in this.data){
            if (closure(key, this.data[key]))
                foundList.push(this.data[key]);
        }
        return foundList;
    }
    return [];
};

CrossMan.Data.prototype.every = function(closure){
    if (this.data instanceof Array){
        for (var i=0; i<this.data.length; i++){
            if (!closure(this.data[i], i))
                return false;
        }
    }else{
        for (var key in this.data){
            if (!closure(key, this.data[key]))
                return false;
        }
    }
    return true;
};

CrossMan.Data.prototype.any = function(closure){
    if (this.data instanceof Array || this.data instanceof NodeList){
        for (var i=0; i<this.data.length; i++){
            if (closure(this.data[i], i))
                return true;
        }
    }else{
        for (var key in this.data){
            if (closure(key, this.data[key]))
                return true;
        }
    }
    return false;
};
CrossMan.Data.prototype.some = CrossMan.Data.prototype.any;

CrossMan.Data.prototype.collect = function(closure){
    var newList = [];
    if (this.data instanceof Array){
        for (var i=0, newItem; i<this.data.length; i++){
            newItem = closure(this.data[i], i);
            newList.push(newItem);
        }
    }else{
        var index = -1;
        for (var key in this.data){
            newItem = closure(key, this.data[key], ++index);
            newList.push(newItem);
        }
    }
    return newList;
};

CrossMan.Data.prototype.collectMap = function(closure){
    var newMap = {};
    var newItemEntry = null;
    if (this.data instanceof Array){
        for (var i=0, it; i<this.data.length; i++){
            it = this.data[i];
            newItemEntry = closure(it, i);
            newMap[newItemEntry.key] = newItemEntry.value;
        }
    }else{
        var index = -1, key, value;
        for (key in this.data){
            value = this.data[key];
            newItemEntry = closure(key, value, ++index);
            newMap[newItemEntry.key] = newItemEntry.value;
        }
    }
    return newMap;
};

CrossMan.Data.prototype.merge = function(data){
    var newMap = {};
    var newItemEntry = null;
    if (this.data instanceof Array){
        for (var i=0, it; i<data.length; i++){
            this.data.push( data[i] );
        }
    }else{
        var key;
        for (key in data){
            this.data[key] = data[key];
        }
    }
    return this;
};

CrossMan.Data.newMergeOptionAll = function(standardOption, mergeOption){
    var mergedOption = standardOption;
    if (!mergeOption){
        mergedOption = CrossMan.Data.newMergeOptionAll({}, mergedOption);
    }else{
        //- Make List
        if (!(mergeOption instanceof Array) && !mergeOption.length) //Array from other window is converted to Not Array... shit..
            mergeOption = [mergeOption];
        //- Merge All
        for (var i=0; i<mergeOption.length; i++){
            mergedOption = CrossMan.Data.newMergeOption(mergedOption, mergeOption[i]);
        }
    }
    return mergedOption;
};

CrossMan.Data.newMergeOption = function(standardOption, mergeOption){
    if (!standardOption)
        standardOption = (mergeOption instanceof Array) ? [] : {};
    // var newMergedOption = CrossMan.Data.assign({}, standardOption);
    // var newMergedOption = JSON.parse(JSON.stringify(standardOption));
    var newMergedOption = CrossMan.Data.cloneObject(standardOption);
    return CrossMan.Data.mergeIntoOption(newMergedOption, mergeOption);
};

CrossMan.Data.mergeIntoOption = function(standardOption, mergeOption){
    if (mergeOption){
        if (!standardOption){
            if (mergeOption instanceof Array)
                standardOption = [];
            else
                standardOption = {};
        }

        for (var optionName in mergeOption){
            var nextValue = mergeOption[optionName];
            var mergedValue = null;
            if (nextValue === null){
                standardOption[optionName] = null;

            }else if (nextValue === undefined){
                standardOption[optionName] = undefined;

            }else if (nextValue instanceof Element){
                mergedValue = nextValue;
                standardOption[optionName] = mergedValue;

            }else if (nextValue instanceof Array){
                if (!standardOption[optionName])
                    standardOption[optionName] = [];
                for (var i=0; i<nextValue.length; i++){
                    if (nextValue[i] === null)
                        mergedValue = null;
                    else if (nextValue[i] === undefined)
                        mergedValue = undefined;
                    else if (nextValue[i] instanceof Element)
                        mergedValue = nextValue[i];
                    else if (nextValue[i] instanceof Array)
                        mergedValue = CrossMan.Data.newMergeOption(standardOption[optionName][i], nextValue[i]);
                    else if (typeof nextValue[i] == 'object')
                        mergedValue = CrossMan.Data.newMergeOption(standardOption[optionName][i], nextValue[i]);
                    else
                        mergedValue = nextValue[i];
                    standardOption[optionName][i] = mergedValue;
                }

            }else if (typeof nextValue == 'object'){
                if (standardOption[optionName] == null)
                    standardOption[optionName] = {};
                for (var key in nextValue){
                    if (nextValue[key] === null)
                        mergedValue = null;
                    else if (nextValue[key] === undefined)
                        mergedValue = undefined;
                    else if (nextValue[key] instanceof Element)
                        mergedValue = nextValue[key];
                    else if (nextValue[key] instanceof Array)
                        mergedValue = CrossMan.Data.newMergeOption(standardOption[optionName][key], nextValue[key]);
                    else if (typeof nextValue[key] == 'object')
                        mergedValue = CrossMan.Data.newMergeOption(standardOption[optionName][key], nextValue[key]);
                    else
                        mergedValue = nextValue[key];
                    standardOption[optionName][key] = mergedValue;
                }

            }else{
                mergedValue = nextValue;
                standardOption[optionName] = mergedValue;
            }
        }
    }
    return standardOption;
};

CrossMan.Data.cloneObject = function(obj){
    var copy;
    if (null == obj || "object" != typeof obj) // Handle the 3 simple types, and null or undefined
        return obj;
    if (obj instanceof Date){
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array){
        copy = [];
        for (var i=0, len=obj.length; i<len; i++){
            copy[i] = CrossMan.Data.cloneObject(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Element){ //TODO: This is Refference :)  right?
        copy = obj;
        return copy;
    }
    if (typeof obj == 'object' || obj instanceof Object){
        copy = {};
        for (var attr in obj){
            if (obj.hasOwnProperty(attr))
                copy[attr] = CrossMan.Data.cloneObject(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
};

/*****
 * Javascript Object.assign Alternative.
 * @param target
 * @returns {*}
 *****/
CrossMan.Data.assign = function(target){
    for (var i=1; i<arguments.length; i++){
        var source = arguments[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)){
                target[key] = source[key];
            }
        }
    }
    return target;
};

CrossMan.Data.prototype.parse = function(){
    if (this.data){
        var startStr = this.data.substr(0, 1);
        var endStr = this.data.substr(this.data.length-1, 1);
        if (typeof this.data == 'string'){
            if (startStr == '{' && endStr == '}'){
                return JSON.parse(this.data);

            }else if (startStr == '[' && endStr == ']'){
                return JSON.parse(this.data);

            }else if (this.data.indexOf(',') != -1 || this.data.trim().indexOf(' ') != -1){
                var list = this.data.split(/[\s,]+/);
                for (var i = 0; i < list.length; i++) {
                    list[i] = list[i].trim();
                }
                return list;

            }else if (this.data == 'true'){
                return true;
            }else if (this.data == 'false'){
                return false;
            }
        }
        return this.data;
    }
};

CrossMan.Data.prototype.findHighestZIndex = function(tagName){
    var highestIndex = 0;
    //Makes parameter array
    if (!tagName)
        tagName = 'div';
    if (typeof tagName == 'string')
        tagName = [tagName];
    //Search
    if (tagName instanceof Array){
        for (var i=0, elementList; i<tagName.length; i++){
            elementList = document.getElementsByTagName(tagName[i]);
            for (var j=0, zIndex; j<elementList.length; j++){
                // zIndex = document.defaultView.getComputedStyle(elementList[j], null).getPropertyValue("z-index");
                zIndex = window.getComputedStyle(elementList[j], null).getPropertyValue("z-index");
                if (zIndex != 'auto'){
                    var parsedZIndex = parseInt(zIndex);
                    if (parsedZIndex > highestIndex)
                        highestIndex = parsedZIndex;
                }
            }
        }
    }else{
        console.log('Could not get highest z-index. because, not good parameter', tagName);
    }
    return highestIndex;
};

//TODO: This is not good. It will be deleted.
CrossMan.Data.prototype.getContextPath = function(){
    var offset=location.href.indexOf(location.host)+location.host.length;
    var ctxPath=location.href.substring(offset,location.href.indexOf('/',offset+1));
    return ctxPath;
};

CrossMan.Data.prototype.random = function(){
    var object = this.data;
    if (!object){
        return Math.random();
    }else if (typeof object == 'object'){ //Array, Object
        var key = this.randomKey();
        return object[key];
    }else{ //Number
        return Math.floor(Math.random() * object);
    }
};

CrossMan.Data.prototype.randomKey = function(){
    var object = this.data;
    if (object instanceof Array){
        var index = Math.floor(Math.random() * object.length);
        return index;
    }else if (typeof object == 'object'){
        var keyList = Object.keys(object);
        var index = Math.floor(Math.random() * keyList.length);
        var key = keyList[index];
        return key;
    }
};

CrossMan.Data.prototype.randomColor = function(){
    var color = '';
    var data = getData([1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']);
    for (var i=0; i<6; i++)
        color += data.random();
    return color;
};

/*****
 * https://stackoverflow.com/a/21963136/12873116
 *****/
CrossMan.Data.lut = [];
for (var i=0; i<256; i++) {
    CrossMan.Data.lut[i] = (i<16?'0':'')+(i).toString(16);
}

CrossMan.Data.prototype.createUUID = function(){
    // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
    // });
    var lut = CrossMan.Data.lut;
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
};



/****************************************************************************************************
 *  StorageMan
 *  Created By sujkim
 ****************************************************************************************************/
CrossMan.Data.prototype.load = function(callback){
    var saveKey = this.saveKey = this.data;
    var value = this.getWithLocalStorage(saveKey);
    if (callback){
        var returnValue = callback(value);
        if (returnValue != null)
            this.data = returnValue;
    }else{
        this.data = value;
    }
    return this;
};

CrossMan.Data.prototype.save = function(value){
    var saveKey = this.saveKey = this.data;
    this.setWithLocalStorage(saveKey, value);
    return this;
};

CrossMan.Data.prototype.getWithLocalStorage = function(saveKey){
    var val = this.getStringWithLocalStorage(saveKey);
    this.data = val;
    if (val && (val.indexOf('[') == 0 || val.indexOf('{') == 0))
        return JSON.parse(val);
    if (val == 'true')
        return true;
    if (val == 'false')
        return false;
    return val;
};
CrossMan.Data.prototype.getStringWithLocalStorage = function(saveKey){
    return localStorage.getItem(saveKey);
};
CrossMan.Data.prototype.getBooleanWithLocalStorage = function(saveKey){
    var val = this.getStringWithLocalStorage(saveKey);
    // - TRUE = true or 'true' // - FALSE = null or false or Any Characters,
    return (val && (val == true || val == 'true'));
};
CrossMan.Data.prototype.getObjWithLocalStorage = function(saveKey){
    var val = this.getStringWithLocalStorage(saveKey);
    return JSON.parse(val);
};
CrossMan.Data.prototype.parseWithLocalStorage = CrossMan.Data.prototype.getObjWithLocalStorage;
CrossMan.Data.prototype.nvlWithLocalStorage = function(key, nvlData){
    var data = this.getWithLocalStorage(key);
    return data == null ? nvlData : data;
};
CrossMan.Data.prototype.setWithLocalStorage = function(saveKey, val){
    if (typeof val == 'string' || typeof val == 'number'){
        localStorage.setItem(saveKey, val);
    }else{
        localStorage.setItem(saveKey, JSON.stringify(val));
    }
};
CrossMan.Data.prototype.addWithLocalStorage = function(saveKey, val){
    //Check before data
    var listItem = this.getWithLocalStorage(saveKey);
    //Push data
    if (listItem && listItem instanceof Array && listItem.length > 0){
        listItem.push(val);
    }else{
        listItem = [val];
    }
    //Check Limit Length
    if (limitLength && listItem.length > limitLength){
        var targetLengthToDelete = (listItem.length - limitLength);
        listItem.splice(0, targetLengthToDelete);
    }
    //Save to LocalStorage
    this.setWithLocalStorage(saveKey, listItem);
    return listItem;
}
CrossMan.Data.prototype.removeWithLocalStorage = function(saveKey){
    localStorage.removeItem(saveKey);
};
CrossMan.Data.prototype.addRecentData = function(saveKey, obj, cnt, isAccum){
    var recentObjList = this.getObjWithLocalStorage(saveKey);
    if (!recentObjList || !recentObjList.splice) recentObjList = [];
    if (!isAccum) CrossMan.Data.removeSameObj(recentObjList, obj);
    recentObjList.splice(0, 0, obj);
    recentObjList.splice(cnt, 1);
    this.set(saveKey, recentObjList);
};
CrossMan.Data.prototype.getRecentData = function(saveKey, cnt){
    var resultList = [];
    var recentObjList = this.getObjWithLocalStorage(saveKey);
    if (recentObjList){
        resultList = recentObjList.splice(0, cnt);
        resultList = (cnt) ? resultList : recentObjList;
    }
    return resultList;
};
CrossMan.Data.removeSameObj = function(recentObjList, targetObj){
    var length = recentObjList.length;
    for (var i=0; i<length; i++){
        var j = length - (i + 1);
        var obj = recentObjList[j];
        var flag = true;
        for (var attr in obj){
            if (obj[attr] != targetObj[attr]) flag = false;
        }
        if (flag) recentObjList.splice(j, 1);
    }
};


/***************************************************************************
 *
 * getClass
 *
 ***************************************************************************/
CrossMan.Clazz = function(ClassFunction){
    this.ClassFunction = ClassFunction;
}
CrossMan.Clazz.prototype.extend = function(SuperClassFunction){
    /** Inheritance **/
    var ClassFunction = this.ClassFunction;
    ClassFunction.prototype = Object.create(SuperClassFunction.prototype);
    ClassFunction.prototype.constructor = ClassFunction;
    return this;
}
CrossMan.Clazz.prototype.returnFunction = function(){
    return this.ClassFunction;
}


/***************************************************************************
 *
 * getXHR
 *
 ***************************************************************************/
CrossMan.XHR = function(url, bodyObject, headerObject){
    this.url = null;
    this.method = CrossMan.XHR.GET;
    this.modeAsync = true;
    this.body = null;
    this.header = null;

    this.setURL(url).setBody(bodyObject).setHeader(headerObject);
};
CrossMan.XHR.GET = 'GET';
CrossMan.XHR.POST = 'POST';
CrossMan.XHR.PUT = 'PUT';
CrossMan.XHR.DELETE = 'DELETE';

CrossMan.XHR.prototype.setURL = function(url){
    this.url = url;
    return this;
};
CrossMan.XHR.prototype.setBody = function(body){
    this.body = body;
    return this;
};
CrossMan.XHR.prototype.setHeader = function(header){
    this.header = header;
    return this;
};
CrossMan.XHR.prototype.setMethod = function(method){
    this.method = method;
    return this;
};
CrossMan.XHR.prototype.setAsync = function(modeAsync){
    this.modeAsync = modeAsync;
    return this;
};
CrossMan.XHR.makeHeaderMap = function(xhr){
    var headerMap = {};
    // Get the raw header string
    var headers = xhr.getAllResponseHeaders();
    // Convert the header string into an array
    // of individual headers
    var headerArray = headers.trim().split(/[\r\n]+/);
    // Create a map of header names to values
    for (var i=0, line; i<headerArray.length; i++){
        line = headerArray[i];
        var parts = line.split(': ');
        var header = parts.shift();
        var value = parts.join(': ');
        headerMap[header] = value;
    }
    return headerMap;
};

CrossMan.XHR.prototype.request = function(callbackWhenSuccess, callbackWhenError, callbackWhenFinally){
    var header = this.header ? this.header : {};
    var body = this.body ? this.body : {};
    var params = body;
    var url = this.url;
    /** Setup Parameter **/
    switch (this.method){
        case CrossMan.XHR.GET:
            // var paramsToRequest = "dummy=" +new Date();
            var paramsToRequest = "";
            for (var propertyName in params){
                var originValue = params[propertyName];
                var propertyValue;
                if (originValue instanceof Array){
                    for (var ii=0; ii<originValue.length; ii++){
                        propertyValue = originValue[ii];
                        if (propertyValue === undefined || propertyValue === null)
                            continue;
                        propertyValue = encodeURIComponent(originValue[ii]);
                        paramsToRequest += ('&' +propertyName+ '=' +propertyValue);
                    }
                }else{
                    propertyValue = originValue;
                    if (propertyValue === undefined || propertyValue === null)
                        continue;
                    propertyValue = encodeURIComponent(originValue);
                    paramsToRequest += ('&' +propertyName+ '=' +propertyValue);
                }
            }
            url += ('?' + paramsToRequest);
            body = null;
            if (!header['Content-Type'])
                header['Content-Type'] = 'application/x-www-form-urlencoded';
            break;
        // case CrossMan.XHR.POST:
        //     break;
        // case CrossMan.XHR.PUT:
        //     break;
        // case CrossMan.XHR.DELETE:
        //     break;
        default:
            body = JSON.stringify(params);
            if (!header['Content-Type'])
                header['Content-Type'] = 'application/json';
            break;
    }
    /** Request **/
    var time = new Date().getTime();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event){
        if (xhr.readyState === xhr.UNSENT) {
            // console.log('... unsent');
        }
        if (xhr.readyState === xhr.OPENED) {
            // console.log('... opened');
        }
        if (xhr.readyState === xhr.HEADERS_RECEIVED) {
            // console.log('... headers received');
        }
        if (xhr.readyState === xhr.LOADING) {
            // console.log('... loading');
        }
    };
    xhr.onload = function(event){
        var elapsedTime = new Date().getTime() - time;
        var readyState = event.target.readyState;
        var status = event.target.status;
        var responseType = event.target.responseType;
        var headerMap = CrossMan.XHR.makeHeaderMap(xhr);
        // console.log('SEND', event, readyState, status, elapsedTime);
        if (readyState === xhr.DONE){
            var data;
            if (responseType == 'APPLICATION/JSON'){
                data = JSON.parse(event.target.responseText);
            }else{
                data = getData(event.target.responseText).parse();
            }
            if (status === 200) {
                if (callbackWhenSuccess)
                    callbackWhenSuccess(data);
            }else{
                if (callbackWhenError)
                    callbackWhenError(event);
            }
        }
        if (callbackWhenFinally)
            callbackWhenFinally();
    };
    //- Open
    xhr.open(this.method, url, this.modeAsync);
    //- Header
    for (var key in header){
        xhr.setRequestHeader(key, header[key]);
    }
    //- Send
    xhr.send(body);
    if (!this.modeAsync){

    }
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
    if (typeof element == 'string' && eventName instanceof Function && !eventFunc){
        eventFunc = eventName;
        eventName = element;
        return this.addEventListenerByEventName(eventName, eventFunc);
    }
    return this.addEventListenerById(element, eventName, eventFunc);
};
SjEvent.prototype.addEventListenerById = function(id, eventName, eventFunc){
    var hasEvent = false;
    var hasId = (id != null);
    var hasEventName = (eventName != null);
    var hasEventFunc = (eventFunc != null);
    if (hasEventFunc){
        if (typeof eventFunc == 'string'){
            eventFunc = new Function('event', eventFunc);
        }
    }

    if (hasId){
        //Get Element ID
        var eventId = '';
        if (id instanceof Element){
            eventId = id.id;
        }else if (typeof id == 'string' && id != ''){
            eventId = id
        }
        //Add Object Event
        if (hasEventName && hasEventFunc){
            if (!this.objectEventMap[eventId])
                this.objectEventMap[eventId] = {};
            this.addEvent(this.objectEventMap[eventId], eventName, eventFunc);
        }
    }else{
        //Add Global Event
        if (hasEventName && hasEventFunc)
            this.addEventListenerByEventName(eventName, eventFunc);
    }

    //Special Event (After Add)
    this.addSpecialEvent(id, eventName);
    return this;
};
SjEvent.prototype.addEventListenerByEventName = function(eventName, eventFunc){
    if (!this.globalEventMap)
        this.globalEventMap = {};
    this.addEvent(this.globalEventMap, eventName, eventFunc);
    return this;
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
    return (arguments.length == 2) ? this.hasEventListenerByEventName.apply(this, arguments) : this.hasEventListenerById.apply(this, arguments);
};
SjEvent.prototype.hasEventListenerById = function(id, eventName, eventFunc){
    var hasEvent = false;
    var hasId = (id != null);
    var hasEventName = (eventName != null);
    var hasEventFunc = (eventFunc != null);
    if (hasId){
        //Get Element ID
        var eventId = '';
        if (id instanceof Element){
            eventId = id.id;
        }else if (typeof id == 'string' && id != ''){
            eventId = id;
        }
        //Check Object Event
        if (hasEventName){
            var eventMapForObject = this.objectEventMap[eventId];
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
SjEvent.prototype.removeEventListener = function(arg1, arg2, arg3){
    return (arguments.length == 2) ? this.removeEventListenerByEventName.apply(this, arguments) : this.removeEventListenerById.apply(this, arguments);
};
SjEvent.prototype.removeEventListenerById = function(id, eventName, eventFunc){
    var result = false;
    var hasId = (id != null);
    var hasEventName = (eventName != null);
    var hasEventFunc = (eventFunc != null);
    if (hasId){
        //Get Element ID
        var eventId = '';
        if (id instanceof Element){
            eventId = id.id;
        }else if (typeof id == 'string' && id != ''){
            eventId = id
        }
        //Remove Object Event
        if (hasEventName && eventId != ''){
            var eventMapForObject = this.objectEventMap[eventId];
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
    //Exec Global Event
    var resultForGlobal = this.execEvent(this.globalEventMap, eventName, event);
    //Exec Object Event
    var resultForObject = this.execEventListenerById(element, eventName, event);
    return (resultForGlobal || resultForObject);
};
SjEvent.prototype.execEventListenerById = function(id, eventName, event){
    var resultForObject;
    //Exec Object Event
    if (id != null){
        //Get Element ID
        var eventId = '';
        if (id instanceof Element){
            eventId = id.id;
        }else if (typeof id == 'string' && id != ''){
            eventId = id
        }
        //Exec Event
        if (eventId != '')
            resultForObject = this.execEvent(this.objectEventMap[eventId], eventName, event);
    }
    return resultForObject;
};
SjEvent.prototype.execEventListenerByEventName = function(eventName, event){
    var resultOnGlobal;
    var resultOnObject;
    //Exec Global Event
    resultOnGlobal = this.execEvent(this.globalEventMap, eventName, event);
    //Exec All Object Event
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
    if (!eventMap)
        return result;
    var eventList = eventMap[eventNm];
    if (eventList){
        for (var i=0; i<eventList.length; i++){
            result = eventList[i](event);
        }
    }
    return result;
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
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
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









/***************************************************************************
 * [Node.js] exports
 ***************************************************************************/
try{
    module.exports = exports = {
        /** Start **/
        ready:ready,
        /** Class **/
        getClass:getClass,
        /** Element **/
        getEl:getEl,
        newEl:newEl,
        searchEl:searchEl,
        cloneEl:cloneEl,
        forEl:forEl,
        ifEl:ifEl,
        /** Data **/
        getData:getData,
        cloneData:cloneData,
        /** XHR **/
        getXHR:getXHR,
        postXHR:postXHR,
        putXHR:putXHR,
        deleteXHR:deleteXHR,
        /** Event **/
        SjEvent:SjEvent
    };
}catch(e){}
