
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
        if (val >= 1)
            return colors[colors.length-1];
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
            $("#searchResultsContainer").hide();
            $("#searchUi").show();
        } else {
            $("#searchResultsContainer").show();
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
        var table = $('<table class="table table-sm w-75"></table>');

        var thead = $('<thead></thead>');
        table.append(thead);
        var headrow = $('<tr></tr>');
        thead.append(headrow);
        headrow.append('<th>' + (showClusterHeader ? 'Cluster' : '') + '</th>');
        if (hasEvalue)
            headrow.append('<th>E-Value</th>');
        headrow.append('<th class="text-right"># of UniProt IDs</th>');
        headrow.append('<th class="text-right"># of UniRef90 IDs</th>');
        var crcell = $('<th class="text-right">UniProt ID </th>');
        headrow.append(crcell);
        var ttText = 'The CR is the ratio of the number of sequence pairs with edge alignment score values (derived from BLAST e-values/bit scores) &ge; the minimum alignment score threshold used to generate the SSN to the total number of sequence pairs.';
        var po = $('<a href="index.php?#explore_conv" target="_blank" data-toggle="tooltip" title="' + ttText + '"><i class="fas fa-question-circle"></i></a>').tooltip();
        //po.popover({trigger: 'focus', html: true,
        //    content: 'The CR is the ratio of the number of sequence pairs with edge alignment score values (derived from BLAST e-values/bit scores) ≥ the minimum alignment score threshold used to generate the SSN to the total number of sequence pairs. <a href="index.php?#explore_conv" target="_blank">More...</a>'})
        crcell.append(po);
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
                //if (parentNetName.toLowerCase().startsWith("mega"))
                //    netName = "Mega" + netName;

                var row = $('<tr></tr>');
                row.append('<td><a href="' + getResultsUrl(clusterId, ascore) + '">' + netName + '</a></td>');
                if (hasEvalue)
                    row.append('<td>' + D.evalue + '</td>');
                row.append('<td class="text-right">' + numUniProt + '</td>');
                row.append('<td class="text-right">' + numUniRef90 + '</td>');
                row.append('<td class="text-right">' + convRatio + '</td>');
                //var cell = $('<td class="text-right" style="color: #' + getColor(convRatio) + '"></td>');
                //cell.append(convRatio > 0.7 ? ('<b>' + convRatio + '</b>') : convRatio);
                //row.append(cell);
    
                body.append(row);
            }
    	    table.append(body);
        }
        $("#searchResults").append(table);
        $("#searchResultsContainer").show();
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

            if (typeof id === "function")
                id(data.id);
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
                if (typeof id === "function")
                    id(data.id);
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
                $("#searchUi").hide();

                var processFn = function(matches, isDiced = false) {
                    var table = $('<table class="table table-sm w-100"></table>');
        		    table.append('<thead><tr><th>UniProt ID</th><th>Cluster</th><th>Organism</th><th>TrEMBL/SwissProt</th></thead>');
        		    //table.append('<thead><tr><th>UniProt ID</th><th>Cluster</th><th>Description</th><th>Organism</th><th>TrEMBL/SwissProt</th></thead>');
        		    //table.append('<thead><tr><th>UniProt ID</th><th>Cluster</th>' + (isDiced ? '<th>Alignment Score</th>' : '') + '<th>Description</th><th>Organism</th><th>TrEMBL/SwissProt</th></thead>');
    		        var body = $('<tbody>');
            		table.append(body);
                    for (var i = 0; i < matches.length; i++) {
                        var D = matches[i];
                        var netName = typeof D.name !== "undefined" ? D.name : D.cluster;
                        if (D.parent.toLowerCase().startsWith("mega"))
                            netName = "Mega" + netName;
                        var ascore = isDiced ? D.ascore : '';
                        var ascoreText = isDiced ? (' AS ' + D.ascore) : '';
                        var tr = $('<tr>');
                        tr.append('<td><a href="https://www.uniprot.org/uniprot/' + D.uniprot_id + '">' + D.uniprot_id + '</a></td>');
                        tr.append('<td><a href="' + getResultsUrl(D.cluster, ascore) + '">' + netName + ascoreText + '</a></td>');
                        //tr.append('<td></td>');
                        tr.append('<td>' + D.organism + '</td>');
                        tr.append('<td>' + D.status + '</td>');
                        body.append(tr);
                    }
                    $("#searchResults").append(table);
                };

                var numSeq = data.matches.length;
                
                $("#searchResults").empty();
                $("#searchResults").append('<div class="my-5 bigger">Query:<br><b>' + data.query + '</b><br>Number of Sequences Found: ' + numSeq + '</div>');

                processFn(data.matches);

                $("#searchResults").append('<div class="my-5"></div>');
                
                if (typeof data.diced_matches !== "undefined" && data.diced_matches.length > 0) {
                    $("#searchResults").append('<div class="mt-5"><h4>Diced Clusters</h4></div>');
                    processFn(data.diced_matches);
                }

                $("#searchResultsContainer").show();
                
                if (typeof id === "function")
                    id(data.id);

                progress.stop();
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
        $("#searchResultsContainer").show();
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

