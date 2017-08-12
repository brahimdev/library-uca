$(function() {
	
	
	$('#search-form .search-btn').on('click', function(event) {
		var authorQueryData = $('#search-form').serializeObject();
		var data = $('#search-form').serializeObject();
		$.ajax({
			type : 'POST',
			url : 'authors/search',
			data : JSON.stringify(authorQueryData),
			contentType : 'application/json',
			success : function(data) {
				
				$('#result-container').html(data);
				initRecordsDataTables();
			}
		});
	});

});