module UIDragDrop {

	import ng = angular;

	interface IDroppableJQueryOptions {
		scope?: string;
		drop?(event: any, ui: any): void;
	}

	interface IDroppableJQuery extends ng.IAugmentedJQuery {
		droppable(options: IDroppableJQueryOptions): void;
	}

	function LinkDroppableDirective(scope: ng.IScope, element: IDroppableJQuery, attrs: ng.IAttributes, dragzone: IDragZoneController) {
		var item = scope.$eval(attrs['droppable']);
		element.droppable({
			scope: 'drag',
			drop: (event, ui) => dragzone.dropped(item)
		});
		scope.$watch(attrs['candrop'],(candrop)=>{
			if(candrop) {
				element.droppable("enable");
			}
			else {
				element.droppable("disable");
			}
		});
	}

	function DroppableDirective(): ng.IDirective {
		return {
			require: '^dragzone',
			restrict: 'A',
			link: LinkDroppableDirective
		}
	}
	
	ng.module('ui.dragdrop').directive('droppable',DroppableDirective);
}