define(["app-config"],function(a){"use strict";return{layout:{content:{leftSpace:!1,rightSpace:!1}},initialize:function(){this.bindCustomEvents(),this.config=a.getSection("sulu-snippet"),this.defaultType=this.config.defaultType,this.loadData()},bindCustomEvents:function(){this.sandbox.on("sulu.dropdown.template.item-clicked",function(a){this.checkRenderTemplate(a)},this),this.sandbox.on("sulu.tab.save",function(a){this.submit(a)},this)},loadData:function(){this.sandbox.emit("sulu.snippets.snippet.get-data",function(a){this.render(a)}.bind(this))},render:function(a){this.data=a,this.data.template?this.checkRenderTemplate(this.data.template):this.checkRenderTemplate(),this.listenForChange()},checkRenderTemplate:function(a){return"string"==typeof a&&(a={template:a}),a&&this.template&&this.template===a.template?void this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1):(this.template||(this.template=this.defaultType),this.sandbox.emit("sulu.header.toolbar.item.loading","template"),void(""!==this.template&&this.contentChanged?this.showRenderTemplateDialog(a):this.loadFormTemplate(a)))},showRenderTemplateDialog:function(a){this.sandbox.emit("sulu.overlay.show-warning","sulu.overlay.be-careful","content.template.dialog.content",function(){this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1),this.template?this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template):this.sandbox.emit("sulu.header.toolbar.item.change","template",this.defaultType)}.bind(this),function(){this.loadFormTemplate(a)}.bind(this))},loadFormTemplate:function(a){var b,c;a&&(this.template=a.template),this.formId="#snippet-form-container",this.$container=this.sandbox.dom.createElement('<div id="snippet-form-container"/>'),this.html(this.$container),this.sandbox.form.getObject(this.formId)&&(b=this.data,this.data=this.sandbox.form.getData(this.formId),b.id&&(this.data.id=b.id),this.data=this.sandbox.util.extend({},b,this.data)),c=this.getTemplateUrl(a),require([c],function(a){this.renderFormTemplate(a)}.bind(this))},renderFormTemplate:function(a){var b=this.initData(),c={translate:this.sandbox.translate,content:b,options:this.options,categoryLocale:this.options.language},d=this.sandbox.util.extend({},c),e=this.sandbox.util.template(a,d);this.sandbox.dom.html(this.formId,e),this.createForm(b).then(function(){this.changeTemplateDropdownHandler()}.bind(this))},createForm:function(a){var b=this.sandbox.form.create(this.formId),c=this.sandbox.data.deferred();return b.initialized.then(function(){this.setFormData(a).then(function(){this.sandbox.start(this.$el,{reset:!0}),this.initSortableBlock(),this.bindFormEvents(),c.resolve()}.bind(this))}.bind(this)),c.promise()},setFormData:function(a){return this.sandbox.form.setData(this.formId,a)},initSortableBlock:function(){var a,b=this.sandbox.dom.find(".sortable",this.$el);b&&b.length>0&&(this.sandbox.dom.sortable(b,"destroy"),a=this.sandbox.dom.sortable(b,{handle:".move",forcePlaceholderSize:!0}))},bindFormEvents:function(){this.sandbox.dom.on(this.formId,"form-remove",function(){this.initSortableBlock(),this.sandbox.emit("sulu.tab.dirty")}.bind(this)),this.sandbox.dom.on(this.formId,"form-add",function(a,b,c,d){var e=this.sandbox.dom.children(this.$find('[data-mapper-property="'+b+'"]')),f=void 0!==d&&e.length>d?e[d]:this.sandbox.dom.last(e);this.sandbox.start(f),this.initSortableBlock()}.bind(this)),this.sandbox.dom.on(this.formId,"init-sortable",function(a){this.initSortableBlock()}.bind(this))},listenForChange:function(){this.sandbox.dom.on(this.$el,"keyup change",function(){this.sandbox.emit("sulu.tab.dirty"),this.contentChanged=!0}.bind(this),".trigger-save-button"),this.sandbox.on("sulu.content.changed",function(){this.sandbox.emit("sulu.tab.dirty"),this.contentChanged=!0}.bind(this))},getTemplateUrl:function(a){var b="text!/admin/content/template/form";return b+=a?"/"+a.template+".html":"/"+this.defaultType+".html",b+="?type=snippet&language="+this.options.language},initData:function(){return this.data},changeTemplateDropdownHandler:function(){this.sandbox.emit("sulu.header.toolbar.item.enable","template"),this.template&&this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template)},submit:function(a){this.sandbox.logger.log("save Model");var b;this.sandbox.form.validate(this.formId)&&(b=this.sandbox.form.getData(this.formId),this.sandbox.logger.log("data",b),this.options.data=this.sandbox.util.extend(!0,{},this.options.data,b),this.sandbox.emit("sulu.snippets.snippet.save",b,a))}}});