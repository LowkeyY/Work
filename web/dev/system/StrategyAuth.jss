dev.system.StrategyAuth = function(params) {
	Ext.Ajax.request({
				url : '/dev/system/StrategyAuth.jcp',
				method : 'GET',
				scope : this,
				params : params,
				callback : function(options, success, response) {
					if (this.rendered) {
						this.body.update(response.responseText, true);
					} else {
						this.html = response.responseText;
					}
				}
			});
	dev.system.StrategyAuth.superclass.constructor.call(this, {
				tbar : [{
					text : '保存'.loc(),
					icon : '/themes/icon/common/save.gif',
					cls : 'x-btn-text-icon  bmenu',
					scope : this,
					handler : function() {
						var bdy = Ext.get(this.body).dom;
						var cbs = Ext.DomQuery.select(
								"input:checked[name=buttonchk]", bdy);
						
						var result = {}, pos, name, v, j = 0;
						for (var i = 0; i < cbs.length; i++) {
							if (!Ext.fly(cbs[i]).up("tr{display=none}", bdy)) {
								v = cbs[i].value;
								pos = v.lastIndexOf(",");
								name = v.substring(0, pos);
								if (!result[name]) {
									result[name] = ",";
									j++;
								}
								result[name] += v.substring(pos + 1) + ",";
							}
						}
						
						cbs = Ext.DomQuery.select(
								"input:checked[name=prgchk]", bdy);
						for (var i = 0; i < cbs.length; i++) {
							if (!Ext.fly(cbs[i]).up("tr{display=none}", bdy)) {
								v = cbs[i].value;
								if (typeof(result[v])=='undefined'){
									result[v] = ",";
									j++;
								}
							}
						}
						
						var toSaveStrategyAuthFn = function() {
							params.result = Ext.encode(result);
							params.total = j;
							Ext.Ajax.request({
										url : '/dev/system/StrategyAuth.jcp',
										method : 'POST',
										params : params,
										callback : function(options, success, response) {
											var o = Ext.decode(response.responseText)
											if (success && o.success) {
												Ext.msg('info', '保存成功!'.loc());
											} else {
												Ext.msg('error', '保存失败,原因是'.loc()
																+ o.message);
											}
										}
									});
						}
						
						if(j==0)
							Ext.msg('confirm', '警告：此操作会清空该策略所有授权！<br>是否继续?'.loc(), function(answer) {
										if (answer == 'yes') {
											toSaveStrategyAuthFn.createDelegate(this).defer(1);;
										}
									})
						else
							toSaveStrategyAuthFn.createDelegate(this).defer(1);

					}
				}, {
					text : '返回'.loc(),
					icon : '/themes/icon/common/redo.gif',
					cls : 'x-btn-text-icon  bmenu',
					scope : this,
					handler : params.retFn
				}],
				bodyStyle : 'overflow:auto;padding:20px 0 0 40px;'
			});
}
Ext.extend(dev.system.StrategyAuth, Ext.Panel, {});