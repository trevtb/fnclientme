function AboutDialogAssistant(sceneAssistant) {
  this.sceneAssistant = sceneAssistant;
  this.controller = sceneAssistant.controller;
}

AboutDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  this.sceneAssistant.controller.setupWidget("okAboutButton",
    this.attributes = {},
    this.model = {
      buttonLabel: "OK",
      buttonClass: "affirmative",
      disabled: false
    }
  );
  this.checkIt = this.checkIt.bindAsEventListener(this);
  Mojo.Event.listen($('okAboutButton'), Mojo.Event.tap, this.checkIt);
}; //endfunction setup

AboutDialogAssistant.prototype.checkIt = function() {
	this.widget.mojo.close();
}; //endfunction checkIt

AboutDialogAssistant.prototype.cleanup = function() {
	this.sceneAssistant.controller.stopListening($('okAboutButton'), Mojo.Event.tap, this.checkIt);
}; //endfunction cleanup