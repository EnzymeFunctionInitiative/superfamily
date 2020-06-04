
const STATE_HOME = 1;
const STATE_SEQ = 2;
const STATE_ID = 3;
const STATE_TAX = 4;


$(document).ready(function() {
    var searchApp = "dosearch.php";

    var getVersion = function() {
        var v = $("#version").val();
        return v;
    };

    history.replaceState({state: STATE_HOME}, null, "");
    var historyFn = function(type, id) { history.pushState({state: type}, null, "#"+type+id); };
    $(window).on("popstate", function (e) {
        var state = e.originalEvent.state;
        console.log(state);
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
                    network = new Network("", netData);
                }
            }
            if (network) {
                onFinish(network);
            }
        });
    }

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
                var processFn = function(network, matches, parentCluster = "", ascore = "") {
                    var ascoreUrl = (parentCluster && ascore) ? "&as=" + ascore : "";
                    var table = $('<table class="table table-sm"></table>');
    		        table.append('<thead><tr><th>Cluster</th><th>E-Value</th></thead>');
    		        var body = $('<tbody>');
            		table.append(body);
                    for (var i = 0; i < matches.length; i++) {
                        var netName = typeof network !== 'undefined' ? network.getNetworkMapName(matches[i][0]) : matches[i][0];
                        body.append('<tr><td><a href="explore.html?v=' + version + '&id=' + matches[i][0] + ascoreUrl + '">' + netName + '</a></td><td>' + matches[i][1] + '</td></tr>');
                    }
                    if (parentCluster && ascore) {
                        var div = $("<div><h3>" + parentCluster + " AS " + ascore + "</h3></div>");
                        $("#searchResults").append(div);
                    }
                    if (matches.length > 0) {
                        $("#searchResults").append(table);
                    }
                    return matches.length;
                };

                var netInfoFn = function(network) {
                    var numMatches = processFn(network, data.matches);
                    var dicedClusters = Object.keys(data.diced_matches);
                    if (dicedClusters.length > 0) {
                        for (var i = 0; i < dicedClusters.length; i++) {
                            var parentCluster = dicedClusters[i];
                            var ascores = Object.keys(data.diced_matches[parentCluster]);
                            for (var ai = 0; ai < ascores.length; ai++) {
                                var ascore = ascores[ai];
                                var matches = data.diced_matches[parentCluster][ascore];
                                numMatches += processFn(network, matches, parentCluster, ascore);
                            }
                        }
                    }
                    if (numMatches > 0) {
                        $("#searchUi").hide();
                        $("#searchResults").show();
                        if (typeof id === "function")
                            id(data.id);
                    } else {
                        $("#searchSeqErrorMsg").text("No matching sequences or clusters found.").show();
                    }
                    progress.stop();
                };

                $("#searchResults").empty();
                getNetInfo(version, netInfoFn);
            }
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
                if (typeof data.cluster_id === "object") {
                    var addClusterTableFn = function(network) {
                        var table = $('<table class="table table-sm"></table>');
        		        table.append('<thead><tr><th>Cluster</th><th>Alignment Score</th></thead>');
        		        var body = $('<tbody>');
                		table.append(body);
                        var ascores = Object.keys(data.cluster_id);
                        for (var i = 0; i < ascores.length; i++) {
                            var ascore = ascores[i];
                            var clusterId = data.cluster_id[ascore];
                            var netName = typeof network !== 'undefined' ? network.getNetworkMapName(clusterId) : clusterId;
                            body.append('<tr><td><a href="explore.html?v=' + version + '&id=' + clusterId + "&as=" + ascore + '">' + netName + '</a></td><td>' + ascore + '</td></tr>');
                        }
                        $("#searchResults").empty().append(table).show();
                        $("#searchUi").hide();
                        if (typeof id === "function")
                            id(data.id);
                    };
                    getNetInfo(version, addClusterTableFn);
                } else {
                    window.location.href = "explore.html?v=" + version + "&id=" + data.cluster_id;
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
                        var netName = typeof network !== 'undefined' ? network.getNetworkMapName(matches[i][0]) : matches[i][0];
                        var ascoreParm = isDiced ? "&as=" + matches[i][1] : "";
                        if (netName) {
                            var tr = $('<tr>');
                            tr.append($('<td><a href="explore.html?v=' + version + '&id=' + matches[i][0] + ascoreParm + '">' + netName + '</a></td>'));
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
                            network = new Network("", netData);
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


    //if (id) {//searchState.state != STATE_HOME) {
    //    $("#searchResults").show();
    //    $("#searchUi").hide();
    //} else {
    //    $("#searchResults").hide();
    //    $("#searchUi").show();
    //}
});

