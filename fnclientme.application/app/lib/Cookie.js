function Cookie() {  
    this.initialContents = [ this.generateDevices(), this.generateGroups(), this.generateSettings() ];  
    this.cookieContents = {};  
    this.cookie = null;  
} //endfunction Cookie
  
Cookie.prototype.initialize = function() {  
    this.cookie = new Mojo.Model.Cookie('fncme-2013_6');  
    this.storedCookieData = this.cookie.get();  
    this.cookieContents = this.initialContents;  
  
    if(this.storedCookieData)  
    {  
        this.cookieContents = this.storedCookieData;  
    }  
  
    this.storeCookie();  
}; //endfunction initialize
  
Cookie.prototype.setCookieData = function(cookieContents) {  
    this.cookieContents = cookieContents;  
    this.storeCookie();  
}; //endfunction setCookieData
  
Cookie.prototype.getCookieData = function() {  
    return this.cookieContents;  
}; //endfunction getCookieData
  
Cookie.prototype.storeCookie = function() {  
    this.cookie.put(this.cookieContents);  
}; //endfunction storeCookie

Cookie.prototype.generateDevices = function() {
	d = new Array(12);
	for (var i=0; i<12; i++) {
		d[i] = {label:'Device ' + (i+1), value:'dev#' + (i+1) + '#1#1'}; 
	} //endfor
	
	return d;
}; //endfunction generateDevices

Cookie.prototype.generateGroups = function() {
	g = new Array(12);
	for (var i=0; i<12; i++) {
		g[i] = {label:'Group ' + (i+1), value:'grp#' + (i+1) + '#0'}; 
	} //endfor
	
	return g;
}; //endfunction generateGroups

Cookie.prototype.generateSettings = function() {
	data = new Array(3);
	data[0] = 'fnserver.node751.ns01.biz';
	data[1] = '';
	data[2] = '';
	
	return data;
}; //endfunction generateSettings