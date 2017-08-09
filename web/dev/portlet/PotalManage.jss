Ext.namespace("dev.portlet");
/**
 * portLet样式管理-tz
 * 2009/08/05
 * */
dev.portlet.PotalManage = function(objectId, returnFunction) {

	var defaultWidth = 260;
	var defaultHeight = 200;
	var pid = Ext.id();
	var loadData = function(panel) {
		Ext.Ajax.request({
			url : '/dev/portlet/PotalManage.jcp?objectId=' + panel.objectId
					+ '&r=' + Math.random(),
			method : 'GET',
			success : function(response, options) {
				var result = Ext.decode(response.responseText);
				if (result.success) {
					var box = panel.getBox();
					var width = box.width - defaultWidth;
					for (var i = 0, arr = result.config, x = 0, y = 0; i < arr.length; i++) {
						if (!arr[i].width) {
							if (x > width) {
								y += defaultHeight;
								x = 0;
							}
							arr[i].width = defaultWidth;
							arr[i].height = defaultHeight;
							arr[i].x = x;
							arr[i].y = y;
							x += defaultWidth;
						} else {
							arr[i].width *= box.width;
							arr[i].height *= box.height;
							arr[i].x *= box.width;
							arr[i].y *= box.height;
						}
						var subPanel = new dev.portlet.PotalManage.Portlet(arr[i]);
						panel.add(subPanel);
					}
					panel.doLayout();
				} else {
					Ext.msg("error", '获取数据错误,原因是'.loc() + result.message);
				}
			}
		});
	}

	var topButtons = [new Ext.Button({
		text : '保存'.loc(),
		icon : '/themes/icon/xp/save.gif',
		cls : 'x-btn-text-icon  bmenu',
		pid : pid,
		handler : function(btn) {
			var panel = Ext.getCmp(btn.pid);
			var mainBox = Ext.fly(panel.body).getBox();
			var arr = new Array();
			panel.items.each(function(item) {
						var box = item.getBox();
						arr.push({
									objectId : item.objectId,
									x : (box.x - mainBox.x) / mainBox.width,
									y : (box.y - mainBox.y) / mainBox.height,
									width : box.width / mainBox.width,
									height : box.height / mainBox.height,
									showTitle : item.showTitle,
									showBorder : item.showBorder,
									type : item.type,
									subType : item.subType,
									title : item.title
								});
					});
			Ext.Ajax.request({
						url : '/dev/portlet/PotalManage.jcp',
						method : 'POST',
						params : {
							objectId : panel.objectId,
							layout : Ext.encode(arr)
						},
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success) {
								Ext.msg("info", '保存成功!'.loc());
							} else {
								Ext.msg("error", '保存数据错误,原因是'.loc() + result.message);
							}
						}
					});
		}
	}),  new Ext.Button({
				text : '重置'.loc(),
				icon : '/themes/icon/xp/refresh.gif',
				pid : pid,
				cls : 'x-btn-text-icon  bmenu',
				handler : function(btn) {
					var panel = Ext.getCmp(btn.pid);
					Ext.Ajax.request({
								url : '/dev/portlet/PotalManage.jcp',
								method : 'POST',
								params : {
									objectId : panel.objectId,
									layout : ''
								},
								success : function(response, options) {
									var result = Ext
											.decode(response.responseText);
									if (result.success) {
										loadData(panel);
										Ext.msg("info", '重置成功!'.loc());
										panel.items.each(function(item) {
													this.remove(item, true);
												}, panel);
									} else {
										Ext.msg("error", '重置错误,原因是'.loc()
														+ result.message);
									}
								}
							});
				}
			}), new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				handler : returnFunction
			})];
	var outter = new Ext.Panel({
				id : pid,
				objectId : objectId,
				tbar : topButtons,
				layout : 'absolute',
				bodyStyle : 'overflow:auto;'
			});

	loadData(outter);
	return outter;

}
/**
 * 子panel类,支持布局,缩放,自动内容生成,简单设置
 */
