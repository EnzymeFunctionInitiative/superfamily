

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
function AppData(networkId, networkData) {
    this.Id = networkId;
    this.data = networkData.cluster;
    if (typeof this.data === "undefined")
        this.data = {};
    this.subgroup_map = typeof networkData.subgroup_map !== "undefined" ? networkData.subgroup_map : [];;
    this.enzymecodes = networkData.enzymecodes;
    this.breadcrumb = networkData.breadcrumb;
    this.dataDir = this.data.dir;
    this.is_diced = typeof this.data.dicing.parent !== "undefined" && this.data.dicing.parent.length > 0;
    if (typeof this.data.public === "undefined")
        this.data.public = {};
    if (typeof this.data.families === "undefined")
        this.data.families = {};
}
AppData.prototype.getAlignmentScore = function() {
    //DEBUG:
    //this.data.alignment_score = "22";
    return typeof this.data.alignment_score !== "undefined" ? this.data.alignment_score : "";
}
AppData.prototype.getClusterTitle = function() {
    return typeof this.data.cluster_title !== "undefined" ? this.data.cluster_title : "";
}
AppData.prototype.getDescription = function() {
    return typeof this.data.desc !== "undefined" ? this.data.desc : "";
}
AppData.prototype.getName = function() {
    return typeof this.data.cluster_name !== "undefined" ? this.data.cluster_name : "family";
}
AppData.prototype.getImage = function() {
    return this.data.image;
}
AppData.prototype.getRegions = function() {
    return Array.isArray(this.data.regions) ? this.data.regions : [];
}
AppData.prototype.getChildren = function() {
    return Array.isArray(this.data.children) ? this.data.children : [];
}
AppData.prototype.getUniRefVersion = function() {
    return typeof this.data.uniref_version !== "undefined" ? this.data.uniref_version : 0;
}
AppData.prototype.getTigr = function() {
    return Array.isArray(this.data.families.tigr) ? this.data.families.tigr : [];
}
AppData.prototype.getIsDiced = function() {
    return this.is_diced;
}
AppData.prototype.getDicedParent = function() {
    var parentId = "";
    var defaultId = "";
    var parentImage = "";
    if (typeof this.data.dicing !== "undefined") {
        if (typeof this.data.dicing.parent !== "undefined")
            parentId = this.data.dicing.parent;
        if (typeof this.data.dicing.default_subcluster !== "undefined")
            defaultId = this.data.dicing.default_subcluster;
        if (typeof this.data.dicing.parent_image !== "undefined")
            parentImage = this.data.dicing.parent_image;
    }
    if (parentId && defaultId)
        return {parent: parentId, default: defaultId, parent_image: parentImage};
    else
        return parentId;
}
AppData.prototype.getDicedChildren = function() {
    return (typeof this.data.dicing !== "undefined" && Array.isArray(this.data.dicing.children)) ? this.data.dicing.children : [];
}
AppData.prototype.getDicedNav = function(isParent = false) {
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
AppData.prototype.getAltSsns = function() {
    return (typeof this.data.alt_ssn !== "undefined" && Array.isArray(this.data.alt_ssn)) ? this.data.alt_ssn : [];
}
AppData.prototype.getNextAscore = function() {
    var ascores = this.getAltSsns();
    if (ascores.length)
        return ascores[0];
    else
        return "";
}
AppData.prototype.getConsensusResidues = function() {
    if (typeof this.data.cons_res !== "undefined") {
        return this.data.cons_res;
    } else {
        return false;
    }
}
AppData.prototype.getConsensusResiduesFiles = function() {
    if (typeof this.data.cons_res_files !== "undefined" && Array.isArray(this.data.cons_res_files)) {
        return this.data.cons_res_files;
    } else {
        return [];
    }
}
AppData.prototype.getDataDir = function() {
    return typeof this.dataDir !== "undefined" ? this.dataDir : "data";
}
// Since there are potentially many KEGG IDs, we get the list of IDs async.
AppData.prototype.hasKeggIds = function() {
    // The number of KEGG IDs is returned with the network JSON, but not the ID list.
    return typeof this.data.public.has_kegg !== "undefined" ? this.data.public.has_kegg : false;
}
// ASYNC
AppData.prototype.getKeggIds = function(version, addKeggIdFn, finishFn) {
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
// Since there are potentially many Alphafold IDs, we get the list of IDs async.
AppData.prototype.hasAlphafoldIds = function() {
    // The number of Alphafold IDs is returned with the network JSON, but not the ID list.
    return typeof this.data.public.has_alphafolds !== "undefined" ? this.data.public.has_alphafolds : false;
}
// ASYNC
AppData.prototype.getAlphafoldIds = function (version, onReceiveDataFn, finishFn) {
    //return Array.isArray(this.data.public.alphafolds) ? this.data.public.alphafolds : [];
    var parms = {a: "alphafolds", cid: this.Id};
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
            console.log("Invalid alphafolds data (" + dataStr + ")");
            console.log(e);
            data = false;
        }
        if (data.valid) {
            onReceiveDataFn(data.alphafolds);
        }
        finishFn();
    });
}
AppData.prototype.getSize = function() {
    if (this.data.size.uniprot > 0) {
        return this.data.size;
    } else {
        return false;
    }
}
AppData.prototype.getConvRatio = function() {
    if (typeof this.data.conv_ratio !== "undefined") {
        return this.data.conv_ratio;
    } else {
        return false;
    }
}
AppData.prototype.getDicedWalkthrough= function() {
    if (typeof this.data.dicing.dnav !== "undefined") {
        return this.data.dicing.dnav;
    } else {
        return false;
    }
}
AppData.prototype.getSwissProtFunctions = function () {
    return Array.isArray(this.data.public.swissprot) ? this.data.public.swissprot : [];
}
AppData.prototype.getPdb = function () {
    return Array.isArray(this.data.public.pdb) ? this.data.public.pdb: [];
}
AppData.prototype.getAnno = function () {
    return Array.isArray(this.data.public.anno) ? this.data.public.anno: [];
}
AppData.prototype.getEnzymeCodes = function () {
    return typeof this.enzymecodes !== "undefined" ? this.enzymecodes : {};
}
AppData.prototype.getDisplayFeatures = function () {
    return typeof this.data.display !== "undefined" ? this.data.display : {};
}
AppData.prototype.getDownloadFeatures = function () {
    return typeof this.data.download !== "undefined" ? this.data.download : {};
    //return Array.isArray(this.data.download) ? this.data.download : [];
}
AppData.prototype.getSubgroupDesc = function () {
    return this.data.cluster_desc;
}
AppData.prototype.getSubgroups = function () {
    return this.subgroup_map;
}
AppData.prototype.getGndKey = function () {
    return typeof this.data.gnd_key !== "undefined" ? this.data.gnd_key : "";
}
AppData.prototype.getBreadcrumb = function () {
    return this.breadcrumb;
}


