
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
    var app = new App(version, alignmentScore);
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
                    app.init(appData, gndKey);
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
App.prototype.init = function(appData, gndKey) {
    this.appMeta.Id = appData.Id;
    this.appMeta.Ascore = appData.getAlignmentScore();
    this.appMeta.GndKey;
    this.appMeta.DataDir = appData.getDataDir();

    this.appData = appData;

    this.url = new AppUrl(this.appMeta);
    this.uniref = new AppUniRef(this.appData);

    this.dataFeat = new AppDataFeatures(this.appData, this.appMeta, this.url);
    this.diced = new AppDiced(this.appData, this.appMeta);
    this.sunburst = new AppSunburst(this.appData, this.uniref);

    var hasSubgroups = this.appData.getSubgroups().length > 0;
    var hasRegions = this.appData.getRegions().length > 0;
    var hasChildren = this.appData.getChildren().length > 0;
    var hasDicedChildren = this.appData.getDicedChildren().length > 0;
    var isLeaf = !hasSubgroups && !hasRegions && !hasChildren && !hasDicedChildren;

    this.progress = new Progress($("#progressLoader"));
    this.progress.start();

    this.setPageHeaders();
    var nav = new AppNav(this.appData, this.appMeta);
    nav.addBreadcrumb();

    this.image = new AppImage(this.appData, this.appMeta, this.progress, this.url);

    // This shows the main diced image and page.
    if (this.appData.getAltSsns().length > 0) {
        this.initAltSsn();
        var dlDivId = "downloads";
        var hideTabStuff = false;
        if (this.appMeta.Ascore) {
            $("#altSsnSecondary").show();
        }
        $("#downloadContainer").show();
        $("#altSsnPrimary").show();
        $(".alt-cluster-ascores").text(this.appData.getAltSsns().join(", "));
        $(".alt-cluster-id").text(this.appData.getName());
        $(".alt-cluster-default-as").text(this.appData.getDefaultAlignmentScore());
        $(".alt-cluster-sfld").text(this.appData.getSfldDesc() + " (SFLD subgroup " + this.appData.getSfldId() + ")");
        var nextAs = this.appData.getNextAscore();
        $("#alt-cluster-next-as-link").attr("href", getUrlFn(this.appMeta.Id + "-1", this.appMeta.Version, nextAs));
        $(".alt-cluster-next-as").text(nextAs);
        this.dataFeat.addDownloadFeatures(dlDivId, hideTabStuff);
        this.diced.addDicedNav(true); // true = this is a parent diced cluster

        this.diced.addAscoreTabs();
    } else {
        this.initStandard(isLeaf);
        if (this.appMeta.Id != "fullnetwork")
            this.initLeafData();
        // Still more stuff to zoom in to
        if (!isLeaf)
            this.initChildren();
        if (this.appMeta.Id != "fullnetwork") {
            this.dataFeat.addDownloadFeatures("downloads")
            $("#downloadContainer").show();
        }
        // If this is a diced network...
        var dicedParent = this.appData.getDicedParent();
        if (dicedParent) {
            $("#dicedContainer").show();
            this.diced.addDicedNav();
            this.image.setDicedClusterImage(dicedParent, function() {});
        }
    }

    applyRowClickableFn(this.appMeta.Version);

    $(".hmm-logo").click(function(evt) {
        var parm = $(this).data("logo");
        var windowSize = ["width=1500,height=600"];
        var url = "view_logo.php?" + parm;
        var theWindow = window.open(url, "", windowSize);
        evt.preventDefault();
    });
}
App.prototype.initAltSsn = function() {
    this.dataFeat.addClusterSize();
    this.image.setClusterImage(function() {});
    var altDiv = $("#altSsn");
    altDiv.show();

    var tabList = $("#dicedAscoreTabList");
    var tabs = $("#dicedAscoreTabs");
    var ascores = this.appData.getAltSsns();
    for (var i = 0; i < ascores.length; i++) {
        var as = ascores[i];
        var fileName = this.appData.getImage();
        var filePath = this.appMeta.DataDir + '/dicing-' + as + '/' + fileName + '_sm.png';
        var style = i == 0 ? "active" : "";
        var style2 = i == 0 ? "show" : "";

        //var link = $('<a class="nav-link ' + style + '" id="ascore-pills-ascore-' + as + '-tab" data-toggle="pill" href="#ascore-tabs-ascore-' + as + '" role="tab">AS ' + as + '</a>');
        var link = $('<li class="nav-item"><a class="nav-link ' + style + '" id="ascore-pills-ascore-' + as + '-tab" data-toggle="pill" href="#ascore-tabs-ascore-' + as + '" role="tab">AS ' + as + '</a></li>');
        tabList.append(link);

        var tab = $('<div class="tab-pane fade ' + style2 + ' ' + style + '" id="ascore-tabs-ascore-' + as + '"><h4>Alignment Score ' + as + '</h4></div>');
        var img = $('<img src="' + filePath + '" class="img-fluid" alt="Overview image for AS ' + as + '">');
        var imgLink = $('<a href="' + getUrlFn(this.appMeta.Id, this.appMeta.Version, as) + '"></a>');
        imgLink.append(img);
        tab.append(imgLink);

        tabs.append(tab);
    }
                            
                            
    $("#submitAnnoLink").attr("href", $("#submitAnnoLink").attr("href") + "?id=" + this.appMeta.Id);
//    $("#dataAvailable").show();
    $("#downloadClusterImage").hide();
}
App.prototype.initStandard = function(isLeaf) {
    var that = this;
    var addClusterNumbersFn = function() {
        if (!isLeaf)
            that.image.addClusterNumbers($("#clusterNums"));
    };
    this.image.setClusterImage(addClusterNumbersFn);
    if (this.appMeta.Id != "fullnetwork") {
        this.dataFeat.addTigrFamilies();
        this.dataFeat.checkForKegg();
    }
}
App.prototype.initLeafData = function() {
    var hasData = this.dataFeat.addDisplayFeatures();
    this.dataFeat.addClusterSize();
    this.dataFeat.addConvRatio();
    this.dataFeat.addConsRes();
    $("#consensusResidueContainer").show();
    if (hasData) {
        this.dataFeat.addSwissProtFunctions();
        this.dataFeat.addPdb();
        this.dataFeat.addGndFeature();
        this.sunburst.addSunburstFeature();
        $("#displayFeatures").show();
        $("#dataAvailable").show();
    }
    $("#submitAnnoLink").attr("href", $("#submitAnnoLink").attr("href") + "?id=" + this.appMeta.Id);
}

