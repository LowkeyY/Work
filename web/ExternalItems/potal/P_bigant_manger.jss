Ext.namespace("ExternalItems.potal");
ExternalItems.potal.P_bigant_manger = function() {
}

ExternalItems.potal.P_bigant_manger.prototype = {
	init : function(src, param) {
		src.isIFrame = 'true';
		src.url = "http://192.168.0.196:8000";
		var bsNode = new WorkBench.baseNode();
		bsNode.init(src);
	}
}