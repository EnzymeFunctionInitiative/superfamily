
const STATE_HOME = 1;
const STATE_SEQ = 2;
const STATE_ID = 3;
const STATE_TAX = 4;


$(document).ready(function() {
    var searchApp = "search_do.php";

    var getVersion = function() {
        var v = $("#version").val();
        return v;
    };

    var colors = generateColor("#ff0000", "#000000", 15)
    var getColor = function(val) {
        var idx = Math.floor(val * colors.length);
        return colors[idx];
    };

    var getResultsUrl = function(id, ascore = "") {
        var v = getVersion();
        var parms = ["id="+id, "v="+v];
        if (ascore)
            parms.push("as="+ascore);
        var url = "explore.php?" + parms.join("&");
        return url;
    };

    history.replaceState({state: STATE_HOME}, null, "");
    var historyFn = function(type, id) { history.pushState({state: type}, null, "#"+type+id); };
    $(window).on("popstate", function (e) {
        var state = e.originalEvent.state;
        if (state.state == STATE_HOME) {
            $("#searchResults").hide();
            $("#searchUi").show();
        } else {
            $("#searchResults").show();
            $("#searchUi").hide();
        }
    });


    var getNetInfo = function(version, onFinish) {
        $.get("getdata.php", {a: "netinfo", v: version}, function (netDataStr) {
            var netData = parseNetworkJson(netDataStr);
            var network;
            if (netData !== false) {
                if (netData.valid) {
                    network = new AppData("", netData);
                }
            }
            if (network) {
                onFinish(network);
            }
        });
    }

    var addClusterTableFn = function(data, multiBody = false, showClusterHeader = false) {
        var hasEvalue = (data.length > 0 && typeof data[0].clusters[0].evalue !== "undefined");
        var table = $('<table class="table table-sm"></table>');
        table.append('<thead><tr><th>' + (showClusterHeader ? 'Cluster' : '') + '</th>' + (hasEvalue ? '<th>E-Value</th>' : '') + '<th>UniProt IDs</th><th>Nodes</th><th>UniProt ID CR</th></thead>');
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var DD = data[i];
            var cellStyle = i ? 'pt-5' : '';
            var numCols = hasEvalue ? 5 : 4;
            var parentNetName = DD.parent;
            var ascore = DD.ascore;
            var body = $('<tbody></tbody>');
            if (multiBody)
                body.append('<tr><td class="' + cellStyle + ' pb-0" colspan="' + numCols + '"><h5><b>' + parentNetName + ' AS ' + ascore + '</b></h5></td></tr>');

            for (var ri = 0; ri < DD.clusters.length; ri++) {
                var D = DD.clusters[ri];
                var clusterId = D.cluster;
                var numUniProt = D.num_up;
                var numUniRef90 = D.num_ur;
                var convRatio = D.cr;
                var netName = typeof D.name !== "undefined" ? D.name : clusterId;
                if (parentNetName.toLowerCase().startsWith("mega"))
                    netName = "Mega" + netName;

                var row = $('<tr></tr>');
                row.append('<td><a href="' + getResultsUrl(clusterId, ascore) + '">' + netName + '</a></td>');
                if (hasEvalue)
                    row.append('<td>' + D.evalue + '</td>');
                row.append('<td>' + numUniProt + '</td>');
                row.append('<td>' + numUniRef90 + '</td>');
                var cell = $('<td style="color: #' + getColor(convRatio) + '"></td>');
                cell.append(convRatio > 0.7 ? ('<b>' + convRatio + '</b>') : convRatio);
                row.append(cell);
    
                body.append(row);
            }
    	    table.append(body);
        }
        $("#searchResults").append(table).show();
        $("#searchUi").hide();
    };


    var searchSeqFn = function(id = "") {
        var seq = $("#searchSeq").val();
        var version = getVersion();
        var progress = new Progress($("#progressLoader"));
        progress.start();
        var parms = {t: "seq", v: version};
        if (typeof id !== "function")
            parms.id = id;
        else
            parms.query = seq;
        $.post(searchApp, parms, function(dataStr) {
            var data = JSON.parse(dataStr);
            if (data.status !== true) {
                $("#searchSeqErrorMsg").text(data.message).show();
            } else {

                $("#searchResults").empty();
                $("#searchResults").append('<div class="my-5 bigger">Query Sequence:<br><code>' + data.query.replaceAll('^', "<br>") + '</code></div>');

                if (data.matches.length > 0) {
                    //$("#searchResults").append('<div class="mt-5"><h5>Non-diced Clusters</h5></div>');
                    addClusterTableFn(data.matches, false, true);
                }

                $("#searchResults").append('<div class="my-5"></div>');

                if (data.diced_matches.length > 0) {
                    $("#searchResults").append('<div class="mt-5"><h4>Diced Clusters</h4></div>');
                    addClusterTableFn(data.diced_matches, true);
                }
            }
            progress.stop();
        });
    };

    var searchIdFn = function(id = "") {
        var idVal = $("#searchId").val();
        var version = getVersion();
        var parms = {t: "id", v: version};
        if (typeof id !== "function")
            parms.id = id;
        else
            parms.query = idVal;
        $.post(searchApp, parms, function(dataStr) {
            var data = JSON.parse(dataStr);
            if (data.status !== true) {
                $("#searchIdErrorMsg").text(data.message).show();
            } else {
                if (typeof data.cluster_data !== "undefined" && typeof data.cluster_data === "object") {
                    $("#searchResults").empty();
                    $("#searchResults").append('<div class="my-5 bigger">Query ID:<br><b>' + data.query + '</b></div>');
                    addClusterTableFn(data.cluster_data, true);
                } else {
                    window.location.href = getResultsUrl(data.cluster_id);
                }
            }
        });
    };

    var getSearchTaxType = function() {
        return $("#searchTaxTypeGenus").prop("checked") ? "genus" : ($("#searchTaxTypeFamily").prop("checked") ? "family" : "species");
    };
    var searchTaxFn = function(id = "") {
        var termVal = $("#searchTaxTerm").val();
        var termType = getSearchTaxType();
        var version = getVersion();
        var progress = new Progress($("#progressLoader"));
        progress.start();
        var parms = {t: "tax", v: version};
        if (typeof id !== "function") {
            parms.id = id;
        } else {
            parms.query = termVal;
            parms.type = termType;
        }
        $.post(searchApp, parms, function(dataStr) {
            var data = JSON.parse(dataStr);
            if (data.status !== true) {
                $("#searchTaxTermErrorMsg").text(data.message).show();
            } else {
                var processFn = function(network, matches, isDiced = false) {
                    var table = $('<table class="table table-sm w-50"></table>');
                    if (isDiced)
        		        table.append('<thead><tr><th>Cluster</th><th>Alignment Score</th><th>Number of Hits</th></thead>');
                    else
        		        table.append('<thead><tr><th>Cluster</th><th>Number of Hits</th></thead>');
    		        var body = $('<tbody>');
            		table.append(body);
                    for (var i = 0; i < matches.length; i++) {
                        var clusterId = matches[i][0];
                        var netName = typeof network !== 'undefined' ? network.getNetworkMapName(clusterId) : clusterId;
                        var ascore = isDiced ? matches[i][1] : "";
                        if (netName) {
                            var tr = $('<tr>');
                            tr.append($('<td><a href="' + getResultsUrl(clusterId, ascore) + '">' + netName + '</a></td>'));
                            if (isDiced)
                                tr.append($('<td>' + matches[i][1] + '</td>'));
                            tr.append($('<td>' + matches[i][isDiced ? 2 : 1] + '</td>'));
                            body.append(tr);
                        }
                    }
                    if (!isDiced)
                        $("#searchResults").empty();
                    $("#searchResults").append(table).show();
                    $("#searchUi").hide();
                    if (typeof id === "function")
                        id(data.id);
                };

                $.get("getdata.php", {a: "netinfo", v: version}, function (netDataStr) {
                    var netData = parseNetworkJson(netDataStr);
                    var network;
                    if (netData !== false) {
                        if (netData.valid) {
                            network = new AppData("", netData);
                        }
                    }
                    processFn(network, data.matches);
                    if (typeof data.diced_matches !== "undefined" && data.diced_matches.length > 0) {
                        processFn(network, data.diced_matches, true);
                    }
                    progress.stop();
                });
            }
        });
    };

    var id = window.location.hash.substr(1);
    if (id) {
        var t = id.substr(0, 1);
        var jid = id.substr(1);
        if (t == STATE_ID)
            searchIdFn(jid);
        else if (t == STATE_SEQ)
            searchSeqFn(jid);
        else if (t == STATE_TAX)
            searchTaxFn(jid);
        $("#searchResults").show();
        $("#searchUi").hide();
    }

    $("#searchIdBtn").click(function() {
        $("#searchIdErrorMsg").hide();
        searchIdFn(function(jid) { historyFn(STATE_ID, jid); });
    });
    $("#searchSeqBtn").click(function() {
        $("#searchSeqErrorMsg").hide();
        searchSeqFn(function(jid) { historyFn(STATE_SEQ, jid); });
    });
    $("#searchTaxTermBtn").click(function() {
        $("#searchTaxTermErrorMsg").hide();
        searchTaxFn(function(jid) { historyFn(STATE_TAX, jid); });
    });


    var taxSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: searchApp + '?t=tax-prefetch',
        remote: {
            url: searchApp + '?t=tax-auto&query=%QUERY',
            wildcard: '%QUERY'
            //prepare: function(query, settings) { return "search.php?t=tax-auto&query=" + query + "&type=" + getSearchTaxType(); }
        }
    });

    $("#searchTaxTerm").typeahead({
        minLength: 4,
    }, {
        source: taxSearch,
        limit: 100,
    });

});

