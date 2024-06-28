

function AppUniRef(network) {
    this.network = network;
}

AppUniRef.prototype.getUniRefVersion = function(useCurrent = true) {
    // Use the currently-viewed cluster
    if (useCurrent) {
        var size = this.network.getSize();
        var hasUniRef50 = size.uniref50 > 0;
        return hasUniRef50 ? 50 : 90;
    }

    // Look at the last child cluster value and determine the UniRef version from that.
    var kids = this.network.getRegions();
    if (kids.length == 0) {
        kids = this.network.getChildren();
    }
    var hasUniRef50 = false;
    if (kids.length > 0) {
        hasUniRef50 = kids[kids.length-1].size.uniref50 > 0;
    }

    return hasUniRef50 ? 50 : 90;
}

