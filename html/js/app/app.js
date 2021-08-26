
const DEFAULT_VERSION = "3.0";

// Extend the jQuery API for data available buttons
$(document).ready(function () {
    $(".copy-btn").click(function(e) {
        var id = $(this).data("id");
        if (id)
            copyToClipboard(id);
    });

    $.fn.extend({
        enableDataAvailableButton: function () {
            $(this).removeClass("btn-outline-secondary").addClass("btn-secondary").removeClass("disabled");
        },
    });
});

function initApp(version, gndKey) {
    var requestData = getPageClusterId();
    var requestId = "", alignmentScore = "";
    //HACK
    if (!requestData.network_id)
        requestId = "fullnetwork";
    else
        requestId = requestData.network_id;
    if (requestData.alignment_score)
        alignmentScore = requestData.alignment_score;
    version = requestData.version;
    var app = new App(version);
    var args = {a: "cluster", cid: requestId, v: version};
    if (alignmentScore)
        args["as"] = alignmentScore;

    $.get("getdata.php", args, function (dataStr) {
        var data = parseNetworkJson(dataStr);
        if (data !== false) {
            if (data.valid) {
                if (typeof data.cluster !== "undefined" && typeof data.cluster.REDIRECT !== "undefined") {
                    goToUrlFn(data.cluster.REDIRECT.cluster_id, version, data.cluster.REDIRECT.as);
                } else {
                    var appData = new AppData(requestId, data);
                    app.init(appData, gndKey, requestData.show_diced_list_page);
                }
            } else {
                app.responseError(data.message);
            }
        } else {
            app.invalidNetworkJsonError(dataStr);
        }
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// APP CLASS FOR POPULATING THE UI
// 
function App(version) {
    this.appMeta = new AppMeta();
    this.appMeta.Version = version;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// ERROR HANDLING/UI
//
App.prototype.responseError = function(msg) {
    $("#loadError").text(msg).show();
}
App.prototype.invalidNetworkJsonError = function() {
    $("#loadError").text("An application error occurred (invalid data in response).").show();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// INITIALIZE/STARTUP
//
App.prototype.init = function(appData, gndKey, showDicedListPage) {
    this.appMeta.Id = appData.Id;
    this.appMeta.GndKey = gndKey;
    this.appMeta.Ascore = appData.getAlignmentScore();
    this.appMeta.DataDir = appData.getDataDir();

    this.appData = appData;

    this.url = new AppUrl(this.appMeta);
    this.uniref = new AppUniRef(this.appData);

    this.dataFeat = new AppDataFeatures(this.appData, this.appMeta, this.url);
    this.diced = new AppDiced(this.appData, this.appMeta, this.dataFeat);
    this.sunburst = new AppSunburst(this.appData, this.appMeta, this.uniref);

    var hasRegions = this.appData.getRegions().length > 0;
    var hasChildren = this.appData.getChildren().length > 0;
    var isLeaf = !hasRegions && !hasChildren;

    this.progress = new Progress($("#progressLoader"));
    this.progress.start();

    this.setPageHeaders();
    var nav = new AppNav(this.appData, this.appMeta);
    nav.addBreadcrumb();

    this.image = new AppImage(this.appData, this.appMeta, this.progress, this.url);

    var ascores = this.appData.getAltSsns();

    if (showDicedListPage) {
        this.initDicedListPage(ascores);
    } else {
        var hideInfoForDiced = false;
        // This shows the main diced image and page.
        if (ascores.length > 0) {
            this.initMasterDicedPage(ascores);
            this.diced.addDicedNav(true); // true = this is a parent diced cluster
            hideInfoForDiced = true;
        }
        this.initClusterPage(isLeaf, hideInfoForDiced);
    }

    this.initUi();
}


App.prototype.initMasterDicedPage = function(ascores) {
    var nextAs = this.appData.getNextAscore();
    this.diced.addAscoreTabs();
    this.diced.initDicedDescText(nextAs);

    var theUrl = getUrlFn(this.appMeta.Id, this.appMeta.Version, this.appMeta.Ascore);
    theUrl += "&d=l";
    $("#dicedListLink").attr("href", theUrl);

    //if (this.appMeta.Ascore)
    //    $("#dicedAscoreListImageDesc").show();

    $("#dicedClusterDesc").show();
    $("#downloadContainer").show();
    $("#dicedAscoreListOverview").show();
    $("#dicedDiceIncrements").text(ascores.join(", "));
    $("#dicedNumDicings").text(ascores.length);
}


App.prototype.initDicedListPage = function(ascores) {
    this.dataFeat.addClusterSize("dicedAscoreListClusterSize");

    var nextAs = this.appData.getNextAscore();
    this.diced.initDicedDescText(nextAs);
    this.diced.initDicedSsnOverview(ascores);
    
    var theUrl = getUrlFn(this.appMeta.Id + "-1", this.appMeta.Version, nextAs);
    console.log(theUrl);
    $("#dicedDescNextAsLink").attr("href", theUrl);


    $("#dicedAscoreListContainer").show();

    this.progress.stop();
}


App.prototype.initClusterPage = function(isLeaf, hideInfoForDiced) {
    var that = this;

    $("#clusterDataOverviewContainer").show();
    
    var addClusterNumbersFn = function() {
        if (!isLeaf)
            that.image.addClusterNumbers($("#clusterNums"));
    };
    this.image.setClusterImage(addClusterNumbersFn);

    if (this.appMeta.Id != "fullnetwork") {
        this.dataFeat.addTigrFamilies();
        this.dataFeat.checkForKegg();
        this.initLeafPage(hideInfoForDiced);
    } else {
        this.dataFeat.addClusterSize("clusterSize");
    }

    if (this.appMeta.Id == "fullnetwork")
        $(".fullnetwork-text").show();

    // Still more stuff to zoom in to
    if (!isLeaf)
        this.initSubGroupPage();
    if (this.appMeta.Id != "fullnetwork") {
        this.dataFeat.addDownloadFeatures("downloads")
        $("#downloadContainer").show();
    }
    // If this is a child of a diced network...
    var dicedParent = this.appData.getDicedParent();
    if (dicedParent) {
        $("#dicedImageContainer").show();
        this.diced.addDicedNav();
        this.image.setDicedClusterImage(dicedParent, function() {});
    }
}


// Add information to the placeholders.
App.prototype.initLeafPage = function(hideInfoForDiced = false) {
    var hasData = this.dataFeat.addDisplayFeatures();
    this.dataFeat.addClusterSize("clusterSize");
    if (!hideInfoForDiced) {
        this.dataFeat.addConsRes();
        this.dataFeat.addConvRatio();
    }
    if (hasData) {
        this.dataFeat.addSwissProtFunctions();
        this.dataFeat.addPdb();
        this.dataFeat.addAnno();
        if (!hideInfoForDiced)
            this.dataFeat.addGndFeature();
        this.sunburst.addSunburstFeature();
        $("#displayFeatures").show();
        $("#dataAvailable").show();
    }
    $("#submitAnnoLink").attr("href", $("#submitAnnoLink").attr("href") + "?id=" + this.appMeta.Id);
}


App.prototype.initSubGroupPage = function() {
    var clusterTableDiv = $('<div id="clusterTable"></div>');
    this.addSubgroupTable(clusterTableDiv);
    $("#subgroupTable").append(clusterTableDiv);
    $("#subgroupTable").show();
}


// Add a table of all of the clusters that derive from the current view.
App.prototype.addSubgroupTable = function (div) {
    var table = $('<table class="table table-hover w-auto"></table>');

    var that = this;

    var kids = this.appData.getRegions();
    if (kids.length == 0)
        kids = this.appData.getChildren();

    if (kids.length == 0)
        return;

    var hasUniRef50 = this.uniref.getUniRefVersion(false) == 50 ? true : false;

    var headHtml = '<thead><tr class="text-center"><th>Cluster</th>';
    if (this.appMeta.Id != "fullnetwork") //TODO: HACK
        headHtml += '<th>SFLD Subgroup</th>';
    headHtml += '<th>UniProt</th><th>UniRef90</th>' + (hasUniRef50 ? '<th>UniRef50</th>' : '') + '</tr></thead>';
    var head = table.append(headHtml);
    var body = table.append('<tbody class="row-clickable text-center"></tbody>');

    $.each(kids, function (i, data) {
        var row = $('<tr data-node-id="' + data.id + '"></tr>');
        var size = that.appData.getSizes(data.id);
        var sfldIds = that.appData.getSfldIds(data.id);
        var sfldDesc = that.appData.getNetworkSfldTitle(data.id);
        var sfldDisplayFn = function (sfldId, desc) {
            return "<span style=\"color: " + that.appData.getSfldColor(sfldId) + ";\">" + desc + "</span>";
        };
        if (!sfldDesc) {
            for (var i = 0; i < sfldIds.length; i++) {
                var sfldId = sfldIds[i];
                var sfldIdStr = sfldId ? " [" + sfldId + "]" : "";
                if (sfldDesc.length)
                    sfldDesc += '; ';
                sfldDesc += sfldDisplayFn(sfldId, that.appData.getSfldDescForClusterId(sfldId));
                //sfldDesc += sfldDisplayFn(sfldId, that.appData.getSfldDescForClusterId(sfldId) + sfldIdStr);
            }
        } else {
            var sfldIdStr = sfldIds.join("; ");
            if (sfldIdStr)
                sfldIdStr = " [" + sfldIdStr + "]";
            sfldDesc = sfldDisplayFn(sfldIds[0], sfldDesc);
            //sfldDesc = sfldDisplayFn(sfldIds[0], sfldDesc + sfldIdStr);
        }
        var rowHtml = "<td>" + data.name + "</td>";
        if (that.appMeta.Id != "fullnetwork") //TODO: HACK
            rowHtml += "<td>" + sfldDesc + "</td>";
        rowHtml += "<td>" + commify(size.uniprot) + "</td><td>" + commify(size.uniref90) + "</td>";
        if (hasUniRef50) {
            rowHtml += "<td>";
            if (size.uniref50 > 0)
                rowHtml += commify(size.uniref50);
            rowHtml += "</td>";
        }
        row.append(rowHtml);
        body.append(row);
    });

    div.append(table);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
//
App.prototype.getDownloadSize = function (fileType) {
    //TODO: implement this
    return "";//'&lt; 1 MB';
}
App.prototype.setPageHeaders = function () {
    document.title = this.appData.getPageTitle();
    $("#familyTitle").text(document.title);
    $("#clusterDesc").text(this.appData.getDescription());
    var as = this.appMeta.Ascore;
    if (as.length > 0) {
        var hWarn = $('<span class="as-warning"> (Alignment Score ' + as + ')</span>');
        $("#familyTitle").append(hWarn);
    }
}
App.prototype.initUi = function () {
    applyRowClickableFn(this.appMeta.Version);

    $(".hmm-logo").click(function(evt) {
        var parm = $(this).data("logo");
        var windowSize = ["width=1500,height=600"];
        var url = "view_logo.php?" + parm;
        var theWindow = window.open(url, "", windowSize);
        evt.preventDefault();
    });
}

