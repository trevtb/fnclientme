function SettingsDialogAssistant(sceneAssistant, settingsData, callBack) {
  this.sceneAssistant = sceneAssistant;
  this.controller = sceneAssistant.controller;
  this.settingsData = settingsData;
  this.callBack = callBack;
}
SettingsDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  this.sceneAssistant.controller.setupWidget("ipAddr-id",
    this.urlAttributes = {
      property: "value",
      focus: true,
      limitResize: true,
      textReplacement: false,
      enterSubmits: false
    },
    this.nameModel = {value : this.settingsData[0]}
  );
  
  this.sceneAssistant.controller.setupWidget("username-id",
		    this.urlAttributes = {
		      property: "value",
		      focus: false,
		      limitResize: true,
		      textReplacement: false,
		      enterSubmits: false
		    },
		    this.nameModel = {value : this.settingsData[1]}
  );
  
  this.sceneAssistant.controller.setupWidget("password-id",
		    this.urlAttributes = {
		      property: "value",
		      focus: false,
		      limitResize: true,
		      textReplacement: false,
		      enterSubmits: false
		    },
		    this.nameModel = {value : this.settingsData[2]}
  );
  
  
  this.sceneAssistant.controller.setupWidget("okSettingsButton",
    this.attributes = {},
    this.model = {
      buttonLabel: "OK",
      buttonClass: "affirmative",
      disabled: false
    }
  );
  
  Mojo.Event.listen($('okSettingsButton'), Mojo.Event.tap, this.checkIt.bindAsEventListener(this));
};

SettingsDialogAssistant.prototype.cleanup = function() {
	this.sceneAssistant.controller.stopListening($('okSettingsButton'), Mojo.Event.tap, this.checkIt);
}; //endfunction cleanup

SettingsDialogAssistant.prototype.checkIt = function() {
	this.errorMsg = false;
	
	if (!this.verifyIP(this.sceneAssistant.controller.get('ipAddr-id').mojo.getValue()) || !this.verifyUsername(this.sceneAssistant.controller.get('username-id').mojo.getValue())
			|| !this.verifyPassword(this.sceneAssistant.controller.get('password-id').mojo.getValue())) {
		Mojo.Controller.errorDialog("You supplied invalid information. Your data did not get saved.");
		this.errorMsg = true;
	} //endif
	
	if (!this.errorMsg) {
		this.settingsData = new Array(3);
		this.settingsData[0] = this.sceneAssistant.controller.get('ipAddr-id').mojo.getValue();
		this.settingsData[1] = this.sceneAssistant.controller.get('username-id').mojo.getValue();
		this.settingsData[2] = this.sceneAssistant.controller.get('password-id').mojo.getValue();
		this.callBack(this.settingsData);
	} //endif
	
	this.widget.mojo.close();
};

SettingsDialogAssistant.prototype.verifyIP = function (IPValue) {
	retVal = false;
	
	hostParts = Array();
	hostParts = IPValue.split(".");
	if (hostParts.length >= 2) {
		retVal = true;
	} //endif
	
	return retVal;
}; //endfunction verifyIP

SettingsDialogAssistant.prototype.verifyUsername = function (Username) {
	retVal = false;
	
	if (Username.length >= 1) {
		retVal = true;
	} //endif
	
	return retVal;
}; //endfunction verifyUsername

SettingsDialogAssistant.prototype.verifyPassword = function (Password) {
	retVal = false;
	
	if (Password.length >= 8) {
		retVal = true;
	} //endif
	
	return retVal;
}; //endfunction verifyPassword