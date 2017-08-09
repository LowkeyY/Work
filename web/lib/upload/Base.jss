Ext.namespace("lib.upload");

Ext.form.FileUploadField = Ext.extend(Ext.form.TextField, {
			/**
			 * @cfg {String} buttonText The button text to display on the upload
			 *      button (defaults to 'Browse...'). Note that if you supply a
			 *      value for {@link #buttonCfg}, the buttonCfg.text value will
			 *      be used instead if available.
			 */
			buttonText : 'Browse...',
			/**
			 * @cfg {Boolean} buttonOnly True to display the file upload field
			 *      as a button with no visible text field (defaults to false).
			 *      If true, all inherited TextField members will still be
			 *      available.
			 */
			buttonOnly : false,
			/**
			 * @cfg {Number} buttonOffset The number of pixels of space reserved
			 *      between the button and the text field (defaults to 3). Note
			 *      that this only applies if {@link #buttonOnly} = false.
			 */
			buttonOffset : 3,
			/**
			 * @cfg {Object} buttonCfg A standard {@link Ext.Button} config
			 *      object.
			 */

			// private
			readOnly : true,

			/**
			 * @hide
			 * @method autoSize
			 */
			autoSize : Ext.emptyFn,

			// private
			initComponent : function() {
				Ext.form.FileUploadField.superclass.initComponent.call(this);

				this.addEvents(
						/**
						 * @event fileselected Fires when the underlying file
						 *        input field's value has changed from the user
						 *        selecting a new file from the system file
						 *        selection dialog.
						 * @param {Ext.form.FileUploadField}
						 *            this
						 * @param {String}
						 *            value The file value returned by the
						 *            underlying file input field
						 */
						'fileselected');
			},
			netdiskPattren : "^netdisk\\(([a-zA-Z0-9-]{36})\\):(.+?)$",
			// private
			onRender : function(ct, position) {
				Ext.form.FileUploadField.superclass.onRender.call(this, ct,
						position);

				this.wrap = this.el.wrap({
							cls : 'x-form-field-wrap x-form-file-wrap'
						});
				this.el.addClass('x-form-file-text');
				this.el.dom.removeAttribute('name');

				this.fileInput = this.wrap.createChild({
							id : this.getFileInputId(),
							name : this.name || this.getId(),
							cls : 'x-form-file',
							tag : 'input',
							type : 'file',
							size : 1
						});
				if (!this.ssid) {
					this.ssid = this.wrap.createChild({
								id : this.id + "-ssid",
								name : this.name + "_SSID",
								tag : 'input',
								type : 'hidden'
							});
					this.ssid.setValue = function(v) {
						this.dom.value = v;
					}
				}

				var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
							text : this.buttonText
						});
				this.button = new Ext.Button(Ext.apply(btnCfg, {
							renderTo : this.wrap,
							cls : 'x-form-file-btn'
									+ (btnCfg.iconCls ? ' x-btn-icon' : '')
						}));
				this.netdiskReady = this.netdiskConfig && Ext.isObject(this.netdiskConfig);
				if(this.netdiskReady){
					this.netDiskButton = new Ext.Button(Ext.apply(this.netdiskConfig, {
								renderTo : this.wrap,
								scope : this,
								cls : 'x-form-disk-btn' + (this.netdiskConfig.iconCls ? ' x-btn-icon' : ''),
								handler: function(){
									if(this.netdiskConfig.usingJSS){
										using(this.netdiskConfig.usingJSS);
										eval(this.netdiskConfig.usingJSS+"(this)");
									}
								}
							}));
				}
				if (this.buttonOnly) {
					this.el.hide();
					this.wrap.setWidth(this.button.getEl().getWidth());
				}else{
					this.el.setWidth(this.width - 70 * (this.netdiskReady ? 2 : 1));
				}

				this.fileInput.on('change', function() {
							var v = this.fileInput.dom.value;
							this.setValue(v);
							this.fireEvent('fileselected', this, v);
						}, this);
			},

			// private
			getFileInputId : function() {
				return this.id + '-file';
			},

			// private
			onResize : function(w, h) {
				Ext.form.FileUploadField.superclass.onResize.call(this, w, h);

				this.wrap.setWidth(w);

				if (!this.buttonOnly) {
					var w = this.wrap.getWidth()
							- this.button.getEl().getWidth()
							- this.buttonOffset;
					this.el.setWidth(w);
				}
			},

			// private
			preFocus : Ext.emptyFn,

			// private
			getResizeEl : function() {
				return this.wrap;
			},

			// private
			getPositionEl : function() {
				return this.wrap;
			},

			// private
			alignErrorIcon : function() {
				this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
			}

		});
Ext.reg('fileuploadfield', Ext.form.FileUploadField);

