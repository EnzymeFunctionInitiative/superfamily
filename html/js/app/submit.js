
var getPageClusterId = function () {
	var paramStr = window.location.search.substring(1);
	var params = paramStr.split("&");
	var reqId = "";
	for (var i = 0; i < params.length; i++) {
		var parts = params[i].split("=");
		if (parts[0] === "id")
			reqId = parts[1];
	}
	if (reqId)
		return reqId;
	else
		return "";
};

$(document).ready(function () {
    var clusterId = getPageClusterId();
    if (clusterId)
        $("#inputClusterId").val(clusterId);

    var postSubmitPage = "submit_ok.php";
    validateForm(postSubmitPage); // Comes from forms.js
});

