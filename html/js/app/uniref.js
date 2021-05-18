

function AppUniRef(network) {
    this.network = network;
}

AppUniRef.prototype.getUniRefVersion = function(useCurrent = true) {
    if (useCurrent) {
        var size = this.network.getCurrentSizes(this.network.Id);
        var hasUniRef50 = size.uniref50 > 0;
        return hasUniRef50 ? 50 : 90;
    }
    var kids = this.network.getRegions();
    if (kids.length == 0) {
        kids = this.network.getChildren();
    }
    var hasUniRef50 = false;
    if (kids.length > 0) {
        var size = this.network.getSizes(kids[kids.length-1].id);
        hasUniRef50 = size.uniref50 > 0;
    }
    return hasUniRef50 ? 50 : 90;
}

