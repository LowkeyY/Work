﻿/*
 * Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
(function() {
	var r = function(c, j) {
		function r() {
			var a = arguments, b = this.getContentElement("advanced",
					"txtdlgGenStyle");
			b && b.commit.apply(b, a);
			this.foreach(function(b) {
						b.commit && "txtdlgGenStyle" != b.id
								&& b.commit.apply(b, a)
					})
		}
		function i(a) {
			if (!s) {
				s = 1;
				var b = this.getDialog(), d = b.imageElement;
				if (d) {
					this.commit(f, d);
					for (var a = [].concat(a), e = a.length, c, g = 0; g < e; g++)
						(c = b.getContentElement.apply(b, a[g].split(":")))
								&& c.setup(f, d)
				}
				s = 0
			}
		}
		var f = 1, k = /^\s*(\d+)((px)|\%)?\s*$/i, v = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i, o = /^\d+px$/, w = function() {
			var a = this.getValue(), b = this.getDialog(), d = a.match(k);
			d && ("%" == d[2] && l(b, !1), a = d[1]);
			b.lockRatio
					&& (d = b.originalElement, "true" == d
							.getCustomData("isReady")
							&& ("txtHeight" == this.id
									? (a
											&& "0" != a
											&& (a = Math.round(d.$.width
													* (a / d.$.height))), isNaN(a)
											|| b.setValueOf("info", "txtWidth",
													a))
									: (a
											&& "0" != a
											&& (a = Math.round(d.$.height
													* (a / d.$.width))), isNaN(a)
											|| b.setValueOf("info",
													"txtHeight", a))));
			g(b)
		}, g = function(a) {
			if (!a.originalElement || !a.preview)
				return 1;
			a.commitContent(4, a.preview);
			return 0
		}, s, l = function(a, b) {
			if (!a.getContentElement("info", "ratioLock"))
				return null;
			var d = a.originalElement;
			if (!d)
				return null;
			if ("check" == b) {
				if (!a.userlockRatio && "true" == d.getCustomData("isReady")) {
					var e = a.getValueOf("info", "txtWidth"), c = a.getValueOf(
							"info", "txtHeight"), d = 1E3 * d.$.width
							/ d.$.height, f = 1E3 * e / c;
					a.lockRatio = !1;
					!e && !c ? a.lockRatio = !0 : !isNaN(d) && !isNaN(f)
							&& Math.round(d) == Math.round(f)
							&& (a.lockRatio = !0)
				}
			} else
				void 0 != b
						? a.lockRatio = b
						: (a.userlockRatio = 1, a.lockRatio = !a.lockRatio);
			e = CKEDITOR.document.getById(p);
			a.lockRatio ? e.removeClass("cke_btn_unlocked") : e
					.addClass("cke_btn_unlocked");
			e.setAttribute("aria-checked", a.lockRatio);
			CKEDITOR.env.hc
					&& e.getChild(0).setHtml(a.lockRatio ? CKEDITOR.env.ie
							? "■"
							: "▣" : CKEDITOR.env.ie ? "□" : "▢");
			return a.lockRatio
		}, x = function(a) {
			var b = a.originalElement;
			if ("true" == b.getCustomData("isReady")) {
				var d = a.getContentElement("info", "txtWidth"), e = a
						.getContentElement("info", "txtHeight");
				d && d.setValue(b.$.width);
				e && e.setValue(b.$.height)
			}
			g(a)
		}, y = function(a, b) {
			function d(a, b) {
				var d = a.match(k);
				return d ? ("%" == d[2] && (d[1] += "%", l(e, !1)), d[1]) : b
			}
			if (a == f) {
				var e = this.getDialog(), c = "", g = "txtWidth" == this.id
						? "width"
						: "height", h = b.getAttribute(g);
				h && (c = d(h, c));
				c = d(b.getStyle(g), c);
				this.setValue(c)
			}
		}, t, q = function() {
			var a = this.originalElement;
			a.setCustomData("isReady", "true");
			a.removeListener("load", q);
			a.removeListener("error", h);
			a.removeListener("abort", h);
			CKEDITOR.document.getById(m).setStyle("display", "none");
			this.dontResetSize || x(this);
			this.firstLoad && CKEDITOR.tools.setTimeout(function() {
						l(this, "check")
					}, 0, this);
			this.dontResetSize = this.firstLoad = !1
		}, h = function() {
			var a = this.originalElement;
			a.removeListener("load", q);
			a.removeListener("error", h);
			a.removeListener("abort", h);
			a = CKEDITOR.getUrl(CKEDITOR.plugins.get("image").path
					+ "images/noimage.png");
			this.preview && this.preview.setAttribute("src", a);
			CKEDITOR.document.getById(m).setStyle("display", "none");
			l(this, !1)
		}, n = function(a) {
			return CKEDITOR.tools.getNextId() + "_" + a
		}, p = n("btnLockSizes"), u = n("btnResetSize"), m = n("ImagePreviewLoader"), A = n("previewLink"), z = n("previewImage");
		return {
			title : c.lang.image["image" == j ? "title" : "titleButton"],
			minWidth : 420,
			minHeight : 360,
			onShow : function() {
				this.linkEditMode = this.imageEditMode = this.linkElement = this.imageElement = !1;
				this.lockRatio = !0;
				this.userlockRatio = 0;
				this.dontResetSize = !1;
				this.firstLoad = !0;
				this.addLink = !1;
				var a = this.getParentEditor(), b = a.getSelection(), d = (b = b
						&& b.getSelectedElement())
						&& a.elementPath(b).contains("a", 1);
				CKEDITOR.document.getById(m).setStyle("display", "none");
				t = new CKEDITOR.dom.element("img", a.document);
				this.preview = CKEDITOR.document.getById(z);
				this.originalElement = a.document.createElement("img");
				this.originalElement.setAttribute("alt", "");
				this.originalElement.setCustomData("isReady", "false");
				if (d) {
					this.linkElement = d;
					this.linkEditMode = !0;
					var c = d.getChildren();
					if (1 == c.count()) {
						var g = c.getItem(0).getName();
						if ("img" == g || "input" == g)
							this.imageElement = c.getItem(0), "img" == this.imageElement
									.getName()
									? this.imageEditMode = "img"
									: "input" == this.imageElement.getName()
											&& (this.imageEditMode = "input")
					}
					"image" == j && this.setupContent(2, d)
				}
				if (this.customImageElement)
					this.imageEditMode = "img", this.imageElement = this.customImageElement, delete this.customImageElement;
				else if (b && "img" == b.getName()
						&& !b.data("cke-realelement") || b
						&& "input" == b.getName()
						&& "image" == b.getAttribute("type"))
					this.imageEditMode = b.getName(), this.imageElement = b;
				this.imageEditMode
						? (this.cleanImageElement = this.imageElement, this.imageElement = this.cleanImageElement
								.clone(!0, !0), this.setupContent(f,
								this.imageElement))
						: this.imageElement = a.document.createElement("img");
				l(this, !0);
				CKEDITOR.tools.trim(this.getValueOf("info", "txtUrl"))
						|| (this.preview.removeAttribute("src"), this.preview
								.setStyle("display", "none"))
			},
			onOk : function() {
				if (this.imageEditMode) {
					var a = this.imageEditMode;
					"image" == j && "input" == a
							&& confirm(c.lang.image.button2Img)
							? (this.imageElement = c.document
									.createElement("img"), this.imageElement
									.setAttribute("alt", ""), c
									.insertElement(this.imageElement))
							: "image" != j && "img" == a
									&& confirm(c.lang.image.img2Button)
									? (this.imageElement = c.document
											.createElement("input"), this.imageElement
											.setAttributes({
														type : "image",
														alt : ""
													}), c
											.insertElement(this.imageElement))
									: (this.imageElement = this.cleanImageElement, delete this.cleanImageElement)
				} else
					"image" == j
							? this.imageElement = c.document
									.createElement("img")
							: (this.imageElement = c.document
									.createElement("input"), this.imageElement
									.setAttribute("type", "image")), this.imageElement
							.setAttribute("alt", "");
				this.linkEditMode
						|| (this.linkElement = c.document.createElement("a"));
				this.commitContent(f, this.imageElement);
				this.commitContent(2, this.linkElement);
				this.imageElement.getAttribute("style")
						|| this.imageElement.removeAttribute("style");
				this.imageEditMode
						? !this.linkEditMode && this.addLink
								? (c.insertElement(this.linkElement), this.imageElement
										.appendTo(this.linkElement))
								: this.linkEditMode
										&& !this.addLink
										&& (c
												.getSelection()
												.selectElement(this.linkElement), c
												.insertElement(this.imageElement))
						: this.addLink
								? this.linkEditMode
										? c.insertElement(this.imageElement)
										: (c.insertElement(this.linkElement), this.linkElement
												.append(this.imageElement, !1))
								: c.insertElement(this.imageElement)
			},
			onLoad : function() {
				"image" != j && this.hidePage("Link");
				var a = this._.element.getDocument();
				this.getContentElement("info", "ratioLock")
						&& (this.addFocusable(a.getById(u), 5), this
								.addFocusable(a.getById(p), 5));
				this.commitContent = r
			},
			onHide : function() {
				this.preview && this.commitContent(8, this.preview);
				this.originalElement
						&& (this.originalElement.removeListener("load", q), this.originalElement
								.removeListener("error", h), this.originalElement
								.removeListener("abort", h), this.originalElement
								.remove(), this.originalElement = !1);
				delete this.imageElement
			},
			contents : [{
				id : "info",
				label : c.lang.image.infoTab,
				accessKey : "I",
				elements : [{
					type : "vbox",
					padding : 0,
					children : [{
						type : "hbox",
						widths : ["280px", "110px"],
						align : "right",
						children : [{
							id : "txtUrl",
							type : "text",
							label : c.lang.common.url,
							required : !0,
							isReplace : true,
							counts : 0,
							getLongdesc : function(){
								return this.getDialog().getContentElement("advanced","txtGenLongDescr");
							},
							setLongdesc : function(val){
								var field;
								if(field = this.getLongdesc())
									field.setValue(val);
							},
							getConfig : function(value){
								var result = [] , config;
								if(value && (config = value.match(NETDISK_FILE_PATTERN)) && config.length == 3)
									result = config[2].split("::");
								return result;
							},
							getNetdiskConfig : function(){
								var config = [] , filed;
								if(filed = this.getLongdesc())
									return this.getConfig(filed.getValue());
								return config;
							},
							onChange : function() {
								var a = this.getDialog(), b = this.getValue();
								if (0 < b.length) {
									var a = this.getDialog(), d = a.originalElement , rb = "" ,config;
									if(!b.startsWith(NETDISK_FILE_STARTFLAG))
										this.setLongdesc("");
									if((config = this.getNetdiskConfig()).length)
										rb = config[1];
									a.preview.removeStyle("display");
									d.setCustomData("isReady", "false");
									var c = CKEDITOR.document.getById(m);
									c && c.setStyle("display", "");
									d.on("load", q, a);
									d.on("error", h, a);
									d.on("abort", h, a);
									d.setAttribute("src", rb || b);
									t.setAttribute("src", rb || b);
									a.preview.setAttribute("src", rb || t.$.src);
									g(a)
								} else
									a.preview
											&& (a.preview
													.removeAttribute("src"), a.preview
													.setStyle("display", "none"))
							},
							setup : function(a, b) {
								if (a == f) {
									var d = b.data("cke-saved-src")
											|| b.getAttribute("src") , config ;
									this.getDialog().dontResetSize = !0;
									var longdesc = b.getAttribute("longdesc");
									if(longdesc && (config = this.getConfig(longdesc)).length){
										this.setLongdesc(longdesc);
										this.setValue(config[0]);
									} else
										this.setValue(d);
									this.setInitValue()
								}
							},
							commit : function(a, b) {
								var realValue = "" , config;
								if(a == f && this.getValue().startsWith(NETDISK_FILE_STARTFLAG) && (config = this.getNetdiskConfig()).length){
									realValue = config[1];
								}
								a == f && (this.getValue() || this.isChanged())
										? (b.data("cke-saved-src", realValue || this.getValue()), 
										b.setAttribute("src", realValue || this.getValue()))
										: 8 == a && (b.setAttribute("src", ""), b
														.removeAttribute("src"))
							},
							validate : CKEDITOR.dialog.validate.notEmpty(c.lang.image.urlMissing)
						},/* {
							type : "button",
							id : "browse",
							style : "display:inline-block;margin-top:10px;",
							align : "center",
							label : c.lang.common.browseServer,
							hidden : !0,
							filebrowser : "info:txtUrl"
						}*/{
							type : "button",
							id : "browse",
							style : "display:inline-block;margin-top:16px;",
							align : "center",
							label : '网盘选取..',
							hidden : !NETDISK_USINGJSS,
							filebrowser : "info:txtUrl",
							pattern : 'jpg;bmp;png;gif',
							onClick: function() {
								NETDISK_GETFILE(this);
							}
						}]
					}]
				}, {
					id : "txtAlt",
					type : "text",
					label : c.lang.image.alt,
					accessKey : "T",
					"default" : "",
					onChange : function() {
						g(this.getDialog())
					},
					setup : function(a, b) {
						a == f && this.setValue(b.getAttribute("alt"))
					},
					commit : function(a, b) {
						a == f
								? (this.getValue() || this.isChanged())
										&& b.setAttribute("alt", this
														.getValue())
								: 4 == a ? b.setAttribute("alt", this
												.getValue()) : 8 == a
										&& b.removeAttribute("alt")
					}
				}, {
					type : "hbox",
					children : [{
						id : "basic",
						type : "vbox",
						children : [{
							type : "hbox",
							requiredContent : "img{width,height}",
							widths : ["50%", "50%"],
							children : [{
								type : "vbox",
								padding : 1,
								children : [{
									type : "text",
									width : "45px",
									id : "txtWidth",
									label : c.lang.common.width,
									onKeyUp : w,
									onChange : function() {
										i.call(this, "advanced:txtdlgGenStyle")
									},
									validate : function() {
										var a = this.getValue().match(v);
										(a = !!(a && 0 !== parseInt(a[1], 10)))
												|| alert(c.lang.common.invalidWidth);
										return a
									},
									setup : y,
									commit : function(a, b, d) {
										var c = this.getValue();
										a == f
												? (c
														? (b
																.setStyle(
																		"width",
																		CKEDITOR.tools
																				.cssLength(c)),
															b
																.setStyle(
																		"max-width",
																		CKEDITOR.tools
																				.cssLength(c)))
														: b
																.removeStyle("width"), !d
														&& b
																.removeAttribute("width"))
												: 4 == a
														? c.match(k)
																? (b
																		.setStyle(
																				"width",
																				CKEDITOR.tools
																						.cssLength(c)), b
																		.setStyle(
																				"max-width",
																				CKEDITOR.tools
																						.cssLength(c)))
																: (a = this
																		.getDialog().originalElement, "true" == a
																		.getCustomData("isReady")
																		&& b
																				.setStyle(
																						"width",
																						a.$.width
																								+ "px") &&  b
																				.setStyle(
																						"max-width",
																						a.$.width
																								+ "px"))
														: 8 == a
																&& (b
																		.removeAttribute("width"), b
																		.removeStyle("width"))
									}
								}, {
									type : "text",
									id : "txtHeight",
									width : "45px",
									label : c.lang.common.height,
									onKeyUp : w,
									onChange : function() {
										i.call(this, "advanced:txtdlgGenStyle")
									},
									validate : function() {
										var a = this.getValue().match(v);
										(a = !!(a && 0 !== parseInt(a[1], 10)))
												|| alert(c.lang.common.invalidHeight);
										return a
									},
									setup : y,
									commit : function(a, b, d) {
										var c = this.getValue();
										a == f
												? (c
														? b
																.setStyle(
																		"height",
																		CKEDITOR.tools
																				.cssLength(c))
														: b
																.removeStyle("height"), !d
														&& b
																.removeAttribute("height"))
												: 4 == a
														? c.match(k)
																? b
																		.setStyle(
																				"height",
																				CKEDITOR.tools
																						.cssLength(c))
																: (a = this
																		.getDialog().originalElement, "true" == a
																		.getCustomData("isReady")
																		&& b
																				.setStyle(
																						"height",
																						a.$.height
																								+ "px"))
														: 8 == a
																&& (b
																		.removeAttribute("height"), b
																		.removeStyle("height"))
									}
								}]
							}, {
								id : "ratioLock",
								type : "html",
								style : "margin-top:30px;width:40px;height:40px;",
								onLoad : function() {
									var a = CKEDITOR.document.getById(u), b = CKEDITOR.document
											.getById(p);
									a && (a.on("click", function(a) {
												x(this);
												a.data
														&& a.data
																.preventDefault()
											}, this.getDialog()), a.on(
											"mouseover", function() {
												this.addClass("cke_btn_over")
											}, a), a.on("mouseout", function() {
												this
														.removeClass("cke_btn_over")
											}, a));
									b && (b.on("click", function(a) {
										l(this);
										var b = this.originalElement, c = this
												.getValueOf("info", "txtWidth");
										if (b.getCustomData("isReady") == "true"
												&& c) {
											b = b.$.height / b.$.width * c;
											if (!isNaN(b)) {
												this.setValueOf("info",
														"txtHeight", Math
																.round(b));
												g(this)
											}
										}
										a.data && a.data.preventDefault()
									}, this.getDialog()), b.on("mouseover",
											function() {
												this.addClass("cke_btn_over")
											}, b), b.on("mouseout", function() {
												this
														.removeClass("cke_btn_over")
											}, b))
								},
								html : '<div><a href="javascript:void(0)" tabindex="-1" title="'
										+ c.lang.image.lockRatio
										+ '" class="cke_btn_locked" id="'
										+ p
										+ '" role="checkbox"><span class="cke_icon"></span><span class="cke_label">'
										+ c.lang.image.lockRatio
										+ '</span></a><a href="javascript:void(0)" tabindex="-1" title="'
										+ c.lang.image.resetSize
										+ '" class="cke_btn_reset" id="'
										+ u
										+ '" role="button"><span class="cke_label">'
										+ c.lang.image.resetSize
										+ "</span></a></div>"
							}]
						}, {
							type : "vbox",
							padding : 1,
							children : [{
								type : "text",
								id : "txtBorder",
								requiredContent : "img{border-width}",
								width : "60px",
								label : c.lang.image.border,
								"default" : "",
								onKeyUp : function() {
									g(this.getDialog())
								},
								onChange : function() {
									i.call(this, "advanced:txtdlgGenStyle")
								},
								validate : CKEDITOR.dialog.validate
										.integer(c.lang.image.validateBorder),
								setup : function(a, b) {
									if (a == f) {
										var d;
										d = (d = (d = b
												.getStyle("border-width"))
												&& d
														.match(/^(\d+px)(?: \1 \1 \1)?$/))
												&& parseInt(d[1], 10);
										isNaN(parseInt(d, 10))
												&& (d = b
														.getAttribute("border"));
										this.setValue(d)
									}
								},
								commit : function(a, b, d) {
									var c = parseInt(this.getValue(), 10);
									a == f || 4 == a
											? (isNaN(c)
													? !c
															&& this.isChanged()
															&& b
																	.removeStyle("border")
													: (b
															.setStyle(
																	"border-width",
																	CKEDITOR.tools
																			.cssLength(c)), b
															.setStyle(
																	"border-style",
																	"solid")), !d
													&& a == f
													&& b
															.removeAttribute("border"))
											: 8 == a
													&& (b
															.removeAttribute("border"), b
															.removeStyle("border-width"), b
															.removeStyle("border-style"), b
															.removeStyle("border-color"))
								}
							}, {
								type : "text",
								id : "txtHSpace",
								requiredContent : "img{margin-left,margin-right}",
								width : "60px",
								label : c.lang.image.hSpace,
								"default" : "",
								onKeyUp : function() {
									g(this.getDialog())
								},
								onChange : function() {
									i.call(this, "advanced:txtdlgGenStyle")
								},
								validate : CKEDITOR.dialog.validate
										.integer(c.lang.image.validateHSpace),
								setup : function(a, b) {
									if (a == f) {
										var d, c;
										d = b.getStyle("margin-left");
										c = b.getStyle("margin-right");
										d = d && d.match(o);
										c = c && c.match(o);
										d = parseInt(d, 10);
										c = parseInt(c, 10);
										d = d == c && d;
										isNaN(parseInt(d, 10))
												&& (d = b
														.getAttribute("hspace"));
										this.setValue(d)
									}
								},
								commit : function(a, b, c) {
									var e = parseInt(this.getValue(), 10);
									a == f || 4 == a
											? (isNaN(e)
													? !e
															&& this.isChanged()
															&& (b
																	.removeStyle("margin-left"), b
																	.removeStyle("margin-right"))
													: (b
															.setStyle(
																	"margin-left",
																	CKEDITOR.tools
																			.cssLength(e)), b
															.setStyle(
																	"margin-right",
																	CKEDITOR.tools
																			.cssLength(e))), !c
													&& a == f
													&& b
															.removeAttribute("hspace"))
											: 8 == a
													&& (b
															.removeAttribute("hspace"), b
															.removeStyle("margin-left"), b
															.removeStyle("margin-right"))
								}
							}, {
								type : "text",
								id : "txtVSpace",
								requiredContent : "img{margin-top,margin-bottom}",
								width : "60px",
								label : c.lang.image.vSpace,
								"default" : "",
								onKeyUp : function() {
									g(this.getDialog())
								},
								onChange : function() {
									i.call(this, "advanced:txtdlgGenStyle")
								},
								validate : CKEDITOR.dialog.validate
										.integer(c.lang.image.validateVSpace),
								setup : function(a, b) {
									if (a == f) {
										var c, e;
										c = b.getStyle("margin-top");
										e = b.getStyle("margin-bottom");
										c = c && c.match(o);
										e = e && e.match(o);
										c = parseInt(c, 10);
										e = parseInt(e, 10);
										c = c == e && c;
										isNaN(parseInt(c, 10))
												&& (c = b
														.getAttribute("vspace"));
										this.setValue(c)
									}
								},
								commit : function(a, b, c) {
									var e = parseInt(this.getValue(), 10);
									a == f || 4 == a
											? (isNaN(e)
													? !e
															&& this.isChanged()
															&& (b
																	.removeStyle("margin-top"), b
																	.removeStyle("margin-bottom"))
													: (b
															.setStyle(
																	"margin-top",
																	CKEDITOR.tools
																			.cssLength(e)), b
															.setStyle(
																	"margin-bottom",
																	CKEDITOR.tools
																			.cssLength(e))), !c
													&& a == f
													&& b
															.removeAttribute("vspace"))
											: 8 == a
													&& (b
															.removeAttribute("vspace"), b
															.removeStyle("margin-top"), b
															.removeStyle("margin-bottom"))
								}
							}, {
								id : "cmbAlign",
								requiredContent : "img{float}",
								type : "select",
								widths : ["35%", "65%"],
								style : "width:90px",
								label : c.lang.common.align,
								"default" : "",
								items : [[c.lang.common.notSet, ""],
										[c.lang.common.alignLeft, "left"],
										[c.lang.common.alignRight, "right"]],
								onChange : function() {
									g(this.getDialog());
									i.call(this, "advanced:txtdlgGenStyle")
								},
								setup : function(a, b) {
									if (a == f) {
										var c = b.getStyle("float");
										switch (c) {
											case "inherit" :
											case "none" :
												c = ""
										}
										!c
												&& (c = (b
														.getAttribute("align") || "")
														.toLowerCase());
										this.setValue(c)
									}
								},
								commit : function(a, b, c) {
									var e = this.getValue();
									if (a == f || 4 == a) {
										if (e ? b.setStyle("float", e) : b
												.removeStyle("float"), !c
												&& a == f)
											switch (e = (b
													.getAttribute("align") || "")
													.toLowerCase(), e) {
												case "left" :
												case "right" :
													b.removeAttribute("align")
											}
									} else
										8 == a && b.removeStyle("float")
								}
							}]
						}]
					}, {
						type : "vbox",
						height : "250px",
						children : [{
							type : "html",
							id : "htmlPreview",
							style : "width:95%;",
							html : "<div>"
									+ CKEDITOR.tools
											.htmlEncode(c.lang.common.preview)
									+ '<br><div id="'
									+ m
									+ '" class="ImagePreviewLoader" style="display:none"><div class="loading">&nbsp;</div></div><div class="ImagePreviewBox"><table><tr><td><a href="javascript:void(0)" target="_blank" onclick="return false;" id="'
									+ A
									+ '"><img id="'
									+ z
									+ '" alt="" /></a>'
									+ (c.config.image_previewText || "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas feugiat consequat diam. Maecenas metus. Vivamus diam purus, cursus a, commodo non, facilisis vitae, nulla. Aenean dictum lacinia tortor. Nunc iaculis, nibh non iaculis aliquam, orci felis euismod neque, sed ornare massa mauris sed velit. Nulla pretium mi et risus. Fusce mi pede, tempor id, cursus ac, ullamcorper nec, enim. Sed tortor. Curabitur molestie. Duis velit augue, condimentum at, ultrices a, luctus ut, orci. Donec pellentesque egestas eros. Integer cursus, augue in cursus faucibus, eros pede bibendum sem, in tempus tellus justo quis ligula. Etiam eget tortor. Vestibulum rutrum, est ut placerat elementum, lectus nisl aliquam velit, tempor aliquam eros nunc nonummy metus. In eros metus, gravida a, gravida sed, lobortis id, turpis. Ut ultrices, ipsum at venenatis fringilla, sem nulla lacinia tellus, eget aliquet turpis mauris non enim. Nam turpis. Suspendisse lacinia. Curabitur ac tortor ut ipsum egestas elementum. Nunc imperdiet gravida mauris.")
									+ "</td></tr></table></div></div>"
						}]
					}]
				}]
			}, {
				id : "Link",
				requiredContent : "a[href]",
				label : c.lang.image.linkTab,
				padding : 0,
				elements : [{
					id : "txtUrl",
					type : "text",
					label : c.lang.common.url,
					style : "width: 100%",
					"default" : "",
					setup : function(a, b) {
						if (2 == a) {
							var c = b.data("cke-saved-href");
							c || (c = b.getAttribute("href"));
							this.setValue(c)
						}
					},
					commit : function(a, b) {
						if (2 == a && (this.getValue() || this.isChanged())) {
							var d = decodeURI(this.getValue());
							b.data("cke-saved-href", d);
							b.setAttribute("href", d);
							if (this.getValue()
									|| !c.config.image_removeLinkByEmptyURL)
								this.getDialog().addLink = !0
						}
					}
				}, {
					type : "button",
					id : "browse",
					filebrowser : {
						action : "Browse",
						target : "Link:txtUrl",
						url : c.config.filebrowserImageBrowseLinkUrl
					},
					style : "float:right",
					hidden : !0,
					label : c.lang.common.browseServer
				}, {
					id : "cmbTarget",
					type : "select",
					requiredContent : "a[target]",
					label : c.lang.common.target,
					"default" : "",
					items : [[c.lang.common.notSet, ""],
							[c.lang.common.targetNew, "_blank"],
							[c.lang.common.targetTop, "_top"],
							[c.lang.common.targetSelf, "_self"],
							[c.lang.common.targetParent, "_parent"]],
					setup : function(a, b) {
						2 == a && this.setValue(b.getAttribute("target") || "")
					},
					commit : function(a, b) {
						2 == a && (this.getValue() || this.isChanged())
								&& b.setAttribute("target", this.getValue())
					}
				}]
			}, {
				id : "Upload",
				hidden : !0,
				filebrowser : "uploadButton",
				label : c.lang.image.upload,
				elements : [{
							type : "file",
							id : "upload",
							label : c.lang.image.btnUpload,
							style : "height:40px",
							size : 38
						}, {
							type : "fileButton",
							id : "uploadButton",
							filebrowser : "info:txtUrl",
							label : c.lang.image.btnUpload,
							"for" : ["Upload", "upload"]
						}]
			}, {
				id : "advanced",
				label : c.lang.common.advancedTab,
				elements : [{
					type : "hbox",
					widths : ["50%", "25%", "25%"],
					children : [{
						type : "text",
						id : "linkId",
						requiredContent : "img[id]",
						label : c.lang.common.id,
						setup : function(a, b) {
							a == f && this.setValue(b.getAttribute("id"))
						},
						commit : function(a, b) {
							a == f && (this.getValue() || this.isChanged())
									&& b.setAttribute("id", this.getValue())
						}
					}, {
						id : "cmbLangDir",
						type : "select",
						requiredContent : "img[dir]",
						style : "width : 100px;",
/*						label : c.lang.common.langDir,
						"default" : "",
						items : [[c.lang.common.notSet, ""],
								[c.lang.common.langDirLtr, "ltr"],
								[c.lang.common.langDirRtl, "rtl"]],*/
						//暂时处理
						label : "鼠标点击事件",
						"default" : "",
						items : [[c.lang.common.notSet, ""],
								["弹出放大图片", "ltr"],
								["无操作", "rtl"]],
						setup : function(a, b) {
							a == f && this.setValue(b.getAttribute("dir"))
						},
						commit : function(a, b) {
							a == f && (this.getValue() || this.isChanged())
									&& b.setAttribute("dir", this.getValue())
						}
					}, {
						type : "text",
						id : "txtLangCode",
						requiredContent : "img[lang]",
						label : c.lang.common.langCode,
						"default" : "",
						setup : function(a, b) {
							a == f && this.setValue(b.getAttribute("lang"))
						},
						commit : function(a, b) {
							a == f && (this.getValue() || this.isChanged())
									&& b.setAttribute("lang", this.getValue())
						}
					}]
				}, {
					type : "text",
					id : "txtGenLongDescr",
					requiredContent : "img[longdesc]",
					label : c.lang.common.longDescr,
					//hidden : !0,
					setup : function(a, b) {
						a == f && this.setValue(b.getAttribute("longDesc"))
					},
					commit : function(a, b) {
						a == f && (this.getValue() || this.isChanged())
								&& b.setAttribute("longDesc", this.getValue())
					}
				}, {
					type : "hbox",
					widths : ["50%", "50%"],
					children : [{
						type : "text",
						id : "txtGenClass",
						requiredContent : "img(cke-xyz)",
						label : c.lang.common.cssClass,
						"default" : "",
						setup : function(a, b) {
							a == f && this.setValue(b.getAttribute("class"))
						},
						commit : function(a, b) {
							a == f && (this.getValue() || this.isChanged())
									&& b.setAttribute("class", this.getValue())
						}
					}, {
						type : "text",
						id : "txtGenTitle",
						requiredContent : "img[title]",
						label : c.lang.common.advisoryTitle,
						"default" : "",
						onChange : function() {
							g(this.getDialog())
						},
						setup : function(a, b) {
							a == f && this.setValue(b.getAttribute("title"))
						},
						commit : function(a, b) {
							a == f
									? (this.getValue() || this.isChanged())
											&& b.setAttribute("title", this
															.getValue())
									: 4 == a ? b.setAttribute("title", this
													.getValue()) : 8 == a
											&& b.removeAttribute("title")
						}
					}]
				}, {
					type : "text",
					id : "txtdlgGenStyle",
					requiredContent : "img{cke-xyz}",
					label : c.lang.common.cssStyle,
					validate : CKEDITOR.dialog.validate
							.inlineStyle(c.lang.common.invalidInlineStyle),
					"default" : "",
					setup : function(a, b) {
						if (a == f) {
							var c = b.getAttribute("style");
							!c && b.$.style.cssText && (c = b.$.style.cssText);
							this.setValue(c);
							var e = b.$.style.height, c = b.$.style.width, e = (e
									? e
									: "").match(k), c = (c ? c : "").match(k);
							this.attributesInStyle = {
								height : !!e,
								width : !!c
							}
						}
					},
					onChange : function() {
						i
								.call(
										this,
										"info:cmbFloat info:cmbAlign info:txtVSpace info:txtHSpace info:txtBorder info:txtWidth info:txtHeight"
												.split(" "));
						g(this)
					},
					commit : function(a, b) {
						a == f && (this.getValue() || this.isChanged())
								&& b.setAttribute("style", this.getValue())
					}
				}]
			}]
		}
	};
	CKEDITOR.dialog.add("image", function(c) {
				return r(c, "image")
			});
	CKEDITOR.dialog.add("imagebutton", function(c) {
				return r(c, "imagebutton")
			})
})();