describe("Util class", function () {
    var json, error;

    beforeAll(function (done) {
        var url;
        url = "https://public-api.wordpress.com/rest/v1.1/sites/98941271/posts/?search=json&number=1&fields=title,content";
        util.ajax(url, function (err, data) {
            //console.log(err);
            error = err;
            json = data;
            console.log(json);
            done();
        }); 
    });

    it ("should return a json", function (done) {
        expect(error).toBe(null);
        expect(json).toBeDefined();
        done();
    });

});
