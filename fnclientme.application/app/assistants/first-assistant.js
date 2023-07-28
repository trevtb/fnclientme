function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {
	this.cookie = new Cookie();
	this.cookie.initialize();
	this.data = this.cookie.getCookieData();
	this.selectedItem = this.data[0][0].value;
	this.handleCommand = this.handleCommand.bind(this);
	this.handleEdit = this.handleEdit.bind(this);
	this.handleOn = this.handleOn.bind(this);
	this.handleOff = this.handleOff.bind(this);
	
	this.listModel = {
						value:this.selectedItem,
						choices: this.data[0]
	};
	this.listAttributes = {
			modelProperty:'value',
			label:'SELECT'
	};
	
	this.fnMenuModel = {
			 visible: true,
				items: [
					{
						label:'FNClientME',
						items: [
							{ label: "Devices",  command: 'show-devices', width: 160 },
							{ label: "Groups", command: 'show-groups', width: 160 }
						]
					}
				]
	  };
	
	this.controller.setupWidget(Mojo.Menu.appMenu,
			this.attributes = {
			  omitDefaultItems: true
			},
			this.model = {
			  visible: true,
			  items: [
			      {label: "About", command: 'show-about'},
			      { label: "Settings", command: 'show-settings' },
			  ]
			}); 
	
	this.controller.setupWidget(Mojo.Menu.viewMenu, { spacerHeight: 0, menuClass:'no-fade' }, this.fnMenuModel);
	
	this.controller.setupWidget('selector', this.listAttributes, this.listModel);
	
	this.setupButton('edit');
	Mojo.Event.listen(this.controller.get('edit_button'),Mojo.Event.tap, this.handleEdit); 
	this.setupButton('on');
	Mojo.Event.listen(this.controller.get('on_button'),Mojo.Event.tap, this.handleOn); 
	this.setupButton('off');
	Mojo.Event.listen(this.controller.get('off_button'),Mojo.Event.tap, this.handleOff); 
};

FirstAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening('selector', Mojo.Event.propertyChange, this.handleCommand);
	this.controller.stopListening($('edit_button'), Mojo.Event.tap, this.handleEdit); 
	this.controller.stopListening($('on_button'), Mojo.Event.tap, this.handleOn); 
	this.controller.stopListening($('off_button'), Mojo.Event.tap, this.handleOff); 
};

FirstAssistant.prototype.handleEdit = function(event) {
	var type = this.selectedItem.substring(0,3);
	if (type.match('dev')) {
		var dataArray = this.listModel.value.split("#");
		var devNum = parseInt(dataArray[1]);
		
		var dialog = this.controller.showDialog( {
			template: 'first/editDevice-dialog',
			assistant: new EditDeviceDialogAssistant(this, this.data[0][devNum-1], this.updateDevice.bind(this))
		} );
	} else if (type.match('grp')) {
		var dataArray = this.listModel.value.split("#");
		var grpNum = parseInt(dataArray[1]);
		
		var dialog = this.controller.showDialog( {
			template: 'first/editGroup-dialog',
			assistant: new EditGroupDialogAssistant(this, this.data[1][grpNum-1], this.data, this.updateGroup.bind(this))
		} );
	} //endif
}; //endfunction handleEdit

FirstAssistant.prototype.handleOn = function(event) {
	this.prepareCommand(1);
}; //endfunction handleOn

FirstAssistant.prototype.handleOff = function(event) {
	this.prepareCommand(0);
}; //endfunction handleOff

FirstAssistant.prototype.handleCommand = function(event) {
	  if(event.type == Mojo.Event.command) {
	    switch(event.command) {
	      case 'show-devices':
	    	  	this.selectedItem = this.data[0][0].value;
	    		this.listModel.choices = this.data[0];
	    		this.listModel.value = this.selectedItem;
	    		this.controller.modelChanged(this.listModel, this);
	        break;
	      case 'show-groups':
	    	  	this.selectedItem = this.data[1][0].value;
	    		this.listModel.choices = this.data[1];
	    		this.listModel.value = this.selectedItem;
	    		this.controller.modelChanged(this.listModel, this);
	    	break;
	      case 'show-about':
	    	  this.showAbout();
	    	break;
	      case 'show-settings':
	    	  this.showSettings();
	    	break;
	    } //endswitch
	  } //endif
}; //endfunction handleCommand

