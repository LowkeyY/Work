Ext.namespace("usr.docManage");

function makeFormItemTip(a) {
	if (a.tipText) {
		var f = " ", d = a.tipText, b = document.createElement("img");
		b.src = "/themes/icon/common/help.gif";
		if (!a.noStyle) {
			b.style.verticalAlign = "middle"
		}
		if (a.xtype == "combo") {
			b.style.marginLeft = "16px"
		}
		var c = new Ext.Element(b);
		c.insertAfter(a.el);
		if (a.tipTitle) {
			f = a.tipTitle
		}
		new Ext.ToolTip({
					target : c,
					trackMouse : true,
					showDelay : 0,
					draggable : true,
					maxWidth : 500,
					title : f,
					html : d
				})
	}
}


function cdump(c) {
	if (arguments.length > 0) {
		for (var a = 0; a < arguments.length; a++) {
			try {
				console.log(arguments[a])
			} catch (b) {
			}
		}
	} else {
		try {
			console.log(c)
		} catch (b) {
		}
	}
};

usr.docManage.syncRequest = function(a, g) {
	var b = null;
	if (window.XMLHttpRequest) {
		b = new XMLHttpRequest()
	} else {
		if (window.ActiveXObject) {
			try {
				b = new ActiveXObject("Msxml2.XMLHTTP")
			} catch (d) {
				try {
					b = new ActiveXObject("Microsoft.XMLHTTP")
				} catch (c) {
				}
			}
		}
	}
	b.open("Post", a, false);
	b.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded;charset=utf-8");
	b.send(g);
	var f = b.responseText;
	return f
};

usr.docManage.WEBOFFICECLASS = function() {
			this.init.apply(this, arguments);
		};
usr.docManage.WEBOFFICECLASS.prototype = {
	init : function() {
		this.baseURI = location.href.substr(0, location.href.indexOf("/",location.href.indexOf("//")?location.href.indexOf("//")+2:0)
						+ 1);
		this.wo_view = null;
		this.wo_edit = null
	},
	getNoticeMsg : function(message) {
		var msg;
		if (message) {
			msg = message
		} else {
			msg = "您尚未安装OA系统浏览器辅助组件或者组件已经失效。"
		}
		return msg + "<br /><br />请点击[<a href='/usr/docManage/webactivex.zip'>" 
				+ "<span class='cnoa_color_red'>下载</span></a>]安装(安装之前请关闭浏览器及其它应用程序)！<br />";
	},
	initActiveX : function(officeDivId) {
		if (window.navigator.platform && window.navigator.platform == "Win64") {
			Ext.msg("warn","您正在使用64位版本浏览器，请使用32位版本浏览器访问本系统！");
			return false
		}
		var office = document.getElementById(officeDivId);
		if (office == null) {
			var newOffice = document.createElement("div");
			if (Ext.isIE) {
				newOffice.innerHTML = '<object id="'
						+ officeDivId
						+ '" style="LEFT: -10px; TOP: -10px" height="1" width="1"  ' 
						+ 'classid="clsid:367C478A-F4AC-424F-823F-F7E155526BCA">' 
						+ '<param name="_ExtentX" value="1"><param name="_ExtentY" value="1"></object>'
			} else {
				newOffice.innerHTML = '<object id="'
						+ officeDivId
						+ '" style="LEFT: -10px; TOP: -10px" TYPE="application/x-itst-activex"  ' 
						+ 'clsid="{367C478A-F4AC-424F-823F-F7E155526BCA}" progid="CNOA.WebCtrl"' 
						+ '  height="1" width="1"><param name="_ExtentX" value="1"><param name="_ExtentY" value="1"></object>'
			}
			document.body.appendChild(newOffice);
			office = document.getElementById(officeDivId);
		}
		try {
			var version = office.Version;
			if (!version) {
				Ext.msg("warn",this.getNoticeMsg());
				return false
			}
		} catch (e) {
			Ext.msg("warn",this.getNoticeMsg());
			return false
		}
		return office
	},
	view : function(url, type, windowId) {
		var id = "DMDC_WEBOFFICE";
		var _this = this;
		var myMask = new Ext.LoadMask(Ext.getCmp(windowId).el, {
					msg : "查看office文档"
				});
		myMask.show();
		this.wo_view = this.initActiveX(id);
		if (!this.wo_view) {
			myMask.hide();
			return
		}
		setTimeout(function() {
					try {
						_this.wo_view.openOfficeForView(_this.baseURI + url, type);
						myMask.hide()
					} catch (g) {
						Ext.msg("warn","Office组件初始化失败，请安装浏览器组件以启动Office组件");
						myMask.hide()
					}
				}, 20)
	},
	setPostStr : function(name, value) {
		try {
			this.wo_edit.setWebOfficePostStr(name, value)
		} catch (e) {
			cdump("error for set setWebOfficePostStr()")
		}
	},
	close : function() {
		try {
			this.wo_edit.closeWebOffice()
		} catch (e) {
		}
	}
};

