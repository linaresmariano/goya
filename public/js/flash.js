$('#messages').ready(function(){
	$('#messages').addClass('alert-dismissible');
	$('#messages').attr('role','alert');
	$('#messages').html('<button type="button" data-dismiss="alert" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'+$('#messages').html());
	
})