export const API_BASE_URL = 'http://localhost:8080';

//export const API_BASE_URL = 'http://'+document.location.hostname+':8080'

export const ACCESS_TOKEN = 'accessToken';

// export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect'

export const OAUTH2_REDIRECT_URI = document.location.origin+'/oauth2/redirect';


// export const OAUTH2_REDIRECT_URI = 'https://'+document.location.hostname+(document.location.port.length>0?':'+document.location.port:'')+'/oauth2/redirect';

export const GOOGLE_AUTH_URL = API_BASE_URL + '/api/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = API_BASE_URL + '/api/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/api/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const WSO2_AUTH_URL = API_BASE_URL + '/api/oauth2/authorize/customClient?redirect_uri=' + OAUTH2_REDIRECT_URI;
