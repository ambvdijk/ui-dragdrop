module UIDragDrop {

	import ng = angular;

	interface IJqueryDraggableOptions {
		helper?: string;
		scope?: string;
		start?(): void;
		stop?(): void;
	}

	interface IDragableJQuery extends ng.IAugmentedJQuery {
		draggable?(options: IJqueryDraggableOptions): void;
	}

	function LinkDraggableDirective(scope: ng.IScope, element: IDragableJQuery, attrs: ng.IAttributes, dragzone: IDragZoneController) {
		var item = scope.$eval(attrs['draggable']);
		element.draggable({
			helper: 'clone',
			scope: 'drag',
			start: () => dragzone.start(item),
			stop: () => dragzone.stop()
		});
	}

	function DraggableDirective(): ng.IDirective {
		return {
			require: '^dragzone',
			restrict: 'A',
			link: LinkDraggableDirective
		}
	}


	angular.module('ui.dragdrop').directive('draggable', DraggableDirective);
}