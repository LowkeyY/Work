CPM.manager.ProgramEmbed = Ext.extend(CPM.manager.CustomizeObject, {
	configCache : {},
	/**
	 * 强制每次使用load,不调用updateData
	 */
	forceToLoad : false,

	// private
	className : 'CPM.manager.ProgramEmbed',
	programType : 'ProgramEmbed',
	swfId : '',// 错误，需要协商。
	doCommand : function(cmd, param, parentPanel) {
		var panel = parentPanel.getComponent(0);
		if (panel && panel.jsObj && panel.jsObj.applyState) {
			panel.jsObj.applyState(cmd, param, panel);
		}

	},
	updateData : function(panel, param) {
		var json = this.configCache[param.objectId];
		var prgInfo = Ext.decode(json);
		if (prgInfo.isIframe == '1') {
			panel.removeAll(false);
			this.loadEmbedProgram(panel.ownerCt, panel, param, prgInfo);
		} else if (prgInfo.isIframe == '2') {
			if (panel.jsObj.updateData)
				panel.jsObj.updateData(param);

		} else if (prgInfo.isIframe == '3') {
			var swf = Ext.get(this.swfId);
			param.ra = Math.random();
			swf.updateData(param);
		}
	},
	load : function(mode, parentPanel, param) {
		var wrapPanel = new Ext.Panel({
					layout : 'fit',
					param : param,
					border : false
				});
		var json = this.configCache[param.objectId];
		var pm = param;
		CPM.doAction({
					params : {
						objectId : param.objectId,
						programType : this.programType
					},
					method : 'GET',
					success : function(response) {
						json = response.responseText;
						this.configCache[param.objectId] = json;
						this.loadEmbedProgram(parentPanel, wrapPanel, pm, Ext
										.decode(json));
					}
				}, this);
		parentPanel.add(wrapPanel);
		parentPanel.doLayout();
		return wrapPanel;
	},
	loadEmbedProgram : function(framePanel, parentPanel, param, prgInfo) {
		if (framePanel.ownerCt.xtype == 'tabpanel' && prgInfo.title) {
			framePanel.setTitle(prgInfo.title);
		}
		if (prgInfo.isIframe == '1') {// IFRAME
			param.framePanelId = framePanel.id;
			param.parentPanelId = parentPanel.id;

			var embedUrl = prgInfo.url
					+ ((prgInfo.url.indexOf('?') == -1) ? "?" : "&")
					+ Ext.urlEncode(param);
			var panelHeiht = iframeHeight = framePanel.getEl().getHeight();

			var ja = prgInfo.buttonArray;
			var btns = new Array();
			if (typeof(ja) != 'undefined' && ja != null && ja.length > 0) {
				var cb = null;
				for (var i = 0; i < ja.length; i++) {
					cb = this.getButton(ja[i], parentPanel.id);
					btns.push((cb == null) ? ja[i] : cb);
				}
				iframeHeight -= 26;
			}

			parentPanel.add(new Ext.Panel({
						layout : 'fit',
						scope : this,
						border : false,
						height : panelHeiht,
						items : new Ext.ux.IFrameComponent({
									height : iframeHeight,
									url : embedUrl
								}),
						tbar : btns.length ? btns : {hidden:true}
					}));
			parentPanel.doLayout();
		} else if (prgInfo.isIframe == '2') {// js面板
			using(prgInfo.url);
			var obj = null;
			eval("obj=new " + prgInfo.url + "();");
			if (obj != null && typeof(obj.load) != 'undefined') {
				parentPanel.jsObj = obj;
				var ja = prgInfo.buttonArray;
				if (ja && ja.length > 0) {
					var btns = new Array();
					var cb = null;
					for (var i = 0; i < ja.length; i++) {
						cb = this.getButton(ja[i], parentPanel.id);
						btns.push((cb == null) ? ja[i] : cb);
					}
					prgInfo.buttonArray = btns;
				}
				obj.load(framePanel, parentPanel, param, prgInfo);
			}
			this.forceToLoad = this.forceToLoad
					|| (Ext.isObject(obj) && Ext.isFunction(obj.updateData));
		} else if (prgInfo.isIframe == '3') {// flex面板
			var id = Ext.id();
			this.swfId = id + "-swf";
			Ext.applyIf(prgInfo, {
						id : id + "-swf",
						width : "100%",
						bgColor : '#FFFFFF',
						height : "100%"
					});
			var config = {
				layout : 'fit',
				id : id,
				param : param,
				border : false,
				inited : false,
				html : this.getFlashObjectHTML(param, prgInfo),
				updateData : function(data) {
					if (this.inited) {
						Ext.get(this.id + "-swf").updateData(data);
					} else {
						this.data = data;
					}
				},
				listeners : {
					afterrender : function(p) {
						var swf = Ext.get(p.id + "-swf");
						// swf.init();//函数名称是不是这个？
						if (Ext.isDefined(p.data)) {
							p.updateData(p.data);
							delete p.data;
						}
					}
				}
			}
			var height = framePanel.getEl().getHeight();
			var ja = prgInfo.buttonArray;
			if (typeof(ja) != 'undefined' && ja != null && ja.length > 0) {
				var btns = new Array(), cb = null;
				for (var i = 0; i < ja.length; i++) {
					cb = this.getButton(ja[i], id);
					btns.push((cb == null) ? ja[i] : cb);
				}
				config.tbar = btns;
				height -= 26;
				delete prgInfo.buttonArray;
			}
			config.height = height;
			var flexPanel = new Ext.Panel(config);
			flexPanel = parentPanel.add(flexPanel);
			parentPanel.doLayout();
			return flexPanel;
		}
	},
	canUpdateDataOnly : function(panel, parentPanel, param) {
		if (this.foreToLoad) {
			return true;
		} else {
			return (Ext.isDefined(panel))
					&& panel.param.objectId == param.objectId
					&& panel.param.programType == param.programType
		}

	},
	buttonMap : {
		'%return' : function(btn, panelId) {

			this.getSuper().getButton(btn, panelId);
			btn.handler = btn.handler.createInterceptor(function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						delete panel.ownerCt.tz;
						return true;
					}, this);
			return btn;
		}
	},
	getFlashObjectHTML : function(param, config) {
		return Ext.isIE ? this.getObjectHTML(param, config) : this
				.getEmbedHTML(param, config);
	},
	getObjectHTML : function(param, config) {
		var source = '<obj'
				+ 'ect id="'
				+ config.id
				+ '" name="'
				+ config.id
				+ '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'
				+ config.width
				+ '" height="'
				+ config.height
				+ '" codebase="'
				+ ((Ext.isSecure) ? "https" : "http")
				+ '://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">';
		source += '<param name="movie" value="' + config.url + '" />';
		source += '<param name="bgcolor" value="' + config.bgColor + '" />';
		source += '<param name="allowScriptAccess" value="always" />';
		source += '<param name="FlashVars" value="' + Ext.urlEncode(param)
				+ '" />';
		source += '</obj' + 'ect>';
		return source;
	},

	getEmbedHTML : function(param, config) {
		var source = '<embed type="application/x-shockwave-flash" pluginspage="'
				+ ((Ext.isSecure) ? "https" : "http")
				+ '://www.adobe.com/go/getflashplayer" ';
		source += 'src="' + config.url + '" ';
		source += 'width="' + config.width + '" ';
		source += 'height="' + config.height + '" ';
		source += 'id="' + config.id + '" ';
		source += 'name="' + config.id + '" ';
		source += 'bgColor="' + config.bgColor + '" ';
		source += 'allowScriptAccess="always" ';
		source += 'flashvars="' + Ext.urlEncode(param) + '" />';
		return source;
	}
});