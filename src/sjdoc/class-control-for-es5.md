# Class Cotntrol for ES5

- How to extends other class
    ```js
    /*************************
     * Super Class
     *************************/
    function SuperClassFunction(){
        this.var1 = 1;
        this.var2 = 2;
    }
    TargetFunction.prototype.doSome1 = function(){
        console.log(this.var1);
    };
    TargetFunction.prototype.doSome2 = function(){
        console.log(this.var2);
    };
    
    /*************************
     * Target Class
     *************************/
    function TargetFunction(){
        SuperClassFunction.apply(this, arguments);
        this.var3 = 3;
        this.var4 = 4;
    }
    TargetFunction.prototype.doSome3 = function(){
        console.log(this.var3);
    };
    
    //Inheritance
    getClass(TargetFunction).extend(SuperClassFunction);
    
    //Make a instance
    var tf = new TargetFunction();
    
    //Test
    tf.doSome1();
    tf.doSome2();
    tf.doSome3();
    ```
- Result
    ```
    1
    2
    3
    ```