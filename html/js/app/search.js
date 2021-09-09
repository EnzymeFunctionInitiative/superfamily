
const STATE_HOME = 1;
const STATE_SEQ = 2;
const STATE_ID = 3;
const STATE_TAX = 4;





$(document).ready(function() {

    sessionStorage.clear();

    var searchApp = "search_do.php";
    var historyFn = function(type, id) { history.pushState({state: type, id: id}, null, "#"+type+id); };

    var doIdSearchNav = function (jid) { historyFn(STATE_ID, jid); };
    
    var util = new SearchUtil();
    var render = new SearchRender(util);
    var results = new SearchResults(util, render, searchApp, doIdSearchNav);

    var showResultsFn = function(t, id) {
        $("#searchUi").hide();
        if (t == STATE_ID)
            results.searchIdFn(id);
        else if (t == STATE_SEQ)
            results.searchSeqFn(id);
        else if (t == STATE_TAX)
            results.searchTaxFn(id);
        $("#searchResultsContainer").show();
    };

    var id = window.location.hash.substr(1);
    if (id) {
        var t = id.substr(0, 1);
        var jid = id.substr(1);
        showResultsFn(t, jid);
    } else {
        history.replaceState({state: STATE_HOME}, null, "");
    }

    $(window).on("popstate", function (e) {
        var state = e.originalEvent.state;
        if (state.state == STATE_HOME) {
            $("#searchResultsContainer").hide();
            $("#searchUi").show();
        } else {
            $("#searchResultsContainer").show();
            showResultsFn(state.state, state.id);
//            if (state.state == STATE_TAX) {
//                $("#searchResults table").hide();
//                $("#searchResultsTax").show();
//                console.log("Tax");
//            } else if (state.state == STATE_ID) {
//                $("#searchResults table").hide();
//                $("#searchResultsId").show();
//                console.log("Id");
//            }
            $("#searchUi").hide();
        }
    });

    $("#searchIdBtn").click(function() {
        $("#searchIdErrorMsg").hide();
        results.searchIdFn(doIdSearchNav);
    });
    $("#searchSeqBtn").click(function() {
        $("#searchSeqErrorMsg").hide();
        results.searchSeqFn(function(jid) { historyFn(STATE_SEQ, jid); });
    });
    $("#searchTaxTermBtn").click(function() {
        $("#searchTaxTermErrorMsg").hide();
        results.searchTaxFn(function(jid) { historyFn(STATE_TAX, jid); });
    });


    // Taxonomy typeahead stuff
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

