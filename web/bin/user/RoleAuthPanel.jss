Ext.namespace("bin.user");

bin.user.RoleAuthPanel = function(config) {

	this.authDs = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/bin/user/auth.jcp",
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, [{
									name : 'applicationArray',
									mapping : 'application_array'
								}]),
				remoteSort : false
			});

	this.AuthPanel = new Ext.Panel({
				frame : false,
				width : 280,
				collapsible : true,
				layout : 'fit'
			});
	var cf = {
		title : this.title,
		region : 'east',
		collapsible : false,
		split : false,
		width : 450,
		autoScroll : true,
		minSize : 175,
		maxSize : 400,
		layout : 'fit',
		margins : '0 0 0 0',
		items : this.AuthPanel
	};
	if (config)
		Ext.apply(cf, config)
	bin.user.RoleAuthPanel.superclass.constructor.call(this, cf);
};

Ext.extend(bin.user.RoleAuthPanel, Ext.Panel, {

	renderTree : function(params) {
		this.authDs.baseParams = params;
		this.authDs.load();
		var treeHtml;
		this.authDs.on('load', function() {
			treeHtml = '<div><div><img align=absbottom src="/themes/jsvm/system/img/menutree/block.gif"/><span>'
					+ '角色权限'.loc() + '</span></div></div>';

			var applicationArray = this.authDs.getAt(0).data.applicationArray;
			for (var i = 0; i < applicationArray.length; i++) {
				var systemId = applicationArray[i].system_id;
				var systemName = applicationArray[i].system_name;
				var sysApplicationAuth = applicationArray[i].application_auth;
				var sysRole = applicationArray[i].sys_role;

				var chkstr = "";
				var st = " class=\"middle\"";

				if (sysApplicationAuth.length != 0)
					chkstr = "checked";
				if (i == applicationArray.length - 1)
					st = " class=\"top\"";

				var gif = "block.gif";
				if (sysRole.length == 0)
					gif = "bottom.gif";

				treeHtml += '<div class="show"><div '
						+ st
						+ '><img align=absbottom src="/themes/jsvm/system/img/menutree/'
						+ gif + '"/><span>' + systemName
						+ '</span></div></div>';

				for (var j = 0; j < sysRole.length; j++) {
					var chk = "";
					for (var k = 0; k < sysApplicationAuth.length; k++) {
						if (sysApplicationAuth[k].role_id == sysRole[j].role_id) {
							chk = "checked";
							break;
						}
					}
					var style = " class=\"middle\"";
					var sty = " class=\"middle\"";

					if (j == sysRole.length - 1)
						style = " class=\"top\"";
					if (i == applicationArray.length - 1)
						sty = "";

					treeHtml += '<div class="show"><div '
							+ sty
							+ '><div class="show"><div'
							+ style
							+ '><img align=absbottom src="/themes/jsvm/system/img/menutree/bottom.gif"/><a href="#"><input type="checkbox" name="syschk" value='
							+ systemId + 'S' + sysRole[j].role_id + ' ' + chk
							+ '/></a><span>' + sysRole[j].auth_id
							+ '</span></div></div></div></div>';
				}
			}
			this.AuthPanel.getEl().update(treeHtml);
		}, this);
	}
});