usr.docManage.WO4WFCLASS = Ext.extend(usr.docManage.WEBOFFICECLASS, {
			edit : function(params, type, targetName, state, realname, callbackParams, element, windowId) {
				var f = "DMDC_WEBOFFICE_EDIT4WF";
				var m = Ext.getDom(targetName);
				var startState = state && state=="new" ? 0 : 1;
				if (m!=null && m.length > 0 && Ext.isEmpty(Ext.getDom(element).getAttribute("rid"))) {
					Ext.msg("warn","已经有打开的Office文档未完成保存或发送");
					return false
				} else {
					Ext.getDom(element).setAttribute("id",targetName);
					Ext.getDom(element).setAttribute("rid",Ext.id());
				}
				var _this = this;
				var myMask = new Ext.LoadMask(Ext.getCmp(windowId).el, {
							msg : "编辑office文档"
						});
				myMask.show();
				this.wo_edit = this.initActiveX(f);
				if (!this.wo_edit) {
					myMask.hide();
					return
				}
				setTimeout(function() {
							try {
								_this.wo_edit.openOfficeForEdit(_this.baseURI + params, type, realname, startState, _this.baseURI + callbackParams, 'a=b&c=d', 2, 0)
							} catch (p) {
								Ext.msg("warn","Office组件初始化失败，请安装浏览器组件以启动Office组件");
							}
							myMask.hide()
						}, 50)
			},
			save : function(url) {
				if (url) {
					try {
						url = /^http:|https:/.test(url) ? url : this.baseURI + url;
						this.wo_edit.WO_saveUrl = url;
					} catch (e) {
						cdump("error for set WO_saveUrl")
					}
				}
				try {
					this.wo_edit.saveWebOffice(2)
				} catch (e) {
					cdump("error for saveWebOffice(2)")
				}
			},
			close : function() {
				try {
					this.wo_edit.closeWebOffice(2)
				} catch (a) {
					cdump("error for closeWebOffice(2)")
				}
			}
		});
		
usr.docManage.WO4WF = new usr.docManage.WO4WFCLASS();


usr.docManage.HtmlTextField = Ext.extend(Ext.form.TextField, {
			onRender : function(b, a) {
				usr.docManage.HtmlTextField.superclass.onRender.call(this, b, a);
				makeFormItemTip({
							el : this.el,
							tipText : this.tipText,
							tipTitle : this.tipTitle
						})
			}
		});
Ext.reg("htmltextfield", usr.docManage.HtmlTextField);

usr.docManage.HtmlFormLayout = Ext.extend(Ext.layout.ContainerLayout, {
			type : "htmlform",
			prefix : null,
			cache : true,
			leftmargin : 20,
			rigtmargin : 20,
			topmargin : 20,
			bottommargin : 20,
			loadTemplate : false,
			layoutCallBackTimes : 0,
			layoutPadding : 10,
			onLayout : function(d, h) {
				if (!this.loadTemplate) {
					var g = "";
					if (!this.cache) {
						if (this.template.indexOf("?") > -1) {
							this.template = this.template + "&r="
									+ Math.random()
						} else {
							this.template = this.template + "?r="
									+ Math.random()
						}
					}
					g = usr.docManage.syncRequest(this.template);
					if (!g || g == "") {
						alert("模板" + this.template + "初始化错误!");
						return
					}
					this.prefix = Ext.id();
					var a = d.items.items;
					for (var c = 0; c < a.length; c++) {
						var f = a[c];
						var b = "";
						if (f.name) {
							b = f.name
						} else {
							if (f.hiddenName) {
								b = f.hiddenName
							}
						}
						if (b != "") {
							if (f instanceof Ext.form.DisplayField
									&& f.noWordWrap) {
								f.style = f.style || "";
								f.style += "white-space: normal;";
								g = g.replace("${" + b + "}",
										'<div class="x-form-field-wrap"><table><tr><td id="'
												+ this.prefix + "-" + b
												+ '"></td></tr></table></div>')
							} else {
								g = g.replace(
												"${" + b + "}",
												'<div id="'
														+ this.prefix
														+ "-"
														+ b
														+ '" class="x-form-field-wrap"></div>')
							}
						}
					}
					if (this.templateData
							&& (typeof this.templateData == "object")) {
						for (var c in this.templateData) {
							g = g.replace("${data:" + c + "}",
									this.templateData[c])
						}
					}
					var j = h.createChild({
								tag : "div"
							}, null, true);
					j.innerHTML = '<div class="cunovs-formhtml-layout" style="padding:'
							+ this.layoutPadding + 'px;">' + g + "</div>";
					this.loadTemplate = true
				}
				this.renderAll(d, h);
				if (typeof this.layoutCallBack == "function"
						&& this.layoutCallBackTimes < 1) {
					this.layoutCallBackTimes++;
					this.layoutCallBack.call(this)
				}
			},
			renderItem : function(c, a, d) {
				if (c && !c.rendered) {
					var b = "";
					if (c.name) {
						b = c.name
					} else {
						if (c.hiddenName) {
							b = c.hiddenName
						}
					}
					if (b == "") {
						return
					}
					c.render(this.prefix + "-" + b);
					this.configureItem(c, a)
				}
			}
		});
Ext.Container.LAYOUTS.htmlform = usr.docManage.HtmlFormLayout;