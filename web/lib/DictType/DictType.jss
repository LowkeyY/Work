

// dg加班，时间不够，dictType未处理-tz
Ext.ux.DictType = Ext.extend(Ext.form.Field, {
			/**
			 * @cfg {Array} String(joined width this.separator) or int
			 *      array,include each combos width
			 */

			widths : false
			/**
			 * @cfg {String} separator. Used to split length (defaults to ','
			 *      (comma))
			 */
			,
			separator : ','
			/**
			 * @cfg {Boolean} force to choose full term(defaults to 'false' ).
			 */
			,
			forceFull : false
			/**
			 * @cfg {Boolean} message to show when the field is deficit
			 */
			,
			deficitText : '本项需选至最后一级'.loc()
			/**
			 * @cfg {Boolean} allow return blank (defaults to 'true' ).
			 */
			,
			allowBlank : true
			/**
			 * @cfg {Boolean} message to show when the field is blank.
			 */
			,
			blankText : '本项不能为空'.loc(),
			/**
			 * @cfg {Object} comboConfig for ComboBox constructor.
			 */

			comboConfig : {},
			/**
			 * @cfg {boolean} isSupport multiLanguage.
			 */
			translateItems : false
			/**
			 * private creates handlers
			 */
			,
			combos : null,
			sizes : null,
			initComponent : function() {
				this.combos = new Array();
				this.sizes = new Array();
				// call parent initComponent
				Ext.ux.DictType.superclass.initComponent.call(this);
				this.sizes = this.length.split(this.separator);
				if (this.sizes.length < 1) {
					throw 'length必需设置为逗号分隔的大于0的数字组成的字符串'.loc();
				}

				if (typeof(this.store) == 'undefined') {
					throw '请传入store'.loc();
				}
				this.addEvents(
						/**
						 * @event select 在各个combo选项被选后触发 <br />
						 *        <ul style="padding:5px;padding-left:16px;">
						 *        <li>obj - 指向本 DictType</li>
						 *        </ul>
						 * @param {obj}
						 * 
						 * 
						 */
						"select");

				var toNext = function(obj, arg) {
					if (typeof(arg) == 'object') {
						(function() {
							this.fireEvent("select", this);
						}).defer(200, this);
					}

					if (obj.level == this.sizes.length - 1)
						return;
					var nextCombo = this.combos[obj.level + 1];
					var nextStore = nextCombo.store;
					var forcast = obj.getValue();
					if (this.type == 3) {
						var m = 0;
						for (var i = obj.level; i > -1; i--) {
							m += this.sizes[i] * 1;
						}
						forcast = forcast.substring(0, m);
					}
					var reg = new RegExp("^" + forcast + ".{"
									+ this.sizes[nextCombo.level] + "}$", "ig");
					if ((nextCombo.level == this.sizes.length - 1)
							&& this.type == 2) {
						reg = new RegExp("^" + forcast + ".{1,"
										+ this.sizes[nextCombo.level] + "}$",
								"ig");
					}
					nextStore.data = this.store.data.filterBy(function(o, k) {
								return o.data.value.match(reg) != null;
					});
					if (nextStore.data.getCount() > 0) {
						nextCombo.show();
						nextStore.fireEvent("datachanged", nextStore);
						nextCombo.setValue(nextStore.getAt(0).get("value"));
						if (arg != 0)
							nextCombo.fireEvent("select", nextCombo);
					} else {
						var level = nextCombo.level;
						while (level < this.sizes.length)
							this.combos[level++].hide();
					}
				}

				Ext.applyIf(this.comboConfig, {
							translateItems : this.translateItems,
							valueField : 'value',
							displayField : 'text',
							triggerAction : 'all',
							mode : 'local'
						});

				if (!this.widths) {
					this.widths = new Array(this.sizes.length);
					for (var i = 0; i < this.widths.length; i++)
						this.widths[i] = 100;
				} else {
					if (!(this.widths instanceof Array))
						this.widths = this.widths.split(this.separator);

					if (this.widths.length < this.sizes.length)
						for (var i = this.widths.length; i < this.sizes.length; i++)
							this.widths.push(100);
				}
				this.width = 0;
				for (var i = 0; i < this.widths.length; i++)
					this.width += this.widths[i] * 1;
				var pos = this.sizes.length - 1;
				for (var i = 0; i <= pos; i++) {
					this.combos.push(new Ext.form.ComboBox(Ext.applyIf({
								id : Ext.id(),
								store : new Ext.data.SimpleStore({
											fields : ['text', 'value']
										}),
								width : this.widths[i],
								listeners : {
									select : toNext,
									scope : this
								},
								level : i
							}, this.comboConfig)));
				}
				var initreg;
				if (this.type == 3) {
					initreg = new RegExp(
							"^.{"
									+ this.sizes[0]
									+ "}"
									+ String
											.leftPad('', this.sizes[1] * 1, '0')
									+ "$", "ig");
				} else {
					initreg = new RegExp("^.{" + this.sizes[0] + "}$", "ig");
				}
				this.combos[0].store.data = this.store.data.filterBy(function(
								o, k) {
							return o.data.value.match(initreg) != null;
				});
				this.combos[0].store.fireEvent("datachanged",this.combos[0].store);

				this.combos[0].show();

			},
			reset : function() {
				this.setValue(" ");
				this.combos[0].setValue("");
			}
			/**
			 * private Renders underlying DictField and provides a workaround
			 * for side error icon bug
			 */
			,
			onRender : function(ct, position) {
				// don't run more than once-tz
				if (this.isRendered) {
					return;
				}

				// render underlying hidden field
				// Ext.ux.DictType.superclass.onRender.call(this, ct, position);

				var titems = new Array(this.sizes.length);
				for (var i = 0; i < this.sizes.length; i++)
					titems[i] = {
						tag : 'td',
						style : 'padding-right:4px;width:' + this.widths[i],
						cls : 'ux-DictType-' + i
					}

				var t = Ext.DomHelper.append(ct, {
							tag : 'table',
							style : 'border-collapse:collapse;width:'
									+ this.width,
							children : [{
										tag : 'tr',
										children : titems
									}]
						}, true);
				this.hiddenField = Ext.DomHelper.append(ct, {
							tag : 'input',
							type : 'hidden',
							name : this.name
						});
				this.tableEl = t;
				this.wrap = t.wrap({
							cls : 'x-form-field-wrap'
						});
				/*
				 * this.wrap.on("mousedown", this.onMouseDown, this, { delay :
				 * 10 });
				 */

				this.el = this.tableEl;
				// render
				for (var i = 0; i < this.sizes.length; i++) {
					this.combos[i].render(t.child('td.ux-DictType-' + i));
				}
				// workaround for IE trigger misalignment bug
				if (Ext.isIE && Ext.isStrict) {
					t.select('input').applyStyles({
								top : 0
							});
				}

				// create icon for side invalid errorIcon
				if ('side' === this.msgTarget) {
					var elp = this.el.findParent('.x-form-element', 10, true);
					// this.errorIcon =
					// elp.createChild({cls:'x-form-invalid-icon'});
					// for(var i=0;i<this.sizes.length;i++)
					// this.combos[i].errorIcon = this.errorIcon;
				}

				// we're rendered flag
				this.isRendered = true;

			}

			/**
			 * private
			 */
			,
			adjustSize : Ext.BoxComponent.prototype.adjustSize

			/**
			 * private
			 */
			,
			alignErrorIcon : function() {
				this.errorIcon.alignTo(this.tableEl, 'tl-tr', [2, 0]);
			}

			/*******************************************************************
			 * Disable this component.
			 * 
			 * @return {Ext.Component} this
			 */
			,
			disable : function() {
				if (this.isRendered) {
					for (var i = 0; i < this.sizes.length; i++)
						this.combos[i].onDisable();
				}
				this.disabled = true;
				for (var i = 0; i < this.sizes.length; i++)
					this.combos[i].disabled = true;
				this.fireEvent("disable", this);
				return this;
			}

			/*******************************************************************
			 * Enable this component.
			 * 
			 * @return {Ext.Component} this
			 */
			,
			enable : function() {
				if (this.isRendered) {
					for (var i = 0; i < this.sizes.length; i++)
						this.combos[i].onEnable();
				}
				this.disabled = false;
				for (var i = 0; i < this.sizes.length; i++)
					this.combos[i].disabled = false;
				this.fireEvent("enable", this);
				return this;

			}

			/**
			 * private Focus dict filed
			 */
			,
			focus : function() {
				this.combos[0].focus();
			},
			blur : function() {
				for (var i = 0; i < this.sizes.length; i++)
					this.combos[i].blur();
			}
			/**
			 * private
			 */
			,
			getPositionEl : function() {
				return this.wrap;
			}
			/**
			 * private
			 */
			,
			getResizeEl : function() {
				return this.wrap;
			}
			/**
			 * @return {Dict/String} Returns id of this field
			 */
			,
			getValue : function() {
				var j = this.combos.length - 1;
				while (this.combos[j].hidden && j-- > 0);
				var val = "";
				if (j == -1) {
					val = "";
				} else {
					val = this.combos[j].getValue()
				}
				this.hiddenField.value = val;
				return val;
			},

			getText : function() {
				var j = this.combos.length - 1;
				while (this.combos[j].hidden && j > 0)
					j--;
				if (j == -1)
					return "";
				return this.combos[j].getText();
			},
			initValue : function() {
				if (this.value !== undefined) {
					this.setValue(this.value);
				}
			}

			/**
			 * Returns true if this component is visible
			 * 
			 * @return {boolean}
			 */
			,
			isVisible : function() {
				return this.combos[0].isVisible();
			}

			/**
			 * private Handles focus event
			 */
			,
			onFocus : function() {
				if (!this.hasFocus) {
					this.hasFocus = true;
					this.startValue = this.getValue();
					this.fireEvent("focus", this);
				}
			}

			/**
			 * private Just to prevent blur event when clicked in the middle of
			 * fields
			 */
			,
			onMouseDown : function(e) {
				if (e.target.nodeName)
					this.wrapClick = 'td' === e.target.nodeName.toLowerCase();
				e.stopEvent();
			}

			/**
			 * private Sets correct this.sizes of underlying DictField With
			 * workarounds for IE bugs
			 */
			,
			setSize : function(w, h) {
				if (!w) {
					return;
				}
				// TODO 不急用，有空再写吧。tz
			}
			/*******************************************************************
			 * @param {String}
			 *            val Value to set Sets the value of this field
			 */
			,
			setValue : function(val) {
				if (typeof(val) == 'object')
					val = val.value;
				var cur, csize = 0, j = 0;
				while (j < this.sizes.length && val.length > csize) {
					csize += this.sizes[j] * 1;
					if (this.type == 3) {
						if (val.length > csize) {
							cur = val.substring(0, csize);
							for (var u = this.sizes[j + 1], m = 0; m < u; m++) {
								cur += "0";
							}
						} else {
							cur = val;
						}
					} else {
						cur = (val.length > csize)
								? val.substring(0, csize)
								: val;
					}
					this.combos[j].setValue(cur);
					this.combos[j].fireEvent("select", this.combos[j], [0]);
					j++;
				}
			}

			/**
			 * @return {Boolean} true = valid, false = invalid callse validict
			 *         methods of DictField
			 */
			,
			getRawValue : function() {
				var j = this.combos.length - 1;
				while (this.combos[j].hidden && j-- > 0);
				var val = "";
				if (j == -1) {
					val = "";
				} else {
					val = this.combos[j].getValue()
				}
				this.hiddenField.value = val;
				return val;
			},
			validateValue : function() {
				var val = true;
				if (!this.allowBlank)
					val = val && this.getValue() != "";
				if (!val)
					this.markInvalid(this.blankText);
				if (this.forceFull)
					val = val && !this.combos[this.combos.length - 1].hidden;
				if (!val)
					this.markInvalid(this.deficitText);
				return val;
			},
			getCombos : function() {
				return this.combos;
			},
			onDestroy : function() {
				for (var i = 0; i < this.combos.length; i++) {
					this.combos[i].destroy();
				}
			}

		});

// register xtype
Ext.reg('dicttype', Ext.ux.DictType);