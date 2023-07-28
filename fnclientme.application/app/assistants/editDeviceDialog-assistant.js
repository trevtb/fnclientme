function EditDeviceDialogAssistant(sceneAssistant, devData, callBack) {
  this.sceneAssistant = sceneAssistant;
  this.controller = sceneAssistant.controller;
  
  this.tmpArray = devData.value.split("#");
  
  this.devName = devData.label;
  this.devChan = this.tmpArray[2];
  this.devSwitch = this.tmpArray[3];
  this.pos = this.tmpArray[1];
  this.callBack = callBack;
  
  this.chanListener = this.chanListener.bindAsEventListener(this);
  this.switchListener = this.switchListener.bindAsEventListener(this);
}

EditDeviceDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  this.sceneAssistant.controller.setupWidget("newDeviceName",
    this.urlAttributes = {
      property: "value",
      focus: true,
      limitResize: true,
      textReplacement: false,
      enterSubmits: false
    },
    this.nameModel = {value : this.devName}
  );
  
  this.sceneAssistant.controller.setupWidget("newChannel",
		  this.channelAttributes = {
		  	label: "Channel",
		  	modelProperty: "value",
		  	min: 1,
		  	max: 4
    	  },
    	  this.channelModel = {value : parseInt(this.devChan)}
  );
  this.controller.listen(this.controller.get("newChannel"),
		  Mojo.Event.propertyChange, this.chanListener); 

  
  this.sceneAssistant.controller.setupWidget("newSwitch",
		   this.channelAttributes = {
			  label: "Switch",
		      modelProperty: "value",
		      min: 1,
		      max: 3
		    },
		    this.channelModel = {value : parseInt(this.devSwitch)}
  );
  
  this.controller.listen(this.controller.get("newSwitch"),
		  Mojo.Event.propertyChange, this.switchListener); 

  
  this.sceneAssistant.controller.setupWidget("okDevButton",
    this.attributes = {},
    this.model = {
      buttonLabel: "OK",
      buttonClass: "affirmative",
      disabled: false
    }
  );
  Mojo.Event.listen($('okDevButton'), Mojo.Event.tap, this.checkIt.bindAsEventListener(this));
};

EditDeviceDialogAssistant.prototype.cleanup = function() {
	this.sceneAssistant.controller.stopListening($('okDevButton'), Mojo.Event.tap, this.checkIt);
	this.sceneAssistant.controller.stopListening($('newChannel'), Mojo.Event.tap, this.chanListener);
	this.sceneAssistant.controller.stopListening($('newSwitch'), Mojo.Event.tap, this.switchListener);
}; //endfunction cleanup

EditDeviceDialogAssistant.prototype.checkIt = function() {
	var name = this.sceneAssistant.controller.get("newDeviceName").mojo.getValue();
	
	if (name.match(/^[a-zA-Z0-9\ ]*$/)) {
		this.callBack(name, this.devChan, this.devSwitch, (this.pos -1));
		this.widget.mojo.close();
	} else {
		Mojo.Controller.errorDialog("The device name may not contain special characters.");
	} //endif
};

EditDeviceDialogAssistant.prototype.chanListener = function(event) {
	this.devChan = event.value;
};

EditDeviceDialogAssistant.prototype.switchListener = function(event) {
	this.devSwitch = event.value;
};