lib.upload.FileBase = Ext.extend(Ext.form.FileUploadField, {
			minSize : 0,
			maxSize : 0,
			buttonText : '浏览文件..'.loc(),
			basePath : '/lib/upload/',
			ztype : 'FileUpload',
			/**
			 * @cfg{Date} pattern file postfix pattern ex.(*.jpg;*.gif;*.bmp)
			 */
			pattern : "",
			/**
			 * @cfg{Date} state init state (new or view or edit)
			 */
			state : '',

			// private
			processWin : null,
			serverSpeed : 420,
			patternReg : null,
			getTip : function() {
				return [this.pattern, this.maxSize, this.minSize].join(">");
			},
			initValue : Ext.emptyFn,
			getName : function() {
				return this.name;
			},
			initComponent : function() {
				lib.upload.FileBase.superclass.initComponent.call(this);
				if (!this.pattern.exec) {
					if (this.pattern == '') {
						this.patternReg = null;
					} else {
						if (this.pattern.charAt(this.pattern.length - 1) == ';')
							this.pattern = this.pattern.substring(this.pattern,
									this.pattern.length - 1);
						this.patternReg = new RegExp("\\.("
										+ (this.pattern.replace(new RegExp(
														"\\*\\.", 'g'), '')
												.replace(new RegExp(";", 'g'),
														'|')) + ")\\s*$", "i");
					}
				} else {
					this.patternReg = this.pattern;
					this.pattern = "";
				}
			},
			initValue : Ext.emptyFn,
			validateValue : function(value) {
				if (typeof(value) == 'undefined')
					value = '';
				if (value == '') {
					if (this.allowBlank)
						return true;
					else if(this.state !='edit') {
						this.markInvalid('此处为必填项目'.loc());
						return false;
					}
				}
				if (this.patternReg == null || value == '')
					return true;
				var valid = this.patternReg.test(value);
				if (!valid)
					this.markInvalid((!this.pattern.exec) ? '上传文件的格式为'.loc()
							+ this.pattern : '文件格式错误'.loc());
				if (valid && this.netdiskReady && value.startsWith('netdisk')){
					valid = value.match(this.netdiskPattren);
					if(!valid)
						this.markInvalid('网盘文件路径读取错误。');
				}
				return valid;
			}

		});

lib.upload.Uploader = {
	getProcessWin : function(form) {
		var pwin = form.processWin;
		if (typeof(pwin) == 'undefined') {
			var processBar = new Ext.ProgressBar({
						total : 1,
						height : 32,
						text : '文件上传中......'.loc()
					});
			var processFrame = new Ext.ux.IFrameComponent({
						url : '',
						width : 0,
						height : 0
					});
			pwin = new Ext.Window({
						layout : 'fit',
						width : 350,
						height : 92,
						modal : true,
						closable : false,
						closeAction : 'hide',
						plain : true,
						title : '文件上传进度'.loc(),
						resizable : false,
						hidden : true,
						buttons : [new Ext.Button({
									text : '关闭进度条'.loc(),
									handler : function() {
										pwin.hide();
									},
									scope : this
								})],
						items : [processBar, processFrame]
					});

			var sid = "Tmp" + (Math.random() + "").substring(2);
			pwin.start = function() {
				window[sid] = pwin;
				processFrame.el.dom.src = '/lib/upload/process.jcp?sid=' + sid;
			}

			pwin.startProcess = function(total) {
				processBar.total = total;
				delete window[sid];
				return pwin;
			}

			pwin.u = function(process, message) {
				processBar.updateProgress(process / processBar.total, message)
			}

			pwin.on("hidden", function() {
						this.updateProgress(0, "");
					}, pwin);

			pwin.on("show", function() {
					});
			form.sid = sid;
			form.processWin = pwin;
		}
		return pwin;
	},
	setEnctype : function(fm) {
		if (fm.encTzSeted)
			return;

		fm.form.serverSpeed = this.serverSpeed;
		fm.form.getProcessWin = this.getProcessWin;

		fm.on('beforeaction', function(form, action) {
					if (action.type == 'submit') {
						var pipeArr = new Array(), totalMax = 0, totalMin = 0;
						form.items.each(function(f) {
									if (f.ztype && f.ztype == 'FileUpload'
											&& (!f.state || f.state == 'new')
											&& f.getValue() != '') {
										pipeArr.push(f);
										totalMax += f.maxSize || 0;
										totalMin += f.totalMin || 0;
									}
								});
						form.fileUpload = (pipeArr.length > 0);
						if (!form.fileUpload) {
							return true;
						}
						var win = form.getProcessWin(form);
						win.show();
						var val = pipeArr[0].getValue();
						if (val.length > 20)
							val = val.substring(val.lastIndexOf("\\") + 1);
						win.u(0, '上传文件'.loc() + val + '中...'.loc());
						win.start();
						var url = action.getUrl();
						url += (url.indexOf('?') != -1 ? '&' : '?')
								+ "totalMax=" + totalMax + "&totalMin="
								+ totalMin;
						Ext.apply(action.options, {
									method : 'POST',
									url : url
								});
						form.beforeAction(action);
						action.run.defer(100, action);
						return false;
					}
				});

		var closeProcessBar = function() {
			if (this.processWin)
				this.processWin.hide();
		}.createDelegate(fm.form);

		fm.on("actioncomplete", closeProcessBar);
		fm.on("actionfailed", closeProcessBar);
		fm.on("beforedestroy", function() {
					if (this.form.processWin)
						this.form.processWin.destroy();
				}, fm);

		fm.encTzSeted = true;
	}
}
