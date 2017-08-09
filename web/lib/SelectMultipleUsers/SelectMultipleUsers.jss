Ext.namespace('lib.SelectMultipleUsers');
using("lib.checkTree.TreeCheckNodeUI");

lib.SelectMultipleUsers.SelectMultipleUsers = function(config) {

	lib.SelectMultipleUsers.SelectMultipleUsers.superclass.constructor.call(
			this, config);
	this.style = {
		height : config.height || 55
	};
	this.selectType = config.selectType || 0;// 取值方式：0、邮件，1、短信，2、只显示名称
	this.addLocalTabConf = config.addLocalTabConf || null;
	this.editable = config.editable || this.selectType != 2;//只显示名称时，不可手动编辑。
	this.theCheckNonesAttributesId = "";

	var listTree = new Ext.ux.TreeCheckPanel({
		title : '从通讯录中添加',
		border : false,
		enableDD : true,
		name : 'mailListTree',
		scope : this,
		autoScroll : true,
		addLocalTabConf : this.addLocalTabConf,
		width : (config.menuWidth  || 240),
		height : (config.menuHeight || 550),
		animate : false,
		useArrows : false,
		root : new Ext.tree.AsyncTreeNode({
					text : '通讯录',
					draggable : false,
					expanded : true,
					id : "mail_list_id",
					icon : "/themes/icon/all/group.gif"
				}),
		selModel : new Ext.tree.MultiSelectionModel(),
		listeners : {
			'render' : function(t) {
				this.loader.baseParams = {
					node : this.getRootNode().id,
					selectType : this.scope.selectType
				}
				if (this.addLocalTabConf != null)
					Ext.apply(this.loader.baseParams, {
								tabId : this.addLocalTabConf.tabId,
								groupByCol : this.addLocalTabConf.groupByCol
							});
			},
			'click' : function(node) {
				if (node.hasChildNodes()) {
					node.expand(true, false, function(node) {
						var iterateNodes = function(n) {
							if (n.hasChildNodes()) {
								if (!n.childrenRendered) {
									n.on("expand", function(cn) {
												var cns = cn.childNodes;
												for (var i = 0; i < cns.length; i++) {
													var node = cns[i];
													iterateNodes(node);
												}
											})
								} else {
									var ns = n.childNodes;
									for (var i = 0; i < ns.length; i++) {
										var node = ns[i];
										iterateNodes(node);
									}
								}
							} else {
								if (n.attributes.canRead)
									n.ownerTree.scope.setValueByNode(n);
							}
						};
						node.eachChild(function(n) {
									var n = n;
									iterateNodes(n);
								});
					});
				} else {
					this.scope.setValueByNode(node);
				};
			}
		},
		loader : new Ext.ux.TreeCheckLoader({
					dataUrl : '/lib/SelectMultipleUsers/SelectMultipleUsers.jcp',
					requestMethod : "GET",
					listeners : {
						'beforeload' : function(loader, node ,fn) {
							if(node.ownerTree.scope.selectType == 2){
								Ext.apply(loader.baseParams,{
									"hasDatas" : node.ownerTree.scope.getValue()
								});
							}
						}
					}
				})
	});

	this.selectMenu = new Ext.menu.Menu({
				items : [listTree]
			});
}
Ext.extend(lib.SelectMultipleUsers.SelectMultipleUsers, Ext.form.TriggerField,
		{
			defaultAutoCreate : {
				tag : "textarea",
				autocomplete : "off"
			},
			triggerClass : "x-form-search-trigger iconpicker-trigger",
			onTriggerClick : function() {
				if (this.menu == undefined) {
					this.menu = this.selectMenu;
				}
				this.menu.showAt([this.el.getX() + this.getWidth(),
						this.el.getY()]);
			},
			onRender : function(ct, position) {
				lib.SelectMultipleUsers.SelectMultipleUsers.superclass.onRender.call(this, ct, position);
				this.el.dom.name = "";
				this.hid = this.wrap.createChild({
							tag : "input",
							type : "hidden",
							name : this.name
						});
			},
			setValueByNode : function(n) {
				if(!Ext.isDefined(n.attributes.canRead) || !n.attributes.canRead)
					return;
				var ovs = this.getValue();
				var ovids = this.theCheckNonesAttributesId;
				//手动填写的值，默认载入时格式会不对，一般情况不能手动填写，暂时保留。
				if(this.selectType == 2 && ovs.indexOf("<")==-1)
					ovs = "";
				var vs = ovs.split(",") || [];
				var vsid = ovids.split(",") || [];

				if (n.attributes.checked == "all") {
					if (this.selectType == 0) {
						if(vs.indexOf(n.attributes.text + "<" + n.attributes.email+ ">")==-1)
							vs.push(n.attributes.text + "<" + n.attributes.email+ ">");
					} else if (this.selectType == 1) {
						if(vs.indexOf(n.attributes.text + "<" + n.attributes.celler+ ">")==-1)
							vs.push(n.attributes.text + "(" + n.attributes.celler+ ")");
					} else if (this.selectType == 2) {
						if(vs.indexOf(n.attributes.text+"("+n.attributes.dept_name+")<"+n.attributes.user_id+">")==-1){
							vs.push(n.attributes.text+"("+n.attributes.dept_name+")<"+n.attributes.user_id+">");
							vsid.push(n.attributes.user_id);
						}
					}
				} else if (n.attributes.checked == "none") {
					if (this.selectType == 0) {
						vs.remove(n.attributes.text + "<" + n.attributes.email+ ">");
					} else if (this.selectType == 1) {
						vs.remove(n.attributes.text + "(" + n.attributes.celler+ ")");
					} else if (this.selectType == 2) {
						vs.remove(n.attributes.text+"("+n.attributes.dept_name+")<"+n.attributes.user_id+">");
						vsid.remove(n.attributes.user_id);
					}
				}
				
				if (Ext.isEmpty(vs)){
					this.setValue("");
					this.theCheckNonesAttributesId = "";
				}else{
					var svs = vs.join(",");
					this.setValue(svs.charAt(0)==","?svs.substring(1):svs);
					var svsid = vsid.join(",");
					this.theCheckNonesAttributesId = (svsid.charAt(0)==","?svsid.substring(1):svsid);
				}
					
			},
			getValue : function() {
				if (this.selectType == 2 && Ext.isDefined(this.hid)) {
					return this.hid.dom.value || "";
				}
				return lib.SelectMultipleUsers.SelectMultipleUsers.superclass.getValue.call(this);
			},
			setValue : function(value) {
				if (this.selectType == 2) {
					this.hid.dom.value = value;
					value = value.replace(/<(\d+)>/g,"");
				}
				this.el.update(value);
			}
		});
Ext.reg('SelectMultipleUsers', lib.SelectMultipleUsers.SelectMultipleUsers);
