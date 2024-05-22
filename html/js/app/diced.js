

function AppDiced(appData, appMeta, dataFeat) {
    this.appData = appData;
    this.appMeta = appMeta;
    this.dataFeat = dataFeat;
}


AppDiced.prototype.initDicedSsnOverview = function(ascores) {
    this.dataFeat.addClusterSize();
    var altDiv = $("#dicedAscoreListContainer");
    altDiv.show();
    
    var clusterName = this.appData.getName();

    var tabList = $("#dicedAscoreTabList");
    var tabs = $("#dicedAscoreTabs");
    for (var i = 0; i < ascores.length; i++) {
        var as = ascores[i];
        var fileName = this.appData.getImage();
        var filePath = this.appMeta.DataDir + '/dicing-' + as + '/' + fileName;
        //TODO: var filePath = this.appMeta.DataDir + '/dicing-' + as + '/' + fileName + '_sm.png';
        var style = i == 0 ? "active" : "";
        var style2 = i == 0 ? "show" : "";

        //var link = $('<a class="nav-link ' + style + '" id="ascore-pills-ascore-' + as + '-tab" data-toggle="pill" href="#ascore-tabs-ascore-' + as + '" role="tab">AS ' + as + '</a>');
        var link = $('<li class="nav-item"><a class="nav-link ' + style + '" id="ascore-pills-ascore-' + as + '-tab" data-toggle="pill" href="#ascore-tabs-ascore-' + as + '" role="tab">AS ' + as + '</a></li>');
        tabList.append(link);

        var theUrl = getUrlFn(this.appMeta.Id+"-1", this.appMeta.Version, as);
        var tab = $('<div class="tab-pane fade ' + style2 + ' ' + style + '" id="ascore-tabs-ascore-' + as + '"><h4>Alignment Score ' + as + '</h4></div>');
        var img = $('<img src="' + filePath + '" class="img-fluid" alt="Overview image for AS ' + as + '">');
        var imgLink = $('<a href="' + theUrl + '"></a>');
        imgLink.append(img);
        tab.append(imgLink);
        tab.append('<div class="center btn btn-primary m-1"><a href="' + theUrl + '">Go to the first sub-cluster in ' + clusterName + '.</a></div>');

        tabs.append(tab);
    }

    $("#submitAnnoLink").attr("href", $("#submitAnnoLink").attr("href") + "?id=" + this.appMeta.Id);
    $("#downloadClusterImage").hide();
}


AppDiced.prototype.addAscoreTabs = function() {
    //$("#clusterImgContainer").hide();
    var ascores = this.appData.getAltSsns();
    //TODO:
}


AppDiced.prototype.initDicedDescText = function(nextAs) {
    $(".diced-desc-cluster-id").text(this.appData.getName());
    $(".diced-desc-default-as").text(nextAs);
    $(".diced-desc-subgroup").text(this.appData.getSubgroupDesc());
    $(".diced-desc-next-as").text(nextAs);
}


AppDiced.prototype.addDicedNav = function(isParent = false) {
    var that = this;

    if (!isParent) {
        this.addClusterSelect(isParent);
    }

    var nav = this.appData.getDicedNav(isParent);
    var ascoreCb = $('<select id="sel-parent-ascores" class="form-control w-auto"></select>');
    for (var i = 0; i < nav.ascores.length; i++) {
        var isSel = nav.ascores[i] == this.appMeta.Ascore ? "selected" : "";
        ascoreCb.append($('<option value="' + nav.ascores[i] + '" ' + isSel + '>AS ' + nav.ascores[i] + '</option>'));
    }
    ascoreCb.change(function() {
        goToUrlFn(that.appMeta.Id, that.appMeta.Version, this.value);
    });
    $("#dicedNav").append('<span class="mr-1 ml-4">Alignment Score:</span>').append(ascoreCb);


    if (!isParent) {
        this.addWalkthrough();
    }
}