dev.portlet.PotalManage.Portlet = Ext.extend(Ext.Panel, {
	chartImage : {
		"1" : "chartLine",
		"2" : "chartColumn",
		"5" : "chartPie"
	},
	initComponent : function() {
		Ext.apply(this, {
					tbar :["", '->', {
							text : '设定'.loc(),
							menu : new Ext.menu.Menu({
										items : [{
													text : '显示标题栏'.loc(),
													name : 'showTitle',
													checked : this.showTitle,
													cid : this.id,
													checkHandler : this.onItemCheck
												}, {
													text : '显示边框'.loc(),
													name : 'showBorder',
													checked : this.showBorder,
													cid : this.id,
													checkHandler : this.onItemCheck
												}]
									})
					}],
					header : true,
					border : this.showBorder || false
				});
		dev.portlet.PotalManage.Portlet.superclass.initComponent.call(this);
	},
	onRender : function(ct, position) {
		this.createContent(ct);
		dev.portlet.PotalManage.Portlet.superclass.onRender.call(this,ct,position);
		this.setTitleVisible(this.showTitle);
		this.el.setStyle("position", "absolute");
	},
	initEvents : function() {
		dev.portlet.PotalManage.Portlet.superclass.initEvents.call(this);
		var container = this.ownerCt.body;
		this.resizer = new Ext.Resizable(this.el, {
					minWidth : 150,
					minHeight : 100,
					handles : "all",
					constrainTo : container,
					relatedPanel : this,
					transparent : true,
					resizeElement : function() {
						var box = this.proxy.getBox();
						this.relatedPanel.updateBox(box);
						if (this.relatedPanel.layout) {
							this.relatedPanel.doLayout();
						}
						return box;
					}
				});
		this.dd = new Ext.dd.DD(this);
		this.dd.startDrag = function() {
			this.constrainTo(container);
		};
	},
	beforeDestroy : function() {
		delete this.resizer.relatedPanel;
		Ext.destroy(this.resizer, this.dd);
		dev.portlet.PotalManage.Portlet.superclass.beforeDestroy.call(this);
	},
	// private
	getImagePath : function(name) {
		return '/dev/portlet/image/' + name + '.png';
	},
	createContent : function(ct) {
		if (this.type == '5') {// 统计图页面
			if (!this.backgroundImage) {
				this.backgroundImage = this.chartImage[this.subType];
				if(typeof(this.backgroundImage)=='undefined')
					this.backgroundImage = this.chartImage[1];
			}
			this.html = "<img style='width:100%;height:100%;' src='"
					+ this.getImagePath(this.backgroundImage)
					+ "'  class='x-unselectable'>";
		} else if (this.type == '9') {// 单记录查询
			// 临时--用图片意义不大。再看。
			this.backgroundImage = "embedBinary";
			this.html = "<div style='width:100%;height:100%;overflow:hidden;'><img src='"
					+ this.getImagePath(this.backgroundImage)
					+ "' class='x-unselectable'>";
		} else if (this.type == '10') {// 列表查询
			// 临时--最好能把ListView引进来。
			this.backgroundImage = "embedBinary";
			this.html = "<div style='width:100%;height:100%;overflow:hidden;'><img src='"
					+ this.getImagePath(this.backgroundImage)
					+ "' class='x-unselectable'>";
		} else if (this.type == '11') {// 外挂程序
			this.backgroundImage = "embedBinary";
			this.html = "<div style='width:100%;height:100%;overflow:hidden;'><img src='"
					+ this.getImagePath(this.backgroundImage)
					+ "' class='x-unselectable'>";
		}
	},
	onItemCheck : function(btn) {
		var panel = Ext.getCmp(btn.cid);
		if (btn.name == 'showTitle') {
			panel.setTitleVisible(btn.checked);
		} else if (btn.name == 'showBorder') {
			panel.setBorderVisible(btn.checked);
		}
	},
	setTitleVisible : function(visible) {
	//	var textItem = this.getTopToolbar().items.get(0);
	//	Ext.fly(textItem.getEl()).update(visible ? "" : "(" + this.title + ")");
		this.showTitle = visible;
		this.header.setStyle("display", visible ? "block" : "none");
	},
	setBorderVisible : function(visible) {
		this.showBorder = visible;
		var fnName = visible ? "removeClass" : "addClass";
		this.el[fnName](this.baseCls + '-noborder');
		this.body[fnName](this.bodyCls + '-noborder');
		this.header[fnName](this.headerCls + '-noborder');
		this.tbar[fnName](this.tbarCls + '-noborder');
		this.body.setWidth(this.body.getWidth() + (visible ? -2 : 2));
	}
})