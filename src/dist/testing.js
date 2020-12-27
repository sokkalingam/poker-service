var Testing = /** @class */ (function () {
    function Testing() {
    }
    Testing.hasStraight = function () {
        var result = new Array();
        var nums = [5, 4, 3, 2, 1];
        var counter = 0;
        for (var i = 0; i < nums.length; i++) {
            var prev = nums[i];
            for (var j = i + 1; j < nums.length; j++) {
                if (prev - nums[j] != 0) {
                    i = j;
                    counter = 0;
                }
                else {
                    counter++;
                    if (counter === 5) {
                        for (var k = i; k < nums.length; k++) {
                            result.push(nums[k]);
                            return result;
                        }
                    }
                }
            }
        }
        return result;
    };
    return Testing;
}());
console.log(Testing.hasStraight());
