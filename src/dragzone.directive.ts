module UIDragDrop {

	import ng = angular;

	interface IDragZoneScope extends ng.IScope {
		dropped(dropping: IDragZoneDropping): void;
	}

	export interface IDragZoneDropping {
		source: any;
		target: any;
	}

	export interface IDragZoneController {
		start(source: any): void;
		stop(): void;
		dropped(target: any): void;
	}

	class DragZoneController implements IDragZoneController {

		private source: any;
		private scope: IDragZoneScope;

		static $inject = ['$scope', '$element', '$attrs'];

		constructor(scope: IDragZoneScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
			this.scope = scope;
		}

		start(source: any): void {
			this.source = source;
		}

		stop(): void {
			this.source = null;
		}

		dropped(target: any): void {
			this.scope.$apply(() => {
				this.scope.dropped({ source: this.source, target: target });
			});
		}
	}

	function DragZoneDirective(): ng.IDirective {
		return {
			restrict: 'A',
			controller: DragZoneController,
			scope: {
				dropped: '&'
			}
		};
	}

	angular.module('ui.dragdrop').directive('dragzone', DragZoneDirective);
}