AppDiced.prototype.addWalkthrough = function() {
    var that = this;

    if (typeof sessionStorage.queryId !== "undefined") {
        $("#clusterAsNavTitleId").text(" (" + sessionStorage.queryId + ")");
    }
    var sessionData = false;
    var isIdType = false;
    if (typeof sessionStorage.idData !== "undefined") {
        sessionData = JSON.parse(sessionStorage.idData);
        isIdType = true;
    } else if (typeof sessionStorage.evalueData !== "undefined") {
        sessionData = JSON.parse(sessionStorage.evalueData);
        isIdType = false;
    }

    var asNavBtn = $('<button id="cluster-as-nav-btn" class="btn btn-primary btn-sm pull-right" style="margin-left: 90px"><i class="fas fa-code-branch"></i> AS Walk-Through</button>');

    var createTable = function() {
        var table = $('<table class="table walkthrough"></table>');
        var th = $('<thead></thead>');
        th.append('<td>Cluster ID</td><td>AS</td><td>Num Nodes</td><td>Conv. Ratio</td>');
        var dicedSpCol = $('<td>SwissProt</td>');
        th.append(dicedSpCol);
        dicedSpCol.show();
        var dicedAnnoCol = $('<td>Annotation</td>');
        th.append(dicedAnnoCol);
        table.append(th);
        return table;
    };

    var getListItem = function(navItem, groupIdx, hasId) {
        var navItemName = ucFirst(navItem.cluster_id);
        var spDiv = getPopoverSwissProt(navItem.sp, groupIdx);
        var annoDiv = getPopoverAnno(navItem.anno, groupIdx);

        var hasIdText = "";
        if (hasId) {
            if (sessionData !== false && !isIdType) {
                hasIdText = "<br>[e-value = " + hasId + "]";
            } else {
                hasIdText = " [" + hasId + "]";
            }
        }

        var listItem = $('<tr></tr>');
        listItem.append('<td><a href="' + getUrlFn(navItem.cluster_id, that.appMeta.Version, navItem.ascore) + '">' + navItemName + hasIdText + '</a></td>');
        listItem.append('<td>' + navItem.ascore + '</td>');
        listItem.append('<td>' + navItem.num_nodes + '</td>');
        var cr = typeof navItem.cr !== "undefined" ? navItem.cr : "";
        listItem.append('<td>' + cr + '</td>');
        var spCell = $('<td></td>');
        spCell.append(spDiv);
        listItem.append(spCell);
        var annoCell = $('<td></td>');
        annoCell.append(annoDiv);
        listItem.append(annoCell);
        return listItem;
    };

    var processClusterItem = function(navItem) {
        if (sessionData === false)
            return false;
        if (isIdType) {
            for (var i = 0; i < sessionData.length; i++) {
                if (sessionData[i].ascore == navItem.ascore && sessionData[i].clusters[0].cluster == navItem.cluster_id)
                    return sessionStorage.queryId;
            }
        } else {
            for (var i = 0; i < sessionData.length; i++) {
                if (sessionData[i].ascore == navItem.ascore) {
                    var data = sessionData[i].clusters;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].cluster == navItem.cluster_id)
                            return data[j].evalue;
                    }
                }
            }
        }
        return false;
    };


    asNavBtn.click(function() {
        $("#clusterAsNavList").empty();
        var dnav = that.appData.getDicedWalkthrough();
        var table = createTable();
        $("#clusterAsNavList").append(table);
        var makeWalkthroughDnav = function(navList, headingText, isForward) {
            var nextAscore = "";
            var tbody = $('<tbody></tbody>');
            table.append(tbody);

            var groupIdx = isForward ? "f" : "b";
            for (var i = 0; i < navList.length; i++) {
                var navItem = navList[i];
                nextAscore = navItem.ascore;
                if (typeof navItem.num_nodes !== "undefined") {
                    var idOrFalse = isForward ? processClusterItem(navItem) : false;
                    //var hasId = isForward ? checkForUniProtId(navItem) : false;
                    var listItem = getListItem(navItem, groupIdx+1, idOrFalse);
                    tbody.append(listItem);
                }
            }
            if (nextAscore) {
                var headerBody = $('<tbody class="walkthrough-header"></tbody>').append('<tr><td><h5>' + headingText + '</h5></td></tr>');
                table.append(headerBody);
                table.append(tbody);
                //$("#clusterAsNavList").append('<div></div>').append('<h5>' + headingText + ' (AS' + nextAscore + ')</h5>').append(table);
            }
        };
        if (dnav.backward !== false)
            makeWalkthroughDnav(dnav.backward, "Previous Cluster", false);
        if (dnav.forward !== false)
            makeWalkthroughDnav(dnav.forward, "Next Clusters", true);
        $("#clusterAsNavModal").modal();
    });
    $("#dicedNav").append(asNavBtn);
}


AppDiced.prototype.addClusterSelect = function(isParent) {
    var that = this;

    var nav = this.appData.getDicedNav(isParent);
    var idParts = this.appMeta.Id.split("-");
    var parentIdParts = idParts.slice(0, idParts.length-1);
    var prevId = nav.siblings.prev ? parentIdParts.join("-") + "-" + nav.siblings.prev : "";
    var nextId = nav.siblings.next ? parentIdParts.join("-") + "-" + nav.siblings.next : "";
    
    var prevBtn = $('<button id="prev-sibling-btn" class="btn btn-primary btn-sm mr-0">Previous</button>');
    if (prevId) {
        prevBtn.click(function() {
            goToUrlFn(prevId, that.appMeta.Version, that.appMeta.Ascore);
        });
    } else {
        prevBtn.addClass("disabled");
    }
    
    var nextBtn = $('<button id="next-sibling-btn" class="btn btn-primary btn-sm">Next</button>');
    if (nextId) {
        nextBtn.click(function() {
            goToUrlFn(nextId, that.appMeta.Version, that.appMeta.Ascore);
        });
    } else {
        nextBtn.addClass("disabled");
    }

    var idCb = $('<select id="sel-sibling-id" class="form-control w-auth mx-2"></select>');
    var curId = idParts[idParts.length-1];
    var ids = nav.siblings.ids;
    ids.sort(sortClusterIds);
    var parentNum = idParts.slice(1, idParts.length-1).join("-");
    for (var i = 0; i < ids.length; i++) {
        var isSel = ids[i] == curId ? "selected" : "";
        idCb.append($('<option value="cluster-' + parentNum + '-' + ids[i] + '" ' + isSel + '>Cluster ' + parentNum + '-' + ids[i] + '</option>'));
    }
    idCb.change(function() {
        goToUrlFn(this.value, that.appMeta.Version, that.appMeta.Ascore);
    });
    
    $("#dicedNav").append(prevBtn).append(idCb).append(nextBtn);
}


function sortClusterIds(a, b) {
    var aa = a.split("-");
    var bb = b.split("-");
    var maxIdx = aa.length > bb.length ? bb.length : aa.length;
    for (var i = 0; i < maxIdx; i++) {
        var aaa = +aa[i];
        var bbb = +bb[i];
        if (aaa < bbb)
            return -1;
        else if (aaa > bbb)
            return 1;
    }
    return 0;
}




