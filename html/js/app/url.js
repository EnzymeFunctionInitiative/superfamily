

function AppUrl(appMeta) {
    this.appMeta = appMeta;
}

AppUrl.prototype.getDownloadUrl = function(type, networkId = "") {
    if (!networkId)
        networkId = this.appMeta.Id;
    var extPos = type.indexOf(".");
    if (extPos >= 0)
        type = type.substr(0, extPos);
    //this.dataDir + "/weblogo.png"
    var url = "download.php?c=" + networkId + "&t=" + type;
    if (this.appMeta.Version)
        url += "&v=" + this.appMeta.Version;
    if (this.appMeta.Ascore)
        url += "&as=" + this.appMeta.Ascore;
    return url;
}

AppUrl.prototype.getGndUrl = function (gndParams) {
    return this.appMeta.GndUrl + "?" + gndParams;
}

