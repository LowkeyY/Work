Ext.namespace('dev.gis');

dev.gis.IconPicker = function(config) {
	var str='气层';
	this.disAbled = false;
	if(config.width)
		config.width+=24;
	var vParams = {};
	//vParams["obj_type"]="1";
	this.viewStore = new Ext.data.JsonStore({
				url : '../dev/gis/Piclist.jcp',
				//baseParams : vParams,
				root : 'Rows',
				fields : ['name']
			});
	/*var tpl = new Ext.XTemplate('<tpl for=".">',
			'<div class="thumb-wrap" sid="{did}">',
			'<table cellpadding="0" cellspacing="0" >',
			'<tr><td class="thumb"><img src="/dev/gis/picdownload.jcp?meta_name={name}" /></td></tr></table>', '',
			'</div>', '</tpl>');*/
			
	var tpl = new Ext.XTemplate('<tpl for=".">',
			'<div class="thumb-wrap" sid="{did}">',
			
			'<div class="db-icn db-ft-{icon}-medium"><img src="/dev/gis/picdownload.jcp?meta_name={name}" /></div>', '',
			'<div class="db-txt db-ellipsis" align="center"><span ext:qtip="{name}" unselectable="on">{name}</span></div>', '',
			'</div>', '</tpl>');

	this.view = new Ext.DataView({
				store : this.viewStore,
				tpl : tpl,
				autoHeight : true,
				overClass : 'x-view-over',
				itemSelector : 'div.thumb-wrap',
				loadingText : '图片载入中...'.loc(),
				autoWidth : true
			});

	this.combo = new Ext.form.ComboBox({
				xtype : 'combo',
				allowBlank : false,
				store : new Ext.data.JsonStore({
							url : '/dev/gis/Piclist.jcp?coms=true',
							root : 'Rows',
							method : 'get',
							autoLoad : true,
							fields : ["text","value"],
							remoteSort : false
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				mode : 'local'
			});
	this.combo.on("select", function(combo, record, index) {
				vParams["obj_type"] = record.get("value");
				this.viewStore.load({
							params : vParams
						});
			}, this)
	Ext.applyIf(config, {
				multiSelect : false,
				lovTitle : '选择图片'.loc(),
				displayField : '<tpl for=".">{name}</tpl>',
				defaultImage : "/dev/gis/picdownload.jcp?meta_name="+str,
				defaultAutoCreate : {
					tag : "div"
				},

				triggerClass : 'x-form-search-trigger iconpicker-trigger',
				lovWidth : 340,
				lovHeight : 300,
				alwaysLoadStore : false,
				valueField : 'name',
				cls : 'iconpicker-content',
				valueSeparator : '',
				value : '',
				displaySeparator : '',
				image : false,
				windowConfig : {
					cls : 'images-view'
				}
			});
	dev.gis.IconPicker.superclass.constructor.call(this, config);
	

}
Ext.extend(dev.gis.IconPicker, lib.ListValueField.ListValueField, {
			onRender : function(ct, position) {

				dev.gis.IconPicker.superclass.onRender.call(this, ct,
						position);
				this.wrap.applyStyles({
							position : 'relative'
						});
				this.el.removeClass("x-form-field");
				this.image = this.el.createChild({
							tag : 'img',
							style : "position:absulute",
							src : this.defaultImage
						}, false, true);
				
				if(this.height)
					this.el.setStyle("height",this.height+2);
					
			},
			validateValue : function() {
				if (this.allowBlank === false && this.value == this.emptyImage) {
					this.markInvalid(this.blankText);
					return false;
				}
				return true;
			},
			onSelect : function() {
				var rec = this.getSelectedRecords();
				if (rec.length > 0) {
					rec = rec[0];
					this.setValue(rec.get(this.valueField));
					// 添加图片显示
				}
				this.window.hide();
			},

			setValue : function(val) {//alert(val);
				
				this.hiddenField.value=val;
				if (val == "" || typeof(val) == 'undefined') {
					val = '气层';
				} 
				this.value = val;
				this.validate();
				if (this.image)
					this.image.src = "../dev/gis/picdownload.jcp?meta_name="+val;
				this.hiddenField.value=this.getValue();  
			},

			getRawValue : function() {
				return this.getValue();
			},
			getValue : function() {
				var v = this.value;
				return v;
			},
			
			setIconDisabled : function(dis){
				this.disAbled = dis;
			},

			onTriggerClick : function(e) {
				if(this.disAbled == true)
					return;
				if (!this.isStoreLoaded) {
					this.view.store.load();
					this.isStoreLoaded = true;
				} else if (this.alwaysLoadStore === true) {
					this.view.store.reload();
				}

				this.windowConfig = Ext.apply(this.windowConfig, {
							title : this.lovTitle,
							width : this.lovWidth,
							height : this.lovHeight,
							autoScroll : true,
							layout : 'fit',
							tbar : [{
										text : '确定'.loc(),
										handler : this.onSelect,
										scope : this
									}, {
										text : '取消'.loc(),
										handler : function() {
											this.select(this.selections);
											this.window.hide();
										},
										scope : this
									}, '->', this.combo

							],
							items : this.view
						}, {
							shadow : false,
							frame : true
						});

				if (!this.window) {
					this.window = new Ext.Window(this.windowConfig);
					this.window.on('beforeclose', function() {
								this.window.hide();
								return false;
							}, this);
					this.view.on('dblclick', this.onSelect, this);

				}
				var vw = Ext.lib.Dom.getViewWidth(), vh = Ext.lib.Dom
						.getViewHeight();
				var s = Ext.getDoc().getScroll();
				var x = e.xy[0] - s.left, y = e.xy[1] - s.top;
				y = (vh - y < this.lovHeight)
						? e.xy[1] - this.lovHeight
						: e.xy[1];
				x = (vw - x < this.lovWidth)
						? e.xy[0] - this.lovWidth
						: e.xy[0];
				this.window.setPagePosition(x, y);
				this.window.show();
			}
		});