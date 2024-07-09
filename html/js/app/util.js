

////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
//
function applyRowClickableFn(version) {
    $(".row-clickable tr")
        .mouseover(function () {
            $("#cluster-region-" + $(this).data("node-id")).mouseover();
        })
        .mouseout(function () {
            $("#cluster-region-" + $(this).data("node-id")).mouseout();
        })
        .click(function () {
            var id = $(this).data("node-id");
            var alignmentScore = $(this).data("alignment-score");
            if (!alignmentScore)
                alignmentScore = "";
            goToUrlFn(id, version, alignmentScore);
        });
}
function getPageClusterId(defaultVersion) {
    var paramStr = window.location.search.substring(1);
    var params = paramStr.split("&");
    var reqId = "", version = defaultVersion, as = "", dicedList = false;
    for (var i = 0; i < params.length; i++) {
        var parts = params[i].split("=");
        if (parts[0] === "id")
            reqId = parts[1];
        else if (parts[0] === "v")
            version = parts[1];
        else if (parts[0] === "as")
            as = parts[1];
        else if (parts[0] === "d" && parts[1] === "l")
            dicedList = true;
    }
    //TODO: validate version
    var data = {network_id: "", version: version}
    if (reqId)
        data.network_id = reqId;
    if (!isNaN(as))
        data.alignment_score = as;
    data.show_diced_list_page = dicedList;
    return data;
}
function getUrlFn(id, version, alignmentScore = "") {
    var url = "?id=" + id + "&v=" + version;
    if (alignmentScore)
        url += "&as=" + alignmentScore;
    return url;
}
function goToUrlFn(id, version, alignmentScore = "") {
    window.location = getUrlFn(id, version, alignmentScore);
}
function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function copyToClipboard(id) {
    $("#"+id).show().select();
    document.execCommand("copy");
    $("#"+id).hide();
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function commify(num) {
    return parseInt(num).toLocaleString();
}

