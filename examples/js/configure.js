
var cit = new CatchIt({
    VERSION: '0.0.0'
});

cit.onError(function(error, extra) {
    console.log('Error happened on Version', extra.VERSION);
    console.log(error);
});