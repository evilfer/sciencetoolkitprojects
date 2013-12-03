/*
http://stackoverflow.com/questions/1090948/change-url-parameters/10997390#10997390
*/



function updateURLParameter(url, param, paramVal) {
    var theAnchor = null;
    var theParams = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    var tmpAnchor;

    if (additionalURL) {
        tmpAnchor = additionalURL.split("#");
        theParams = tmpAnchor[0];
        theAnchor = tmpAnchor[1];
        if (theAnchor) {
            additionalURL = theParams;
        }


        tempArray = additionalURL.split("&");

        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    } else {
        tmpAnchor = baseURL.split("#");
        theParams = tmpAnchor[0];
        theAnchor = tmpAnchor[1];

        if (theParams) {
            baseURL = theParams;
        }
    }

    var value = encodeURIComponent(theAnchor ? paramVal + "#" + theAnchor : paramVal);

    var rows_txt = temp + "" + param + "=" + value;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function obj2query(data) {
    var output = "";
    for (var key in data) {
        if (output.length > 0) {
            output += "&";
        }
        output += key + "=" + encodeURIComponent(data[key]);
    }
    return output;
}