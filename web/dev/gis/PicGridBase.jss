/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('dev.gis'); 
dev.gis.PicGridBase = function(config) {
    this.events = {
        "containerclick" : true,
        "containerdblclick" : true,
        "containercontextmenu" : true,
        "continermousedown" : true,
        "itemdblclick": true,
        "itemcontextmenu": true,
        "selectionchange": true,
        "beforeitemdrop": true,
        "itemdrop":true
    };        
    
    dev.gis.PicGridBase.superclass.constructor.call(this, Ext.applyIf(config || {}, {
        
        plugins: [
            new dev.gis.PicGridDragSelector({dragSafe:true})
        ],        
          
        view: new dev.gis.PicGridView({
            forceFit:true,
            tpl: config.tpl,
            emptyText: config.emptyText || ''
        })     
    }));    
    
    this.on('rowcontextmenu', this.onRowContextMenu, this);
    this.on('rowdblclick', this.onRowDblClick, this);
    this.getSelectionModel().on('selectionchange', this.onSelectionChange, this);
        
};

Ext.extend(dev.gis.PicGridBase, Ext.grid.GridPanel, {

   initEvents : function(){
      
	   dev.gis.PicGridBase.superclass.initEvents.call(this);
	    var myDrop = new Ext.dd.DropTarget(this.body, { 
		    
		    grid: this,
            dropAllowed: 'x-dd-drop-ok', 
            dropNotAllowed: 'x-dd-drop-nodrop',
	        ddGroup: this.ddGroup || 'defaultDD', 
	        dropAllowedTarget: this.dropAllowedTarget,
	        dropNotAllowedTarget: this.dropNotAllowedTarget,
	        
	        notifyDrop: function(dd, e, data) 
	        { 
	            // first we check if this is a valid drop point
	            var dnTarget = e.getTarget(this.dropNotAllowedTarget);
	            if(dnTarget) {
	                return false;
	            }
	            // if user drops on a row we get index of that row and use it in drop event
	            var rowIndex = this.grid.getView().findRowIndex(e.getTarget(this.dropAllowedTarget));
	            // now lets build drop event
                var dropEvent = {
                    grid : this.grid,
                    rowIndex: rowIndex,
                    data: data,
                    source: dd,
                    rawEvent: e
                };	               
	            if(false === this.grid.fireEvent("beforeitemdrop", dropEvent)) {
	                return false;
	            }
		        this.grid.fireEvent("itemdrop", dropEvent);
		        return true;
	        },
		   
	        notifyOver: function(dd, e, data) 
	        { 
	            //check if the row is allowed, return true or false 
	            var daTarget = e.getTarget(this.dropAllowedTarget);
	            var dnTarget = e.getTarget(this.dropNotAllowedTarget);
	            if(dnTarget) {
	                return this.dropNotAllowed;
	            } else {
	                return this.dropAllowed;
	            }		            
	        }
	    });	        
    },

    onRowContextMenu: function(grd, index, e) {
        if(this.getSelectionModel().isSelected(index) !== true) {
            this.getSelectionModel().clearSelections();
            this.getSelectionModel().selectRow(index);
        }
        this.fireEvent("itemcontextmenu", this, e);
    },
    
    onRowDblClick: function(grd, index, e) {
        this.fireEvent("itemdblclick", grd, index, e);
    },
    
    onSelectionChange: function(sm) {
        this.fireEvent("selectionchange", this, sm.getSelections());
    },
    
    setTemplate: function(tpl) {
        this.getView().tpl = tpl;
        this.getView().refresh(false);
        return;
    },
    
    selectAll: function() {
        this.getSelectionModel().selectAll();
    },         
    
    // private
    processEvent : function(name, e){
        this.fireEvent(name, e);
        var t = e.getTarget();
        var v = this.view;
        var header = v.findHeaderIndex(t);
        var row = v.findRowIndex(t);
        if(header !== false){
            this.fireEvent("header" + name, this, header, e);
        }else if(row !== false){
            var cell = v.findCellIndex(t);
            if(row !== false){
                this.fireEvent("row" + name, this, row, e);
                if(cell !== false){
                    this.fireEvent("cell" + name, this, row, cell, e);
                }
            }
        }else if(e.target == this.getView().mainBody.dom) {
            if( this.fireEvent("container" + name, this, e) !== false)
                this.getSelectionModel().clearSelections();
        }
    }

});