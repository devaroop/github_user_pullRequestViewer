var current_page = 1;
var gh_login_name = "";

$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return $.getUrlVars()[name];
    }
});

$( document ).ready(function() {
    $('#login_name_form').submit(function() {
        var login_name = $('#github_login').val();
        get_pull_data(login_name, 1);

        return false;
    });//end form submit

    var github_uname_from_url = $.getUrlVar('github_login');
    if(typeof github_uname_from_url !== "undefined"){
        //try seeing if there is a page
        github_uname_from_url = github_uname_from_url.trim();
        if("" !== github_uname_from_url){
            var gh_page = $.getUrlVar('page');
            gh_page = (typeof gh_page === "undefined" ||
                       "" == gh_page)? 1 : gh_page;
            get_pull_data(github_uname_from_url, gh_page);
        }
    }

    $('#next_page').click(function(){
        get_pull_data(gh_login_name, ++current_page);
    });
    
});//end doc ready

var get_pull_data = function(login_name, page){
    $('#next_page').hide();
    $('#ajax-spinner').show();
    _update_window_href(login_name, page);
    $.getJSON( "https://api.github.com/users/" + login_name + "/events?page=" + page, function( data ) {
        var items = [];

        if(0 == data.length) {//no more activity for user
            if( page > 10 ){
                $('#results').html("Can provide only upto 10 pages :(");
            }else{
                $('#results').html("No (more) pull activity for: '" + login_name + "' (page#" + page + ")");
            }
            
            return;
        }

        $.each( data, function( key, val ) {
            if("PullRequestEvent" == val.type &&
               "opened" == val.payload.action) {
                var html = construct_pull_req_html(val);
                items.push(html);
            }
        });
        
        //got no pull requests?
        if(0 == items.length) {
            //try next page
            get_pull_data(login_name, ++page);
            return;
        }
        $('#results').html("<p class='lead'>Pull Requests made by '" + 
                           login_name + "' (page #" + page +")</p>\n" +
                           items.join('')
                          );
        $('#next_page').show();

    }) //end getjson
    .fail(function() {
        //handle 404's
        $('#results').html("<b style='color:red'>Got a 404 :(, Is this a valid Github login?</b>"); 
        $('#next_page').hide();
    })
    .complete(function(){
        $('#ajax-spinner').hide();
    });

};

var construct_pull_req_html = function(pull_req_evt){
    var pull_req = pull_req_evt.payload.pull_request,
    repo = pull_req.base.repo,
    html = '<div class="panel panel-primary">' + 
        '<div class="panel-heading">' +
        '<h3 class="panel-title">' +
        "<a target='_blank' href=" + pull_req.html_url + "><span class='label label-success'>" + repo.name + "</span> : " + pull_req.title  +"</a>" +
        '</h3>' +
        '</div>' +
        '<div class="panel-body">' +
        pull_req.body +
        '</div>' +
        '</div>';
    return html;
};

var _update_window_href = function(login_name, page){
    gh_login_name = login_name;
    current_page = page;
    window.history.pushState("Github user pull request viewer", 
                             "IGNORED", 
                             "/github_user_pullRequestViewer?github_login=" + login_name + "&page=" + page
                            );
};