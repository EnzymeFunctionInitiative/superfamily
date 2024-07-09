

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

function initApp(appInfo) {
    var requestData = getPageClusterId(appInfo.version);
    var requestId = "", alignmentScore = "";
    //HACK
    if (!requestData.network_id)
        requestId = "fullnetwork";
    else
        requestId = requestData.network_id;
    if (requestData.alignment_score)
        alignmentScore = requestData.alignment_score;
    if (requestData.version)
        appInfo.version = requestData.version;
    if (requestData.version_name)
        appInfo.versionName = requestData.version_name;
    var app = new App(appInfo);
    var args = {a: "cluster", cid: requestId, v: appInfo.version};
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
                    app.init(appData, requestData.show_diced_list_page);
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
function App(appInfo) {
    this.appMeta = new AppMeta();
    this.appMeta.Version = appInfo.version;
    this.appMeta.VersionName = appInfo.versionName;
    this.appMeta.SubgroupTitle = appInfo.subgroupTitle;
    this.appMeta.GndKey = appInfo.gndKey;
    this.appMeta.GndUrl = appInfo.gndUrl;
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
App.prototype.init = function(appData, showDicedListPage) {
    this.appMeta.Id = appData.Id;
    this.appMeta.Ascore = appData.getAlignmentScore();
    this.appMeta.DataDir = appData.getDataDir();

    this.appData = appData;

    this.progress = new Progress($("#progressLoader"));
    this.progress.start();

    this.url = new AppUrl(this.appMeta);
    this.uniref = new AppUniRef(this.appData);

    this.dataFeat = new AppDataFeatures(this.appData, this.appMeta, this.url, this.progress);
    this.diced = new AppDiced(this.appData, this.appMeta, this.dataFeat);
    var hasUniRef = true;

    var apiExtra = [["v", this.appMeta.Version]];
    if (this.appMeta.Ascore)
        apiExtra.push(["as", this.appMeta.Ascore]);
    var sbScriptDir = "vendor/efiillinois/sunburst/php";
    var sbParams = {
            apiId: this.appData.Id,
            apiKey: this.appMeta.GndKey,
            apiExtra: apiExtra,
            appUniRefVersion: this.uniref.getUniRefVersion(),
            scriptApp: sbScriptDir + "/get_tax_data.php",
            fastaApp: sbScriptDir + "/get_sunburst_fasta.php",
            hasUniRef: hasUniRef,
            appPrimaryIdTypeText: function(){},
            appPostSunburstTextFn: function(){},
            hideFastaDownload: true,
            useBootstrap: true,
    };
    this.sunburst = new AppSunburst(sbParams);

    var hasRegions = this.appData.getRegions().length > 0;
    var hasChildren = this.appData.getChildren().length > 0;
    var isLeaf = !hasRegions && !hasChildren;

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

    if (this.appMeta.Id == "fullnetwork") {
        $(".fullnetwork-text").show();
    }

    this.initUi();
}


// This is where we show all of the images of the various diced versions of this cluster.
App.prototype.initMasterDicedPage = function(ascores) {
    var nextAs = this.appData.getNextAscore();
    this.diced.addAscoreTabs();
    this.diced.initDicedDescText(nextAs);

    var theUrl = getUrlFn(this.appMeta.Id, this.appMeta.Version, this.appMeta.Ascore);
    theUrl += "&d=l";
    $("#dicedListLink").attr("href", theUrl);

    $("#dicedClusterDesc").show();
    $("#downloadContainer").show();
    $("#dicedAscoreListOverview").show();
    $("#dicedDiceIncrements").text(ascores.join(", "));
    $("#dicedNumDicings").text(ascores.length);
}


// This is where we show the parent cluster before dicing.
App.prototype.initDicedListPage = function(ascores) {
    this.dataFeat.addClusterSize("dicedAscoreListClusterSize");

    var nextAs = this.appData.getNextAscore();
    this.diced.initDicedDescText(nextAs);
    this.diced.initDicedSsnOverview(ascores);
    
    var theUrl = getUrlFn(this.appMeta.Id + "-1", this.appMeta.Version, nextAs);
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
        this.dataFeat.checkForAlphafoldIds();
        this.initLeafPage(hideInfoForDiced);
    }

    // Still more stuff to zoom in to
    if (!isLeaf)
        this.initSubGroupPage();
    if (this.appMeta.Id != "fullnetwork") {
        var hasFeat = this.dataFeat.addDownloadFeatures("downloads")
        if (hasFeat)
            $("#downloadContainer").show();
    }
    // If this is a child of a diced network...
    var dicedParent = this.appData.getDicedParent();
    if (dicedParent) {
        $("#dicedImageContainer").show();
        this.diced.addDicedNav();
        this.image.setDicedClusterImage(dicedParent, function() {});
    }

    var subgroups = this.appData.getSubgroups();
    var subgroupList = $("#subgroupMapping");
    $.each(subgroups, function (i, info) {
        var row = $("<tr><td>" + info["subgroup_id"] + "</td><td>" + info["cluster_desc"] + "</td><td>" + info["cluster_name"] + "</td></tr>");
        subgroupList.append(row);
    });
}


// Add information to the placeholders.
App.prototype.initLeafPage = function(hideInfoForDiced = false) {
    var hasData = this.dataFeat.addDisplayFeatures();

    this.dataFeat.addClusterSize("clusterSize");

    if (hasData) {
        this.dataFeat.addSwissProtFunctions();
        this.dataFeat.addPdb();
        this.dataFeat.addGndFeature();
    
        var feat = this.appData.getDisplayFeatures();
        if (feat.hasOwnProperty("tax")) {
            var that = this;
            $("#dataAvailableSunburst").click(function() {
                $("#sunburst-container").empty();
                that.sunburst.attachToContainer("sunburst-container")
                that.sunburst.addSunburstFeatureAsync(() => { $("#sunburstModal").modal(); });
            }).enableDataAvailableButton();
        }
    
        if (!hideInfoForDiced) {
            this.dataFeat.addConsRes();
            this.dataFeat.addConvRatio();
        }
    
        $("#displayFeatures").show();
        $("#dataAvailable").show();
    }
}


App.prototype.initSubGroupPage = function() {
    var clusterTableDiv = $('<div id="clusterTable"></div>');
    this.addChildrenTable(clusterTableDiv);
    $("#subgroupTable").append(clusterTableDiv);
    $("#subgroupTable").show();
}


// Add a table of all of the clusters that derive from the current view.
App.prototype.addChildrenTable = function (div) {
    var table = $('<table class="table table-hover w-auto"></table>');

    var that = this;

    var kids = this.appData.getRegions();
    if (kids.length == 0)
        kids = this.appData.getChildren();

    if (kids.length == 0)
        return;

    var hasUniRef50 = this.appData.getUniRefVersion(false) == 50 ? true : false;

    var headHtml = '<thead><tr class="text-center"><th>Cluster</th>';
    if (this.appMeta.Id != "fullnetwork") //TODO: HACK
        headHtml += '<th>' + this.appMeta.SubgroupTitle + ' Subgroup</th>';
    headHtml += '<th>UniProt</th><th>UniRef90</th>' + (hasUniRef50 ? '<th>UniRef50</th>' : '') + '</tr></thead>';
    var head = table.append(headHtml);
    var body = table.append('<tbody class="row-clickable text-center"></tbody>');

    $.each(kids, function (i, data) {
        var row = $('<tr data-node-id="' + data.id + '"></tr>');

        var color = data.color ? "color: " + data.color + ";" : "";
        var subgroupDesc = "<span style=\"" + color + "\">" + data.cluster_desc + "</span>";

        var url = getUrlFn(data.id, that.appMeta.Version);
        var linkHtml = '<a href="' + url + '">' + data.cluster_name + '</a>';
        if (data.diced == 1)
            linkHtml = '<button class="btn btn-primary btn-sm">Diced ' + linkHtml + '</button>';
        var rowHtml = "<td>" + linkHtml + "</td>";
        if (that.appMeta.Id != "fullnetwork") //TODO: HACK
            rowHtml += "<td>" + subgroupDesc + "</td>";

        rowHtml += "<td>" + commify(data.size.uniprot) + "</td><td>" + commify(data.size.uniref90) + "</td>";
        if (hasUniRef50) {
            rowHtml += "<td>";
            if (data.size.uniref50 > 0)
                rowHtml += commify(data.size.uniref50);
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
    var doc_title = this.appData.getClusterTitle();
    if (doc_title) {
        document.title = doc_title;
        $("#family-title").text(document.title);
    }
    var as = this.appMeta.Ascore;
    if (as.length > 0) {
        var hWarn = $('<span class="as-warning"> (Alignment Score ' + as + ')</span>');
        $("#family-title").append(hWarn);
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

