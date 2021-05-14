

function parseNetworkJson(json) {
    try {
        var data = JSON.parse(json);
        return data;
    } catch (e) {
        console.log("Invalid data (" + json + ")");
        console.log(e);
        return false;
    }
}
function Network(networkId, networkData) {
    this.Id = networkId;
    this.data = networkData.cluster;
    if (typeof this.data === "undefined")
        this.data = {};
    this.network_map = networkData.network_map;
    this.sfld_map = networkData.sfld_map;
    this.sfld_desc = networkData.sfld_desc;
    this.enzymecodes = networkData.enzymecodes;
    this.dataDir = this.data.dir;
    if (typeof this.data.public === "undefined")
        this.data.public = {};
    if (typeof this.data.families === "undefined")
        this.data.families = {};
}
Network.prototype.getAlignmentScore = function() {
    //DEBUG:
    //this.data.alignment_score = "22";
    return typeof this.data.alignment_score !== "undefined" ? this.data.alignment_score : "";
}
Network.prototype.getDefaultAlignmentScore = function() {
    //DEBUG:
    //this.data.default_alignment_score = "11";
    return typeof this.data.default_alignment_score !== "undefined" ? this.data.default_alignment_score : "";
}
Network.prototype.getPageTitle = function() {
    return typeof this.data.title !== "undefined" ? this.data.title : "Title";
}
Network.prototype.getDescription = function() {
    return typeof this.data.desc !== "undefined" ? this.data.desc : "";
}
Network.prototype.getName = function() {
    return typeof this.data.name !== "undefined" ? this.data.name : "family";
}
Network.prototype.getImage = function() {
    return this.data.image;
}
Network.prototype.getSubgroups = function() {
    return Array.isArray(this.data.subgroups) ? this.data.subgroups : [];
}
Network.prototype.getRegions = function() {
    return Array.isArray(this.data.regions) ? this.data.regions : [];
}
Network.prototype.getChildren = function() {
    return Array.isArray(this.data.children) ? this.data.children : [];
}
Network.prototype.getTigr = function() {
    return Array.isArray(this.data.families.tigr) ? this.data.families.tigr : [];
}
Network.prototype.getDicedParent = function() {
    return (typeof this.data.dicing !== "undefined" && typeof this.data.dicing.parent !== "undefined") ? this.data.dicing.parent : "";
}
Network.prototype.getDicedChildren = function() {
    return (typeof this.data.dicing !== "undefined" && Array.isArray(this.data.dicing.children)) ? this.data.dicing.children : [];
}
Network.prototype.getDicedNav = function(isParent = false) {
    var nav = {};
    if (isParent) {
        nav.ascores = this.data.alt_ssn;
        nav.siblings = {};
        nav.children = this.data.dicing.children;
    } else {
        if (typeof this.data.dicing.parent_ascores === "undefined" || typeof this.data.dicing.siblings === "undefined")
            return {};
        nav.ascores = this.data.dicing.parent_ascores;
        nav.siblings = this.data.dicing.siblings;
    }
    return nav;
}
Network.prototype.getAltSsns = function() {
    return (typeof this.data.alt_ssn !== "undefined" && Array.isArray(this.data.alt_ssn)) ? this.data.alt_ssn : [];
}
Network.prototype.getNextAscore = function() {
    var ascores = this.getAltSsns();
    if (ascores.length)
        return ascores[0];
    else
        return "";
}
Network.prototype.getConsensusResidues = function() {
    if (typeof this.data.cons_res !== "undefined") {
        return this.data.cons_res;
    } else {
        return false;
    }
}
Network.prototype.getConsensusResiduesFiles = function() {
    if (typeof this.data.cons_res_files !== "undefined" && Array.isArray(this.data.cons_res_files)) {
        return this.data.cons_res_files;
    } else {
        return [];
    }
}
Network.prototype.getDataDir = function() {
    return typeof this.dataDir !== "undefined" ? this.dataDir : "data";
}
// Since there are potentially many KEGG IDs, we get the list of IDs async.
Network.prototype.hasKeggIds = function() {
    // The number of KEGG IDs is returned with the network JSON, but not the ID list.
    return typeof this.data.public.has_kegg !== "undefined" ? this.data.public.has_kegg : false;
}
// ASYNC
Network.prototype.getKeggIds = function(version, addKeggIdFn, finishFn) {
    var parms = {a: "kegg", cid: this.Id};
    var ascore = this.getAlignmentScore();
    if (ascore)
        parms.as = ascore;
    if (version)
        parms.v = version;
    $.get("getdata.php", parms, function(dataStr) {
        var data = false;
        try {
            data = JSON.parse(dataStr);
        } catch (e) {
            console.log("Invalid kegg data (" + dataStr + ")");
            console.log(e);
            data = false;
        }
        if (data.valid) {
            for (var i = 0; i < data.kegg.length; i++) {
                addKeggIdFn(data.kegg[i]);
            }
        }
        finishFn();
    });
}
Network.prototype.getSizes = function(netId) {
    if (netId && typeof this.network_map[netId] !== "undefined") {
        return this.network_map[netId].size;
    } else {
        return 0;
    }
}
Network.prototype.getCurrentSizes = function() {
    if (typeof this.data.size !== "undefined" && this.data.size.uniprot > 0) {
        return this.data.size;
    } else {
        return false;
    }
}
Network.prototype.getConvRatio = function() {
    if (typeof this.data.conv_ratio !== "undefined") {
        return this.data.conv_ratio;
    } else {
        return false;
    }
}
Network.prototype.getDicedWalkthrough= function() {
    if (typeof this.data.dicing.dnav !== "undefined") {
        return this.data.dicing.dnav;
    } else {
        return false;
    }
}
Network.prototype.getSwissProtFunctions = function () {
    return Array.isArray(this.data.public.swissprot) ? this.data.public.swissprot : [];
}
Network.prototype.getPdb = function () {
    return Array.isArray(this.data.public.pdb) ? this.data.public.pdb: [];
}
Network.prototype.getEnzymeCodes = function () {
    return typeof this.enzymecodes !== "undefined" ? this.enzymecodes : {};
}
Network.prototype.getDisplayFeatures = function () {
    return typeof this.data.display !== "undefined" ? this.data.display : {};
}
Network.prototype.getDownloadFeatures = function () {
    return typeof this.data.download !== "undefined" ? this.data.download : {};
    //return Array.isArray(this.data.download) ? this.data.download : [];
}
// Needed for breadcrumb and other things
Network.prototype.getNetworkMapName = function (networkId) {
    return typeof this.network_map[networkId] !== "undefined" ? this.network_map[networkId].name : networkId;
}
Network.prototype.getNetworkSfldTitle = function (networkId) {
    if (typeof this.network_map[networkId] !== "undefined" && typeof this.network_map[networkId].sfld_title !== "undefined")
        return this.network_map[networkId].sfld_title;
    else
        return "";
}
Network.prototype.getSfldDesc = function () {
    return this.data.sfld_desc;
}
Network.prototype.getSfldId = function () {
    return this.data.sfld_id;
}
// Needed for display of clusters that have children
Network.prototype.getSfldDescForClusterId = function (id) {
    return typeof this.sfld_desc[id] !== "undefined" ? this.sfld_desc[id].desc : "";
}
// Needed for display of clusters that have children
Network.prototype.getSfldColor = function (id) {
    return typeof this.sfld_desc[id] !== "undefined" ? this.sfld_desc[id].color : "";
}
// Needed for display of clusters that have children
Network.prototype.getSfldIds = function (cid) {
    return typeof this.sfld_map[cid] !== "undefined" ? this.sfld_map[cid] : [];
}
Network.prototype.getGndKey = function () {
    return typeof this.data.gnd_key !== "undefined" ? this.data.gnd_key : "";
}

