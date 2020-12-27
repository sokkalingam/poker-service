var MyClass = /** @class */ (function () {
    function MyClass() {
    }
    MyClass.prototype.sayHello = function () {
        return "Hello";
    };
    return MyClass;
}());
var myClass = new MyClass();
console.log(myClass.sayHello());
