var FNCommandAssistant = function() {
} //endfunction FNCommandAssistant

FNCommandAssistant.prototype.run = function(future) {
	
	data = this.controller.args.data.split("#");
	type = data[0];
	server = data[1];
	port = data[2];
	transmission = '';
	
	if (type == 'dev') {
		transmission = data[3];
		this.makeConnection(future, type, server, port, transmission);
	} else if (type == 'grp') {
		var trans = Array();
		for (var i=3; i<data.length; i++) {
			trans.push(data[i]);
		} //endfor
		
		transmission = trans;
		
		this.makeConnection(future, type, server, port, transmission);
	} //endif
} //endfunction run

FNCommandAssistant.prototype.makeConnection = function(future, type, server, port, transmission) {
	if (type == 'dev') {
		var num = parseInt(transmission);
		transmission = "aaam" + transmission;
		if (num < 10) {
			transmission += ".";
		} //endif
		transmission += "\n";
	} else if (type == 'grp') {
		for (var i=0; i<transmission.length; i++) {
			var num = parseInt(transmission[i]);
			transmission[i] = "aaam" + transmission[i];
			if (num < 10) {
				transmission[i] += ".";
			} //endif
			transmission[i] += "\n";
		} //endfor
	} //endif
	
	future.result = {reply: "command to be executed: " + transmission};
	
	if (type == 'dev') {
		this.doConnect(transmission, server, port);
	} else if (type == 'grp') {
		for (var i=0; i<transmission.length; i++) {
			this.doConnect(transmission[i], server, port);
		} //endfor
	} //endif
} //endfunction makeConnection

FNCommandAssistant.prototype.doConnect = function(command, server, port) {
	var net = IMPORTS.require('net');
	
	// create a new client connection
	var client = net.createConnection(parseInt(port), server);
	
	// event handler when data arrives from the server
	client.on("data", function(data) {
		 console.error("Received data: " + data.toString());
	});
	// event handler called after a connection has been established
		client.on("connect", function() {
		console.error("Connection established !");
		client.write(command, 1);
		client.end();
	});

	// event handler called in case of an error
	client.on('end', function() {
		console.error("Connection killed.");
	});
} //endmethod doConnect