App.prototype.initChildren = function() {
    var that = this;
    var showFn = function() {
        var clusterTableDiv = $('<div id="clusterTable"></div>');
        that.addSubgroupTable(clusterTableDiv);
        $("#subgroupTable").append(clusterTableDiv);
    };

    var kids = this.appData.getDicedChildren();
    if (kids.length > 0) {
        alert("HI");
        $("#dicingInfo").show();
        var menu = $('<select class="form-control w-25"></select>');
        for (var i = 0; i < kids.length; i++) {
            menu.append($('<option></option>').attr("value", kids[i].id).text(kids[i].id));
        }
        menu.val("");
        menu.change(function() {
            var id = $(this).val();
            goToUrlFn(id, that.appMeta.Version);
        });
        $("#subgroupTable").append(menu);
    } else {
        showFn();
    }

    $("#subgroupTable").show();
}


// Add a table of all of the clusters that derive from the current view.
App.prototype.addSubgroupTable = function (div) {
    var table = $('<table class="table table-hover w-auto"></table>');

    var that = this;

    // If there are cleanly-defined sub-clusters, then the 'regions' property will be present.
    if (this.appData.getRegions().length > 0 || this.appData.getChildren().length > 0) {
        var kids = this.appData.getRegions();
        if (kids.length == 0)
            kids = this.appData.getChildren();

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
    } else if (this.appData.getDicedChildren().length > 0) {
        var head = table.append('<thead><tr><th>Sub-Cluster</th></tr></thead>');
        var body = table.append('<tbody class="row-clickable text-center"></tbody>');
        $.each(this.appData.getDicedChildren(), function (i, data) {
            var row = $('<tr data-node-id="' + data.id + '"></tr>');
            row.append("<td>" + data.id + "</td>");
            body.append(row);
        });
    } else if (this.appData.getSubgroups().length > 0) {
        var head = table.append('<thead><tr><th>Cluster</th><th>SFLD Number</th><th>Subgroup</th></tr></thead>');
        var body = table.append('<tbody class="row-clickable text-center"></tbody>');
        $.each(this.appData.getSubgroups(), function (i, data) {
            var descColor = typeof data.color !== "undefined" ? ' style="color: '+data.color+'; font-weight: bold"' : "";
            var descCol = "<td" + descColor + ">" + data.desc + "</td>";
            var row = $('<tr data-node-id="' + data.id + '"></tr>');
            row.append("<td>" + data.name + "</td><td>" + data.sfld + "</td>" + descCol);
            body.append(row);
        });
    }

    div.append(table);
}


App.prototype.addAltSsns = function (div) {
    var as = this.appMeta.Ascore;
    var that = this;
    var table = $('<table class="table table-sm text-center w-auto"></table>');
    table.append('<thead><tr><th>Alignment Score</th></thead>');
    var body = table.append('<tbody class="row-clickable text-center"></tbody>');
    table.append(body);
    if (as) {
        var row = $('<tr data-node-id="' + that.appMeta.Id + '" data-alignment-score="' + '"></tr>');
        row.append("<td>" + "Default" + "</td>");
        body.append(row);
    }
    $.each(this.appData.getAltSsns(), function (i, data) {
        if (data[0]) {
            var row = $('<tr data-node-id="' + that.appMeta.Id + '" data-alignment-score="' + data[0] + '"></tr>');
            row.append("<td>" + data[0] + "</td>");
            body.append(row);
        }
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


