/**
 * Created by Pratik on 08-09-2016.
 */

export default function Notifier() {

	this.notify = function (head, message, type) {
		let alertClass = type === 'warn' ? 'alert-warning' : type === 'error' ? 'alert-danger' : 'alert-info';
		let alert      = '<div class="alert ' + alertClass + ' alert-dismissible fade in" role="alert">' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
			'<span aria-hidden="true">&times;</span>' +
			'</button>' +
			'<strong> ' + head + ' </strong> ' + message + ' </div>';

		$('.info-box').append(alert);

		setTimeout(function () {
			let alerts = $('.alert');
			if (alerts) {
				alerts.first().alert('close');
			}
		}, 4500);
	};
}