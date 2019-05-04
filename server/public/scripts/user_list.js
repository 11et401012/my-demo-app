function User(){

}

User.prototype.init = function(){
	this.bindListElements();
}

User.prototype.bindListElements = function(){
	var self = this;
	jQuery('.update-status').click(function(e){
		e.preventDefault();
		var options = {};
		var href = jQuery(this).attr('href');
		options.success = function(){
			window.location.href = href;
		}
		self.confirm(jQuery(this), e, options);
	});
}

User.prototype.confirm = function(element, e, data){
	var options = {
		title: "Are you sure?",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "#dd6b55",
		confirmButtonText: "Yes, delete it!",
		closeOnConfirm: true
	};

	jQuery.extend(options, data);

	swal(options,function(isConfirm){
		if(isConfirm){
			if(data && jQuery.isFunction(data.success)){
				data.success();
			}else{
				window.location = element.getAttribute("href");
			}
		}else{
			if(data && jQuery.isFunction(data.fail)){
				data.fail();
			}else{
				return false;
			}
		}
	});
};