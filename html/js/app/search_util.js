

function SearchUtil() {
    this.colors = generateColor("#ff0000", "#000000", 15);
}


SearchUtil.prototype.getVersion = function() {
    var v = $("#version").val();
    return v;
};

SearchUtil.prototype.getColor = function(val) {
    if (val >= 1)
        return this.colors[this.colors.length-1];
    var idx = Math.floor(val * this.colors.length);
    return this.colors[idx];
};

SearchUtil.prototype.getResultsUrl = function(id, ascore = "") {
    var v = this.getVersion();
    var parms = ["id="+id, "v="+v];
    if (ascore)
        parms.push("as="+ascore);
    var url = "explore.php?" + parms.join("&");
    return url;
};


SearchUtil.prototype.getNetInfo = function(version, onFinish) {
    $.get("getdata.php", {a: "netinfo", v: version}, function (netDataStr) {
        // Comes from app_data.js
        var netData = parseNetworkJson(netDataStr);
        var network;
        if (netData !== false) {
            if (netData.valid) {
                network = new AppData("", netData);
            }
        }
        if (network) {
            onFinish(network);
        }
    });
}
