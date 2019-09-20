$(document).ready(function() {
  //this handles the redirect from swc - should always have code parameter on the page load.  Otherwise shouldn't have code paramet on page load.
  var authorizationCode = getParameterByName('code');
  if (getParameterByName('code')) {
    window.localStorage.setItem("swcAuthorizationCode", authorizationCode.toString());
    getAccessToken(authorizationCode);
  }

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function returnToHome() {
    var url = window.location.protocol + "//" + window.location.host + "/";
    window.location.href = url;
  }

  window.getAuthorizationCode = function() {
    console.log('in here')
    var existingAuthorizationCode = window.localStorage.getItem("swcAuthorizationCode");
    if (existingAuthorizationCode) {
      //we have our authorization code but not our access token, so get access token from my api
      getAccessToken(existingAuthorizationCode)
    } else {
      //we don't have the authorization code, grab it from querystring params
      if (authorizationCode) {
        window.localStorage.setItem("swcAuthorizationCode", authorizationCode.toString())
        getAccessToken(authorizationCode)
      } else {
        swcLogin();
      }
    }
  }
  
  document.getElementById("login").addEventListener("click", window.getAuthorizationCode);

  function swcLogin() {
    var hostUrl = window.location.protocol + "//" + window.location.host + "/";
    var clientId = getClientId();
    window.location.href = "http://www.swcombine.com/ws/oauth2/auth/?response_type=code&client_id=" + clientId + "&scope=CHARACTER_READ&redirect_uri=" + hostUrl + "authorize/index.html&state=auth&access_type=offline"
  }

  function getClientId() {
    var localClientId = 'e5c1500bf34c3cec3761f3049cbc947e1299c7d8';
    return localClientId
  }

  function getAccessToken(authCode) {
    var url = window.location.protocol + "//" + window.location.host + "/";
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": url + "api/v1/login?authorization_code=" + authCode,
      "method": "GET"
    }

    $.ajax(settings).done(function (response) {
      window.localStorage.setItem('swcAccessToken', response.access_token)
      window.localStorage.setItem('swcAccessTokenExpiresAt', response.expires_at)
      returnToHome()
    }).fail(function(error) {
    });
  }

});