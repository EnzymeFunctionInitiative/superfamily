
function AppImage(appData, appMeta, progress, url) {
    this.appData = appData;
    this.appMeta = appMeta;
    this.progress = progress;
    this.url = url;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE IMAGE ELEMENTS
// 
AppImage.prototype.setClusterImage = function (onFinishFn) {
    var img = $("#clusterImg");
    var fileName = this.appData.getImage();
    var that = this;
    if (Array.isArray(fileName))
        ;//TODO:
    else
        img
            .attr("src", this.appMeta.DataDir + "/" + fileName + "_sm.png")
            .on("load", function () { that.addClusterHotspots(img); that.progress.stop(); onFinishFn(); })
            .on("error", function () { that.progress.stop(); });
    $("#downloadClusterImage").click(function (e) {
        e.preventDefault();
        window.location.href = that.url.getDownloadUrl("net");
    });
}
AppImage.prototype.setDicedClusterImage = function (dicedParent, onFinishFn) {
    var that = this;
    var imgPath = this.appMeta.DataDir + "/../" + dicedParent;
    $("#parentImg").attr("src", imgPath + "_sm.png");
    $("#dicedParentImg").show();
    $("#toggleParentImg").click(function() {
        if (!$(this).data("hidden") || $(this).data("hidden") == false) {
            $("#toggleParentImgIcon").removeClass("fa-chevron-circle-up").addClass("fa-chevron-circle-down");
            $("#toggleParentImgText").text("Show");
            $("#parentImg").removeClass("w-50").addClass("h-70px");
            $(this).data("hidden", true);
        } else {
            $("#toggleParentImgIcon").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-up");
            $("#toggleParentImgText").text("Hide");
            $("#parentImg").removeClass("h-70px").addClass("w-50");
            $(this).data("hidden", false);
        }
    });
    $("#downloadDicedParentImage").click(function (e) {
        e.preventDefault();
        window.location.href = that.url.getDownloadUrl("net", dicedParent);
    });
}
// This should be called on the image
AppImage.prototype.addClusterHotspots = function (img) {
    var parent = img.parent();
    var w = img.width() / 100;
    var h = img.height() / 100;
    var that = this;
    var imgmap = $('<map name="clusterHotspotMap" id="clusterHotspotMap"></map>');
    $.each(this.appData.getRegions(), function (i, data) {
        var coords = [data.coords[0] * w, data.coords[1] * h, data.coords[2] * w, data.coords[3] * h];
        var coordStr = coords.join(",");
        var shape = $('<area shape="rect" coords="' + coordStr + '" id="cluster-region-' + data.id + '" href="' + getUrlFn(data.id, that.appMeta.Version) + '">');
        shape
            .click(function () {
                goToUrlFn(data.id, that.appMeta.Version);
            })
            .mouseover(function () {
                $("#cluster-num-text-" + data.id).css({ color: "red", "text-decoration": "underline" });
            }).mouseout(function () {
                $("#cluster-num-text-" + data.id).css({ color: "inherit", "text-decoration": "inherit" });
            });
        imgmap.append(shape);
    });
    parent.append(imgmap);
    img.attr("usemap", "#clusterHotspotMap");
    img.maphilight();
    //imgmap.imageMapResize();
}
AppImage.prototype.addClusterNumbers = function (parent) {
    var pw = parent.width();
    var width = $("#clusterImg").width() + "px";
    var padding = -1;
    $("#clusterNums").removeClass("w-100").css({width: width});
    $.each(this.appData.getRegions(), function (i, data) {
        var theName = data.coords[1] == 0 ? data.name : "";
        var obj = $('<span id="cluster-num-text-' + data.id + '">' + theName + "</span>");
        parent.append(obj);
        // Calculate the width of the text to properly align text for small clusters
        var offset = (obj.width() / pw * 100 / 2) + padding;
        var pos = data.coords[0] + (data.coords[2] - data.coords[0]) / 2 - offset;
        obj.css({
            position: "absolute",
            top: "0px",
            left: pos + "%"
        });
    });
    $("#clusterNums").show();
}

