$( document ).ready(function() {
    $('#login_name_form').submit(function() {
        var login_name = $('#github_login').val();

        $.getJSON( "https://api.github.com/users/" + login_name + "/events", function( data ) {
            var items = [];
            $.each( data, function( key, val ) {
                if("PullRequestEvent" == val.type) {
                    var html = construct_pull_req_html(val);
                    items.push(html);
                }
            });

            $('#results').html("<ul>" + items.join('') + "</ul>");

        }); //end getjson
        return false;
    });//end form submit

});//end doc ready

var construct_pull_req_html = function(pull_req_evt){
    var pull_req = pull_req_evt.payload.pull_request,
    repo = pull_req_evt.payload.repo,
    html = "<li>" + 
        "<a target='_blank' href=" + pull_req.html_url + ">" + pull_req.title  +"</a>" +
        "</li>";
    return html;
};