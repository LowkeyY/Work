using("bin.exe.manager.ProgramInput");
CPM.manager.ProgramCombinedInput = Ext.extend(CPM.manager.ProgramInput, {
			programType : 'ProgramCombinedInput',
			className : 'CPM.manager.ProgramCombinedInput',
			buttonMap : {
				'%auth' : {
					handler : function(btn) {
						var conn=new Ext.data.Connection();
						conn.request({    
								method: 'GET',    
								url:'/bin/user/getOrg.jcp?'
						});				
						conn.on('requestcomplete', function(conn, oResponse ){	
							var orgJSON = Ext.decode(oResponse.responseText);
							var name=orgJSON.shortName;
							if(name==""){
								name=orgJSON.name;
							}
							using("bin.exe.AuthPanel");
							var panel = Ext.getCmp(btn.panelId);
							var parentPanel = panel.ownerCt;
							var oldParam = panel.param;

							var param = Ext.applyIf({
										retFn : function() {
											CPM.replacePanel(authPanel,
													parentPanel, oldParam);
										},
										programType : 'authPanel'
									}, oldParam);
							param.rootId=orgJSON.id;
							param.rootName=name;
							var authPanel = new bin.exe.AuthPanel({
										param : param
							});
						},this);
					}
				},
				'%setup' : {
					handler : function(btn) {
						using("bin.exe.PdSetupPanel");
						var panel = Ext.getCmp(btn.panelId);
						var parentPanel = panel.ownerCt;
						var param = panel.param;
						var pdpanel = new bin.exe.PdSetupPanel(param)
						pdpanel.init();
					}
				}
			}
		});