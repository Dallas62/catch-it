

function errorFunc() {
    variableError++;
}

setTimeout(function() {
    errorFunc();
}, 650);

setInterval(function() {
    errorFunc();
}, 6500);