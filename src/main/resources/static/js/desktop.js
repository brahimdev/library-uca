var dataTablesMessages = {
	"emptyTable" 		: message.datatable.emptySearchResultMessage,
	"info" 			: message.datatable.info,
	"infoEmpty" 		: message.datatable.infoEmpty,
	"infoFiltered" 		: message.datatable.infoFiltered,
	"lengthMenu" 		: message.datatable.lengthMenu,
	"loadingFiles" 		: message.datatable.loadingFiles,
	"processing" 		: message.datatable.processing,
	"search" 		: message.datatable.search,
	"zeroFiles" 		: message.datatable.zeroFiles,
	"paginate" : {
	    "first" 		: message.datatable.pagination.first,
	    "last" 		: message.datatable.pagination.last,
	    "next" 		: message.datatable.pagination.next,
	    "previous"  	: message.datatable.pagination.previous
	}
}

var dataTablesConfig = {
    "language" : dataTablesMessages
}

var dataTablesPdfBtnLabel = 'pdfHtml5';

var dataTablesNewBtnHtml = '<button class="btn btn-primary" type="button">' + 
				'<i class="fa fa-plus fa-fw"></i>' + message.common.newLabel + '</button>';

function styleDtPdfButton(dtBtns) {
    var pdfBtn = $(dtBtns).find('.buttons-pdf');
    $(pdfBtn).removeClass('dt-button').addClass('btn btn-default');
    $(pdfBtn).find('span').prepend('<i class="fa fa-share-square-o fa-fw" aria-hidden="true"></i>');
    $(dtBtns).addClass('uca');
}

$(function() {

	var desktopPage = $('#page-wrapper');
	
	$(desktopPage).find('#side-menu').metisMenu();
	
	$(document).on('click', ".table-uca .btn-delete", function(event) {
		event.stopPropagation();
		// TODO replace for toastr
		if (!confirm(message.common.confirmDeletion)) {
			return 
		}
		var tr = $(this).closest('tr');
		var url = $(tr).data('href');
		$.ajax({
			type : 'DELETE',
			url :  url,
			contentType : 'application/json',
			success : function(data) {
				if (data == -1) {
					toastr["error"](message.common.dbIntegrityError);
					$('#toast-container .toast-error').show();
				} else if (data == -100) {
					toastr["error"](message.common.internalServerError);
					$('#toast-container .toast-error').show();
				} else {
					var table = $(tr).closest('table').DataTable();
					table.row(tr).remove().draw();
				}
			}
		});
	});
	
	
	$(document).on('click', ".table-uca tr[class*='clickable']", function(event) {
		window.location = $(this).data('href')
	});
	
	
	$(window).bind('load resize', function() {
		var topOffset = 50;
		var width = (this.window.innerWidth > 0) ? this.window.innerWidth
				: this.screen.width;
		if (width < 768) {
			$('div.navbar-collapse').addClass('collapse');
			topOffset = 100; // 2-row-menu
		} else {
			$('div.navbar-collapse').removeClass('collapse');
		}
		var height = ((this.window.innerHeight > 0) ? this.window.innerHeight
				: this.screen.height) - 1;
		height = height - topOffset;
		if (height < 1)
			height = 1;
		if (height > topOffset) {
			$(desktopPage).css('min-height', (height) + 'px');
		}
	});

	var url = window.location;
	var element = $('ul.nav a').filter(function() {
		return this.href == url;
	}).addClass('active').parent();

	while (true) {
		if (element.is('li')) {
			element = element.parent().addClass('in').parent();
		} else {
			break;
		}
	}

	toastr.options = {
		"closeButton" : false,
		"debug" : false,
		"newestOnTop" : false,
		"progressBar" : false,
		"positionClass" : "toast-bottom-right",
		"preventDuplicates" : false,
		"onclick" : null,
		"showDuration" : "300",
		"hideDuration" : "1000",
		"timeOut" : "5000",
		"extendedTimeOut" : "1000",
		"showEasing" : "swing",
		"hideEasing" : "linear",
		"showMethod" : "fadeIn",
		"hideMethod" : "fadeOut"
	}

});