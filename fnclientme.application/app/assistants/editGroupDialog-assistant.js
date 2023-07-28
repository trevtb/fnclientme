function EditGroupDialogAssistant(sceneAssistant, groupData, data, callBack) {
  this.callBack = callBack;
  this.data = data;
  this.sceneAssistant = sceneAssistant;
  this.controller = sceneAssistant.controller;
  this.groupName = groupData.label;
  this.groupTmp = groupData.value.split("#");
  this.devices = Array();
  
  var isempty = false;
  for (var i=2; i<this.groupTmp.length; i++) {
	  if (parseInt(this.groupTmp[i]) == 0) {
		  isempty = true;
	  } //endif
	  this.devices.push(this.groupTmp[i]);
  } //endfor
  if (isempty) {
	  this.devices = Array();
	  this.devices[0] = 0;
  } //endif
}
EditGroupDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  this.sceneAssistant.controller.setupWidget("newGroupName",
    this.grpAttributes = {
      property: "value",
      focus: true,
      limitResize: true,
      textReplacement: false,
      enterSubmits: false
    },
    this.nameModel = {value : this.groupName}
  );
  
  this.sceneAssistant.controller.setupWidget("okGrpButton",
    this.attributes = {},
    this.model = {
      buttonLabel: "OK",
      buttonClass: "affirmative",
      disabled: false
    }
  );
  Mojo.Event.listen($('okGrpButton'), Mojo.Event.tap, this.checkIt.bindAsEventListener(this));
  
  if (this.devices[0] == 0) {
	  this.grpListData = [];
  } else {
	this.grpListData = Array();
	for (var i=0; i<this.devices.length; i++) {
		this.grpListData.push({data:this.data[0][parseInt(this.devices[i])-1].label});
	}  //endfor
  } //endif
  
  this.devGrpModel = { items: this.grpListData};
  
  this.sceneAssistant.controller.setupWidget("devGrpList",
			{
				itemTemplate: 'first/item-template',
				listTemplate: 'first/list-template',
				addItemLabel: 'Add',
				hasNoWidgets: true,
				swipeToDelete: true,
		        reorderable: true,
			},
		    
			this.devGrpModel);
  this.controller.listen($("devGrpList"), Mojo.Event.listAdd, this.listAdd.bindAsEventListener(this));
  this.controller.listen('devGrpList',Mojo.Event.listDelete, this.listDelete.bindAsEventListener(this));
  this.controller.listen('devGrpList', Mojo.Event.listReorder, this.reorderItem.bindAsEventListener(this));
  
  this.scrollModel = {
		  				mode:'vertical',
  };

  
  this.controller.setupWidget($('groupScroller'), this.scrollModel, {});
};

EditGroupDialogAssistant.prototype.cleanup = function() {
	this.sceneAssistant.controller.stopListening($('okGrpButton'), Mojo.Event.tap, this.checkIt);
	this.controller.stopListening('devGrpList', Mojo.Event.listAdd, this.listAdd);
	this.controller.stopListening('devGrpList', Mojo.Event.listDelete, this.listDelete);
	this.controller.stopListening('devGrpList', Mojo.Event.listReorder, this.reorderItem);
}; //endfunction cleanup

EditGroupDialogAssistant.prototype.checkIt = function() {
	var value = this.controller.get("newGroupName").mojo.getValue();
	if (value.match(/^[a-zA-Z0-9\ ]*$/)) {
		var num = parseInt(this.groupTmp[1]);
		num = num - 1;
		this.data[1][num].label = value;
		this.callBack(this.data, num);
		this.widget.mojo.close();
	} else {
		Mojo.Controller.errorDialog("The group name may not contain special characters.");
	} //endif
}; //endfunction checkIt

EditGroupDialogAssistant.prototype.listAdd = function() {
	var tmpi = this.data[1][parseInt(this.groupTmp[1]) - 1].value;
	var tmpar = tmpi.split('#');
	
	var menuItems = Array();
	for (var i=0; i<this.data[0].length; i++) {
		var tmpData = this.data[0][i].value.split('#');
		var num = parseInt(tmpData[1]);
		var num = num - 1;
		
		menuItems[i] = {label:this.data[0][i].label, command:num + '#' + parseInt(this.groupTmp[1]) + '#' + parseInt(tmpar[2])};
	} //endfor
	
	this.controller.popupSubmenu({
	      onChoose: this.handleSelection,
	      placeNear: event.target,
	      items: menuItems
	    });
}; //endfunction listAdd

EditGroupDialogAssistant.prototype.listDelete = function(event) {
	this.devices[event.index] = 'zero';
	var tmpD = new Array();
	for (var i=0; i<this.devices.length; i++) {
		if (this.devices[i] != 'zero') {
			tmpD.push(this.devices[i]);
		} //endif
	} //endfor
	
	var tmpS = 'grp#' + this.groupTmp[1];
	
	for (var i=0; i<tmpD.length; i++) {
		tmpS += '#' + tmpD[i];
	} //endfor
	
	this.data[1][parseInt(this.groupTmp[1]) - 1].value = tmpS;
}; //endfunction listDelete

EditGroupDialogAssistant.prototype.handleSelection = function(value) {
	if (value != null) {
		var ar = value.split('#');
		var pos = parseInt(ar[0]);
		var num = parseInt(ar[1]);
		var first = parseInt(ar[2]);
		
		var dataAr = [{data:this.data[0][pos].label}];
		this.controller.get($('devGrpList')).mojo.noticeAddedItems(this.controller.get($('devGrpList')).mojo.getLength(), dataAr);
		this.controller.get($('devGrpList')).mojo.revealItem((this.controller.get($('devGrpList')).mojo.getLength() - 1), false);
		
		if (first == 0) {
			this.data[1][num-1].value = 'grp#' + num + '#' + (pos+1);
		} else {
			this.data[1][num-1].value += '#' + (pos+1);
		} //endif
	} //endif
}; //endfunction handleSelection

EditGroupDialogAssistant.prototype.reorderItem = function (event) {
	Mojo.Log.info("reorder event %j", event.item, event.toIndex, event.fromIndex);
 
	this.devGrpModel.items.splice(event.fromIndex, 1);
	this.devGrpModel.items.splice(event.toIndex, 0, event.item);
	
	var tmp = this.devices[event.fromIndex];
	var tar = Array();
	tar[event.toIndex] = this.devices[event.fromIndex];
	this.devices[event.fromIndex] = 'zero';
	
	var count = 0;
	for (var i=0; i<this.devices.length; i++) {
		if (this.devices[i] != 'zero') {
			if (count == event.toIndex) {
				count = count +1;
			} //endif
			tar[count] = this.devices[i];
			count = count + 1;
		} //endif
	} //endfor
	
	this.devices = tar;
	
	this.data[1][parseInt(this.groupTmp[1]) - 1].value = 'grp#' + this.groupTmp[1];
	for (var i=0; i<this.devices.length; i++) {
		this.data[1][parseInt(this.groupTmp[1]) - 1].value += '#' + this.devices[i];
	} //endfor
};