FirstAssistant.prototype.setupButton = function(type) {
	var nam = '';
	var lab = '';
	
	switch(type) {
		case 'edit':
			nam = 'edit_button';
			lab = 'Edit';
		  break;
		
		case 'on':
			nam = 'on_button';
			lab = 'ON';
		  break;
		  
		case 'off':
			nam = 'off_button';
			lab = 'OFF';
		  break;
	} //endswitch
			
	this.controller.setupWidget(nam,
			  this.attributes = {},
			  this.model = {
			      label : lab,
			      'button-class': 'affirmative',
			      disabled: false
			  }
	);
}; //endfunction setupButton

FirstAssistant.prototype.showAbout = function() {
	var dialog = this.controller.showDialog( {
		template: 'first/about-dialog',
		assistant: new AboutDialogAssistant(this)
	});
}; //endfunction showAbout

FirstAssistant.prototype.showSettings = function() {
	var dialog = this.controller.showDialog( {
		template: 'first/settings-dialog',
		assistant: new SettingsDialogAssistant(this, this.data[2], this.updateSettings.bind(this))
	});
};

FirstAssistant.prototype.updateSettings = function(newSettings) {
	this.data[2] = newSettings;
	this.cookie.setCookieData(this.data);
}; //endfunction updateSettings

FirstAssistant.prototype.updateDevice = function(name, chan, swit, pos) {
	this.data[0][parseInt(pos)].label = name;
	this.data[0][parseInt(pos)].value = "dev#" + (pos+1) + "#" + chan + "#" + swit;

	this.listModel.choices = this.data[0];
	this.listModel.value = this.data[0][parseInt(pos)].value;
	this.controller.modelChanged(this.listModel, this);
	this.selectedItem = this.data[0][parseInt(pos)].value;
	
	this.cookie.setCookieData(this.data);
}; //endfunction updateDevice

FirstAssistant.prototype.updateGroup = function(data, num) {
	this.data = data;
	this.listModel.choices = this.data[1];
	this.selectedItem = this.data[1][num].value;
	this.listModel.value = this.selectedItem;
	this.controller.modelChanged(this.listModel, this);
	
	this.cookie.setCookieData(this.data);
}; //endfunction updateGroup

FirstAssistant.prototype.prepareCommand = function(command) {
	var tmp = this.listModel.value.split('#');

	if (tmp[0] == 'dev') {
		var chan = parseInt(tmp[2]) - 1;
		var swit = parseInt(tmp[3]) - 1;
		var d = chan * 6;
		d += swit * 2;
		d += command;
		this.executeCommand(d);
	} else if (tmp[0] == 'grp' && parseInt(tmp[2]) != 0) {
		var output = '';
		var devices = Array();
		for (var i=2; i<tmp.length; i++) {
			devices.push(parseInt(tmp[i]) - 1);
			output += ',' + tmp[i];
		} //endfor
		
		var d = '';
		for (var i=0; i<devices.length; i++) {
			var t = this.data[0][devices[i]].value.split('#');
			var chan = parseInt(t[2]) - 1;
			var swit = parseInt(t[3]) - 1;
			var tmp2 = chan * 6;
			tmp2 += swit * 2;
			tmp2 += command;
			if (i != 0) {
				d += ',';
			} //endif
			d += tmp2;
		} //endfor
		
		this.executeCommand(d);
	} //endif
}; //endmethod prepareCommand

FirstAssistant.prototype.executeCommand = function(d) {
	var loginurl = 'http://' + this.data[2][0] + '/tools/api.php?get=cookie&username=' + this.data[2][1] + '&password=' + this.data[2][2];
	Mojo.Log.error(loginurl);
	var request = new XMLHttpRequest();
	request.open('GET', loginurl, true);
	request.send();
	
	var url = 'http://' + this.data[2][0] + '/index.php?docid=action&type=remote&id=' + d;
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.send();
}; //endfunction executeCommand